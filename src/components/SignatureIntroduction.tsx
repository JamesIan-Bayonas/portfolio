import { useEffect, useRef, useState } from "react"
import { professionalProfile } from "../data/professionalProfile"
import { projects } from "../data/projects"
import { usePortfolioReducedMotion } from "../lib/usePortfolioReducedMotion"
import { motionTiming } from "../lib/motionTiming"
import ProfileMark from "./ProfileMark"
import "./SignatureIntroduction.css"

export default function SignatureIntroduction() {
  const [open, setOpen] = useState(false)
  const [revision, setRevision] = useState(0)
  const [playing, setPlaying] = useState(false)
  const reduced = usePortfolioReducedMotion()
  const scene = useRef<HTMLDivElement>(null)
  const settle = useRef<() => void>(() => {})
  const independent = projects.filter(
    (project) => project.role === "Sole developer",
  ).length

  useEffect(() => {
    const element = scene.current
    if (!open || reduced || !element || document.hidden) {
      setPlaying(false)
      return
    }
    let cancelled = false
    let started = false
    const animations: Animation[] = []
    const stop = () => {
      animations.forEach((animation) => animation.cancel())
      if (!cancelled) setPlaying(false)
    }
    settle.current = stop
    const start = () => {
      if (started || cancelled || document.hidden) return
      started = true
      const trace = element.querySelector<SVGPathElement>(".profile-mark-trace")
      if (trace?.animate) {
        const length = trace.getTotalLength()
        animations.push(
          trace.animate(
            [
              { strokeDasharray: String(length), strokeDashoffset: length },
              { strokeDasharray: String(length), strokeDashoffset: 0 },
            ],
            { duration: 1200, easing: motionTiming.cssEase },
          ),
        )
      }
      element
        .querySelectorAll<HTMLElement>(".signature-intro-line")
        .forEach((line, index) => {
          if (!line.animate) return
          // Content is always readable; only emphasis moves through the introduction.
          animations.push(
            line.animate(
              [
                {
                  borderLeftColor: "var(--color-accent)",
                  backgroundColor:
                    "color-mix(in srgb,var(--color-accent) 8%,transparent)",
                },
                {
                  borderLeftColor: "var(--color-border)",
                  backgroundColor: "transparent",
                },
              ],
              {
                duration: 900,
                delay: index * 300,
                easing: motionTiming.cssEase,
              },
            ),
          )
        })
      setPlaying(animations.length > 0)
      void Promise.allSettled(
        animations.map((animation) => animation.finished),
      ).then(() => {
        if (!cancelled) stop()
      })
    }
    const onVisibility = () => {
      if (document.hidden) {
        started = true
        stop()
      }
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start()
      else if (started) stop()
    })
    setPlaying(false)
    observer.observe(element)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      cancelled = true
      animations.forEach((animation) => animation.cancel())
      settle.current = () => {}
      observer.disconnect()
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [open, revision, reduced])

  return (
    <section
      id="signature-introduction"
      className="signature-introduction"
      aria-label="Meet the developer"
    >
      <details onToggle={(event) => setOpen(event.currentTarget.open)}>
        <summary>
          <span className="signature-intro-eyebrow">MEET THE DEVELOPER</span>
          <span>A short introduction</span>
          <span className="signature-intro-open" aria-hidden="true">
            +
          </span>
        </summary>
        <div className="signature-intro-scene" ref={scene}>
          <div className="signature-intro-identity">
            <ProfileMark />
            <p className="font-mono">LEARN / BUILD / REFINE</p>
          </div>
          <div className="signature-intro-copy">
            <p className="signature-intro-eyebrow">A NAME BEHIND THE WORK</p>
            <h2>
              {professionalProfile.name}
              <span aria-hidden="true">.</span>
            </h2>
            <p className="signature-intro-role">
              {professionalProfile.title} · {professionalProfile.location}
            </p>
            <ol>
              <li className="signature-intro-line">
                <span aria-hidden="true">01</span>
                <p>
                  <strong>I build connected systems.</strong> {projects.length}{" "}
                  applications to explore, {independent} built independently and{" "}
                  {projects.length - independent} collaborative capstone.
                </p>
              </li>
              <li className="signature-intro-line">
                <span aria-hidden="true">02</span>
                <p>
                  <strong>I make the reasoning visible.</strong> Follow the
                  workflows, inspect the source, and explore the decisions
                  behind each project.
                </p>
              </li>
              <li className="signature-intro-line">
                <span aria-hidden="true">03</span>
                <p>
                  <strong>I keep learning through the work.</strong>{" "}
                  {professionalProfile.currentFocus}
                </p>
              </li>
            </ol>
            <nav
              aria-label="Explore the developer's work"
              className="signature-intro-links font-mono"
            >
              <a href="/about/">
                My journey <span aria-hidden="true">↗</span>
              </a>
              <a href="/explore/">
                Explore the systems <span aria-hidden="true">↗</span>
              </a>
            </nav>
            <div className="signature-intro-controls font-mono">
              <button
                type="button"
                disabled={reduced}
                onClick={() => setRevision((value) => value + 1)}
              >
                Replay introduction <span aria-hidden="true">↻</span>
              </button>
              <button
                type="button"
                aria-disabled={!playing}
                onClick={() => {
                  if (playing) settle.current()
                }}
              >
                Skip animation
              </button>
              <p role="status">
                {reduced
                  ? "Reduced motion · full introduction shown"
                  : playing
                    ? "Playing · all text and links are available"
                    : "Full introduction shown"}
              </p>
            </div>
          </div>
        </div>
      </details>
    </section>
  )
}
