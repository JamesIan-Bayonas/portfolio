interface Point {
  x: number
  y: number
}
type Path = number[][]
const fish: Path = Array.from({ length: 33 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2
  return [Math.cos(angle) * 0.68, Math.sin(angle) * 0.4]
})
const shapes: Record<string, Path[]> = {
  isdalog: [
    fish,
    [
      [-0.6, 0],
      [-0.95, -0.46],
      [-0.95, 0.46],
      [-0.6, 0],
    ],
    [
      [0.3, -0.1],
      [0.34, -0.1],
    ],
    [
      [0, -0.4],
      [-0.2, -0.7],
      [0.3, -0.35],
    ],
  ],
  dormfix: [
    [
      [-0.7, 0.85],
      [-0.7, -0.6],
      [0, -0.95],
      [0.7, -0.6],
      [0.7, 0.85],
      [-0.7, 0.85],
    ],
    [
      [-0.2, 0.85],
      [-0.2, 0.3],
      [0.2, 0.3],
      [0.2, 0.85],
    ],
    ...[-0.35, 0.2].flatMap((x) =>
      [-0.35, 0].map((y) => [
        [x, y],
        [x + 0.15, y],
        [x + 0.15, y + 0.15],
        [x, y + 0.15],
        [x, y],
      ]),
    ),
  ],
  centralog: [
    [
      [0, -0.85],
      [0.85, -0.4],
      [0.85, 0.45],
      [0, 0.9],
      [-0.85, 0.45],
      [-0.85, -0.4],
      [0, -0.85],
    ],
    [
      [-0.85, -0.4],
      [0, 0.05],
      [0.85, -0.4],
    ],
    [
      [0, 0.05],
      [0, 0.9],
    ],
    [
      [-0.4, -0.63],
      [0.45, -0.18],
      [0.45, 0.1],
    ],
  ],
  pharmalink: [
    [
      [-0.28, -0.9],
      [0.28, -0.9],
      [0.28, -0.28],
      [0.9, -0.28],
      [0.9, 0.28],
      [0.28, 0.28],
      [0.28, 0.9],
      [-0.28, 0.9],
      [-0.28, 0.28],
      [-0.9, 0.28],
      [-0.9, -0.28],
      [-0.28, -0.28],
      [-0.28, -0.9],
    ],
  ],
}

// Equal point counts let the canvas interpolate project symbols without a 3D dependency.
export function atlasSymbolPoints(projectId: string, count = 96): Point[] {
  const size = Math.min(
    160,
    Math.max(16, Math.floor(Number.isFinite(count) ? count : 96)),
  )
  const paths = shapes[projectId] ?? shapes.isdalog
  const segments = paths.flatMap((path) =>
    path
      .slice(1)
      .map((end, i) => ({
        start: path[i],
        end,
        length: Math.hypot(end[0] - path[i][0], end[1] - path[i][1]),
      })),
  )
  const total = segments.reduce((sum, line) => sum + line.length, 0)
  return Array.from({ length: size }, (_, i) => {
    let distance = (i / size) * total
    const segment =
      segments.find((line) => {
        if (distance <= line.length) return true
        distance -= line.length
        return false
      }) ?? segments.at(-1)!
    const t = Math.min(1, distance / segment.length)
    return {
      x: segment.start[0] + (segment.end[0] - segment.start[0]) * t,
      y: segment.start[1] + (segment.end[1] - segment.start[1]) * t,
    }
  })
}

