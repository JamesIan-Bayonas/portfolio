import { useRef, useState } from "react"
import { explorationDestinations } from "../data/explorationDestinations"
import { useSavedExploration } from "../lib/useSavedExploration"
import {
  readSavedExploration,
  writeSavedExploration,
} from "../lib/savedExploration"
import "./SavedExploration.css"

export default function SavedExploration() {
  const ids = useSavedExploration()
  const [expanded, setExpanded] = useState(false)
  const [message, setMessage] = useState("")
  const heading = useRef<HTMLHeadingElement>(null)
  const destinations = ids
    .slice(0, expanded ? ids.length : 3)
    .flatMap((id) => explorationDestinations.filter((item) => item.id === id))
  const labels = {
    case: "CASE STUDY",
    lab: "EXPERIMENT",
    note: "ENGINEERING NOTE",
    tool: "DEVELOPER TOOL",
  }
  function remove(id?: string) {
    const next = id
      ? readSavedExploration(explorationDestinations).filter(
          (item) => item !== id,
        )
      : []
    if (writeSavedExploration(next, explorationDestinations)) {
      setMessage(
        id
          ? "Item removed from your saved collection."
          : "Saved collection cleared.",
      )
      heading.current?.focus({ preventScroll: true })
    } else
      setMessage(
        "This browser could not update the collection. Try again or open an item directly.",
      )
  }
  return (
    <section
      className="saved-exploration"
      id="saved-exploration"
      aria-labelledby="saved-exploration-title"
    >
      <div className="saved-exploration-heading">
        <div>
          <p className="saved-exploration-kicker">
            YOUR COLLECTION / SAVED FOR LATER
          </p>
          <h2 id="saved-exploration-title" ref={heading} tabIndex={-1}>
            {ids.length
              ? "Keep the ideas worth revisiting."
              : "Make a collection of your own."}
          </h2>
        </div>
        <div className="saved-exploration-actions">
          {ids.length > 3 && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
              aria-controls="saved-exploration-items"
            >
              {expanded ? "Show fewer" : `Show all ${ids.length}`}
            </button>
          )}
          {ids.length > 0 && (
            <button type="button" onClick={() => remove()}>
              Clear saved <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>
      {ids.length ? (
        <div className="saved-exploration-grid" id="saved-exploration-items">
          {destinations.map((item, index) => (
            <article key={item.id} className="saved-exploration-card">
              <p className="saved-exploration-kicker">
                0{index + 1} / {labels[item.kind]}
              </p>
              <h3>
                <a href={item.href}>
                  {item.title}
                  <span aria-hidden="true">↗</span>
                </a>
              </h3>
              <p>{item.description}</p>
              <div className="saved-exploration-card-actions">
                <a href={item.href}>Continue exploring →</a>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label={`Remove ${item.title} from saved`}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="saved-exploration-empty">
          <span aria-hidden="true">⌑</span>
          <p>
            Use <strong>Save for later</strong> on any case study, experiment,
            or engineering note. Your chosen items will be waiting here when you
            return.
          </p>
          <a href="/explore/">Find your first system ↗</a>
        </div>
      )}
      <p className="saved-exploration-note">
        {ids.length
          ? `${ids.length} saved ${ids.length === 1 ? "item" : "items"}. `
          : ""}
        Your collection is stored in this browser. Opening new pages won’t
        replace your saves.
      </p>
      <p className="saved-exploration-status" role="status" aria-atomic="true">
        {message}
      </p>
    </section>
  )
}
