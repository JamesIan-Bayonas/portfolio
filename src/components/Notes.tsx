import { useEffect } from "react"
import { engineeringNotes, noteReadingMinutes } from "../data/notes"
import NotesArchive from "./NotesArchive"
import RelatedNotes from "./RelatedNotes"
import FollowNotes from "./FollowNotes"
import { projects } from "../data/projects"
import { normalizePagePath } from "../lib/caseStudyPages"

export default function Notes() {
  const note = engineeringNotes.find(
    (item) =>
      normalizePagePath(item.path) ===
      normalizePagePath(window.location.pathname),
  )
  const project = projects.find((item) => item.id === note?.projectId)
  useEffect(() => {
    if (!note || !window.location.hash) return
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
  }, [note])

  if (!note) return <NotesArchive />

  return (
    <article className="explore-page notes-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="note-header">
          <a className="case-study-breadcrumb font-mono" href="/notes/">
            ← All engineering notes
          </a>
          <p className="project-eyebrow font-mono">
            {project?.name} / {note.topic}
          </p>
          <h1>{note.title}</h1>
          <p className="note-summary">{note.summary}</p>
          <p className="note-byline font-mono">
            James Ian Bayonas · {noteReadingMinutes(note)} min read
          </p>
          <div className="project-links font-mono">
            <a href={project?.caseStudyPath}>
              Read the {project?.name} case study ↗
            </a>
            <a href={`/lab/#demo-${note.projectId}`}>{note.demoLabel} ↗</a>
          </div>
        </header>
        <div className="note-layout">
          <nav className="note-contents" aria-label="On this page">
            <p className="project-eyebrow font-mono">ON THIS PAGE</p>
            <ol>
              {note.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="note-body">
            <div
              className="note-flow"
              aria-label={`${project?.name} decision flow`}
            >
              <ol>
                {note.flow.map((step, index) => (
                  <li key={step}>
                    <span className="font-mono">0{index + 1}</span>
                    <strong>{step}</strong>
                  </li>
                ))}
              </ol>
              <p>{note.flowCaption}</p>
            </div>
            {note.sections.map((section) => (
              <section
                id={section.id}
                key={section.id}
                aria-labelledby={`note-${section.id}`}
              >
                <h2 id={`note-${section.id}`}>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </section>
            ))}
            <aside
              className="note-reference"
              aria-label="Project documentation"
            >
              <h2>Project context</h2>
              <p>{note.sourceContext}</p>
              <a
                className="font-mono"
                href={`${project?.source}#readme`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read the project documentation ↗
              </a>
            </aside>
          </div>
        </div>
        <RelatedNotes note={note} />
        <FollowNotes />
        <footer className="dedicated-case-footer">
          <div>
            <p className="project-eyebrow font-mono">CONTINUE EXPLORING</p>
            <h2>Follow the complete {project?.name} story.</h2>
          </div>
          <a className="font-mono" href={project?.caseStudyPath}>
            Open the case study ↗
          </a>
        </footer>
      </div>
    </article>
  )
}
