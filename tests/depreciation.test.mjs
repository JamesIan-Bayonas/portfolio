import test from "node:test"
import assert from "node:assert/strict"
import { bookValueAt, defaultScenario, repairDaysAt, validateScenario } from "../src/lib/depreciation.ts"

test("straight-line value uses CentraLog's average month and residual floor", () => {
  const scenario = { ...defaultScenario, repairDays: 0 }
  // 487 days is exactly 16 average months. 60,000 - (55,000 / 60 * 16).
  assert.equal(bookValueAt(scenario, "straight-line", 487), 45333.33)
  assert.equal(bookValueAt(scenario, "straight-line", 0), 60000)
  assert.equal(bookValueAt(scenario, "straight-line", 3650), 5000)
})

test("double-declining uses the project's monthly compound rate", () => {
  const scenario = { ...defaultScenario, cost: 65536, salvage: 0, lifespanMonths: 4, repairDays: 0 }
  // Sixteen active months at a 50% monthly rate: 65,536 * (1/2)^16 = 1.
  assert.equal(bookValueAt(scenario, "double-declining", 487), 1)
  assert.equal(bookValueAt({...scenario, salvage:500}, "double-declining", 487), 500)
})

test("repair windows pause either strategy, then allow depreciation to resume", () => {
  for (const method of ["straight-line", "double-declining"]) {
    const valueAtRepairStart = bookValueAt(defaultScenario, method, 365)
    assert.equal(bookValueAt(defaultScenario, method, 400), valueAtRepairStart)
    assert.equal(bookValueAt(defaultScenario, method, 455), valueAtRepairStart)
    assert.ok(bookValueAt(defaultScenario, method, 456) < valueAtRepairStart)
    assert.ok(bookValueAt(defaultScenario, method, 730) > bookValueAt(defaultScenario, method, 730, false))
  }
})

test("future repairs and zero-duration repairs do not change the value", () => {
  assert.equal(repairDaysAt(defaultScenario, 100), 0)
  assert.equal(repairDaysAt(defaultScenario, 400), 35)
  assert.equal(repairDaysAt(defaultScenario, 1000), 90)
  for (const method of ["straight-line", "double-declining"]) {
    assert.equal(bookValueAt(defaultScenario, method, 100), bookValueAt(defaultScenario, method, 100, false))
    const scenario = { ...defaultScenario, repairDays: 0 }
    assert.equal(bookValueAt(scenario, method, 730), bookValueAt(scenario, method, 730, false))
    assert.equal(bookValueAt({...scenario, salvage: scenario.cost}, method, 730), scenario.cost)
  }
})

test("currency rounding follows the C# midpoint-to-even rule", () => {
  assert.equal(bookValueAt({...defaultScenario, cost:100.075, salvage:0, lifespanMonths:40, repairDays:0}, "straight-line", 487), 60.04)
  assert.equal(bookValueAt({...defaultScenario, cost:100.025, salvage:0, lifespanMonths:40, repairDays:0}, "straight-line", 487), 60.02)
})

test("invalid or empty inputs cannot reach the chart calculation", () => {
  assert.deepEqual(validateScenario(defaultScenario), [])
  for (const change of [{cost:NaN}, {cost:0}, {salvage:60001}, {salvage:-1}, {lifespanMonths:2}, {lifespanMonths:3.5}, {elapsedDays:-1}, {repairDays:731}, {repairStartDay:-1}]) {
    assert.ok(validateScenario({...defaultScenario,...change}).length > 0)
  }
})
