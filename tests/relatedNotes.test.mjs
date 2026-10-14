import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { engineeringNotes } from "../src/data/notes.ts"
import { relatedNoteConnections } from "../src/data/relatedNotes.ts"
import { relatedNotes } from "../src/lib/relatedNotes.ts"

const pages = JSON.parse(
  readFileSync(new URL("../src/data/sitePages.json", import.meta.url), "utf8"),
)

test("every published article recommends two other published notes with specific connections", () => {
  for (const current of engineeringNotes) {
    const results = relatedNotes(
      current,
      engineeringNotes,
      relatedNoteConnections,
    )
    assert.equal(results.length, 2, current.id)
    assert.equal(
      new Set(results.map((result) => result.note.id)).size,
      results.length,
    )
    for (const { note, reason } of results) {
      assert.notEqual(note.id, current.id)
      assert.ok(
        pages.some((page) => page.path === note.path),
        note.path,
      )
      assert.ok(reason.trim().length > 30)
    }
  }
})

test("the settlement reading path leads to sale adjustments before receipt review", () => {
  const current = engineeringNotes.find((note) => note.projectId === "isdalog")
  const results = relatedNotes(
    current,
    engineeringNotes,
    relatedNoteConnections,
  )
  assert.deepEqual(
    results.map((result) => result.note.projectId),
    ["pharmalink", "dormfix"],
  )
  assert.match(results[0].reason, /financial records/)
})

test("missing, self, duplicate and unexplained connections cannot produce unusable cards", () => {
  const current = { id: "current", path: "/notes/current/" }
  const next = { id: "next", path: "/notes/next/" }
  const third = { id: "third", path: "/notes/third/" }
  const fourth = { id: "fourth", path: "/notes/fourth/" }
  const unavailable = { id: "unavailable", path: "" }
  const connections = {
    current: [
      { noteId: "current", reason: "Self" },
      { noteId: "missing", reason: "Missing" },
      { noteId: "unavailable", reason: "Unpublished" },
      { noteId: "next", reason: " " },
      { noteId: "next", reason: "First connection" },
      { noteId: "next", reason: "Duplicate" },
      { noteId: "third", reason: "Second connection" },
      { noteId: "fourth", reason: "Extra connection" },
    ],
  }
  assert.deepEqual(
    relatedNotes(
      current,
      [current, next, third, fourth, unavailable],
      connections,
    ),
    [
      { note: next, reason: "First connection" },
      { note: third, reason: "Second connection" },
    ],
  )
  assert.deepEqual(relatedNotes(current, [current, next], {}), [])
})
