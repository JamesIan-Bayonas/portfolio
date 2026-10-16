import React from "react"
import { createRoot } from "react-dom/client"
import ProjectAtlas from "../../src/components/ProjectAtlas"
import "../../src/index.css"

// Dev-only instrumentation surrounds the real renderer; no production probe/loop.
const report = document.querySelector<HTMLElement>("#report")!
const status = document.querySelector<HTMLElement>("#capture-status")!
const capture = document.querySelector<HTMLButtonElement>("#capture")!
const compact = document.querySelector<HTMLInputElement>("#compact")!
const fixture = document.querySelector<HTMLElement>("#fixture")!
const root = createRoot(fixture)
const render = () => {
  fixture.style.maxWidth = compact.checked ? "600px" : "none"
  root.render(
    <React.StrictMode>
      <ProjectAtlas key={String(compact.checked)} compact={compact.checked} />
    </React.StrictMode>,
  )
}
compact.addEventListener("change", render)
const request = window.requestAnimationFrame.bind(window)
const cancel = window.cancelAnimationFrame.bind(window)
const clear = CanvasRenderingContext2D.prototype.clearRect
const hypot = Math.hypot
const pending = new Set<number>()
let paintCount = 0,
  distanceCalls = 0
let sample: {
  start: number
  callbacks: number
  paintTimes: number[]
  durations: number[]
  commits: number[]
  longTasks: number[]
} | null = null
CanvasRenderingContext2D.prototype.clearRect = function (...args) {
  if (this.canvas.classList.contains("atlas-stars")) {
    paintCount++
    sample?.paintTimes.push(performance.now())
  }
  return clear.apply(this, args)
}
Math.hypot = (...args) => {
  distanceCalls++
  return hypot(...args)
}
window.requestAnimationFrame = (callback) => {
  const id = request((time) => {
    pending.delete(id)
    const before = paintCount,
      start = performance.now()
    callback(time)
    if (sample) {
      sample.callbacks++
      if (paintCount > before) sample.durations.push(performance.now() - start)
    }
  })
  pending.add(id)
  return id
}
window.cancelAnimationFrame = (id) => {
  pending.delete(id)
  cancel(id)
}
let interaction: { start: number name: string } | null = null
fixture.addEventListener(
  "click",
  (event) => {
    const button = (event.target as Element).closest(".atlas-node")
    if (sample && button?.getAttribute("aria-pressed") !== "true" && button)
      interaction = {
        start: performance.now(),
        name: button.querySelector("strong")!.textContent!,
      }
  },
  true,
)
new MutationObserver(() => {
  if (
    interaction &&
    fixture
      .querySelector(".atlas-detail h2")
      ?.textContent?.startsWith(interaction.name)
  ) {
    sample?.commits.push(performance.now() - interaction.start)
    interaction = null
  }
}).observe(fixture, { subtree: true, childList: true, characterData: true })
if (PerformanceObserver.supportedEntryTypes.includes("longtask")) {
  new PerformanceObserver((entries) => {
    sample?.longTasks.push(...entries.getEntries().map((e) => e.duration))
  }).observe({ type: "longtask" })
}
const percentile = (values: number[], p: number) => {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted.length
    ? Number(sorted[Math.max(0, Math.ceil(sorted.length * p) - 1)].toFixed(3))
    : null
}
function startCapture() {
  if (sample) return
  capture.disabled = true
  report.textContent = ""
  status.textContent = "Capturing"
  paintCount = distanceCalls = 0
  interaction = null
  sample = {
    start: performance.now(),
    callbacks: 0,
    paintTimes: [],
    durations: [],
    commits: [],
    longTasks: [],
  }
  setTimeout(() => {
    const result = sample!
    sample = null
    const elapsed = performance.now() - result.start
    const scene = fixture.querySelector<HTMLElement>(".atlas-scene")!
    const canvas = fixture.querySelector<HTMLCanvasElement>("canvas")!
    const intervals = result.paintTimes
      .slice(1)
      .map((time, i) => time - result.paintTimes[i])
    report.textContent = JSON.stringify(
      {
        environment: {
          userAgent: navigator.userAgent,
          devicePixelRatio: devicePixelRatio,
          viewport: { width: innerWidth, height: innerHeight },
        },
        variant: compact.checked ? "compact" : "full",
        elapsedMs: Math.round(elapsed),
        stopped:
          fixture.querySelector<HTMLElement>(".project-atlas")!.dataset.stopped,
        sceneVisible:
          scene.getBoundingClientRect().bottom > 0 &&
          scene.getBoundingClientRect().top < innerHeight,
        scene: { width: scene.clientWidth, height: scene.clientHeight },
        canvas: { width: canvas.width, height: canvas.height },
        pendingFrames: pending.size,
        callbacks: result.callbacks,
        draws: paintCount,
        distanceCalls,
        drawsPerSecond: Number((paintCount / (elapsed / 1000)).toFixed(2)),
        drawCallbackMs: {
          samples: result.durations.length,
          median: percentile(result.durations, 0.5),
          p95: percentile(result.durations, 0.95),
          max: percentile(result.durations, 1),
        },
        drawIntervalMs: {
          median: percentile(intervals, 0.5),
          p95: percentile(intervals, 0.95),
          max: percentile(intervals, 1),
        },
        selectionCommitMs: {
          samples: result.commits.length,
          median: percentile(result.commits, 0.5),
          p95: percentile(result.commits, 0.95),
          max: percentile(result.commits, 1),
        },
        longTasks: result.longTasks,
      },
      null,
      2,
    )
    status.textContent = "Capture complete"
    capture.disabled = false
  }, 5000)
}
capture.addEventListener("click", startCapture)
document
  .querySelector("#capture-offscreen")!
  .addEventListener("click", startCapture)
document.body.style.cssText = "max-width:1100px;margin:24px auto;padding:16px"
fixture.style.marginTop = "24px"
render()
