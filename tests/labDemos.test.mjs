import test from "node:test"
import assert from "node:assert/strict"
import { labDemos, labDemoFromHash } from "../src/data/labDemos.ts"
import { searchDestination } from "../src/lib/search.ts"

test("each experiment has a unique deep link that restores its selection", () => {
  assert.equal(new Set(labDemos.map(demo => demo.id)).size, 4)
  for (const demo of labDemos) assert.equal(labDemoFromHash(`#demo-${demo.id}`), demo.id)
})
test("empty and unknown experiment fragments fall back to the valuation lab", () => {
  for (const hash of ["", "#demo-unknown", "#walkthrough", "#demo-dormfix-extra"]) assert.equal(labDemoFromHash(hash), "centralog")
})
test("portfolio search can link to the lab or a selected experiment", () => {
  assert.equal(searchDestination({ path: "/lab/", target: "case-study" }), "/lab/")
  assert.equal(searchDestination({ path: "/lab/", target: "demo-centralog" }), "/lab/#demo-centralog")
})
