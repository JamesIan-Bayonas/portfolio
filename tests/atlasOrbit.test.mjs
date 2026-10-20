import test from "node:test"
import assert from "node:assert/strict"
import {
  createAtlasOrbit,
  atlasOrbitCamera,
  projectAtlasOrbit,
  atlasOrbitEdges,
} from "../src/lib/atlasOrbit.ts"

test("orbit geometry retains sixty particles and sixty closed, project-local edges", () => {
  const points = createAtlasOrbit()
  const edges = atlasOrbitEdges()
  assert.equal(points.length, 60)
  assert.equal(edges.length, 60)
  assert.equal(new Set(edges.map(([a, b]) => `${a}:${b}`)).size, 60)
  assert.deepEqual(createAtlasOrbit(), points)
  for (const [a, b] of edges) {
    assert.equal(points[a].group, points[b].group)
    assert.notEqual(a, b)
  }
  for (let group = 0; group < 4; group++) {
    assert.equal(points.filter((point) => point.group === group).length, 15)
    assert.deepEqual(edges[group * 15 + 14], [group * 15 + 14, group * 15])
  }
})

test("perspective stays finite and bounded through a full rotation and invalid inputs", () => {
  const points = [...createAtlasOrbit(), { x: NaN, y: Infinity, z: -Infinity }]
  const original = structuredClone(points)
  for (const yaw of [-Infinity, -100, -Math.PI, -1, 0, 1, Math.PI, 100, NaN]) {
    for (const pitch of [-Infinity, -100, 0, 100, NaN]) {
      for (const point of points) {
        const result = projectAtlasOrbit(point, atlasOrbitCamera(yaw, pitch))
        for (const value of Object.values(result))
          assert.ok(Number.isFinite(value))
        assert.ok(Math.abs(result.x) < 3 && Math.abs(result.y) < 3)
        assert.ok(result.scale > 0.5 && result.scale < 2)
      }
    }
  }
  assert.deepEqual(points, original)
})

test("near points grow while far points recede and the neutral symbol plane is unchanged", () => {
  const camera = atlasOrbitCamera(0, 0)
  assert.deepEqual(projectAtlasOrbit({ x: 0.5, y: -0.25, z: 0 }, camera), {
    x: 0.5,
    y: -0.25,
    depth: 0,
    scale: 1,
  })
  assert.ok(projectAtlasOrbit({ x: 1, y: 0, z: 1 }, camera).scale > 1)
  assert.ok(projectAtlasOrbit({ x: 1, y: 0, z: -1 }, camera).scale < 1)
})
