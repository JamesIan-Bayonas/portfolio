import test from "node:test"
import assert from "node:assert/strict"
import { searchEntries, searchDestination } from "../src/lib/search.ts"

const entries = [
  {id:"dormfix",label:"DormFix",description:"Housing workflows",category:"Case study",target:"project-dormfix",keywords:["MSSQL", "Ollama", "React"]},
  {id:"isdalog",label:"IsdaLog",description:"Maritime logistics",category:"Case study",target:"project-isdalog",keywords:["React", "MySQL", "Laravel"]},
  {id:"lab",label:"CentraLog valuation lab",description:"Explore depreciation",category:"Demo",target:"lab",keywords:["calculator", "maintenance"]},
]

test("empty queries retain curated order", () => {
  assert.deepEqual(searchEntries(entries,"   "), entries)
})

test("queries match technologies and require every search term", () => {
  assert.deepEqual(searchEntries(entries,"DORMFIX mssql").map(entry=>entry.id), ["dormfix"])
  assert.deepEqual(searchEntries(entries,"react").map(entry=>entry.id), ["dormfix","isdalog"])
  assert.deepEqual(searchEntries(entries,"depreciation").map(entry=>entry.id), ["lab"])
  assert.deepEqual(searchEntries(entries,"dormfix mysql"), [])
})

test("case and diacritics normalize, with project titles ranked first", () => {
  assert.equal(searchEntries(entries,"ÍSDALOG")[0].id,"isdalog")
  const other = { ...entries[1], id:"reference", label:"Background", keywords:["DormFix"] }
  assert.deepEqual(searchEntries([other,...entries],"dormfix").map(entry=>entry.id), ["dormfix","reference"])
})

test("unknown queries return no matches and keep the original list intact", () => {
  assert.deepEqual(searchEntries(entries,"unknown-project"), [])
  assert.deepEqual(entries.map(entry=>entry.id), ["dormfix","isdalog","lab"])
})
test("search destinations retain filter queries and selected demo fragments", () => {
  assert.equal(searchDestination({ path: "/explore/?tech=MSSQL", target: "case-study" }), "/explore/?tech=MSSQL")
  assert.equal(searchDestination({ path: "/lab/", target: "demo-centralog" }), "/lab/#demo-centralog")
})
