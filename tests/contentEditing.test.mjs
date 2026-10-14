import test from "node:test"
import assert from "node:assert/strict"
import { readFile, writeFile, mkdtemp, rm, readdir } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { engineeringNotes } from "../src/data/notes.ts"
import { projectEvolution } from "../src/data/projectEvolution.ts"
import { siteMetadata } from "../src/data/siteMetadata.ts"
import { validateEditableContent } from "../src/lib/contentEditing.ts"
import { createContentStore } from "../scripts/content-store.mjs"

const clone = (value) => JSON.parse(JSON.stringify(value))
async function cleanup(directory) {
  assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir()))
  assert.ok(path.basename(directory).startsWith("portfolio-content-"))
  await rm(directory, { recursive: true, force: true })
}

test("editable copy changes preserve identities and reviewed evidence", () => {
  const notes = clone(engineeringNotes)
  notes[0].title = "An edited explanation"
  notes[0].sections[0].paragraphs.push(
    "An additional paragraph with ₱75 and Unicode text.",
  )
  assert.doesNotThrow(() =>
    validateEditableContent("notes", notes, engineeringNotes),
  )
  const milestones = clone(projectEvolution)
  milestones.dormfix[0].outcome = "An updated outcome explanation."
  assert.doesNotThrow(() =>
    validateEditableContent("milestones", milestones, projectEvolution),
  )
})

test("blank content, changed routes, removed sections, and modified reviewed references cannot save", () => {
  for (const change of [
    (note) => {
      note.title = " "
    },
    (note) => {
      note.path = "/other/"
    },
    (note) => {
      note.projectId = "other"
    },
    (note) => {
      note.sections.pop()
    },
    (note) => {
      note.flow = []
    },
    (note) => {
      note.sections[0].paragraphs = [""]
    },
  ]) {
    const notes = clone(engineeringNotes)
    change(notes[0])
    assert.throws(() =>
      validateEditableContent("notes", notes, engineeringNotes),
    )
  }
  for (const field of ["commit", "committedAt", "evidencePaths", "id"]) {
    const milestones = clone(projectEvolution)
    milestones.dormfix[0][field] = "modified"
    assert.throws(
      () => validateEditableContent("milestones", milestones, projectEvolution),
      /evidence/,
    )
  }
  assert.throws(() => validateEditableContent("notes", null, engineeringNotes))
  assert.throws(() =>
    validateEditableContent("milestones", {}, projectEvolution),
  )
})

test("repository saves retain Unicode and reject stale or concurrent drafts without losing content", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "portfolio-content-"))
  try {
    await writeFile(
      path.join(directory, "notesContent.json"),
      JSON.stringify(engineeringNotes),
    )
    const store = createContentStore(directory)
    const initial = await store.read("notes")
    const next = clone(initial.value)
    next[0].summary = "Receipt review — ₱75 & a recorded decision."
    const saved = await store.save("notes", next, initial.version)
    assert.notEqual(saved.version, initial.version)
    assert.deepEqual((await store.read("notes")).value, next)
    await assert.rejects(
      store.save("notes", initial.value, initial.version),
      (error) => error.status === 409,
    )
    const first = clone(next)
    first[0].title = "First update"
    const second = clone(next)
    second[0].title = "Second update"
    const results = await Promise.allSettled([
      store.save("notes", first, saved.version),
      store.save("notes", second, saved.version),
    ])
    assert.equal(
      results.filter((result) => result.status === "fulfilled").length,
      1,
    )
    assert.equal((await store.read("notes")).value[0].title, "First update")
    assert.deepEqual(await readdir(directory), ["notesContent.json"])
  } finally {
    await cleanup(directory)
  }
})

test("invalid collections and invalid payloads leave the saved file intact", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "portfolio-content-"))
  try {
    const filename = path.join(directory, "notesContent.json")
    const source = JSON.stringify(engineeringNotes)
    await writeFile(filename, source)
    const store = createContentStore(directory)
    for (const kind of ["../notes", "__proto__", "constructor", "sitePages"])
      await assert.rejects(store.read(kind), (error) => error.status === 400)
    const original = await store.read("notes")
    await assert.rejects(
      store.save("notes", [], original.version),
      (error) => error.status === 400,
    )
    assert.equal(await readFile(filename, "utf8"), source)
  } finally {
    await cleanup(directory)
  }
})

test("every article's sharing metadata follows its editable title and summary", () => {
  for (const note of engineeringNotes) {
    const page = siteMetadata.find((page) => page.path === note.path)
    assert.equal(page.title, `${note.title} | James Ian Bayonas`)
    assert.equal(page.description, note.summary)
  }
})
