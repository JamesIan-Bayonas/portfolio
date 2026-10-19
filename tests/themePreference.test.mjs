import test from "node:test"
import assert from "node:assert/strict"
import {
  normalizeThemePreference,
  resolveThemePreference,
  readThemePreference,
  setThemePreference,
  applyThemePreference,
  subscribeThemePreference,
  THEME_PREFERENCE_KEY,
} from "../src/lib/themePreference.ts"

test("device theme applies only in automatic mode and legacy explicit choices are preserved", () => {
  assert.equal(resolveThemePreference("auto", true), "dark")
  assert.equal(resolveThemePreference("auto", false), "light")
  for (const deviceDark of [true, false]) {
    assert.equal(resolveThemePreference("dark", deviceDark), "dark")
    assert.equal(resolveThemePreference("light", deviceDark), "light")
  }
  assert.equal(normalizeThemePreference("light"), "light")
  assert.equal(normalizeThemePreference("dark"), "dark")
  for (const value of [null, undefined, "auto", "unknown", {}, 1])
    assert.equal(normalizeThemePreference(value), "auto")
})

test("theme changes persist, follow live device and storage updates, and preserve project identity", (t) => {
  const priorWindow = globalThis.window
  const priorDocument = globalThis.document
  const media = new EventTarget()
  media.matches = false
  const storage = new Map()
  const localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  }
  const root = { dataset: { project: "dormfix" }, style: {} }
  globalThis.window = Object.assign(new EventTarget(), {
    matchMedia: () => media,
    localStorage,
  })
  globalThis.document = { documentElement: root, querySelector: () => null }
  t.after(() => {
    setThemePreference("auto")
    if (priorWindow === undefined) delete globalThis.window
    else globalThis.window = priorWindow
    if (priorDocument === undefined) delete globalThis.document
    else globalThis.document = priorDocument
  })
  let updates = 0
  const unsubscribe = subscribeThemePreference(() => updates++)
  applyThemePreference()
  assert.equal(root.dataset.theme, "light")
  setThemePreference("dark")
  assert.equal(root.dataset.theme, "dark")
  assert.equal(root.style.colorScheme, "dark")
  assert.equal(storage.get(THEME_PREFERENCE_KEY), "dark")
  media.dispatchEvent(new Event("change"))
  assert.equal(root.dataset.theme, "dark")
  setThemePreference("auto")
  assert.equal(root.dataset.theme, "light")
  media.matches = true
  media.dispatchEvent(new Event("change"))
  assert.equal(root.dataset.theme, "dark")
  storage.set(THEME_PREFERENCE_KEY, "light")
  const changed = new Event("storage")
  Object.defineProperty(changed, "key", { value: THEME_PREFERENCE_KEY })
  window.dispatchEvent(changed)
  assert.equal(root.dataset.theme, "light")
  assert.equal(root.dataset.project, "dormfix")
  assert.equal(updates, 5)
  localStorage.setItem = () => {
    throw new Error("Storage unavailable")
  }
  setThemePreference("dark")
  assert.equal(readThemePreference(), "dark")
  assert.equal(root.dataset.theme, "dark")
  localStorage.setItem = (key, value) => storage.set(key, value)
  unsubscribe()
  const before = updates
  setThemePreference("auto")
  media.dispatchEvent(new Event("change"))
  window.dispatchEvent(changed)
  assert.equal(updates, before)
})
