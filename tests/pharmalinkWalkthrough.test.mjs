import test from "node:test"
import assert from "node:assert/strict"
import { initialSaleWalkthrough, advanceSaleWalkthrough as advance } from "../src/lib/pharmalinkWalkthrough.ts"

test("invalid quantities and future actions cannot reach checkout", () => {
  const state = initialSaleWalkthrough()
  assert.equal(advance(state, { type: "checkout", fail: false }), state)
  assert.equal(advance(state, { type: "void", reason: "Example" }), state)
  for (const quantity of [0, 11, -1, 1.5, NaN]) {
    const invalid = advance(state, { type: "quantity", quantity })
    assert.equal(invalid.quantity, 3)
    assert.ok(invalid.error)
    assert.equal(advance(invalid, { type: "review" }), invalid)
  }
})
test("cart review and failed checkout leave stock and sale records unchanged", () => {
  const reviewed = advance(initialSaleWalkthrough(), { type: "review" })
  const failed = advance(reviewed, { type: "checkout", fail: true })
  assert.equal(failed.stock, 10)
  assert.equal(failed.originalTotal, 0)
  assert.equal(failed.status, "Not recorded")
  assert.deepEqual(failed.history, [])
  assert.equal(failed.step, 1)
})
test("successful checkout records the total and deducts exactly the cart quantity", () => {
  let state = advance(initialSaleWalkthrough(), { type: "quantity", quantity: 10 })
  state = advance(state, { type: "review" })
  state = advance(state, { type: "checkout", fail: false })
  assert.equal(state.stock, 0)
  assert.equal(state.originalTotal, 250)
  assert.equal(state.effectiveTotal, 250)
  assert.equal(state.history.length, 1)
  assert.equal(advance(state, { type: "checkout", fail: false }), state)
})
test("void requires a reason, retains the original sale and restores stock only once", () => {
  const sale = advance(advance(initialSaleWalkthrough(), { type: "review" }), { type: "checkout", fail: false })
  assert.equal(advance(sale, { type: "void", reason: "  " }).step, 2)
  const voided = advance(sale, { type: "void", reason: "Sample input correction" })
  assert.equal(voided.stock, 10)
  assert.equal(voided.originalTotal, 75)
  assert.equal(voided.effectiveTotal, 0)
  assert.equal(voided.status, "Voided")
  assert.equal(voided.history[0], sale.history[0])
  assert.equal(voided.history.length, 2)
  assert.equal(advance(voided, { type: "void", reason: "Repeat" }), voided)
  assert.deepEqual(advance(voided, { type: "reset" }), initialSaleWalkthrough())
})
