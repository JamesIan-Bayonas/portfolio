import { useEffect, useRef, useState } from "react"
import { explorationDestinations } from "../data/explorationDestinations"
import {
  clearRecentExploration,
  readRecentExploration,
  RECENT_EXPLORATION_EVENT,
  RECENT_EXPLORATION_KEY,
} from "../lib/recentExploration"
import "./RecentExploration.css"

export default function RecentExploration() {
  const heading = useRef<HTMLHeadingElement>(null)
  const [ids, setIds] = useState(() =>
    readRecentExploration(explorationDestinations),
  )
  const [cleared, setCleared] = useState(false)
  const [expanded, setExpanded] = useState(false)
  useEffect(() => {
    function update() {
      setIds(readRecentExploration(explorationDestinations))
    }
    function storage(event: StorageEvent) {
      if (event.key === RECENT_EXPLORATION_KEY || event.key === null) update()
    }
    window.addEventListener(RECENT_EXPLORATION_EVENT, update)
    window.addEventListener("storage", storage)
    return () => {
      window.removeEventListener(RECENT_EXPLORATION_EVENT, update)
      window.removeEventListener("storage", storage)
    }
  }, [])
  const destinations = ids.length
    ? ids
        .slice(0, expanded ? 6 : 3)
        .flatMap((id) =>
          explorationDestinations.filter((item) => item.id === id),
        )
    : [
        "case:isdalog",
        "lab:centralog",
        explorationDestinations.find((item) => item.kind === "note")?.id,
      ].flatMap((id) =>
        explorationDestinations.filter((item) => item.id === id),
      )
  const kindLabel = {
    case: "CASE STUDY",
    lab: "EXPERIMENT",
    note: "ENGINEERING NOTE",
    tool: "DEVELOPER TOOL",
  }
  return (
    <section
      id="continue-exploring"
      className="recent-exploration"
      aria-labelledby="recent-exploration-title"
    >
      <div className="recent-exploration-heading">
        <div>
          <p className="recent-exploration-kicker">
            {ids.length
              ? "YOUR EXPLORATION / RECENTLY OPENED"
              : "CHOOSE YOUR FIRST CONNECTION"}
          </p>
          <h2 id="recent-exploration-title" ref={heading} tabIndex={-1}>
            {ids.length
              ? "Pick up where you left off."
              : "Three ways into the work."}
          </h2>
        </div>
        <div className="recent-exploration-controls">
          {ids.length > 3 && (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls="recent-exploration-items"
              onClick={() => setExpanded((value) => !value)}
            >
              {expanded ? "Show fewer" : `Show all ${ids.length}`}
            </button>
          )}
          {ids.length > 0 && (
            <button
              type="button"
              onClick={() => {
                clearRecentExploration()
                setCleared(true)
                setExpanded(false)
                heading.current?.focus({ preventScroll: true })
              }}
            >
              Clear recent <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>
      <div className="recent-exploration-grid" id="recent-exploration-items">
        {destinations.map((item, index) => (
          <a href={item.href} key={item.id} className="recent-exploration-card">
            <span className="recent-exploration-kicker">
              0{index + 1} / {kindLabel[item.kind]}
              <span aria-hidden="true">↗</span>
            </span>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span className="recent-exploration-action">
              {ids.length ? "Open again" : "Start exploring"}
              <span aria-hidden="true">→</span>
            </span>
          </a>
        ))}
      </div>
      <p className="recent-exploration-note">
        {ids.length
          ? "Up to six recently opened pages are remembered on this browser."
          : "Open a case study, experiment, or note and find it here when you return."}{" "}
        Saved on this device only. Clearing removes this list; visiting another
        page starts a new list.
      </p>
      <p role="status" className="sr-only">
        {cleared && ids.length === 0
          ? "Recent exploration cleared. Suggested starting points are now shown."
          : ""}
      </p>
    </section>
  )
}
