import test from "node:test"
import assert from "node:assert/strict"
import { initialAssetWalkthrough, advanceAssetWalkthrough as advance } from "../src/lib/centralogWalkthrough.ts"

test("future actions cannot skip the asset lifecycle", () => {
  const state = initialAssetWalkthrough()
  for (const type of ["transfer", "repair", "resolve", "report"]) assert.equal(advance(state, { type }), state)
})
test("transfer updates location, custodian, and history together without changing the previous record", () => {
  const active = advance(initialAssetWalkthrough(), { type: "activate" })
  const transferred = advance(active, { type: "transfer" })
  assert.equal(transferred.location, "Computer lab")
  assert.equal(transferred.custodian, "Lab custodian")
  assert.equal(transferred.history.length, active.history.length + 1)
  assert.equal(active.location, "Receiving room")
  assert.equal(active.history.length, 2)
})
test("repair cannot be duplicated and resolution preserves custody and repair history", () => {
  const transferred = advance(advance(initialAssetWalkthrough(), { type: "activate" }), { type: "transfer" })
  const repair = advance(transferred, { type: "repair" })
  assert.equal(repair.lifecycle, "In Maintenance")
  assert.equal(advance(repair, { type: "repair" }), repair)
  const resolved = advance(repair, { type: "resolve" })
  assert.equal(resolved.lifecycle, "Active Fleet")
  assert.equal(resolved.repairDays, 30)
  assert.equal(resolved.custodian, transferred.custodian)
  assert.equal(resolved.location, transferred.location)
  assert.deepEqual(resolved.history.slice(0, -1), repair.history)
  assert.equal(advance(resolved, { type: "resolve" }), resolved)
})
test("reporting preserves records and replay starts a fresh sample", () => {
  let state = initialAssetWalkthrough()
  for (const type of ["activate", "transfer", "repair", "resolve"]) state = advance(state, { type })
  const report = advance(state, { type: "report" })
  assert.equal(report.step, 5)
  assert.equal(report.history, state.history)
  assert.equal(advance(report, { type: "report" }), report)
  assert.deepEqual(advance(report, { type: "reset" }), initialAssetWalkthrough())
})
