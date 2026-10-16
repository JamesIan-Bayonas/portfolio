import test from "node:test"
import assert from "node:assert/strict"
import {
  createAtlasTransition,
  sampleAtlasTransition,
  ATLAS_TRANSITION_MS,
} from "../src/lib/atlasTransition.ts"

test("selection reaches the exact target within a finite duration without mutating scene data", () => {
  const from = [{ x: -1, y: 0 }],
    to = [{ x: 1, y: 1 }]
  const transition = createAtlasTransition(from, to)
  assert.deepEqual(sampleAtlasTransition(transition, 0).points, from)
  const middle = sampleAtlasTransition(transition, ATLAS_TRANSITION_MS / 2)
  assert.ok(middle.points[0].x > -1 && middle.points[0].x < 1)
  assert.deepEqual(
    sampleAtlasTransition(transition, ATLAS_TRANSITION_MS).points,
    to,
  )
  assert.deepEqual(sampleAtlasTransition(transition, 10000).points, to)
  transition.from[0].x = 20
  transition.to[0].y = 20
  assert.deepEqual(from, [{ x: -1, y: 0 }])
  assert.deepEqual(to, [{ x: 1, y: 1 }])
  assert.throws(() => createAtlasTransition(from, []), /counts must match/)
})

test("interrupting a selection starts at the displayed geometry and settles only at the latest target", () => {
  const first = createAtlasTransition([{ x: 0, y: 0 }], [{ x: 1, y: 1 }])
  const displayed = sampleAtlasTransition(first, 120).points
  const latest = [{ x: -0.5, y: 0.25 }]
  const interrupted = createAtlasTransition(displayed, latest)
  assert.deepEqual(sampleAtlasTransition(interrupted, 0).points, displayed)
  assert.deepEqual(
    sampleAtlasTransition(interrupted, ATLAS_TRANSITION_MS).points,
    latest,
  )
})
