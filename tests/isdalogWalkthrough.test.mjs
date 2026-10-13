import test from "node:test"
import assert from "node:assert/strict"
import { initialWalkthrough, advanceWalkthrough as advance, walkthroughBalances as balances, SAMPLE_PICKUP_CODE, SAMPLE_DELIVERY_CODE } from "../src/lib/isdalogWalkthrough.ts"

function pickupReady() {
  let state = initialWalkthrough()
  for (const action of [{ type: "publish", cloudTimeout: false }, { type: "bid" }, { type: "accept" }]) state = advance(state, action)
  return state
}
function deliveryReady() {
  let state = advance(pickupReady(), { type: "pickup", code: SAMPLE_PICKUP_CODE })
  for (let i = 0; i < 3; i++) state = advance(state, { type: "checkpoint" })
  return advance(state, { type: "arrive" })
}

test("classification supports cloud and local fallback without holding funds", () => {
  for (const cloudTimeout of [false, true]) {
    const state = advance(initialWalkthrough(), { type: "publish", cloudTimeout })
    assert.equal(state.step, 1)
    assert.equal(state.inference, cloudTimeout ? "local" : "cloud")
    assert.deepEqual(balances(state), { buyer: 10000, held: 0, harvester: 0, platform: 0 })
  }
})
test("stages cannot be skipped and only acceptance holds funds", () => {
  const start = initialWalkthrough()
  for (const type of ["bid", "accept", "arrive", "inspect"]) assert.equal(advance(start, { type }), start)
  const bid = advance(advance(start, { type: "publish", cloudTimeout: false }), { type: "bid" })
  assert.equal(balances(bid).held, 0)
  assert.deepEqual(balances(advance(bid, { type: "accept" })), { buyer: 8400, held: 1600, harvester: 0, platform: 0 })
})
test("incorrect or swapped handoff codes preserve custody and funds", () => {
  const pickup = pickupReady()
  for (const code of ["", "000000", SAMPLE_DELIVERY_CODE]) {
    const rejected = advance(pickup, { type: "pickup", code })
    assert.equal(rejected.step, 3)
    assert.equal(rejected.error, true)
    assert.deepEqual(balances(rejected), balances(pickup))
  }
  const delivery = deliveryReady()
  const rejected = advance(delivery, { type: "deliver", code: SAMPLE_PICKUP_CODE })
  assert.equal(rejected.step, 5)
  assert.equal(rejected.error, true)
})
test("arrival requires all checkpoints and checkpoints stop at the destination", () => {
  let state = advance(pickupReady(), { type: "pickup", code: SAMPLE_PICKUP_CODE })
  assert.equal(advance(state, { type: "arrive" }), state)
  for (let i = 0; i < 3; i++) state = advance(state, { type: "checkpoint" })
  assert.equal(advance(state, { type: "checkpoint" }), state)
  assert.equal(advance(state, { type: "arrive" }).step, 5)
})
test("delivery holds funds until inspection, settlement conserves funds and reset clears state", () => {
  const delivered = advance(deliveryReady(), { type: "deliver", code: SAMPLE_DELIVERY_CODE })
  assert.equal(delivered.step, 6)
  assert.equal(balances(delivered).held, 1600)
  const settled = advance(delivered, { type: "inspect" })
  assert.deepEqual(balances(settled), { buyer: 8400, held: 0, harvester: 1552, platform: 48 })
  assert.equal(Object.values(balances(settled)).reduce((a, b) => a + b), 10000)
  assert.equal(advance(settled, { type: "inspect" }), settled)
  assert.deepEqual(advance(settled, { type: "reset" }), initialWalkthrough())
})
