import test from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { professionalContent } from "../src/data/professionalProfile.ts"
import { validateEditableContent } from "../src/lib/contentEditing.ts"
import { parseRecovery, recoveryConflicts } from "../src/lib/editorRecovery.ts"
import { createContentStore } from "../scripts/content-store.mjs"
import { engineeringNotes } from "../src/data/notes.ts"
import { projectEvolution } from "../src/data/projectEvolution.ts"
import { reflections } from "../src/data/reflections.ts"
const clone = (value) => structuredClone(value)

test("professional saves accept paired copy, metadata and focus updates without changing links", () => {
  const draft = clone(professionalContent)
  for (const language of ["en", "fil"]) {
    draft[language].profile.currentFocus = "Updated focus — ₱75"
    draft[language].pages["/now/"].summary =
      draft[language].profile.currentFocus
    draft[language].pages["/about/"].metadata.description =
      "Updated description"
    draft[language].profile.updatedAt = "2026-10-15"
  }
  assert.doesNotThrow(() =>
    validateEditableContent("professional", draft, professionalContent),
  )
})
test("professional saves reject missing translations, route/link changes, invalid dates and unsupported fields", () => {
  for (const change of [
    (draft) => {
      delete draft.fil
    },
    (draft) => {
      draft.fil.pages["/about/"].title = ""
    },
    (draft) => {
      draft.en.pages["/other/"] = draft.en.pages["/about/"]
    },
    (draft) => {
      draft.en.profile.learningThemes[0].href = "https://other.example"
    },
    (draft) => {
      draft.fil.profile.journey[0].projectIds.reverse()
    },
    (draft) => {
      draft.en.profile.updatedAt = draft.fil.profile.updatedAt = "2026-02-30"
    },
    (draft) => {
      draft.en.profile.updatedAt = "2026-10-15"
    },
    (draft) => {
      draft.en.profile.currentFocus = "Out of sync"
    },
    (draft) => {
      draft.en.profile.education.degree = "Other degree"
    },
    (draft) => {
      draft.en.profile.journey.pop()
    },
    (draft) => {
      draft.en.profile.extra = "Unsupported"
    },
  ]) {
    const draft = clone(professionalContent)
    change(draft)
    assert.throws(() =>
      validateEditableContent("professional", draft, professionalContent),
    )
  }
})
test("professional content is saved atomically and failed validation or stale saves retain the file", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "portfolio-profile-"))
  try {
    const filename = path.join(directory, "professionalContent.json")
    await writeFile(filename, JSON.stringify(professionalContent))
    const store = createContentStore(directory),
      original = await store.read("professional")
    const draft = clone(original.value)
    draft.en.pages["/about/"].title = "A revised English title"
    draft.fil.pages["/about/"].title = "Binagong pamagat"
    const saved = await store.save("professional", draft, original.version)
    assert.deepEqual((await store.read("professional")).value, draft)
    const bytes = await readFile(filename, "utf8")
    draft.fil.pages["/about/"].title = ""
    await assert.rejects(
      store.save("professional", draft, saved.version),
      (error) => error.status === 400,
    )
    await assert.rejects(
      store.save("professional", original.value, original.version),
      (error) => error.status === 409,
    )
    assert.equal(await readFile(filename, "utf8"), bytes)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
test("professional recovery keeps incomplete text, detects stale content, and upgrades old drafts without losing edits", () => {
  const old = {
    schema: 1,
    savedAt: "2026-10-15T00:00:00Z",
    draft: {
      notes: clone(engineeringNotes),
      milestones: clone(projectEvolution),
      reflections: clone(reflections),
    },
    versions: { notes: "n", milestones: "m", reflections: "r" },
  }
  old.draft.notes[0].title = "Unsaved earlier note"
  const current = { professional: { value: professionalContent, version: "p" } }
  const upgraded = parseRecovery(JSON.stringify(old), current.professional)
  assert.equal(upgraded.draft.notes[0].title, old.draft.notes[0].title)
  assert.deepEqual(upgraded.draft.professional, professionalContent)
  upgraded.draft.professional.fil.pages["/about/"].title = ""
  assert.doesNotThrow(() => parseRecovery(JSON.stringify(upgraded)))
  assert.deepEqual(
    recoveryConflicts(upgraded, {
      professional: { ...current.professional, version: "newer" },
    }),
    ["professional"],
  )
  delete upgraded.draft.professional.fil
  assert.throws(() => parseRecovery(JSON.stringify(upgraded)))
})
