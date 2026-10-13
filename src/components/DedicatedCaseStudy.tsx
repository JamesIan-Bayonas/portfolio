import { useEffect, useState } from "react"
import type { Project } from "../data/projects"
import { CaseStudyContent } from "./ProjectCaseStudy"
import IsdaLogWalkthrough from "./IsdaLogWalkthrough"
import DormFixWalkthrough from "./DormFixWalkthrough"
import CentraLogWalkthrough from "./CentraLogWalkthrough"
import EngineeringLab from "./EngineeringLab"
import PharmaLinkWalkthrough from "./PharmaLinkWalkthrough"
import { engineeringNotes } from "../data/notes"

interface DedicatedCaseStudyProps {
  project: Project
  path: string
}

export default function DedicatedCaseStudy({
  project,
  path,
}: DedicatedCaseStudyProps) {
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
      setShareMessage("Page link copied.")
    } catch {
      setShareMessage(`Page address: ${url}`)
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
          aria-label="Breadcrumb"
        >
          <a href="/explore/">← Explore projects</a>
          <span aria-hidden="true">/</span>
          <span>{project.name}</span>
        </nav>
        <header className="dedicated-case-hero">
          <div>
            <p className="project-eyebrow font-mono">
              CASE STUDY / {project.context.toUpperCase()}
            </p>
            <h1>{project.name}</h1>
            <p className="dedicated-case-subtitle">{project.title}</p>
            <p className="dedicated-case-description">{project.description}</p>
            <dl className="project-credits">
              <div>
                <dt>My contribution</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Built for</dt>
                <dd>{project.caseStudy.audience}</dd>
              </div>
            </dl>
            <div className="project-links font-mono">
              <a href="#walkthrough">Follow the walkthrough ↓</a>
              {project.id === "centralog" && <a href="#lab">Explore valuation ↓</a>}
              {project.demoAvailable !== false ? <a href={project.demo} target="_blank" rel="noopener noreferrer">
                Live system ↗
              </a> : <span className="demo-unavailable">Live demo unavailable</span>}
              <a
                href={project.source}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source code ↗
              </a>
            </div>
            <button
              type="button"
              className="case-copy-link font-mono"
              onClick={copyLink}
            >
              Copy page link ↗
            </button>
            <p className="case-share-status" role="status">
              {shareMessage}
            </p>
          </div>
          <figure className="dedicated-case-image">
            <img
              src={project.image}
              alt={project.imageAlt}
              width="1600"
              height="900"
            />
            <figcaption className="font-mono">
              Original {project.name} interface / {project.context.toLowerCase()}
            </figcaption>
          </figure>
        </header>
        {project.id === "isdalog" && <IsdaLogWalkthrough />}
        {project.id === "dormfix" && <DormFixWalkthrough />}
        {project.id === "pharmalink" && <PharmaLinkWalkthrough />}
        {project.id === "centralog" && <><CentraLogWalkthrough /><EngineeringLab embedded /></>}
        <div className="dedicated-engineering" id="engineering">
          <CaseStudyContent
            project={project}
            headingLevel={2}
            contactHref="/#contact"
          />
        </div>
        {engineeringNotes.filter(note => note.projectId === project.id).map(note => <aside className="project-note-link" key={note.id}><p className="project-eyebrow font-mono">ENGINEERING NOTE</p><h2><a href={note.path}>{note.title} ↗</a></h2><p>{note.summary}</p></aside>)}
        <footer className="dedicated-case-footer">
          <div>
            <p className="project-eyebrow font-mono">CONTINUE EXPLORING</p>
            <h2>See the other systems I've built.</h2>
          </div>
          <a href="/#projects" className="font-mono">
            Back to selected work ↗
          </a>
        </footer>
      </div>
    </article>
  )
}
