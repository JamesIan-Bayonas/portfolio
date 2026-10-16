import test from "node:test"
import assert from "node:assert/strict"
import { buildAtlasScenes } from "../src/data/atlasScenes.ts"

const ids = ["isdalog", "dormfix", "centralog", "pharmalink"]
const records = () =>
  ids.map((id) => ({
    id,
    name: id,
    context: id === "dormfix" ? "Collaborative capstone" : "School project",
    role: id === "dormfix" ? "Feature developer" : "Sole developer",
    caseStudyPath: `/projects/${id}/`,
    tech: ["React", "TypeScript", "API", "Database", "Other"],
    caseStudy: {
      workflow: Array.from({ length: 4 }, (_, index) => ({
        title: `${id} stage ${index + 1}`,
        detail: `Explanation ${index + 1}`,
      })),
    },
  }))

test("reordering project records preserves scene identity, visual associations, and contribution records", () => {
  const source = records().reverse()
  const scenes = buildAtlasScenes(source)
  assert.deepEqual(
    scenes.map((scene) => scene.id),
    ids,
  )
  const expected = [
    ["#37cbd6", "FISHERIES", 23, 24],
    ["#b28aff", "HOUSING", 77, 24],
    ["#f3b453", "ASSETS", 77, 76],
    ["#f184ab", "PHARMACY", 23, 76],
  ]
  scenes.forEach((scene, index) => {
    assert.deepEqual(
      [scene.accent, scene.label, scene.position.x, scene.position.y],
      expected[index],
    )
    assert.equal(
      scene.project,
      source.find((record) => record.id === scene.id),
    )
  })
  assert.equal(scenes[1].project.role, "Feature developer")
  assert.equal(scenes[1].project.context, "Collaborative capstone")
})

test("scene content follows maintained workflow, technology, and route changes without mutating the project", () => {
  const source = records()
  source[0].caseStudyPath = "/projects/updated-isdalog/"
  source[0].caseStudy.workflow[0].title = "Updated catch registration"
  const before = structuredClone(source)
  const scene = buildAtlasScenes(source)[0]
  assert.equal(scene.workflow.length, 3)
  assert.equal(scene.workflow[0].title, "Updated catch registration")
  assert.equal(scene.workflow[0].detail, "Explanation 1")
  assert.equal(
    scene.workflow[0].href,
    "/projects/updated-isdalog/#isdalog-workflow",
  )
  assert.equal(scene.caseStudyHref, "/projects/updated-isdalog/")
  assert.equal(scene.walkthroughHref, "/projects/updated-isdalog/#walkthrough")
  assert.deepEqual(scene.technologies, [
    "React",
    "TypeScript",
    "API",
    "Database",
  ])
  for (const step of scene.workflow)
    for (const axis of ["x", "y"])
      assert.ok(step.position[axis] >= 0 && step.position[axis] <= 100)
  assert.deepEqual(source, before)
})

test("missing, duplicate, or unrouted project records fail rather than silently taking another scene's identity", () => {
  assert.throws(
    () => buildAtlasScenes(records().slice(1)),
    /isdalog requires exactly one/,
  )
  const duplicate = records()
  duplicate.push(duplicate[1])
  assert.throws(
    () => buildAtlasScenes(duplicate),
    /dormfix requires exactly one/,
  )
  const unrouted = records()
  delete unrouted[2].caseStudyPath
  assert.throws(
    () => buildAtlasScenes(unrouted),
    /centralog requires a case-study destination/,
  )
})
