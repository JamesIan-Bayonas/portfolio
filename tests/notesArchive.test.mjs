import test from "node:test"
import assert from "node:assert/strict"
import { engineeringNotes } from "../src/data/notes.ts"
import {
  emptyNotesFilters,
  filterNotes,
  noteTopicId,
  notesFilterSearch,
  readNotesFilters,
} from "../src/lib/notesArchive.ts"

const topics = engineeringNotes.map((note) => noteTopicId(note.topic))
const projects = engineeringNotes.map((note) => note.projectId)

test("an unfiltered archive preserves every note and its order", () => {
  assert.deepEqual(
    filterNotes(engineeringNotes, emptyNotesFilters),
    engineeringNotes,
  )
  assert.equal(new Set(topics).size, topics.length)
})

test("search matches article concepts across sections and combines every term", () => {
  assert.equal(
    filterNotes(engineeringNotes, {
      ...emptyNotesFilters,
      query: "  OCR   ZOD  ",
    })[0]?.projectId,
    "dormfix",
  )
  assert.equal(
    filterNotes(engineeringNotes, {
      ...emptyNotesFilters,
      query: "residual-value",
    })[0]?.projectId,
    "centralog",
  )
  assert.deepEqual(
    filterNotes(engineeringNotes, {
      ...emptyNotesFilters,
      query: "OCR nonexistentconcept",
    }),
    [],
  )
})

test("topic, project and query intersect rather than broadening results", () => {
  const note = engineeringNotes.find((note) => note.projectId === "dormfix")
  const filters = {
    query: "receipt",
    project: "dormfix",
    topic: noteTopicId(note.topic),
  }
  assert.deepEqual(filterNotes(engineeringNotes, filters), [note])
  assert.deepEqual(
    filterNotes(engineeringNotes, { ...filters, project: "centralog" }),
    [],
  )
  assert.deepEqual(
    filterNotes(engineeringNotes, { ...filters, query: "nonexistentconcept" }),
    [],
  )
})

test("filtered URLs restore special characters, project and a stable topic ID", () => {
  const filters = {
    query: "  C# & value + 1  ",
    project: "centralog",
    topic: topics[2],
  }
  assert.deepEqual(
    readNotesFilters(notesFilterSearch(filters), topics, projects),
    { ...filters, query: "C# & value + 1" },
  )
  assert.equal(notesFilterSearch(emptyNotesFilters), "")
  assert.equal(notesFilterSearch({ ...emptyNotesFilters, query: "   " }), "")
})

test("unknown URL choices fall back to all while preserving search", () => {
  assert.deepEqual(
    readNotesFilters(
      "?topic=missing&project=unknown&q=receipt",
      topics,
      projects,
    ),
    { query: "receipt", topic: "", project: "" },
  )
  assert.deepEqual(
    readNotesFilters("?project=dormfix&project=centralog", topics, projects),
    { ...emptyNotesFilters, project: "dormfix" },
  )
})
