import { useEffect, useId, useState } from "react"
import { fieldbookEntries } from "../data/fieldbook"
import {
  fieldbookKinds,
  fieldbookTopics,
  readFieldbookView,
  filterFieldbook,
  type FieldbookKind,
} from "../lib/fieldbook"
import { cardAccentStyles } from "../lib/projectCardAccents"
import ResponsiveScreenshot from "./ResponsiveScreenshot"
import "./PortfolioFieldbook.css"

const pageSize = 6
const topics = fieldbookTopics(fieldbookEntries)
const motifs = {
  Systems: "Built to connect.",
  Notes: "Behind the decisions.",
  Reflections: "A little perspective.",
  Lab: "Try. Observe. Understand.",
  Tools: "Make room for focus.",
}
const symbols = {
  Systems: "↗",
  Notes: "≡",
  Reflections: "✳",
  Lab: "⤳",
  Tools: "{ }",
}

export default function PortfolioFieldbook() {
  const inputId = useId()
  const [initial] = useState(() =>
    readFieldbookView(
      window.location.search,
      topics.map((topic) => topic.label),
    ),
  )
  const [kind, setKind] = useState<FieldbookKind>(initial.kind)
  const [query, setQuery] = useState(initial.query)
  const [topic, setTopic] = useState(initial.topic)
  const [sort, setSort] = useState(initial.sort)
  const [topicsOpen, setTopicsOpen] = useState(false)
  const [shareStatus, setShareStatus] = useState("")
  const [view, setView] = useState<"gallery" | "index">(initial.view)
  const [visible, setVisible] = useState(pageSize)
  const matches = filterFieldbook(fieldbookEntries, kind, query, topic)
  const results =
    sort === "title"
      ? [...matches].sort((a, b) => a.title.localeCompare(b.title))
      : matches
  const counts = Object.fromEntries(
    fieldbookKinds.map((category) => [
      category,
      filterFieldbook(fieldbookEntries, category, "").length,
    ]),
  )
  const filtered = kind !== "All" || Boolean(query) || Boolean(topic)

  function reset() {
    setTopic("")
    setKind("All")
    setQuery("")
    setVisible(pageSize)
  }

  useEffect(() => {
    const url = new URL(window.location.href)
    const values = {
      "fb-kind": kind === "All" ? "" : kind,
      "fb-q": query,
      "fb-topic": topic,
      "fb-view": view === "gallery" ? "" : view,
      "fb-sort": sort === "curated" ? "" : sort,
    }
    for (const [key, value] of Object.entries(values)) {
      if (value) url.searchParams.set(key, value)
      else url.searchParams.delete(key)
    }
    window.history.replaceState(window.history.state, "", url)
    setShareStatus("")
  }, [kind, query, topic, view, sort])

  useEffect(() => {
    function restore() {
      const next = readFieldbookView(
        window.location.search,
        topics.map((topic) => topic.label),
      )
      setKind(next.kind)
      setQuery(next.query)
      setTopic(next.topic)
      setView(next.view)
      setSort(next.sort)
      setVisible(pageSize)
    }
    window.addEventListener("popstate", restore)
    return () => window.removeEventListener("popstate", restore)
  }, [])

  async function shareCollection() {
    const url = new URL(window.location.href)
    url.hash = "fieldbook-results"
    try {
      await navigator.clipboard.writeText(url.href)
      setShareStatus("Collection link copied.")
    } catch {
      setShareStatus("Copy the address from your browser to share this view.")
    }
  }

  return (
    <div className="fieldbook">
      <header className="fieldbook-intro">
        <div>
          <p className="fieldbook-kicker">THE FIELDBOOK / JAMES IAN BAYONAS</p>
          <h2 id="directory-title">
            Made with purpose.
            <br />
            <em>Shared with context.</em>
          </h2>
          <p className="fieldbook-deck">
            The systems I build, the decisions behind them, and the things I
            learn along the way. Find your own thread through the work.
          </p>
          <a className="fieldbook-intro-link" href="#fieldbook-results">
            Open the collection <span aria-hidden="true">↓</span>
          </a>
        </div>
        <aside className="fieldbook-edition" aria-label="Collection overview">
          <div className="fieldbook-edition-top">
            <span>A WORKING COLLECTION</span>
            <span aria-hidden="true">↗</span>
          </div>
          <p>
            From the first idea
            <br />
            to the <em>working system.</em>
          </p>
          <div className="fieldbook-spines" aria-hidden="true">
            {["isdalog", "dormfix", "centralog", "pharmalink", "cpats"].map(
              (id, index) => (
                <span key={id} style={cardAccentStyles[id]}>
                  <i>{String(index + 1).padStart(2, "0")}</i>
                  <b>{id}</b>
                </span>
              ),
            )}
          </div>
          <dl>
            <div>
              <dt>Systems</dt>
              <dd>{counts.Systems.toString().padStart(2, "0")}</dd>
            </div>
            <div>
              <dt>Notes & reflections</dt>
              <dd>
                {(counts.Notes + counts.Reflections)
                  .toString()
                  .padStart(2, "0")}
              </dd>
            </div>
            <div>
              <dt>Ways to try it</dt>
              <dd>{(counts.Lab + counts.Tools).toString().padStart(2, "0")}</dd>
            </div>
          </dl>
        </aside>
      </header>

      <div id="fieldbook-results" className="fieldbook-collection">
        <div
          className="fieldbook-categories"
          role="group"
          aria-label="Collection category"
        >
          {fieldbookKinds.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={kind === category}
              onClick={() => {
                setKind(category)
                setVisible(pageSize)
              }}
            >
              {category === "All" ? "Everything" : category}
              <span>{counts[category].toString().padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="fieldbook-topics">
          <div className="fieldbook-topics-heading">
            <span>FOLLOW A THREAD</span>
            <button
              type="button"
              aria-expanded={topicsOpen}
              aria-controls="fieldbook-topic-list"
              onClick={() => setTopicsOpen((value) => !value)}
            >
              {topicsOpen ? "Fewer topics −" : "All topics +"}
            </button>
          </div>
          <div
            id="fieldbook-topic-list"
            className="fieldbook-topic-list"
            role="group"
            aria-label="Filter by topic"
          >
            {(topicsOpen ? topics : topics.slice(0, 8)).map((item) => (
              <button
                key={item.label}
                type="button"
                aria-pressed={topic === item.label}
                onClick={() => {
                  setTopic(topic === item.label ? "" : item.label)
                  setVisible(pageSize)
                }}
              >
                {item.label}
                <span>{item.count}</span>
              </button>
            ))}
          </div>
          {topic && (
            <button
              type="button"
              className="fieldbook-active-topic"
              onClick={() => {
                setTopic("")
                setVisible(pageSize)
              }}
            >
              Topic: {topic} ×
            </button>
          )}
        </div>
        <div className="fieldbook-toolbar">
          <div className="fieldbook-search">
            <label htmlFor={inputId}>
              <span aria-hidden="true">⌕</span>
              <span className="sr-only">Search the fieldbook</span>
            </label>
            <input
              id={inputId}
              type="search"
              value={query}
              placeholder="Find a project, idea, or technology…"
              onChange={(event) => {
                setQuery(event.target.value)
                setVisible(pageSize)
              }}
            />
          </div>
          <div
            className="fieldbook-views"
            role="group"
            aria-label="Collection layout"
          >
            <button
              type="button"
              aria-pressed={view === "gallery"}
              onClick={() => setView("gallery")}
            >
              Gallery
            </button>
            <button
              type="button"
              aria-pressed={view === "index"}
              onClick={() => setView("index")}
            >
              Index
            </button>
          </div>
        </div>
        <div className="fieldbook-collection-options">
          <label>
            Order{" "}
            <select
              aria-label="Collection order"
              value={sort}
              onChange={(event) => {
                setSort(event.target.value as typeof sort)
                setVisible(pageSize)
              }}
            >
              <option value="curated">Curated selection</option>
              <option value="title">Title A–Z</option>
            </select>
          </label>
          <button type="button" onClick={shareCollection}>
            Copy collection link ↗
          </button>
          <span role="status">{shareStatus}</span>
        </div>
        <div className="fieldbook-result-line">
          <p role="status" aria-live="polite" aria-atomic="true">
            {results.length} {results.length === 1 ? "entry" : "entries"}
            {topic ? ` / ${topic}${kind !== "All" ? ` · ${kind}` : ""}` : kind !== "All" ? ` / ${kind}` : query ? " / search results" : " / the complete collection"}
          </p>
          {filtered ? (
            <button type="button" onClick={reset}>
              Reset filters ×
            </button>
          ) : (
            <span>BUILT · WRITTEN · EXPLORED</span>
          )}
        </div>
        <div className={`fieldbook-entries fieldbook-${view}`}>
          {results.slice(0, visible).map((entry) => (
            <article
              key={entry.id}
              className={`fieldbook-entry fieldbook-kind-${entry.kind.toLowerCase()}`}
              style={
                entry.projectId ? cardAccentStyles[entry.projectId] : undefined
              }
            >
              <a href={entry.href}>
                <div className="fieldbook-entry-visual" aria-hidden="true">
                  {entry.image ? (
                    <ResponsiveScreenshot
                      asset={entry.image}
                      alt=""
                      sizes="(min-width: 1520px) 430px, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, calc(100vw - 48px)"
                    />
                  ) : (
                    <div className="fieldbook-paper">
                      <span>{entry.kind} / FIELDNOTE</span>
                      <strong>{symbols[entry.kind]}</strong>
                      <p>{motifs[entry.kind]}</p>
                      <i>{entry.tags[0]}</i>
                    </div>
                  )}
                </div>
                <div className="fieldbook-entry-copy">
                  <div className="fieldbook-entry-meta">
                    <span>{entry.kind}</span>
                    <span>{entry.detail}</span>
                  </div>
                  <h3>{entry.title}</h3>
                  <p className="fieldbook-entry-summary">{entry.summary}</p>
                  <div className="fieldbook-entry-tags" aria-hidden="true">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <span className="fieldbook-entry-action">
                    {entry.kind === "Systems"
                      ? "Explore the system"
                      : entry.kind === "Tools" || entry.kind === "Lab"
                        ? "Open the workbench"
                        : "Read the story"}
                    <span aria-hidden="true">↗</span>
                  </span>
                </div>
              </a>
              <div
                className="fieldbook-related-topics"
                role="group"
                aria-label={`Explore topics from ${entry.title}`}
              >
                {entry.tags.slice(0, 3).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={topic === tag}
                    onClick={() => {
                      setTopic(topic === tag ? "" : tag)
                      setVisible(pageSize)
                      document
                        .getElementById("fieldbook-results")
                        ?.scrollIntoView({ behavior: "auto" })
                    }}
                  >
                    {tag} <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
        {results.length === 0 && (
          <div className="fieldbook-empty">
            <p>No entries on this thread yet.</p>
            <span>
              Try a broader phrase such as “React”, “receipt”, or “procurement”.
            </span>
            <button type="button" onClick={reset}>
              Return to the collection ↗
            </button>
          </div>
        )}
        {visible < results.length && (
          <div className="fieldbook-more">
            <span>
              Showing {Math.min(visible, results.length)} of {results.length}
            </span>
            <button
              type="button"
              onClick={() => setVisible((count) => count + pageSize)}
            >
              More from the fieldbook <span aria-hidden="true">+</span>
            </button>
          </div>
        )}
      </div>
      <nav
        className="fieldbook-paths"
        aria-label="Explore the portfolio in depth"
      >
        <span>TAKE A CLOSER LOOK</span>
        <a href="/explore/">Project atlas ↗</a>
        <a href="/notes/">Engineering notes ↗</a>
        <a href="/reflections/">Personal reflections ↗</a>
        <a href="/about/">The person behind it ↗</a>
      </nav>
    </div>
  )
}
