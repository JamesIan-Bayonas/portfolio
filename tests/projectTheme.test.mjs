import test from "node:test"
import assert from "node:assert/strict"
import { projectThemeForPath, applyProjectTheme } from "../src/lib/projectTheme.ts"
import { projectAccents } from "../src/data/projectAccents.ts"

test("case-study accents follow project identity on direct and translated routes", () => {
  for (const [id, colors] of Object.entries(projectAccents)) {
    for (const suffix of ["", "/", "/#walkthrough"]) {
      assert.deepEqual(projectThemeForPath(`/projects/${id}${suffix}`), { id, ...colors })
    }
  }
  for (const id of ["centralog", "dormfix"]) {
    assert.deepEqual(projectThemeForPath(`/fil/projects/${id}/`), { id, ...projectAccents[id] })
  }
  for (const path of ["/", "/explore/", "/lab/", "/projects/unknown/", "/projects/toString/", "/projects/centralog/nested/"]) {
    assert.equal(projectThemeForPath(path), undefined)
  }
})

test("applying and clearing project identity preserves the user's mode", () => {
  const properties = new Map()
  const root = {
    dataset: { theme: "light" },
    style: { setProperty: (key, value) => properties.set(key, value), removeProperty: (key) => properties.delete(key) },
  }
  applyProjectTheme(root, "/projects/centralog/")
  assert.equal(root.dataset.project, "centralog")
  assert.equal(properties.get("--project-accent-dark"), projectAccents.centralog.accent)
  assert.equal(properties.get("--project-accent-light"), projectAccents.centralog.lightAccent)
  applyProjectTheme(root, "/projects/dormfix/")
  assert.equal(root.dataset.project, "dormfix")
  applyProjectTheme(root, "/explore/")
  assert.deepEqual(root.dataset, { theme: "light" })
  assert.equal(properties.size, 0)
})
