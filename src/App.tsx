import { lazy, Suspense, useEffect, useRef, useState } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react"
import Nav from "./components/Nav"
import Hero from "./components/Hero"
import caseStudyPages from "./data/caseStudyPages.json"
import sitePages from "./data/sitePages.json"
import { projects } from "./data/projects"
import { findCaseStudyPage } from "./lib/caseStudyPages"

const DedicatedCaseStudy = lazy(() => import("./components/DedicatedCaseStudy"))
const Explore = lazy(() => import("./components/Explore"))
const Lab = lazy(() => import("./components/Lab"))
const Notes = lazy(() => import("./components/Notes"))
const HomeSections = lazy(() => import("./components/HomeSections"))
const PortfolioSearch = lazy(() => import("./components/PortfolioSearch"))

// ─── ScrollProgress ────────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotion()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{
        position: "fixed",
        top: "72px",
        left: 0,
        right: 0,
        height: "2px",
        backgroundColor: "var(--color-accent)",
        transformOrigin: "0%",
        scaleX: reduced ? scrollYProgress : scaleX,
        zIndex: 49,
        opacity: 0.85,
      }}
    />
  )
}

// ─── AmbientAtmosphere ─────────────────────────────────────────────────────
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

    measure()
    const t1 = setTimeout(measure, 200)
    const t2 = setTimeout(measure, 800)
    window.addEventListener("resize", measure, { passive: true })
    window.addEventListener("load",   measure, { once: true })

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
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

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchUsed, setSearchUsed] = useState(false)
  function openSearch() { setSearchUsed(true); setSearchOpen(true) }
  const caseStudyPage = findCaseStudyPage([...caseStudyPages, ...sitePages], window.location.pathname)
  const explorePage = caseStudyPage?.path === "/explore/"
  const labPage = caseStudyPage?.path === "/lab/"
  const notesPage = Boolean(caseStudyPage?.path.startsWith("/notes/"))
  const dedicatedProject = projects.find(project => project.id === caseStudyPage?.projectId)

  useEffect(() => {
    if (!caseStudyPage) return
    document.title = caseStudyPage.title
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (description) description.content = caseStudyPage.description
  }, [caseStudyPage])

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        if (document.querySelector(".screenshot-viewer[open], .contact-panel[open]")) { event.preventDefault(); return }
        event.preventDefault()
        setSearchUsed(true)
        if (!event.repeat) setSearchOpen(open => !open)
      }
    }
    window.addEventListener("keydown", handleShortcut)
    return () => window.removeEventListener("keydown", handleShortcut)
  }, [])

  useEffect(() => {
    if (dedicatedProject || explorePage || labPage || notesPage) return
    if (!window.location.hash) return
    let id: string
    try {
      id = decodeURIComponent(window.location.hash.slice(1))
    } catch {
      return
    }
    // The initial fragment is resolved after React mounts its section targets.
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id)
      if (id.startsWith("project-")) {
        const details = target?.querySelector("details")
        if (details) details.open = true
      }
      target?.scrollIntoView({ behavior: "auto" })
    })
    return () => cancelAnimationFrame(frame)
  }, [dedicatedProject, explorePage, labPage, notesPage])

  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: "var(--color-bg)", color: "var(--color-text1)" }}
    >
      {!dedicatedProject && !explorePage && !labPage && !notesPage && <AmbientAtmosphere />}
      <a className="skip-content" href="#main-content">Skip to content</a>
      <Nav portfolioPage={!dedicatedProject && !explorePage && !labPage && !notesPage} explorePage={explorePage} labPage={labPage} notesPage={notesPage} onOpenSearch={openSearch} />
      <ScrollProgress />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 max-w-none"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {notesPage ? <Suspense fallback={<p className="case-page-loading" role="status">Opening the engineering notes…</p>}><Notes /></Suspense> : labPage ? <Suspense fallback={<p className="case-page-loading" role="status">Opening the engineering lab…</p>}><Lab /></Suspense> : explorePage ? <Suspense fallback={<p className="case-page-loading" role="status">Opening the project explorer…</p>}><Explore /></Suspense> : dedicatedProject && caseStudyPage ? <Suspense fallback={<p className="case-page-loading" role="status">Opening the case study…</p>}><DedicatedCaseStudy project={dedicatedProject} path={caseStudyPage.path} /></Suspense> : <>
        <Hero />
        <Suspense fallback={<div className="home-sections-loading" role="status">Opening the project collection…</div>}><HomeSections /></Suspense>
        </>}
      </main>
      {searchUsed && <Suspense fallback={null}><PortfolioSearch open={searchOpen} onClose={() => setSearchOpen(false)} /></Suspense>}
    </div>
  )
}
