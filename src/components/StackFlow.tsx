import { useEffect, useRef, useState, type CSSProperties } from "react"
import "./StackFlow.css"

interface ArchitectureLayer {
  name: string
  detail: string
}

interface StackFlowProps {
  projectName: string
  layers: readonly ArchitectureLayer[]
}

export default function StackFlow({ projectName, layers }: StackFlowProps) {
  const root = useRef<HTMLElement>(null)
  const [run, setRun] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element) return
    let visible = false
    const update = () => {
      const playing = visible && !document.hidden
      setActive(playing)
      if (playing) setRun((previous) => previous || 1)
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        update()
      },
      { threshold: 0.15 },
    )
    observer.observe(element)
    document.addEventListener("visibilitychange", update)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", update)
    }
  }, [])

  return (
    <section
      ref={root}
      className="stack-flow"
      data-active={active}
      data-started={run > 0}
      aria-label={`${projectName} architecture flow`}
    >
      <div className="stack-flow-toolbar font-mono">
        <span>{String(layers.length).padStart(2, "0")} CONNECTED LAYERS</span>
        <button
          type="button"
          className="stack-flow-replay"
          onClick={() => setRun((previous) => previous + 1)}
        >
          Replay stack flow <span aria-hidden="true">↻</span>
        </button>
        <span className="stack-flow-static">Static view</span>
      </div>
      <ol
        key={run}
        className="stack-flow-layers"
        aria-label={`${projectName} architecture layers`}
      >
        {layers.map((layer, index) => (
          <li
            key={layer.name}
            style={{ "--flow-delay": `${index * 0.2}s` } as CSSProperties}
          >
            {index < layers.length - 1 && (
              <svg
                className="stack-flow-wire"
                viewBox="0 0 24 100"
                preserveAspectRatio="none"
                fill="none"
                aria-hidden="true"
              >
                <path
                  className="stack-flow-track"
                  d="M12 0V28L20 38V62L12 72V100"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  className="stack-flow-trace"
                  d="M12 0V28L20 38V62L12 72V100"
                  pathLength="1"
                  vectorEffect="non-scaling-stroke"
                />
                <path
                  className="stack-flow-signal"
                  d="M12 0V28L20 38V62L12 72V100"
                  pathLength="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            )}
            <span className="stack-flow-node font-mono" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="stack-flow-layer">
              <h5>{layer.name}</h5>
              <p>{layer.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="stack-flow-caption">
        Trace each layer of the documented architecture.
      </p>
    </section>
  )
}
