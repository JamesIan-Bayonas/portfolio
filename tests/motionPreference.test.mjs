import test from "node:test"
import assert from "node:assert/strict"
import {
  normalizeMotionPreference,
  shouldReduceMotion,
  portfolioMotionQuery,
  setMotionPreference,
  subscribeMotionPreference,
  MOTION_PREFERENCE_KEY,
} from "../src/lib/motionPreference.ts"

test("a visitor can reduce motion and the device preference is never overridden", () => {
  assert.equal(shouldReduceMotion("auto", false), false)
  assert.equal(shouldReduceMotion("auto", true), true)
  assert.equal(shouldReduceMotion("reduced", false), true)
  assert.equal(shouldReduceMotion("reduced", true), true)
})

test("missing or corrupted saved preferences fall back to the device", () => {
  for (const value of [null, undefined, "always", "full", {}, 1])
    assert.equal(normalizeMotionPreference(value), "auto")
  assert.equal(normalizeMotionPreference("reduced"), "reduced")
})

test("live preferences notify subscribers, follow device changes, and tolerate unavailable storage", (t) => {
  const priorWindow = globalThis.window
  const priorDocument = globalThis.document
  const browser = new EventTarget()
  const media = new EventTarget()
  media.matches = false
  const storage = new Map()
  const localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) }
  globalThis.window = Object.assign(browser, { matchMedia: () => media, localStorage })
  globalThis.document = { documentElement: { dataset: {} } }
  t.after(() => {
    setMotionPreference("auto")
    if (priorWindow === undefined) delete globalThis.window; else globalThis.window = priorWindow
    if (priorDocument === undefined) delete globalThis.document; else globalThis.document = priorDocument
  })
  let updates = 0
  const unsubscribe = subscribeMotionPreference(() => updates++)
  const query = portfolioMotionQuery()
  assert.equal(query.matches, false)
  setMotionPreference("reduced")
  assert.equal(query.matches, true)
  assert.equal(storage.get(MOTION_PREFERENCE_KEY), "reduced")
  assert.equal(document.documentElement.dataset.motion, "reduced")
  assert.equal(updates, 1)
  setMotionPreference("auto")
  assert.equal(query.matches, false)
  media.matches = true
  media.dispatchEvent(new Event("change"))
  assert.equal(query.matches, true)
  assert.equal(updates, 3)
  media.matches = false
  localStorage.setItem = () => { throw new Error("Storage unavailable") }
  setMotionPreference("reduced")
  assert.equal(query.matches, true)
  localStorage.setItem = (key, value) => storage.set(key, value)
  unsubscribe()
  const before = updates
  setMotionPreference("auto")
  media.dispatchEvent(new Event("change"))
  window.dispatchEvent(new Event("storage"))
  assert.equal(updates, before)
})
