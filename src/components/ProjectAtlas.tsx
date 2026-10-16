import { buildAtlasScenes, type AtlasProjectId } from "../data/atlasScenes"
import { useEffect, useId, useRef, useState, type CSSProperties } from "react"
import { projects } from "../data/projects"
import "./ProjectAtlas.css"

const scenes = buildAtlasScenes(projects)
const scenesById = new Map(scenes.map((scene) => [scene.id, scene]))

interface StarFieldProps {
  active: AtlasProjectId
  stopped: boolean
}

function StarField({ active, stopped }: StarFieldProps) {
  const morph = useRef(
    scenesById.get(active)!.symbol.map((point) => ({ ...point })),
  )
  const canvas = useRef<HTMLCanvasElement>(null)
  const selected = useRef(active)
  const clock = useRef(0)
  const repaint = useRef<() => void>(() => {})
  const pointer = useRef({ x: -1000, y: -1000 })
  useEffect(() => {
    selected.current = active
    repaint.current()
  }, [active])
  useEffect(() => {
    const element = canvas.current
    const host = element?.parentElement
    const context = element?.getContext("2d")
    if (!element || !host || !context) return
    let width = 0,
      height = 0,
      frame = 0,
      visible = false,
      time = clock.current,
      previous = 0
    let dark = document.documentElement.dataset.theme !== "light"
    const points = scenes.flatMap((scene, group) =>
      Array.from({ length: 15 }, (_, index) => {
        const angle = index * 2.399 + group
        return {
          group: scene.id,
          accent: scene.accent,
          x: scene.position.x / 100 + Math.cos(angle) * (0.035 + index * 0.008),
          y: scene.position.y / 100 + Math.sin(angle) * (0.03 + index * 0.009),
          phase: index * 1.7 + group,
        }
      }),
    )
    function draw(now: number) {
      frame = 0
      if (now - previous < 32 && !stopped) {
        schedule()
        return
      }
      const delta = Math.min(now - previous, 50) / 1000
      time += stopped ? 0 : delta
      clock.current = time
      previous = now
      context!.clearRect(0, 0, width, height)
      const plotted = points.map((point) => {
        let x = point.x * width + Math.sin(time * 0.22 + point.phase) * 12
        let y = point.y * height + Math.cos(time * 0.18 + point.phase) * 10
        const dx = x - pointer.current.x,
          dy = y - pointer.current.y
        const distance = Math.hypot(dx, dy)
        if (!stopped && distance > 0 && distance < 105) {
          x += (dx / distance) * (105 - distance) * 0.18
          y += (dy / distance) * (105 - distance) * 0.18
        }
        return { ...point, x, y }
      })
      plotted.forEach((point, i) => {
        context!.strokeStyle = point.accent
        for (let j = i + 1; j < plotted.length; j++) {
          const other = plotted[j]
          const distance = Math.hypot(point.x - other.x, point.y - other.y)
          if (point.group !== other.group || distance > width * 0.15) continue
          context!.globalAlpha =
            (1 - distance / (width * 0.15)) *
            (point.group === selected.current ? 0.16 : 0.06) *
            (dark ? 1 : 1.4)
          context!.beginPath()
          context!.moveTo(point.x, point.y)
          context!.lineTo(other.x, other.y)
          context!.stroke()
        }
        context!.globalAlpha = point.group === selected.current ? 0.32 : 0.15
        context!.fillStyle = point.accent
        context!.beginPath()
        context!.arc(point.x, point.y, i % 4 === 0 ? 2.1 : 1.2, 0, Math.PI * 2)
        context!.fill()
      })
      context!.globalAlpha = 1
      const selectedScene = scenesById.get(selected.current)!
      context!.fillStyle = dark
        ? selectedScene.accent
        : selectedScene.lightAccent
      const scale = Math.min(width * 0.32, height * 0.36)
      const blend = stopped ? 1 : 1 - Math.exp(-delta * 6)
      morph.current.forEach((point, index) => {
        const target = selectedScene.symbol[index]
        point.x += (target.x - point.x) * blend
        point.y += (target.y - point.y) * blend
        context!.beginPath()
        context!.arc(
          width / 2 + point.x * scale,
          height / 2 + point.y * scale,
          1.7,
          0,
          Math.PI * 2,
        )
        context!.fill()
      })
      if (!stopped) schedule()
    }
    function schedule() {
      if (!frame && visible && !document.hidden && !stopped)
        frame = requestAnimationFrame(draw)
    }
    function resize() {
      cancelAnimationFrame(frame)
      frame = 0
      const rect = host!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      element!.width = Math.round(width * ratio)
      element!.height = Math.round(height * ratio)
      context!.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw(performance.now())
    }
    function move(event: PointerEvent) {
      const rect = host!.getBoundingClientRect()
      pointer.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }
    }
    function leave() {
      pointer.current = { x: -1000, y: -1000 }
    }
    function visibility() {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else {
        previous = performance.now()
        schedule()
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) {
        previous = performance.now()
        schedule()
      } else {
        cancelAnimationFrame(frame)
        frame = 0
      }
    })
    const sizing = new ResizeObserver(resize)
    const theme = new MutationObserver(() => {
      dark = document.documentElement.dataset.theme !== "light"
      if (stopped) draw(performance.now())
    })
    repaint.current = () => {
      cancelAnimationFrame(frame)
      frame = 0
      previous = performance.now()
      draw(previous + 33)
    }
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    })
    observer.observe(host)
    sizing.observe(host)
    host.addEventListener("pointermove", move, { passive: true })
    host.addEventListener("pointerleave", leave)
    document.addEventListener("visibilitychange", visibility)
    resize()
    return () => {
      repaint.current = () => {}
      cancelAnimationFrame(frame)
      observer.disconnect()
      sizing.disconnect()
      theme.disconnect()
      host.removeEventListener("pointermove", move)
      host.removeEventListener("pointerleave", leave)
      document.removeEventListener("visibilitychange", visibility)
    }
  }, [stopped])
  return <canvas ref={canvas} className="atlas-stars" aria-hidden="true" />
}

