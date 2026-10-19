import { useEffect, useRef, useState } from "react"
import { usePortfolioReducedMotion as useReducedMotion } from "../lib/usePortfolioReducedMotion"
import { cardAccentStyles } from "../lib/projectCardAccents"
import "./Process.css"

const steps = [
  {
    title: "Understand",
    projectId: "isdalog",
    sub: "People · responsibilities · constraints",
    detail:
      "Start with the people using the system, the decisions they make, and the records they need to trust.",
    example:
      "IsdaLog connects harvesters, buyers, and riders around bidding, custody, and settlement.",
    link: "/projects/isdalog/#isdalog-problem",
    label: "Explore the IsdaLog problem",
  },
  {
    title: "Design",
    projectId: "centralog",
    sub: "Data models · state changes · contracts",
    detail:
      "Map how information moves and which records must change together. Make lifecycle rules and trade-offs explicit before building the interface.",
    example:
      "CentraLog connects asset custody and maintenance records with calculated valuation.",
    link: "/projects/centralog/#centralog-decision",
    label: "Read the CentraLog design decision",
  },
  {
    title: "Build",
    projectId: "dormfix",
    sub: "Interfaces · services · connected workflows",
    detail:
      "Connect the interface to the rules underneath it. Keep validation and review decisions visible so people can follow what happens next.",
    example:
      "DormFix's sample receipt review connects extraction, structured fields, checks, and an explicit reviewer decision.",
    link: "/projects/dormfix/#walkthrough",
    label: "Try the DormFix review workflow",
  },
  {
    title: "Validate",
    projectId: "pharmalink",
    sub: "Failure paths · exact results · evidence",
    detail:
      "Check the paths that succeed, fail, or reverse an action. Explain what each test covers and where the evidence stops.",
    example:
      "PharmaLink's sample checkout can fail without changing stock; a void preserves the original sale.",
    link: "/projects/pharmalink/#walkthrough",
    label: "Inspect the PharmaLink failure path",
  },
  {
    title: "Deliver",
    projectId: undefined,
    sub: "Clear scope · documentation · handoff",
    detail:
      "Make the finished work inspectable. Connect the implementation to a clear explanation, source references, and a useful next step.",
    example:
      "The project collection brings together case studies, sample walkthroughs, source links, and downloadable briefs.",
    link: "/explore/",
    label: "Explore the documented projects",
  },
]

export default function Process() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState(-1)
  const reduced = useReducedMotion()

  useEffect(() => {
    const section = root.current
    if (!section || reduced) {
      setActive(-1)
      return
    }
    const rows = [
      ...section.querySelectorAll<HTMLElement>("[data-process-step]"),
    ]
    let visible = false
    let frame = 0
    const measure = () => {
      frame = 0
      if (!visible || document.hidden) return
      const readingLine = window.innerHeight * 0.5
      const bounds = rows.map((row) =>
        row
          .querySelector<HTMLElement>(".process-node")!
          .getBoundingClientRect(),
      )
      let current = -1
      bounds.forEach((rect, index) => {
        if (rect.top + rect.height / 2 <= readingLine) current = index
        const next = bounds[index + 1]
        const fill = next
          ? Math.max(
              0,
              Math.min(
                1,
                (readingLine - rect.bottom) /
                  Math.max(1, next.top - rect.bottom),
              ),
            )
          : 0
        rows[index].style.setProperty("--process-fill", String(fill))
      })
      setActive((previous) => (previous === current ? previous : current))
    }
    const schedule = () => {
      if (visible && !document.hidden && !frame)
        frame = requestAnimationFrame(measure)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) schedule()
      else {
        cancelAnimationFrame(frame)
        frame = 0
      }
    })
    observer.observe(section)
    const resize = new ResizeObserver(schedule)
    resize.observe(section)
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else schedule()
    }
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resize.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [reduced])

  return (
    <section
      ref={root}
      id="process"
      aria-labelledby="process-title"
      className="process-section relative z-10 px-4 py-12 sm:px-6 sm:py-16 lg:px-10"
      data-process-motion={reduced ? "static" : "scroll"}
      data-process-project={steps[active]?.projectId}
      style={cardAccentStyles[steps[active]?.projectId ?? ""]}
    >
      <div className="process-layout max-w-[1440px] mx-auto">
        <header className="process-intro">
          <p className="project-eyebrow font-mono">HOW I WORK</p>
          <h2 id="process-title">
            From the first question
            <br />
            to a clear handoff.
          </h2>
          <p>
            Follow the decisions behind the work, from understanding a workflow
            to making the result ready to inspect.
          </p>
          <div className="process-reading" aria-hidden="true">
            <span className="font-mono">
              {!reduced && active >= 0
                ? `IN VIEW / 0${active + 1} OF 05`
                : "05 CONNECTED STAGES"}
            </span>
            <strong>
              {!reduced && active >= 0
                ? steps[active].title
                : "Understand → Deliver"}
            </strong>
          </div>
          <a className="process-overview-link font-mono" href="/explore/">
            Explore the project evidence ↗
          </a>
        </header>
        <ol
          className="process-stages"
          aria-label="Five stages of my working process"
        >
          {steps.map((step, index) => (
            <li
              key={step.title}
              data-process-step={index}
              data-process-state={
                reduced
                  ? "static"
                  : active === index
                    ? "current"
                    : active > index
                      ? "earlier"
                      : "upcoming"
              }
              aria-current={!reduced && active === index ? "step" : undefined}
            >
              <span className="process-node font-mono" aria-hidden="true">
                0{index + 1}
              </span>
              {index < steps.length - 1 && (
                <span className="process-connector" aria-hidden="true">
                  <span />
                </span>
              )}
              <div className="process-stage-card">
                <p className="process-stage-label font-mono">{step.sub}</p>
                <h3>{step.title}</h3>
                <p className="process-stage-detail">{step.detail}</p>
                <p className="process-example">{step.example}</p>
                <a href={step.link}>
                  {step.label} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
