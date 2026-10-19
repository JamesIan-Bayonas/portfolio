import { portfolioMotionQuery } from "../lib/motionPreference"
import { useEffect, useId, useRef, useState, type CSSProperties } from "react"
import { projects } from "../data/projects"
import "./TechnologyStrip.css"

const technologies = [...new Set(projects.flatMap((project) => project.tech))]
  .sort()
  .map((name) => ({
    name,
    count: projects.filter((project) => project.tech.includes(name)).length,
  }))

export default function TechnologyStrip() {
  const root = useRef<HTMLElement>(null)
  const id = useId()
  const [paused, setPaused] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [active, setActive] = useState(false)
  const [reduced, setReduced] = useState(
    () => portfolioMotionQuery().matches,
  )

  useEffect(() => {
    const element = root.current
    if (!element) return
    const media = portfolioMotionQuery()
    let visible = false
    const update = () => {
      setReduced(media.matches)
      setActive(visible && !document.hidden && !media.matches)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      update()
    })
    observer.observe(element)
    media.addEventListener("change", update)
    document.addEventListener("visibilitychange", update)
    return () => {
      observer.disconnect()
      media.removeEventListener("change", update)
      document.removeEventListener("visibilitychange", update)
    }
  }, [])

  return (
    <section
      ref={root}
      className="technology-strip"
      aria-labelledby={`${id}-title`}
      data-active={active}
      data-paused={paused}
      data-static={expanded || reduced}
    >
      <div className="technology-strip-heading">
        <div>
          <h3 id={`${id}-title`}>Technologies connected to the work.</h3>
          <p>Choose a technology to see the projects behind it.</p>
        </div>
        <div className="technology-strip-controls font-mono">
          <span>{technologies.length} technologies</span>
          {reduced ? (
            <span>Static view · reduced motion</span>
          ) : (
            <>
              <button
                type="button"
                disabled={expanded}
                aria-pressed={paused}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? "Play technology motion" : "Pause technology motion"}
                <span aria-hidden="true"> {paused ? "▷" : "Ⅱ"}</span>
              </button>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`${id}-list`}
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? "Show moving strip" : "Show all technologies"}
              </button>
            </>
          )}
        </div>
      </div>
      <div
        className="technology-strip-viewport"
        id={`${id}-list`}
        onBlur={(event) => {
          if (
            !(event.relatedTarget instanceof Node) ||
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            event.currentTarget.scrollLeft = 0
          }
        }}
      >
        <div
          className="technology-track"
          style={
            {
              "--technology-duration": `${technologies.length * 3.2}s`,
            } as CSSProperties
          }
        >
          {[false, true].map((duplicate) => (
            <ul
              key={String(duplicate)}
              className={
                duplicate
                  ? "technology-list technology-list-copy"
                  : "technology-list"
              }
              aria-label={duplicate ? undefined : "Project technologies"}
              aria-hidden={duplicate || undefined}
            >
              {technologies.map((technology) => (
                <li key={technology.name}>
                  <a
                    href={`/explore/?tech=${encodeURIComponent(technology.name)}`}
                    tabIndex={duplicate ? -1 : undefined}
                    aria-label={`${technology.name}, used in ${technology.count} ${
                      technology.count === 1 ? "project" : "projects"
                    }`}
                  >
                    <span
                      className="technology-mark font-mono"
                      aria-hidden="true"
                    >
                      &lt;/&gt;
                    </span>
                    <span>{technology.name}</span>
                    <span
                      className="technology-project-count font-mono"
                      aria-hidden="true"
                    >
                      {technology.count} ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
