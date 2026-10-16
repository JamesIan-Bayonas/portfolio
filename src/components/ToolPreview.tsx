import { useEffect, useId, useRef, useState } from "react"
import { useReducedMotion } from "motion/react"
import type { LabDemoId } from "../data/labDemos"
import { toolPreviews, valuationPreviewPoints } from "../data/toolPreviews"
import "./ToolPreview.css"

export default function ToolPreview({ projectId }: { projectId: LabDemoId }) {
  const root = useRef<HTMLElement>(null)
  const id = useId()
  const preview = toolPreviews[projectId]
  const reduced = useReducedMotion()
  const [run, setRun] = useState(0)
  const [active, setActive] = useState(false)
  const [skip, setSkip] = useState(false)

  useEffect(() => {
    const element = root.current
    if (!element || reduced) {
      setActive(false)
      return
    }
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
      { threshold: 0.2 },
    )
    observer.observe(element)
    document.addEventListener("visibilitychange", update)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", update)
    }
  }, [reduced])

  return (
    <figure
      ref={root}
      className="tool-preview"
      aria-labelledby={`${id}-title`}
      data-started={run > 0}
      data-active={active}
      data-static={skip || Boolean(reduced)}
      data-preview={projectId}
    >
      <figcaption className="tool-preview-heading">
        <div>
          <p className="font-mono">FIXED SAMPLE / INPUT → RESULT</p>
          <h5 id={`${id}-title`}>{preview.title}</h5>
        </div>
        <div className="tool-preview-controls font-mono">
          {reduced ? (
            <span>Static preview</span>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  setSkip(false)
                  setRun((previous) => previous + 1)
                }}
              >
                Replay tool preview <span aria-hidden="true">↻</span>
              </button>
              <button
                type="button"
                onClick={() => setSkip(true)}
              >
                Show result
              </button>
            </>
          )}
        </div>
      </figcaption>
      <div key={run} className="tool-preview-scene" aria-hidden="true">
        <div className="tool-preview-input">
          <p className="tool-preview-label font-mono">
            01 / {preview.inputLabel}
          </p>
          <div className="tool-preview-paper font-mono">
            {preview.input.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <span className="tool-preview-scan" />
          </div>
        </div>
        <div className="tool-preview-bridge">
          <svg viewBox="0 0 80 32" fill="none">
            <path
              className="tool-preview-track"
              d="M2 16H74M66 8L74 16L66 24"
            />
            <path className="tool-preview-signal" pathLength="1" d="M2 16H74" />
          </svg>
          <span className="font-mono">{preview.operation}</span>
        </div>
        <div className="tool-preview-result">
          <p className="tool-preview-label font-mono">
            02 / {preview.outputLabel}
          </p>
          {projectId === "centralog" && (
            <svg
              className="tool-preview-chart"
              viewBox="0 0 240 80"
              fill="none"
            >
              <path className="tool-preview-axis" d="M0 4V72H240" />
              <polyline points={valuationPreviewPoints} pathLength="1" />
            </svg>
          )}
          <dl>
            {preview.output.map((field) => (
              <div key={field.label} className="tool-preview-field">
                <dt>{field.label}</dt>
                <dd className="font-mono">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <p className="sr-only">
        {preview.inputLabel}: {preview.input.join(". ")}. {preview.outputLabel}:{" "}
        {preview.output
          .map((field) => `${field.label}: ${field.value}`)
          .join(". ")}
        .
      </p>
      <p className="tool-preview-note">{preview.note}</p>
    </figure>
  )
}
