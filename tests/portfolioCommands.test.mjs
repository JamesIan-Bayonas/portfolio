import test from "node:test"
import assert from "node:assert/strict"
import {
  buildPortfolioCommands,
  resolvePortfolioCommand,
  suggestPortfolioCommands,
} from "../src/lib/portfolioCommands.ts"

const commands = buildPortfolioCommands([
  { id: "dormfix", name: "DormFix", caseStudyPath: "/projects/dormfix/" },
  { id: "centralog", name: "CentraLog", caseStudyPath: "/projects/centralog/" },
  { id: "unpublished", name: "Unpublished" },
])

test("project commands preserve published routes and select the matching lab and notes", () => {
  assert.equal(
    resolvePortfolioCommand(" DormFix ", commands)?.href,
    "/projects/dormfix/",
  )
  assert.equal(
    resolvePortfolioCommand(" LAB   DORMFIX ", commands)?.href,
    "/lab/#demo-dormfix",
  )
  assert.equal(
    resolvePortfolioCommand("notes centralog", commands)?.href,
    "/notes/?project=centralog",
  )
  assert.equal(resolvePortfolioCommand("unpublished", commands), undefined)
})

test("suggestions narrow a command without confusing a section with its project commands", () => {
  assert.deepEqual(
    suggestPortfolioCommands("lab d", commands).map((item) => item.command),
    ["lab dormfix"],
  )
  assert.deepEqual(
    suggestPortfolioCommands("lab", commands).map((item) => item.command),
    ["lab", "lab dormfix", "lab centralog"],
  )
  assert.deepEqual(suggestPortfolioCommands("", commands), [])
  assert.equal(resolvePortfolioCommand("lab d", commands), undefined)
})

test("only registered commands resolve and utility commands never navigate", () => {
  for (const value of [
    "https://example.com",
    "javascript:alert(1)",
    "lab unknown",
    "constructor",
    "__proto__",
  ])
    assert.equal(resolvePortfolioCommand(value, commands), undefined)
  assert.equal(resolvePortfolioCommand("help", commands)?.action, "help")
  assert.equal(resolvePortfolioCommand("clear", commands)?.action, "clear")
  assert.equal(resolvePortfolioCommand("clear", commands)?.href, undefined)
})
