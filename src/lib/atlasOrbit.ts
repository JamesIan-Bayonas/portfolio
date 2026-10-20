export interface OrbitPoint {
  x: number
  y: number
  z: number
  group: number
}

export const ORBIT_GROUP_SIZE = 15
export const ORBIT_GROUPS = 4

// Four deterministic orbital planes reuse the existing sixty background particles.
export function createAtlasOrbit(): OrbitPoint[] {
  return Array.from({ length: ORBIT_GROUPS * ORBIT_GROUP_SIZE }, (_, index) => {
    const group = Math.floor(index / ORBIT_GROUP_SIZE)
    const angle =
      ((index % ORBIT_GROUP_SIZE) / ORBIT_GROUP_SIZE) * Math.PI * 2 +
      group * 0.37
    const tilt = 0.4 + group * 0.64
    const radius = 1.25 + group * 0.07
    return {
      group,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * Math.cos(tilt) * radius,
      z: Math.sin(angle) * Math.sin(tilt) * radius,
    }
  })
}

const finite = (value: number, limit: number) =>
  Number.isFinite(value) ? Math.max(-limit, Math.min(limit, value)) : 0

export function atlasOrbitCamera(yaw: number, pitch: number) {
  const y = Number.isFinite(yaw) ? yaw % (Math.PI * 2) : 0
  const p = finite(pitch, 0.35)
  return { cy: Math.cos(y), sy: Math.sin(y), cp: Math.cos(p), sp: Math.sin(p) }
}

export function projectAtlasOrbit(
  point: Pick<OrbitPoint, "x" | "y" | "z">,
  camera: ReturnType<typeof atlasOrbitCamera>,
) {
  const x = finite(point.x, 1.6),
    y = finite(point.y, 1.6),
    z = finite(point.z, 1.6)
  const rotatedX = x * camera.cy + z * camera.sy
  const rotatedZ = -x * camera.sy + z * camera.cy
  const rotatedY = y * camera.cp - rotatedZ * camera.sp
  const depth = y * camera.sp + rotatedZ * camera.cp
  const scale = 5.5 / (5.5 - depth)
  return { x: rotatedX * scale, y: rotatedY * scale, depth, scale }
}

// Adjacent points close each plane; this is sixty edges, not an all-pairs search.
export function atlasOrbitEdges() {
  return Array.from({ length: ORBIT_GROUPS * ORBIT_GROUP_SIZE }, (_, index) => {
    const start = Math.floor(index / ORBIT_GROUP_SIZE) * ORBIT_GROUP_SIZE
    return [index, start + ((index + 1 - start) % ORBIT_GROUP_SIZE)] as const
  })
}
