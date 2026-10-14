import { lazy, Suspense, useEffect, useState } from "react"

import Nav from "./components/Nav"

import ScrollProgress from "./components/ScrollProgress"
import LoadingState from "./components/LoadingState"

import caseStudyPages from "./data/caseStudyPages.json"

import { siteMetadata as sitePages } from "./data/siteMetadata"

import { projects } from "./data/projects"

import { findCaseStudyPage } from "./lib/caseStudyPages"
import { canonicalContentPath, currentLocale } from "./lib/locale"

const DedicatedCaseStudy = lazy(() => import("./components/DedicatedCaseStudy"))

const Explore = lazy(() => import("./components/Explore"))
const PortfolioQuestions = lazy(() => import("./components/PortfolioQuestions"))

const Lab = lazy(() => import("./components/Lab"))

const Notes = lazy(() => import("./components/Notes"))

const ProfessionalPages = lazy(() => import("./components/ProfessionalPages"))
const FilipinoOverview = lazy(() => import("./components/FilipinoOverview"))

const HomePage = lazy(() => import("./components/HomePage"))

const PortfolioSearch = lazy(() => import("./components/PortfolioSearch"))

// ─── App ───────────────────────────────────────────────────────────────────

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false)

  const [searchUsed, setSearchUsed] = useState(false)

  function openSearch() {
    setSearchUsed(true)
    setSearchOpen(true)
  }

  const caseStudyPage = findCaseStudyPage(
    [...caseStudyPages, ...sitePages],
    window.location.pathname,
  )

  const explorePage = caseStudyPage?.path === "/explore/"
  const questionsPage = caseStudyPage?.path === "/ask/"

  const labPage = caseStudyPage?.path === "/lab/"

  const notesPage = Boolean(caseStudyPage?.path.startsWith("/notes/"))

  const contentPath = canonicalContentPath(
    caseStudyPage?.path ?? window.location.pathname,
  )
  const filipinoOverview = caseStudyPage?.path === "/fil/"
  const professionalPath = ["/about/", "/now/", "/work-with-me/"].includes(
    contentPath,
  )
    ? contentPath as "/about/" | "/now/" | "/work-with-me/"
    : undefined

  const dedicatedProject = projects.find(
    (project) => project.id === caseStudyPage?.projectId,
  )

  useEffect(() => {
    if (!caseStudyPage) return

    document.title = caseStudyPage.title

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    )

    if (description) description.content = caseStudyPage.description
  }, [caseStudyPage])

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        if (
          document.querySelector(
            ".screenshot-viewer[open], .contact-panel[open]",
          )
        ) {
          event.preventDefault()
          return
        }

        event.preventDefault()

        setSearchUsed(true)

        if (!event.repeat) setSearchOpen((open) => !open)
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
      style={{
        backgroundColor: "var(--color-bg)",
        color: "var(--color-text1)",
      }}
    >
      <a className="skip-content" href="#main-content">
        {currentLocale() === "fil"
          ? "Lumaktaw sa nilalaman"
          : "Skip to content"}
      </a>
      <Nav
        portfolioPage={!caseStudyPage}
        explorePage={explorePage}
        labPage={labPage}
        notesPage={notesPage}
        professionalPath={professionalPath}
        onOpenSearch={openSearch}
      />
      <ScrollProgress />
      <main
        id="main-content"
        tabIndex={-1}
        className="relative z-10 max-w-none"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {filipinoOverview ? (
          <Suspense
            fallback={
              <LoadingState label="Binubuksan ang portfolio…" variant="page" />
            }
          >
            <FilipinoOverview />
          </Suspense>
        ) : questionsPage ? (
          <Suspense
            fallback={
              <LoadingState
                label="Opening portfolio questions…"
                variant="page"
              />
            }
          >
            <PortfolioQuestions />
          </Suspense>
        ) : professionalPath ? (
          <Suspense
            fallback={
              <LoadingState
                label={
                  currentLocale() === "fil"
                    ? "Binubuksan ang profile…"
                    : "Opening the profile…"
                }
                variant="page"
              />
            }
          >
            <ProfessionalPages path={professionalPath} />
          </Suspense>
        ) : notesPage ? (
          <Suspense
            fallback={
              <LoadingState
                label="Opening the engineering notes…"
                variant="page"
              />
            }
          >
            <Notes />
          </Suspense>
        ) : labPage ? (
          <Suspense
            fallback={
              <LoadingState
                label="Opening the engineering lab…"
                variant="page"
              />
            }
          >
            <Lab />
          </Suspense>
        ) : explorePage ? (
          <Suspense
            fallback={
              <LoadingState
                label="Opening the project explorer…"
                variant="page"
              />
            }
          >
            <Explore />
          </Suspense>
        ) : dedicatedProject && caseStudyPage ? (
          <Suspense
            fallback={
              <LoadingState label="Opening the case study…" variant="page" />
            }
          >
            <DedicatedCaseStudy
              project={dedicatedProject}
              path={caseStudyPage.path}
            />
          </Suspense>
        ) : (
          <>
            <Suspense
              fallback={
                <LoadingState label="Opening the portfolio…" variant="page" />
              }
            >
              <HomePage />
            </Suspense>
          </>
        )}
      </main>
      {searchUsed && (
        <Suspense fallback={null}>
          <PortfolioSearch
            open={searchOpen}
            onClose={() => setSearchOpen(false)}
          />
        </Suspense>
      )}
    </div>
  )
}
