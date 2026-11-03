import test from "node:test"
import assert from "node:assert/strict"
import { filterFieldbook } from "../src/lib/fieldbook.ts"

const entries = [
  {
    kind: "Systems",
    title: "CPATS",
    summary: "Procurement and receiving records",
    tags: ["Next.js", "TypeScript"],
  },
  {
    kind: "Notes",
    title: "Receipt review",
    summary: "The limits of automated checks",
    tags: ["OCR", "DormFix"],
  },
  {
    kind: "Tools",
    title: "Regex Lab",
    summary: "Explore capture groups",
    tags: ["JavaScript"],
  },
]

test("fieldbook combines category and case-insensitive search across summaries and technology", () => {
  assert.deepEqual(
    filterFieldbook(entries, "Systems", "  PROCUREMENT typescript "),
    [entries[0]],
  )
  assert.deepEqual(filterFieldbook(entries, "Notes", "ocr dormfix"), [
    entries[1],
  ])
  assert.deepEqual(filterFieldbook(entries, "Tools", "TypeScript"), [])
  assert.deepEqual(filterFieldbook(entries, "All", "capture"), [entries[2]])
})

test("reset restores curated order without changing source data and unmatched searches stay empty", () => {
  assert.deepEqual(filterFieldbook(entries, "All", "  "), entries)
  assert.deepEqual(filterFieldbook(entries, "All", "absent subject"), [])
  assert.deepEqual(
    entries.map((entry) => entry.title),
    ["CPATS", "Receipt review", "Regex Lab"],
  )
})

// Topic membership is exact: choosing TypeScript must not match JavaScript.
test("topic filters combine with category and query without partial-tag matches", () => {
  assert.deepEqual(filterFieldbook(entries, "All", "", "typescript"), [entries[0]])
  assert.deepEqual(filterFieldbook(entries, "Notes", "", "TypeScript"), [])
  assert.deepEqual(filterFieldbook(entries, "All", "records", "TypeScript"), [entries[0]])
  assert.deepEqual(filterFieldbook(entries, "All", "", "Script"), [])
})
import { readFieldbookView, fieldbookTopics } from "../src/lib/fieldbook.ts"
test("shared views restore valid filters and reject unsupported values", () => {
  const state = readFieldbookView("?fb-kind=Systems&fb-topic=typescript&fb-view=index&fb-sort=title&fb-q=records", ["TypeScript"])
  assert.deepEqual(state, {kind:"Systems",topic:"TypeScript",view:"index",sort:"title",query:"records"})
  assert.equal(readFieldbookView("?fb-kind=unknown&fb-topic=unknown", []).kind, "All")
  assert.equal(readFieldbookView("?fb-topic=unknown", []).topic, "")
  assert.deepEqual(fieldbookTopics([{...entries[0], tags:["React", "react"]}]), [{label:"React",count:1}])
})
