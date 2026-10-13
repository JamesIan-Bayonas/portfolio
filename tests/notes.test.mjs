import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { engineeringNotes, noteReadingMinutes } from "../src/data/notes.ts"
import { findCaseStudyPage } from "../src/lib/caseStudyPages.ts"
import { searchDestination } from "../src/lib/search.ts"
import { labDemos } from "../src/data/labDemos.ts"

const pages = JSON.parse(readFileSync(new URL("../src/data/sitePages.json", import.meta.url), "utf8"))
test("every note has a static page and stable route with or without a trailing slash", () => {
  assert.ok(findCaseStudyPage(pages, "/notes/"))
  for (const note of engineeringNotes) {
    assert.ok(findCaseStudyPage(pages, note.path))
    assert.ok(findCaseStudyPage(pages, note.path.slice(0, -1)))
    assert.equal(searchDestination({ path: note.path, target: "case-study" }), note.path)
  }
})
test("article section anchors are unique and suitable for direct navigation", () => {
  for (const note of engineeringNotes) {
    assert.equal(new Set(note.sections.map(section => section.id)).size, note.sections.length)
    for (const section of note.sections) assert.match(section.id, /^[a-z][a-z0-9-]*$/)
  }
})
test("reading-time estimates never show zero and scale with article length", () => {
  const note = engineeringNotes[0]
  assert.equal(noteReadingMinutes({ ...note, title: "", summary: "", sections: [] }), 1)
  assert.equal(noteReadingMinutes({ ...note, title: "", summary: "", sections: [{ id: "example", title: "", paragraphs: [Array(401).fill("word").join(" ")] }] }), 3)
  assert.ok(noteReadingMinutes(note) >= 2)
})
test("every note connects to a real project route and selectable lab demo", () => {
  const projectPages = JSON.parse(readFileSync(new URL("../src/data/caseStudyPages.json", import.meta.url), "utf8"))
  assert.equal(new Set(engineeringNotes.map(note => note.path)).size, engineeringNotes.length)
  for (const note of engineeringNotes) {
    assert.ok(projectPages.some(page => page.projectId === note.projectId))
    assert.ok(labDemos.some(demo => demo.id === note.projectId))
    assert.ok(note.flow.length > 0)
    assert.ok(note.sourceContext)
  }
})
