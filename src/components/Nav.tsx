import { useState, useEffect, useRef } from "react"
import LanguageSwitch from "./LanguageSwitch"
import { currentLocale, localizeCoreHref } from "../lib/locale"

const resumeUrl = `${import.meta.env.BASE_URL}RESUME.pdf`

const links = ["about", "now", "process", "projects", "explore", "lab", "notes", "skills", "contact"]
const pageLinks: Record<string, string> = { about: "/about/", now: "/now/", contact: "/work-with-me/", explore: "/explore/", lab: "/lab/", notes: "/notes/" }

interface NavProps {
  onOpenSearch: () => void
  portfolioPage?: boolean
  explorePage?: boolean
  labPage?: boolean
  notesPage?: boolean
  professionalPath?: "/about/" | "/now/" | "/work-with-me/"
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </svg>
  )
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function applyTheme(t: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", t)
}

export default function Nav({ onOpenSearch, portfolioPage = true, explorePage = false, labPage = false, notesPage = false, professionalPath }: NavProps) {
  const locale = currentLocale()
  const fil = locale === "fil"
  const shownLinks = fil ? ["about", "now", "projects", "lab", "notes", "contact"] : links
  const labels: Record<string,string> = {about:"Tungkol",now:"Ngayon",projects:"Mga proyekto",lab:"Lab (EN)",notes:"Mga tala (EN)",contact:"Ugnayan"}
  const href = (link: string) => fil && link === "projects" ? "/fil/#projects" : localizeCoreHref(pageLinks[link] ?? `${portfolioPage ? "" : "/"}#${link}`, locale)
  const [active, setActive] = useState(professionalPath ? Object.keys(pageLinks).find(link => pageLinks[link] === professionalPath) ?? "" : notesPage ? "notes" : labPage ? "lab" : explorePage ? "explore" : "")
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const toggleRef = useRef<HTMLButtonElement>(null)

  // Initialise theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(
      "portfolio-theme",
    ) as "dark" | "light" | null
    const initial = saved === "light" ? "light" : "dark"
    setTheme(initial)
    applyTheme(initial)
  }, [])

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    applyTheme(next)
    localStorage.setItem("portfolio-theme", next)
  }

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    const desktop = window.matchMedia("(min-width: 1280px)")
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    desktop.addEventListener("change", onResize)
    return () => {
      document.removeEventListener("keydown", onKey)
      desktop.removeEventListener("change", onResize)
    }
  }, [menuOpen])

  useEffect(() => {
    if (!portfolioPage) return
    const sectionIds = links.filter(link => !pageLinks[link])
    const observed = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            setActive(id === "about" ? "about" : id)
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    )
    function bindSections() {
      for (const id of sectionIds) {
        const section = document.getElementById(id)
        if (section && !observed.has(id)) { observer.observe(section); observed.add(id) }
      }
      if (observed.size === sectionIds.length) mountObserver.disconnect()
    }
    const mountObserver = new MutationObserver(bindSections)
    const main = document.getElementById("main-content")
    if (main) mountObserver.observe(main, { childList: true })
    bindSections()
    return () => { observer.disconnect(); mountObserver.disconnect() }
  }, [portfolioPage])

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 border-b"
      style={{
        height: "72px",
        backgroundColor: "var(--color-nav-bg)",
        borderColor: "var(--color-border)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="max-w-[1440px] mx-auto min-w-0 px-4 sm:px-6 lg:px-10 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <span
            className="text-sm select-none shrink-0 whitespace-nowrap"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-accent)",
            }}
          >
            [DEV/
            <span
              className="nav-logo-cursor"
              style={{
                display: "inline-block",
                width: "0.55ch",
                backgroundColor: "var(--color-accent)",
                height: "1em",
                verticalAlign: "text-bottom",
              }}
            />
            ]
          </span>
          <span
            className="text-xs sm:text-sm font-bold"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text1)",
            }}
          >
            James Ian Bayonas
          </span>
        </div>

        {/* Desktop Nav */}
        <nav
          className="hidden xl:flex items-center gap-3"
          aria-label={fil ? "Pangunahing nabigasyon" : "Main navigation"}
        >
          {shownLinks.map((link) => (
            <a
              key={link}
              href={href(link)}
              hrefLang={fil && (link === "lab" || link === "notes") ? "en" : undefined}
              aria-current={(link === "explore" && explorePage) || (link === "lab" && labPage) || (link === "notes" && notesPage) || (professionalPath && pageLinks[link] === professionalPath) ? "page" : undefined}
              onClick={() => setActive(link)}
              className="relative text-sm lowercase transition-colors duration-150 pb-1"
              style={{
                fontFamily: "var(--font-mono)",
                color:
                  active === link
                    ? "var(--color-accent)"
                    : "var(--color-text2)",
              }}
            >
              {fil ? labels[link] : link}
              {active === link && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-px"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              )}
            </a>
          ))}

          <button
            type="button"
            onClick={onOpenSearch}
            className="nav-search"
            aria-label={fil ? "Maghanap sa portfolio (English)" : "Search portfolio"}
            aria-keyshortcuts="Control+k Meta+k"
          >
            <SearchIcon />
            <kbd>⌘/Ctrl K</kbd>
          </button>

          <LanguageSwitch />
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? (fil ? "Gamitin ang light theme" : "Switch to light theme")
                : (fil ? "Gamitin ang dark theme" : "Switch to dark theme")
            }
            className="transition-colors duration-150 w-9 h-9 flex items-center justify-center"
            style={{ color: "var(--color-text2)" }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color =
                "var(--color-text1)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color =
                "var(--color-text2)"
            }}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* Desktop Resume Link */}
          <a
            href={resumeUrl}
            download="James_Ian_Bayonas_Resume.pdf"
            className="text-sm transition-colors duration-150 px-4 py-1.5 border cursor-pointer"
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--color-text1)",
              borderColor: "var(--color-border)",
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-accent)"
              ;(e.currentTarget as HTMLElement).style.color =
                "var(--color-accent)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.borderColor =
                "var(--color-border)"
              ;(e.currentTarget as HTMLElement).style.color =
                "var(--color-text1)"
            }}
          >
            {fil ? "Resume (EN)" : "Resume"}
          </a>
        </nav>

        {/* Mobile: theme toggle + hamburger */}
        <div className="xl:hidden flex items-center gap-0">
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              onOpenSearch()
            }}
            className="nav-search-mobile"
            aria-label={fil ? "Maghanap sa portfolio (English)" : "Search portfolio"}
          >
            <SearchIcon />
          </button>
          <button
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? (fil ? "Gamitin ang light theme" : "Switch to light theme")
                : (fil ? "Gamitin ang dark theme" : "Switch to dark theme")
            }
            className="transition-colors duration-150 w-11 h-11 flex items-center justify-center"
            style={{ color: "var(--color-text2)" }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLElement).style.color =
                "var(--color-text1)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLElement).style.color =
                "var(--color-text2)"
            }}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          <button
            ref={toggleRef}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            className="shrink-0 w-11 h-11 flex flex-col justify-center items-center gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={fil ? "Buksan o isara ang menu" : "Toggle menu"}
          >
            <span
              className="menu-line block w-5 h-px"
              style={{ backgroundColor: "var(--color-text1)" }}
              data-open={menuOpen}
            />
            <span
              className="menu-line menu-line-middle block w-5 h-px"
              style={{ backgroundColor: "var(--color-text1)" }}
              data-open={menuOpen}
            />
            <span
              className="menu-line menu-line-last block w-5 h-px"
              style={{ backgroundColor: "var(--color-text1)" }}
              data-open={menuOpen}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
        {menuOpen && (
          <div
            id="mobile-navigation"
            className="max-h-[calc(100dvh-72px)] overflow-y-auto xl:hidden border-t px-4 sm:px-6 lg:px-10 py-6 flex flex-col gap-4"
            style={{
              backgroundColor: "var(--color-bg)",
              borderColor: "var(--color-border)",
            }}
          >
            <LanguageSwitch />
            {shownLinks.map((link) => (
              <a
                key={link}
                href={href(link)}
                hrefLang={fil && (link === "lab" || link === "notes") ? "en" : undefined}
                aria-current={(link === "explore" && explorePage) || (link === "lab" && labPage) || (link === "notes" && notesPage) || (professionalPath && pageLinks[link] === professionalPath) ? "page" : undefined}
                onClick={() => {
                  setActive(link)
                  setMenuOpen(false)
                }}
                className="text-sm lowercase flex items-center min-h-11"
                style={{
                  fontFamily: "var(--font-mono)",
                  color:
                    active === link
                      ? "var(--color-accent)"
                      : "var(--color-text2)",
                }}
              >
                {fil ? labels[link] : link}
              </a>
            ))}

            {/* Mobile Menu Resume Link */}
            <a
              href={resumeUrl}
              download="James_Ian_Bayonas_Resume.pdf"
              className="text-sm px-4 py-2 border w-fit cursor-pointer"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--color-text1)",
                borderColor: "var(--color-border)",
              }}
            >
              {fil ? "Resume (EN)" : "Resume"}
            </a>
          </div>
        )}
    </header>
  )
}