export default function ProjectAtlas({
  compact = false,
  onTechnology,
}: {
  compact?: boolean
  onTechnology?: (technology: string) => void
}) {
  const root = useRef<HTMLElement>(null)
  const [selected, setSelected] = useState<AtlasProjectId>(scenes[0].id)
  const [paused, setPaused] = useState(() => {
    try {
      return localStorage.getItem("portfolio-atlas-paused") === "true"
    } catch {
      return false
    }
  })
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  const id = useId()
  useEffect(() => {
    const element = root.current
    if (!element) return
    let visible = false
    const update = () => {
      element.dataset.animating = String(visible && !document.hidden)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    observer.observe(element)
    document.addEventListener("visibilitychange", update)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", update)
    }
  }, [])
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(query.matches)
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  const scene = scenesById.get(selected)!
  const project = scene.project
  const stopped = paused || reduced
  return (
    <section
      ref={root}
      className={`project-atlas${compact ? " project-atlas-compact" : ""}`}
      data-stopped={stopped}
      style={
        {
          "--atlas-color": scene.accent,
          "--atlas-light-color": scene.lightAccent,
        } as CSSProperties
      }
      aria-label="Interactive project atlas"
    >
      <div className="atlas-topline font-mono">
        <span>
          <i aria-hidden="true" /> SYSTEM ATLAS{" "}
          <span className="atlas-version">/ 01—04</span>
        </span>
        <button
          type="button"
          disabled={reduced}
          aria-pressed={paused || reduced}
          onClick={() => {
            setPaused(!paused)
            try {
              localStorage.setItem("portfolio-atlas-paused", String(!paused))
            } catch {
              /* Motion control works without storage. */
            }
          }}
        >
          {reduced
            ? "Reduced motion"
            : paused
              ? "Play motion ▷"
              : "Pause motion Ⅱ"}
        </button>
      </div>
      <div className="atlas-nodes" role="group" aria-label="Select a system">
        {scenes.map((item, index) => (
          <button
            key={item.id}
            type="button"
            className="atlas-node"
            style={
              {
                "--node-color": item.accent,
                "--node-light-color": item.lightAccent,
              } as CSSProperties
            }
            aria-pressed={selected === item.id}
            aria-controls={`${id}-detail ${id}-workflow`}
            onClick={() => setSelected(item.id)}
          >
            <span className="atlas-node-mark" aria-hidden="true">
              0{index + 1}
            </span>
            <strong>{item.project.name}</strong>
            <span className="font-mono">{item.label}</span>
          </button>
        ))}
      </div>
      <div className="atlas-layout">
        <div className="atlas-visual">
          <div className="atlas-scene" aria-hidden="true">
            <StarField active={selected} stopped={stopped} />
            <div className="atlas-symbol-halo" />
            <div className="atlas-scene-caption font-mono">
              <span>PROJECT / 0{scenes.indexOf(scene) + 1}</span>
              <span>{scene.label}</span>
            </div>
            <p className="atlas-symbol-caption font-mono">
              EXPLORE THE WORKFLOW BELOW ↓
            </p>
          </div>
          <ol
            id={`${id}-workflow`}
            className="atlas-workflow"
            aria-label={`${project.name} workflow overview`}
          >
            {scene.workflow.map((step, index) => (
              <li key={step.title}>
                <a href={step.href}>
                  <span className="font-mono" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <span>{step.title}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div
          id={`${id}-detail`}
          className="atlas-detail"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="atlas-detail-copy" key={project.id}>
            <p className="atlas-kicker font-mono">
              0{scenes.indexOf(scene) + 1} / {project.category}
            </p>
            <h2>
              {project.name}
              <span aria-hidden="true">.</span>
            </h2>
            <p className="atlas-project-title">{project.title}</p>
            <p className="atlas-credit">
              {project.context} · {project.role}
            </p>
            <div className="atlas-project-actions font-mono">
              <a href={scene.caseStudyHref}>
                Read the case study <span aria-hidden="true">↗</span>
              </a>
              <a href={scene.walkthroughHref}>Try the workflow →</a>
            </div>
          </div>
        </div>
      </div>
      <div className="atlas-bottomline">
        <p className="font-mono">
          CONNECTED THROUGH <span aria-hidden="true">↳</span>
        </p>
        <div className="atlas-technologies">
          {scene.technologies.map((technology) =>
            onTechnology ? (
              <button
                type="button"
                key={technology}
                onClick={() => onTechnology(technology)}
              >
                {technology} ↗
              </button>
            ) : (
              <a
                key={technology}
                href={`/explore/?tech=${encodeURIComponent(technology)}`}
              >
                {technology} ↗
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  )
}
