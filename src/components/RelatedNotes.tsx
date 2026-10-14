import { engineeringNotes, noteReadingMinutes } from "../data/notes"
import type { EngineeringNote } from "../data/notes"
import { projects } from "../data/projects"
import { relatedNoteConnections } from "../data/relatedNotes"
import { relatedNotes } from "../lib/relatedNotes"

export default function RelatedNotes({ note }: { note: EngineeringNote }) {
  const recommendations = relatedNotes(
    note,
    engineeringNotes,
    relatedNoteConnections,
  )
  if (!recommendations.length) return null

  return (
    <section className="related-notes" aria-labelledby="related-notes-title">
      <div className="explore-section-heading">
        <div>
          <p className="project-eyebrow font-mono">READ NEXT</p>
          <h2 id="related-notes-title">Related Engineering Notes</h2>
        </div>
        <a className="related-notes-browse font-mono" href="/notes/">
          Browse all notes ↗
        </a>
      </div>
      <p className="related-notes-intro">
        Follow the engineering ideas across projects. Each recommendation
        explains its connection to this article.
      </p>
      <div className="related-notes-grid">
        {recommendations.map(({ note: related, reason }) => (
          <article
            className="related-note-card"
            key={related.id}
            aria-labelledby={`related-note-${related.id}`}
          >
            <p className="project-eyebrow font-mono">
              {
                projects.find((project) => project.id === related.projectId)
                  ?.name
              }{" "}
              / {related.topic}
            </p>
            <h3 id={`related-note-${related.id}`}>
              <a href={related.path}>{related.title}</a>
            </h3>
            <p className="related-note-summary">{related.summary}</p>
            <dl className="related-note-reason">
              <div>
                <dt>Why this connects</dt>
                <dd>{reason}</dd>
              </div>
            </dl>
            <div className="related-note-meta font-mono">
              <span>{noteReadingMinutes(related)} min read</span>
              <a href={related.path} aria-label={`Read next: ${related.title}`}>
                Read next <span aria-hidden="true">↗</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
