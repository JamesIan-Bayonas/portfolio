import AppearancePreferences from "./AppearancePreferences"
import MotionPreferences from "./MotionPreferences"
import { useEffect, useRef } from "react"
import { projects } from "../data/projects"
import {
  canonicalContentPath,
  currentLocale,
  localizeCoreHref,
} from "../lib/locale"
import LanguageSwitch from "./LanguageSwitch"
import "./PortfolioMenu.css"

interface PortfolioMenuProps {
  open: boolean
  onClose: () => void
  onOpenSearch: () => void
}

export default function PortfolioMenu({
  open,
  onClose,
  onOpenSearch,
}: PortfolioMenuProps) {
  const dialog = useRef<HTMLDialogElement>(null)
  const closeButton = useRef<HTMLButtonElement>(null)
  const fil = currentLocale() === "fil"
  const locale = fil ? "fil" : "en"
  const t = (en: string, translated: string) => (fil ? translated : en)
  const current = canonicalContentPath(window.location.pathname)
  const sections = [
    {
      href: "/explore/",
      title: t("The systems", "Mga sistema"),
      detail: t(
        "Case studies, workflows & source code",
        "Mga proyekto, workflow at source code",
      ),
    },
    {
      href: "/lab/",
      title: t("The experiments", "Mga eksperimento"),
      detail: t(
        "Try the engineering for yourself",
        "Subukan ang engineering (English)",
      ),
    },
    {
      href: "/notes/",
      title: t("The thinking", "Mga pananaw"),
      detail: t(
        "Notes on decisions & tradeoffs",
        "Mga tala tungkol sa mga desisyon (English)",
      ),
    },
    {
      href: "/about/",
      title: t("The developer", "Ang developer"),
      detail: t(
        "My background, journey & approach",
        "Aking pinagmulan, paglalakbay at pamamaraan",
      ),
    },
  ]

  useEffect(() => {
    const element = dialog.current
    if (!element) return
    if (open && !element.open) {
      element.showModal()
      closeButton.current?.focus()
    }
    else if (!open && element.open) element.close()
  }, [open])

  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  function close() {
    dialog.current?.close()
    onClose()
  }

  function search() {
    close()
    onOpenSearch()
  }

  return (
    <dialog
      ref={dialog}
      id="portfolio-navigation"
      className="portfolio-menu"
      aria-labelledby="portfolio-menu-title"
      onCancel={(event) => {
        event.preventDefault()
        close()
      }}
      onClose={onClose}
      onKeyDown={(event) => {
        if (
          (event.ctrlKey || event.metaKey) &&
          event.key.toLowerCase() === "k"
        ) {
          event.preventDefault()
          event.stopPropagation()
          search()
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        )
          close()
      }}
    >
      <div className="portfolio-menu-top">
        <a
          href={localizeCoreHref("/", locale)}
          onClick={close}
          className="portfolio-menu-brand"
        >
          <span aria-hidden="true">[JIB/]</span> James Ian Bayonas
        </a>
        <button
          type="button"
          className="portfolio-menu-close"
          ref={closeButton}
          onClick={close}
          autoFocus
          aria-label={t("Close navigation menu", "Isara ang menu")}
        >
          <span>{t("Close", "Isara")}</span>
          <span aria-hidden="true">×</span>
        </button>
      </div>
      <div className="portfolio-menu-body">
        <div className="portfolio-menu-main">
          <p className="portfolio-menu-kicker">
            {t("A SMALL UNIVERSE OF SYSTEMS & IDEAS", "MGA SISTEMA AT IDEYA")}
          </p>
          <h2 id="portfolio-menu-title">
            {t("Where to next?", "Saan ang susunod?")}
            <span aria-hidden="true">↗</span>
          </h2>
          <nav
            aria-label={t("Explore destinations", "Tuklasin ang mga pahina")}
            className="portfolio-menu-destinations"
          >
            {sections.map((section, index) => (
              <a
                key={section.href}
                href={localizeCoreHref(section.href, locale)}
                onClick={close}
                aria-current={
                  current === section.href ||
                  (section.href === "/notes/" && current.startsWith("/notes/"))
                    ? "page"
                    : undefined
                }
                hrefLang={
                  fil && ["/lab/", "/notes/"].includes(section.href)
                    ? "en"
                    : undefined
                }
              >
                <span className="portfolio-menu-number">0{index + 1}</span>
                <span>
                  <strong>{section.title}</strong>
                  <small>{section.detail}</small>
                </span>
                <span className="portfolio-menu-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </nav>
        </div>
        <aside className="portfolio-menu-aside">
          <p className="portfolio-menu-kicker">
            {t("START WITH A PROJECT", "MAGSIMULA SA ISANG PROYEKTO")}
          </p>
          <div className="portfolio-menu-projects">
            {projects.map((project, index) => (
              <a
                href={localizeCoreHref(
                  project.caseStudyPath ?? "/explore/",
                  locale,
                )}
                key={project.id}
                onClick={close}
                aria-current={
                  current === project.caseStudyPath ? "page" : undefined
                }
              >
                <span className="portfolio-menu-number">0{index + 1}</span>
                <span>
                  <strong>{project.name}</strong>
                  <small lang="en">{project.category}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <div className="portfolio-menu-personal">
            <a href="/tools/" onClick={close} hrefLang="en">{t("Developer tools / JSON & Regex", "Mga tool / JSON at Regex (English)")} ↗</a>
            <p className="portfolio-menu-kicker">
              {t("BEYOND THE BUILD", "HIGIT PA SA PAGBUO")}
            </p>
            <a href={localizeCoreHref("/now/", locale)} onClick={close}>
              {t("What I’m working on", "Kasalukuyan kong ginagawa")} ↗
            </a>
            <a href={localizeCoreHref("/reflections/", locale)} onClick={close}>
              {t("Reflections & lessons", "Mga pagninilay at aral")} ↗
            </a>
            <a
              href={localizeCoreHref("/work-with-me/", locale)}
              onClick={close}
            >
              {t("Have a workflow in mind?", "May nais ka bang workflow?")} ↗
            </a>
          </div>
          <button
            type="button"
            className="portfolio-menu-search"
            onClick={search}
          >
            <span>
              {t("Search the portfolio", "Maghanap sa portfolio (English)")}
            </span>
            <kbd>⌘ / Ctrl K</kbd>
          </button>
        </aside>
      </div>
      <AppearancePreferences />
      <MotionPreferences />
      <div className="portfolio-menu-bottom">
        <nav aria-label={t("Home sections", "Mga seksyon sa home")}>
          <a href={localizeCoreHref("/", locale)} onClick={close}>
            {t("Home", "Home")}
          </a>
          {!fil && (
            <>
              <a href="/#process" onClick={close}>
                Process
              </a>
              <a href="/#skills" onClick={close}>
                Skills
              </a>
              <a href="/#portfolio-terminal" onClick={close}>
                Terminal
              </a>
              <a href="/#continue-exploring" onClick={close}>
                Recent
              </a>
              <a href="/#saved-exploration" onClick={close}>
                Saved
              </a>
            </>
          )}
          <a
            href="/RESUME.pdf"
            download="James_Ian_Bayonas_Resume.pdf"
            onClick={close}
          >
            {t("Resume ↓", "Resume (English) ↓")}
          </a>
        </nav>
        <LanguageSwitch />
      </div>
    </dialog>
  )
}
