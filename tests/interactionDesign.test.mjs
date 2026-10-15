import test from "node:test"
import assert from "node:assert/strict"
import { atlasSymbolPoints } from "../src/lib/atlasSymbols.ts"
import { profileCommand } from "../src/lib/profileCommands.ts"

test("project symbols have equally sized bounded point sets for stable interpolation", () => {
  const symbols = ["isdalog", "dormfix", "centralog", "pharmalink"].map((id) =>
    atlasSymbolPoints(id),
  )
  for (const points of symbols) {
    assert.equal(points.length, 96)
    for (const point of points) {
      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.y))
      assert.ok(Math.abs(point.x) <= 1 && Math.abs(point.y) <= 1)
    }
  }
  assert.equal(new Set(symbols.map((points) => JSON.stringify(points))).size, 4)
  assert.deepEqual(atlasSymbolPoints("unknown"), symbols[0])
})
test("symbol density stays bounded for invalid and oversized requests", () => {
  assert.equal(atlasSymbolPoints("dormfix", -10).length, 16)
  assert.equal(atlasSymbolPoints("dormfix", 100000).length, 160)
  assert.equal(atlasSymbolPoints("dormfix", NaN).length, 96)
})
test("profile commands resolve only supported local content views", () => {
  assert.equal(profileCommand(" LS   --SKILLS "), "skills")
  assert.equal(profileCommand("./now"), "now")
  assert.equal(profileCommand("ls --journey"), "journey")
  for (const input of [
    "",
    "constructor",
    "__proto__",
    "ls --skills; rm",
    "curl example.com",
    "./hack",
    "<script>alert(1)</script>",
  ])
    assert.equal(profileCommand(input), undefined)
})
