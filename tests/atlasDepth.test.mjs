import test from "node:test"
import assert from "node:assert/strict"
import { atlasDepthOffset, ATLAS_DEPTH_LAYERS } from "../src/lib/atlasDepth.ts"

test("depth offsets stay within six horizontal and four vertical pixels for extreme or invalid input", () => {
  for (const x of [-1000, -1, 0, 1, 1000, NaN, Infinity]) {
    for (const y of [-1000, 0, 1000, NaN]) {
      for (const depth of [-4, 0, 1, 20, NaN, Infinity]) {
        const offset = atlasDepthOffset(x, y, depth)
        assert.ok(Number.isFinite(offset.x) && Math.abs(offset.x) <= 6)
        assert.ok(Number.isFinite(offset.y) && Math.abs(offset.y) <= 4)
      }
    }
  }
  assert.deepEqual(atlasDepthOffset(NaN, Infinity, 1), { x: 0, y: 0 })
})

test("layers remain ordered and symmetric while neutral input stays centered", () => {
  let previous = 0
  for (const depth of Object.values(ATLAS_DEPTH_LAYERS)) {
    const right = atlasDepthOffset(1, 1, depth)
    const left = atlasDepthOffset(-1, -1, depth)
    assert.ok(right.x > previous)
    assert.equal(left.x, -right.x)
    assert.equal(left.y, -right.y)
    assert.deepEqual(atlasDepthOffset(0, 0, depth), { x: 0, y: 0 })
    previous = right.x
  }
})
