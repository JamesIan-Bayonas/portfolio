import { useEffect, useRef, useState } from "react"
import { caseStudyText } from "../lib/caseStudyCopy"
import ReadingProgress from "./ReadingProgress"

interface CaseStudyNavigationProps {
  projectId: string
  locale?: "en" | "fil"
}

export default function CaseStudyNavigation({
  projectId,
  locale = "en",
}: CaseStudyNavigationProps) {
  const t = (en: string, fil: string) => (locale === "fil" ? fil : en)
  const sections = [
    { id: "overview", label: "Overview" },
    ...(["dormfix", "isdalog"].includes(projectId) ? [{ id: "workspace-showcase", label: "Role workspaces" }] : []),
    ...(["centralog", "pharmalink"].includes(projectId) ? [{ id: "admin-showcase", label: projectId === "pharmalink" ? "Role workspaces" : "Admin workspace" }] : []),
    { id: "walkthrough", label: "Walkthrough" },
    ...(projectId === "centralog"
      ? [{ id: "lab", label: "Valuation lab" }]
      : []),
    { id: "engineering", label: "Written case study" },
    { id: `${projectId}-contribution`, label: "My contribution" },
    { id: `${projectId}-decision`, label: "Design decisions" },
    { id: `${projectId}-source-code`, label: "Source code" },
    { id: `${projectId}-test-evidence`, label: "Test evidence" },
    { id: `${projectId}-evolution`, label: "Evolution" },
  ]
  const [active, setActive] = useState("overview")
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const nav = useRef<HTMLElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const sectionIds = sections.map((section) => section.id).join(",")

  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const navigation = nav.current
      const offset = navigation
        ? Math.max(
            156,
            Math.ceil(
              parseFloat(getComputedStyle(navigation).top) +
                navigation.offsetHeight +
                16,
            ),
          )
        : 156
      navigation
        ?.closest<HTMLElement>(".dedicated-case-study")
        ?.style.setProperty("--case-section-offset", `${offset}px`)
      const threshold = offset + 1
      let current = "overview"
      for (const id of sectionIds.split(",")) {
        const target = document.getElementById(id)
        if (target && target.getBoundingClientRect().top <= threshold)
          current = id
      }
      setActive(current)
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    const observer = new ResizeObserver(schedule)
    const content = document.getElementById("case-study")
    if (content) observer.observe(content)
    if (nav.current) observer.observe(nav.current)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("hashchange", schedule)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("hashchange", schedule)
    }
  }, [sectionIds])

  useEffect(() => {
    if (!open) return
    function dismiss(event: PointerEvent) {
      if (!nav.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", dismiss)
    return () => document.removeEventListener("pointerdown", dismiss)
  }, [open])

  async function copySection() {
    const url = `${window.location.origin}${window.location.pathname}#${active}`
    try {
      await navigator.clipboard.writeText(url)
      setMessage(t("Section link copied.", "Nakopya ang link ng seksiyon."))
    } catch {
      setMessage(`${t("Section address:", "Address ng seksiyon:")} ${url}`)
    }
  }

  return (
    <nav
      ref={nav}
      className="case-section-nav font-mono"
      aria-label={t("On this page", "Sa pahinang ito")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false)
          toggle.current?.focus()
        }
      }}
    >
      <span className="case-section-label">
        {t("On this page", "Sa pahinang ito")}
      </span>
      <button
        ref={toggle}
        className="case-section-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="case-section-links"
        onClick={() => setOpen(!open)}
      >
        {t("On this page", "Sa pahinang ito")}:{" "}
        {caseStudyText(
          locale,
          sections.find((section) => section.id === active)?.label ??
            "Overview",
        )}{" "}
        <span aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <ul id="case-section-links" className={open ? "is-open" : ""}>
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              onClick={(event) => {
                if (
                  event.ctrlKey ||
                  event.metaKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return
                event.preventDefault()
                setOpen(false)
                setMessage("")
                if (window.location.hash !== `#${section.id}`) {
                  window.history.pushState(null, "", `#${section.id}`)
                  window.dispatchEvent(new Event("hashchange"))
                }
                requestAnimationFrame(() => {
                  const target = document.getElementById(section.id)
                  if (!target) return
                  target.tabIndex = -1
                  target.focus({ preventScroll: true })
                  target.scrollIntoView({ behavior: "instant" })
                  setActive(section.id)
                })
              }}
            >
              {caseStudyText(locale, section.label)}
            </a>
          </li>
        ))}
      </ul>
      <button className="case-section-copy" type="button" onClick={copySection}>
        {t("Copy section link", "Kopyahin ang link ng seksiyon")}
      </button>
      <span className="case-section-status" role="status">
        {message}
      </span>
      <ReadingProgress locale={locale} />
    </nav>
  )
}
