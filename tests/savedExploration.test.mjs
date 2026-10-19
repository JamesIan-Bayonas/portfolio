import test from "node:test"
import assert from "node:assert/strict"
import {
  parseSavedExploration,
  toggleSavedExploration,
  readSavedExploration,
  writeSavedExploration,
  SAVED_EXPLORATION_KEY,
} from "../src/lib/savedExploration.ts"

const catalog = ["case:isdalog", "lab:dormfix", "note:receipt"].map(
  (id, index) => ({
    id,
    href: `/example/${index}/`,
    title: id,
    description: "Example",
    kind: "case",
  }),
)

test("saved collections reject malformed or unpublished records and retain valid order", () => {
  for (const value of [null, "invalid", "{}", "null"])
    assert.deepEqual(parseSavedExploration(value, catalog), [])
  assert.deepEqual(
    parseSavedExploration(
      JSON.stringify([
        "case:isdalog",
        "unknown",
        "case:isdalog",
        42,
        "lab:dormfix",
      ]),
      catalog,
    ),
    ["case:isdalog", "lab:dormfix"],
  )
  assert.deepEqual(parseSavedExploration('["case:isdalog"]', []), [])
})

test("saving is intentional and removing one item preserves the rest without mutating inputs", () => {
  const previous = ["case:isdalog", "lab:dormfix"]
  assert.deepEqual(toggleSavedExploration(previous, "note:receipt", catalog), [
    "note:receipt",
    ...previous,
  ])
  assert.deepEqual(toggleSavedExploration(previous, "case:isdalog", catalog), [
    "lab:dormfix",
  ])
  assert.deepEqual(
    toggleSavedExploration(previous, "unpublished", catalog),
    previous,
  )
  assert.deepEqual(previous, ["case:isdalog", "lab:dormfix"])
})

test("saving and clearing use only the collection key, notify changes, and report storage failures", (t) => {
  const priorWindow = globalThis.window
  const storage = new Map([
    ["portfolio-recent-exploration-v1", '["case:isdalog"]'],
  ])
  const localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
    removeItem: (key) => storage.delete(key),
  }
  let notifications = 0
  globalThis.window = { localStorage, dispatchEvent: () => notifications++ }
  t.after(() => {
    if (priorWindow === undefined) delete globalThis.window
    else globalThis.window = priorWindow
  })
  assert.equal(writeSavedExploration(["lab:dormfix", "unknown"], catalog), true)
  assert.deepEqual(readSavedExploration(catalog), ["lab:dormfix"])
  assert.equal(writeSavedExploration([], catalog), true)
  assert.equal(storage.has(SAVED_EXPLORATION_KEY), false)
  assert.equal(
    storage.get("portfolio-recent-exploration-v1"),
    '["case:isdalog"]',
  )
  assert.equal(notifications, 2)
  localStorage.setItem = () => {
    throw new Error("Storage unavailable")
  }
  assert.equal(writeSavedExploration(["case:isdalog"], catalog), false)
  assert.equal(notifications, 2)
})
