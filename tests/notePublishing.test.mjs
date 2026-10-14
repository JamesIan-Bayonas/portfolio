import test from "node:test"
import assert from "node:assert/strict"
import {
  createNoteDraft,
  validateEditableContent,
} from "../src/lib/contentEditing.ts"
import { engineeringNotes } from "../src/data/notes.ts"
import { parseRecovery, recoveryConflicts } from "../src/lib/editorRecovery.ts"
import { reflections } from "../src/data/reflections.ts"
import { projectEvolution } from "../src/data/projectEvolution.ts"
import { createContentStore } from "../scripts/content-store.mjs"
import { mkdtemp, writeFile, rm } from "node:fs/promises"
import path from "node:path"
import os from "node:os"

const clone = (value) => structuredClone(value)
test("new incomplete drafts save, while publication requires complete content and stable unique routes", () => {
  const draft = createNoteDraft("asset-review", "centralog")
  assert.doesNotThrow(() =>
    validateEditableContent(
      "notes",
      [...engineeringNotes, draft],
      engineeringNotes,
    ),
  )
  assert.throws(
    () =>
      validateEditableContent(
        "notes",
        [...engineeringNotes, { ...draft, status: "published" }],
        engineeringNotes,
      ),
    /contain text/,
  )
  const ready = {
    ...clone(engineeringNotes[0]),
    id: draft.id,
    path: draft.path,
    projectId: draft.projectId,
    status: "published",
  }
  assert.doesNotThrow(() =>
    validateEditableContent(
      "notes",
      [...engineeringNotes, ready],
      engineeringNotes,
    ),
  )
  for (const mutation of [
    (note) => {
      note.id = "feed"
      note.path = "/notes/feed/"
    },
    (note) => {
      note.path = "/outside/"
    },
    (note) => {
      note.projectId = "missing"
    },
    (note) => {
      note.id = engineeringNotes[0].id
      note.path = engineeringNotes[0].path
    },
    (note) => {
      note.sections.push(clone(note.sections[0]))
    },
    (note) => {
      note.sections[0].id = "main-content"
    },
    (note) => {
      note.sections.push({
        ...clone(note.sections[0]),
        id: `note-${note.sections[0].id}`,
      })
    },
    (note) => {
      note.extra = "unsupported"
    },
  ]) {
    const invalid = clone(ready)
    mutation(invalid)
    assert.throws(() =>
      validateEditableContent(
        "notes",
        [...engineeringNotes, invalid],
        engineeringNotes,
      ),
    )
  }
  assert.throws(
    () =>
      validateEditableContent(
        "notes",
        [...engineeringNotes, { ...ready, status: "draft" }],
        [...engineeringNotes, ready],
      ),
    /return to draft/,
  )
})
test("saved drafts reopen, allow section changes, and become protected after publication", async () => {
  const directory = await mkdtemp(
    path.join(os.tmpdir(), "portfolio-publishing-"),
  )
  try {
    await writeFile(
      path.join(directory, "notesContent.json"),
      JSON.stringify(engineeringNotes),
    )
    const store = createContentStore(directory)
    const initial = await store.read("notes")
    const incomplete = createNoteDraft("new-article", "dormfix")
    const saved = await store.save(
      "notes",
      [...initial.value, incomplete],
      initial.version,
    )
    assert.equal((await store.read("notes")).value.at(-1).status, "draft")
    const ready = {
      ...clone(engineeringNotes[0]),
      id: incomplete.id,
      path: incomplete.path,
      status: "published",
    }
    ready.sections.push({
      id: "new-section",
      title: "New section",
      paragraphs: ["Reviewed explanation."],
    })
    const published = await store.save(
      "notes",
      [...engineeringNotes, ready],
      saved.version,
    )
    const changed = clone(published.value)
    changed.at(-1).sections.pop()
    await assert.rejects(
      store.save("notes", changed, published.version),
      /anchors/,
    )
    assert.deepEqual((await store.read("notes")).value, published.value)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
test("recovery retains incomplete edits, detects stale collections, and rejects malformed copies", () => {
  const draft = {
    notes: clone(engineeringNotes),
    milestones: clone(projectEvolution),
    reflections: clone(reflections),
  }
  draft.notes[0].title = ""
  const copy = {
    schema: 1,
    savedAt: "2026-10-14T00:00:00Z",
    draft,
    versions: { notes: "n1", milestones: "m1", reflections: "r1" },
  }
  assert.deepEqual(parseRecovery(JSON.stringify(copy)), copy)
  const current = {
    notes: { value: engineeringNotes, version: "n1" },
    milestones: { value: projectEvolution, version: "m1" },
    reflections: { value: reflections, version: "r1" },
  }
  assert.deepEqual(recoveryConflicts(copy, current), [])
  assert.deepEqual(
    recoveryConflicts(copy, {
      ...current,
      notes: { ...current.notes, version: "n2" },
    }),
    ["notes"],
  )
  assert.throws(() => parseRecovery("{bad"))
  assert.throws(() =>
    parseRecovery(
      JSON.stringify({ ...copy, draft: { ...draft, notes: [null] } }),
    ),
  )
  assert.equal(parseRecovery(null), undefined)
})
