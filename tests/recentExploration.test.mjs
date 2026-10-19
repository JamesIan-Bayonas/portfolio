import test from "node:test"
import assert from "node:assert/strict"
import {
  parseRecentExploration,
  addRecentExploration,
  RECENT_EXPLORATION_LIMIT,
} from "../src/lib/recentExploration.ts"

const catalog = Array.from({ length: 9 }, (_, index) => ({
  id: `case:${index}`,
  href: `/projects/${index}/`,
  title: `${index}`,
  description: "Example",
  kind: "case",
}))

test("stored history accepts only published identities and rejects malformed data", () => {
  for (const raw of [null, "invalid", "{}", '"string"', "null"])
    assert.deepEqual(parseRecentExploration(raw, catalog), [])
  assert.deepEqual(
    parseRecentExploration(
      JSON.stringify([
        "case:1",
        "https://example.com",
        "case:1",
        3,
        { id: "case:2" },
        "case:2",
      ]),
      catalog,
    ),
    ["case:1", "case:2"],
  )
  assert.deepEqual(parseRecentExploration('["removed-page"]', catalog), [])
})

test("revisiting moves an existing destination to the front without duplicate entries", () => {
  const previous = ["case:1", "case:2", "case:3"]
  assert.deepEqual(addRecentExploration(previous, "case:2", catalog), [
    "case:2",
    "case:1",
    "case:3",
  ])
  assert.deepEqual(previous, ["case:1", "case:2", "case:3"])
  assert.deepEqual(
    addRecentExploration(previous, "unpublished", catalog),
    previous,
  )
})

test("history retains the latest bounded set and drops entries removed from the catalog", () => {
  let history = []
  for (const item of catalog)
    history = addRecentExploration(history, item.id, catalog)
  assert.equal(history.length, RECENT_EXPLORATION_LIMIT)
  assert.deepEqual(history, [
    "case:8",
    "case:7",
    "case:6",
    "case:5",
    "case:4",
    "case:3",
  ])
  assert.deepEqual(
    parseRecentExploration(JSON.stringify(history), catalog.slice(0, 5)),
    ["case:4", "case:3"],
  )
})
