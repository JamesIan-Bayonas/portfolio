import ExplorationNext from "./ExplorationNext"
import ExplorationNav from "./ExplorationNav"
import { useEffect, useState } from "react"
import { engineeringNotes, noteReadingMinutes } from "../data/notes"
import { projects } from "../data/projects"
import {
  emptyNotesFilters,
  filterNotes,
  notesFilterSearch,
  noteTopicId,
  readNotesFilters,
} from "../lib/notesArchive"
import type { NotesFilters } from "../lib/notesArchive"
import FollowNotes from "./FollowNotes"

const topics = [...new Set(engineeringNotes.map((note) => note.topic))].map(
  (label) => ({ id: noteTopicId(label), label }),
)
const archiveProjects = projects.filter((project) =>
  engineeringNotes.some((note) => note.projectId === project.id),
)
const topicIds = topics.map((topic) => topic.id)
const projectIds = archiveProjects.map((project) => project.id)
const searchableNotes = engineeringNotes.map((note) => ({
  ...note,
  projectName: projects.find((project) => project.id === note.projectId)?.name,
}))
const currentFilters = () =>
  readNotesFilters(window.location.search, topicIds, projectIds)

export default function NotesArchive() {
  const [filters, setFilters] = useState(currentFilters)
  const [shareMessage, setShareMessage] = useState("")
  const results = filterNotes(searchableNotes, filters)
  const filtered = Boolean(
    filters.query.trim() || filters.topic || filters.project,
  )

  useEffect(() => {
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${notesFilterSearch(currentFilters())}${window.location.hash}`,
    )
    function restoreFilters() {
      setFilters(currentFilters())
      setShareMessage("")
    }
    window.addEventListener("popstate", restoreFilters)
    return () => window.removeEventListener("popstate", restoreFilters)
  }, [])

  function updateFilters(next: NotesFilters, replace = false) {
    const url = `${window.location.pathname}${notesFilterSearch(next)}${window.location.hash}`
    if (
      url !==
      `${window.location.pathname}${window.location.search}${window.location.hash}`
    ) {
      if (replace) window.history.replaceState(window.history.state, "", url)
      else window.history.pushState(window.history.state, "", url)
    }
    setFilters(next)
    setShareMessage("")
  }

  async function copyFilteredLink() {
    const url = `${window.location.origin}${window.location.pathname}${notesFilterSearch(filters)}`
    try {
      await navigator.clipboard.writeText(url)
      setShareMessage("Archive link copied.")
    } catch {
      setShareMessage(`Archive link: ${url}`)
    }
  }

  return (
    <div className="explore-page notes-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <ExplorationNav active="notes" />
          <a className="case-study-breadcrumb font-mono" href="/explore/">
            ← Explore the projects
          </a>
          <p className="project-eyebrow font-mono">
            ENGINEERING NOTES / DECISIONS & TRADE-OFFS
          </p>
          <h1>
            Behind the feature.
            <br />
            Inside the decision.
          </h1>
          <p>
            Short explanations of the reasoning behind the systems I've built.
            Find a topic or project, then follow the decision into its case
            study and interactive example.
          </p>
        </header>
        <FollowNotes />
        <section className="notes-archive" aria-labelledby="notes-index-title">
          <div className="explore-section-heading">
            <h2 id="notes-index-title">The notes</h2>
            <p className="font-mono">
              {engineeringNotes.length}{" "}
              {engineeringNotes.length === 1 ? "note" : "notes"} in the archive
            </p>
          </div>
          <form
            className="explore-filters"
            role="search"
            aria-label="Filter engineering notes"
            onSubmit={(event) => event.preventDefault()}
          >
            <div>
              <label htmlFor="notes-query">Search notes and concepts</label>
              <input
                id="notes-query"
                type="search"
                placeholder="Try receipt, settlement, or valuation"
                value={filters.query}
                onChange={(event) =>
                  updateFilters({ ...filters, query: event.target.value }, true)
                }
              />
            </div>
            <div>
              <label htmlFor="notes-topic">Topic</label>
              <select
                id="notes-topic"
                value={filters.topic}
                onChange={(event) =>
                  updateFilters({ ...filters, topic: event.target.value })
                }
              >
                <option value="">All topics</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="notes-project">Project</label>
              <select
                id="notes-project"
                value={filters.project}
                onChange={(event) =>
                  updateFilters({ ...filters, project: event.target.value })
                }
              >
                <option value="">All projects</option>
                {archiveProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={!filtered}
              onClick={() => updateFilters({ ...emptyNotesFilters })}
            >
              Clear filters
            </button>
          </form>
          <div className="notes-archive-results">
            <p
              className="explore-results-status"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {results.length} of {engineeringNotes.length}{" "}
              {engineeringNotes.length === 1 ? "note" : "notes"} found
              {filtered ? " with your filters" : ""}.
            </p>
            <button
              className="notes-share-link font-mono"
              type="button"
              onClick={copyFilteredLink}
            >
              Copy filtered link
            </button>
          </div>
          <p
            className="notes-share-status font-mono"
            role="status"
            aria-live="polite"
          >
            {shareMessage}
          </p>
          {results.length ? (
            <div className="notes-list">
              {results.map((item) => (
                <article className="note-index-card" key={item.id}>
                  <p className="project-eyebrow font-mono">
                    {item.projectName} / {item.topic}
                  </p>
                  <h3>
                    <a href={item.path}>{item.title}</a>
                  </h3>
                  <p>{item.summary}</p>
                  <div className="note-index-meta font-mono">
                    <span>
                      James Ian Bayonas · {noteReadingMinutes(item)} min read
                    </span>
                    <a href={item.path}>Read the note ↗</a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="explore-empty">
              <h3>No notes match these filters.</h3>
              <p>
                Try a broader search or clear the filters to browse every
                engineering note.
              </p>
              <button
                type="button"
                onClick={() => updateFilters({ ...emptyNotesFilters })}
              >
                Show all notes
              </button>
            </div>
          )}
        </section>
        <ExplorationNext context="notes" />
      </div>
    </div>
  )
}
