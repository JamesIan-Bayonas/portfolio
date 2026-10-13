import test from "node:test"
import assert from "node:assert/strict"
import { relatedProjects } from "../src/lib/relatedProjects.ts"
import { engineeringCapabilities } from "../src/data/capabilities.ts"

const projects = [
  { id: "isdalog", tech: ["Node.js", "React 18"], caseStudyPath: "/projects/isdalog/" },
  { id: "dormfix", tech: ["Node.js", "React 19"], caseStudyPath: "/projects/dormfix/" },
  { id: "centralog", tech: ["ASP.NET Core 8", "C#", "React 19"], caseStudyPath: "/projects/centralog/" },
  { id: "pharmalink", tech: ["ASP.NET Core 8", "C#", "React 19"], caseStudyPath: "/projects/pharmalink/" },
]

test("shared capabilities connect IsdaLog to DormFix before its settlement connection", () => {
  const results = relatedProjects(projects[0], projects, engineeringCapabilities)
  assert.deepEqual(results.map(item => item.project.id), ["dormfix", "pharmalink"])
  assert.deepEqual(results[0].sharedCapabilities, ["AI-assisted workflows", "Real-time communication"])
  assert.deepEqual(results[0].sharedTechnologies, ["Node.js"])
})

test("CentraLog connects to PharmaLink without forcing unrelated frontend-only matches", () => {
  const results = relatedProjects(projects[2], projects, engineeringCapabilities)
  assert.deepEqual(results.map(item => item.project.id), ["pharmalink"])
  assert.deepEqual(results[0].sharedTechnologies, ["ASP.NET Core 8", "C#"])
  assert.deepEqual(relatedProjects({ id: "other", tech: ["React 19"] }, projects, engineeringCapabilities), [])
})

test("recommendations exclude the current project and unavailable case-study destinations", () => {
  const unpublished = projects.map(project => ({ ...project, caseStudyPath: undefined }))
  assert.deepEqual(relatedProjects(projects[0], unpublished, engineeringCapabilities), [])
  assert.ok(relatedProjects(projects[0], projects, engineeringCapabilities).every(item => item.project.id !== "isdalog"))
})
