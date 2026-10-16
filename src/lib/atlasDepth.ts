export const ATLAS_DEPTH_LAYERS = {
  background: 0.2,
  middle: 0.55,
  foreground: 1,
} as const

const bounded = (value: number, limit: number) =>
  Number.isFinite(value) ? Math.max(-limit, Math.min(limit, value)) : 0

// Normalized pointer input produces a bounded pixel offset, independent of viewport size.
export function atlasDepthOffset(x: number, y: number, depth: number) {
  const layer = Math.max(0, bounded(depth, 1))
  return { x: bounded(x, 1) * 6 * layer, y: bounded(y, 1) * 4 * layer }
}
