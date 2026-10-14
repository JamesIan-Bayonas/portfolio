import { lazy, Suspense, useEffect, useState } from "react"

import { projectScreenshot, type Project } from "../data/projects"

import { CaseStudyContent } from "./ProjectCaseStudy"

import LoadingState from "./LoadingState"

import { engineeringNotes } from "../data/notes"

import ResponsiveScreenshot from "./ResponsiveScreenshot"

import ScreenshotPreview from "./ScreenshotPreview"

import { isdalogScreenshotGallery } from "../data/isdalogWalkthrough"

import ContactAction from "./ContactAction"

import CaseStudyNavigation from "./CaseStudyNavigation"

import RelatedProjects from "./RelatedProjects"

import ProjectBriefDownload from "./ProjectBriefDownload"

const IsdaLogWalkthrough = lazy(() => import("./IsdaLogWalkthrough"))

const DormFixWalkthrough = lazy(() => import("./DormFixWalkthrough"))

const CentraLogWalkthrough = lazy(() => import("./CentraLogWalkthrough"))

const EngineeringLab = lazy(() => import("./EngineeringLab"))

const PharmaLinkWalkthrough = lazy(() => import("./PharmaLinkWalkthrough"))

interface DedicatedCaseStudyProps {
  project: Project

  path: string

  locale?: "en" | "fil"

  sources?: React.ComponentProps<typeof CaseStudyContent>["sources"]

  evidence?: React.ComponentProps<typeof CaseStudyContent>["evidence"]

  milestones?: React.ComponentProps<typeof CaseStudyContent>["milestones"]
}

