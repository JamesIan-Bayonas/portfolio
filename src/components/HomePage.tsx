import { lazy, Suspense, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, MotionConfig } from "motion/react"
import { usePortfolioReducedMotion as useReducedMotion } from "../lib/usePortfolioReducedMotion"
import Hero from "./Hero"
import LoadingState from "./LoadingState"

const HomeSections = lazy(() => import("./HomeSections"))
function AmbientAtmosphere() {
  const { scrollY } = useScroll()

  // ── CRITICAL: do NOT check useReducedMotion here and return a static div ──
  //
  // The previous implementation returned a plain <div className="ambient-glow">
  // when reduced motion was detected. That div had no opacity control, so it
  // sat at full opacity forever with no scroll linkage — the animation never
  // ran regardless of scroll position.
  //
  // The correct behaviour for reduced-motion users: show the glow statically
  // on Hero/About, and hide it completely (opacity 0) from Process onward.
  // We achieve this by ALWAYS rendering the motion elements, but substituting
  // an instant opacity jump (0 duration) instead of a gradual fade when the
  // user prefers reduced motion. This respects the preference (no animation)
  // while still correctly hiding the glow in the right sections.
  const prefersReducedMotion = useReducedMotion()

  const startFadeRef = useRef(600)
  const endFadeRef   = useRef(1400)

  useEffect(() => {
    function measure() {
      const processEl  = document.getElementById("process")
      const projectsEl = document.getElementById("projects")
      if (!processEl || !projectsEl) return

      const scrollTop   = window.scrollY
      const processTop  = processEl.getBoundingClientRect().top  + scrollTop
      const projectsTop = projectsEl.getBoundingClientRect().top + scrollTop

      // Start fading as Process enters the viewport from the bottom
      startFadeRef.current = Math.max(0, processTop - window.innerHeight * 0.35)

      // Reach opacity 0 right as Projects clears the navbar
      endFadeRef.current = Math.max(startFadeRef.current + 1, projectsTop - 72)
    }

    const main = document.getElementById("main-content")
    const resizeObserver = new ResizeObserver(measure)
    const mountObserver = new MutationObserver(measure)
    if (main) {
      resizeObserver.observe(main)
      mountObserver.observe(main, { childList: true })
    }
    measure()
    window.addEventListener("resize", measure, { passive: true })

    return () => {
      resizeObserver.disconnect()
      mountObserver.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  // Transformer-function overload: re-evaluates on every scroll tick,
  // always reads fresh ref values — no stale array problem.
  //
  // When reduced motion is preferred: snap instantly (0 or 1, no in-between).
  // When not: smooth linear interpolation across the fade window.
  const opacity = useTransform(scrollY, (y: number) => {
    const start = startFadeRef.current
    const end   = endFadeRef.current

    if (prefersReducedMotion) {
      // Instant cut: full opacity on Hero/About, zero from Process onward
      return y < start ? 1 : 0
    }

    if (y <= start) return 1
    if (y >= end)   return 0
    return 1 - (y - start) / (end - start)
  })

  // Scale only for non-reduced-motion users
  const scale = useTransform(scrollY, (y: number) => {
    if (prefersReducedMotion) return 1

    const start = startFadeRef.current
    const end   = endFadeRef.current
    if (y <= start) return 1
    if (y >= end)   return 0.82
    return 1 - 0.18 * ((y - start) / (end - start))
  })

  // Single unified render path — motion.div always present so Framer's
  // opacity MotionValue is always wired to a real DOM node. No branch that
  // renders a plain <div> with no opacity control.
  return (
    <motion.div
      aria-hidden="true"
      style={{
        opacity,
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        willChange: "opacity",
        overflow: "clip",
      }}
    >
      {/*
        Centering: left: calc(50% - 450px) in CSS positions the left edge of
        the 900px element at (50vw - 450px), which centers it exactly.
        Framer only manages `scale` here — no x / translateX involved,
        no transform composition conflict possible.
      */}
      <motion.div
        className="ambient-glow"
        style={{
          scale,
          willChange: "transform",
        }}
      />

      <div
        aria-hidden="true"
        className="bg-grid-pattern pointer-events-none fixed inset-0 z-0"
      />
    </motion.div>
  )
}

export default function HomePage() {
  const reduced = useReducedMotion()
  return <MotionConfig reducedMotion={reduced ? "always" : "user"}>
    <AmbientAtmosphere />
    <Hero />
    <Suspense fallback={<LoadingState label="Opening the project collection…" variant="section" />}><HomeSections /></Suspense>
  </MotionConfig>
}
