import test from "node:test"
import assert from "node:assert/strict"
import { initialReceiptReview, advanceReceiptReview as advance, receiptFlags, receiptScenarios } from "../src/lib/dormfixWalkthrough.ts"

test("matching receipt has no amount or age flags; anomalous and incomplete samples do", () => {
  assert.deepEqual(receiptFlags(receiptScenarios.matching), [])
  assert.match(receiptFlags(receiptScenarios.mismatch)[0], /amount/)
  assert.match(receiptFlags(receiptScenarios.old)[0], /seven days/)
  assert.match(receiptFlags(receiptScenarios.unreadable)[0], /Manual review/)
})
test("seven-day boundary is inclusive and missing fields never silently pass", () => {
  const receipt = { ...receiptScenarios.matching, ageDays: 7 }
  assert.deepEqual(receiptFlags(receipt), [])
  assert.equal(receiptFlags({ ...receipt, ageDays: 8 }).length, 1)
  for (const field of ["amount", "ageDays", "reference"]) assert.equal(receiptFlags({ ...receipt, [field]: null }).length, 1)
  assert.equal(receiptFlags({ ...receipt, ageDays: 8, amount: 100 }).length, 2)
})
test("advancing never automatically records a landlord decision", () => {
  let state = initialReceiptReview()
  assert.equal(advance(state, { type: "decide", decision: "verified" }), state)
  for (let i = 0; i < 3; i++) state = advance(state, { type: "next" })
  assert.equal(state.step, 3)
  assert.equal(state.decision, null)
  assert.equal(advance(state, { type: "next" }), state)
  const reviewed = advance(state, { type: "decide", decision: "rejected" })
  assert.equal(reviewed.decision, "rejected")
  assert.equal(advance(reviewed, { type: "decide", decision: "verified" }), reviewed)
})
test("changing sample clears the completed review and reset restores the default", () => {
  const finished = { scenario: "matching", step: 3, decision: "verified" }
  const changed = advance(finished, { type: "select", scenario: "unreadable" })
  assert.deepEqual(changed, { scenario: "unreadable", step: 0, decision: null })
  assert.deepEqual(advance(changed, { type: "reset" }), initialReceiptReview())
})
