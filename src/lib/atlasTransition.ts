interface AtlasPoint {
  x: number
  y: number
}

export const ATLAS_TRANSITION_MS = 480

export function createAtlasTransition(
  from: readonly AtlasPoint[],
  to: readonly AtlasPoint[],
) {
  if (from.length !== to.length)
    throw new Error("Atlas point counts must match")
  return {
    from: from.map((point) => ({ ...point })),
    to: to.map((point) => ({ ...point })),
  }
}

export function sampleAtlasTransition(
  transition: ReturnType<typeof createAtlasTransition>,
  elapsedMs: number,
) {
  const progress = Math.max(
    0,
    Math.min(
      1,
      Number.isFinite(elapsedMs) ? elapsedMs / ATLAS_TRANSITION_MS : 1,
    ),
  )
  const eased = 1 - (1 - progress) ** 3
  return {
    progress,
    points: transition.to.map((target, index) => {
      const source = transition.from[index]
      return progress === 1
        ? { ...target }
        : {
            x: source.x + (target.x - source.x) * eased,
            y: source.y + (target.y - source.y) * eased,
          }
    }),
  }
}