export default function DedicatedCaseStudy({
  project,

  path,

  locale = "en",

  sources,

  evidence,

  milestones,
}: DedicatedCaseStudyProps) {
  const t = (en: string, fil: string) => (locale === "fil" ? fil : en)

  const [shareMessage, setShareMessage] = useState("")

  useEffect(() => {
    if (!window.location.hash) return

    let id: string

    try {
      id = decodeURIComponent(window.location.hash.slice(1))
    } catch {
      return
    }

    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "auto" }),
    )

    return () => cancelAnimationFrame(frame)
  }, [])

  async function copyLink() {
    const url = `${window.location.origin}${path}`

    try {
      await navigator.clipboard.writeText(url)

      setShareMessage(t("Page link copied.", "Nakopya ang link ng pahina."))
    } catch {
      setShareMessage(`${t("Page address:", "Address ng pahina:")} ${url}`)
    }
  }

  return (
    <article
      id="case-study"
      className="dedicated-case-study px-4 sm:px-6 lg:px-10"
    >
      <div className="max-w-[1440px] mx-auto">
        <nav
          className="case-study-breadcrumb font-mono"
          aria-label={t("Breadcrumb", "Lokasyon ng pahina")}
        >
          <a href={locale === "fil" ? "/fil/#projects" : "/explore/"}>
            ← {t("Explore projects", "Tuklasin ang mga proyekto")}
          </a>
          <span aria-hidden="true">/</span>
          <span>{project.name}</span>
        </nav>
        <header className="dedicated-case-hero" id="overview">
          <div>
            <p className="project-eyebrow font-mono">
              {t("CASE STUDY", "PAG-AARAL NG PROYEKTO")} /{" "}
              {project.context.toUpperCase()}
            </p>
            <h1>{project.name}</h1>
            <p className="dedicated-case-subtitle">{project.title}</p>
            <p className="dedicated-case-description">{project.description}</p>
            <aside
              className="case-version-context"
              aria-label={t("Case-study version", "Bersiyon ng case study")}
            >
              <strong>{project.versionLabel}</strong>
              <p>{project.versionSummary}</p>
              <a className="font-mono" href={`#${project.id}-evolution`}>
                {t(
                  "Follow the project evolution",
                  "Sundan ang pag-unlad ng proyekto",
                )}{" "}
                ↓
              </a>
            </aside>
            <dl className="project-credits">
              <div>
                <dt>{t("My role", "Aking tungkulin")}</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>{t("Built for", "Para sa")}</dt>
                <dd>{project.caseStudy.audience}</dd>
              </div>
            </dl>
            <ContactAction
              projectId={project.id}
              label={t(
                "Discuss a similar system",
                "Pag-usapan ang katulad na system",
              )}
              className="case-hero-contact font-mono"
            />
            <div className="project-links font-mono">
              <a href="#engineering">
                {t("Read the case study", "Basahin ang case study")} ↓
              </a>
              <a href="#walkthrough">
                {t(
                  "Follow the walkthrough",
                  "Subukan ang walkthrough (English)",
                )}{" "}
                ↓
              </a>
              {project.id === "centralog" && (
                <a href="#lab">
                  {t("Explore valuation", "Subukan ang valuation (English)")} ↓
                </a>
              )}
              {project.demoAvailable !== false ? (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("Live system", "Live system (English)")} ↗
                </a>
              ) : (
                <span className="demo-unavailable">Live demo unavailable</span>
              )}
              <a
                href={project.source}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("Source code", "Source code (English)")} ↗
              </a>
            </div>
            <div className="case-share-actions">
              <button
                type="button"
                className="case-copy-link font-mono"
                onClick={copyLink}
              >
                {t("Copy page link", "Kopyahin ang link ng pahina")}
              </button>
              <ProjectBriefDownload projectId={project.id} locale={locale} />
            </div>
            <p className="case-share-status" role="status">
              {shareMessage}
            </p>
          </div>
          <figure className="dedicated-case-image">
            <ScreenshotPreview
              images={[
                projectScreenshot(project),
                ...(project.id === "isdalog" ? isdalogScreenshotGallery : []),
              ]}
              selectedId={project.id}
              label={`${t("Inspect", "Suriin ang screenshot ng")} ${project.name}${
                locale === "en" ? " screenshot" : ""
              }`}
            >
              <ResponsiveScreenshot
                asset={project.screenshot}
                alt={project.imageAlt}
                sizes="(min-width: 1520px) 663px, (min-width: 1024px) calc((100vw - 128px) / 2.1), (min-width: 640px) calc(100vw - 50px), calc(100vw - 34px)"
                loading="eager"
              />
            </ScreenshotPreview>
            <figcaption className="font-mono">
              {project.imageCaption}
            </figcaption>
          </figure>
        </header>
        <CaseStudyNavigation projectId={project.id} locale={locale} />
        {locale === "fil" && (
          <p className="project-note-link">
            Nasa English ang interactive walkthrough, orihinal na screenshot,
            source file, at PDF. Sample data lamang ang ginagamit ng mga demo;
            walang binabago sa aktuwal na mga tala.
          </p>
        )}
        <div lang="en">
          <Suspense
            fallback={
              <div id="walkthrough">
                <LoadingState label="Preparing the project walkthrough…" />
              </div>
            }
          >
            {project.id === "isdalog" && <IsdaLogWalkthrough />}
            {project.id === "dormfix" && <DormFixWalkthrough />}
            {project.id === "pharmalink" && <PharmaLinkWalkthrough />}
            {project.id === "centralog" && <CentraLogWalkthrough />}
          </Suspense>
          {project.id === "centralog" && (
            <Suspense
              fallback={
                <div id="lab">
                  <LoadingState label="Preparing the valuation lab…" />
                </div>
              }
            >
              <EngineeringLab embedded />
            </Suspense>
          )}
        </div>
        <div className="dedicated-engineering" id="engineering">
          <CaseStudyContent
            project={project}
            headingLevel={2}
            locale={locale}
            sources={sources}
            evidence={evidence}
            milestones={milestones}
          />
        </div>
        <div lang="en">
          {engineeringNotes
            .filter((note) => note.projectId === project.id)
            .map((note) => (
              <aside className="project-note-link" key={note.id}>
                <p className="project-eyebrow font-mono">
                  ENGINEERING NOTE{locale === "fil" ? " (English)" : ""}
                </p>
                <h2>
                  <a href={note.path}>{note.title} ↗</a>
                </h2>
                <p>{note.summary}</p>
              </aside>
            ))}
          <RelatedProjects project={project} />
        </div>
      </div>
    </article>
  )
}
