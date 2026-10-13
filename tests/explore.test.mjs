import test from "node:test"
import assert from "node:assert/strict"
import { filterProjects, readExploreFilters, exploreFilterSearch, emptyExploreFilters, readComparison } from "../src/lib/explore.ts"

const projects = [
  { name: "DormFix", category: "Housing", description: "Receipt OCR and tenant approvals", tech: ["React", "MSSQL"] },
  { name: "CentraLog", category: "Assets", description: "Inventory and valuation", tech: ["React", ".NET"] },
]
test("comparison URLs discard unknown and duplicate projects and limit selection to two", () => {
  assert.deepEqual(readComparison("?compare=unknown&compare=dormfix&compare=dormfix&compare=centralog&compare=pharmalink", ["dormfix", "centralog", "pharmalink"]), ["dormfix", "centralog"])
})
test("comparison selection survives changing and clearing explorer filters", () => {
  const selected = ["centralog", "pharmalink"]
  for (const filters of [emptyExploreFilters, { query: "receipt", domain: "Housing", technology: "C#" }]) {
    const search = exploreFilterSearch(filters, selected)
    assert.deepEqual(readComparison(search, selected), selected)
    assert.deepEqual(readExploreFilters(search, ["Housing"], ["C#"]), filters)
  }
})
test("empty explorer filters preserve project order and all results", () => {
  assert.deepEqual(filterProjects(projects, emptyExploreFilters), projects)
})
test("query, domain, and technology filters combine with AND matching", () => {
  assert.deepEqual(filterProjects(projects, { query: "receipt OCR", domain: "Housing", technology: "React" }), [projects[0]])
  assert.deepEqual(filterProjects(projects, { query: "INVENTORY", domain: "", technology: ".NET" }), [projects[1]])
  assert.deepEqual(filterProjects(projects, { query: "", domain: "Housing", technology: ".NET" }), [])
  assert.deepEqual(filterProjects(projects, { query: "unknown", domain: "", technology: "" }), [])
})
test("shared filter URLs round-trip spaces and special technology characters", () => {
  const filters = { query: "  receipt OCR  ", domain: "Housing", technology: "C# / .NET" }
  const search = exploreFilterSearch(filters)
  assert.deepEqual(readExploreFilters(search, ["Housing"], ["C# / .NET"]), { ...filters, query: "receipt OCR" })
  assert.equal(exploreFilterSearch(emptyExploreFilters), "")
})
test("unknown URL filter options reset to all without losing text search", () => {
  assert.deepEqual(readExploreFilters("?domain=unknown&tech=unknown&q=React", ["Housing"], ["React"]), { query: "React", domain: "", technology: "" })
})
test("familiar engineering names match technology aliases and case-study text", () => {
  const data = [ { ...projects[0], tech: ["Tesseract.js"] }, { ...projects[1], tech: ["ASP.NET Core 8"], searchText: "Custody transfer" } ]
  assert.equal(filterProjects(data, { ...emptyExploreFilters, query: "OCR" })[0].name, "DormFix")
  assert.equal(filterProjects(data, { ...emptyExploreFilters, query: "dotnet custody" })[0].name, "CentraLog")
})
