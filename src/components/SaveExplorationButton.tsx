import { useState } from "react"
import { explorationDestinations } from "../data/explorationDestinations"
import { currentLocale } from "../lib/locale"
import { useSavedExploration } from "../lib/useSavedExploration"
import {
  readSavedExploration,
  toggleSavedExploration,
  writeSavedExploration,
} from "../lib/savedExploration"
import "./SavedExploration.css"

export default function SaveExplorationButton({ id }: { id: string }) {
  const ids = useSavedExploration()
  const [failed, setFailed] = useState(false)
  const destination = explorationDestinations.find((item) => item.id === id)
  const saved = ids.includes(id)
  const fil = currentLocale() === "fil"
  if (!destination) return null
  function toggle() {
    const next = toggleSavedExploration(
      readSavedExploration(explorationDestinations),
      id,
      explorationDestinations,
    )
    setFailed(!writeSavedExploration(next, explorationDestinations))
  }
  return (
    <div className="save-exploration-control">
      <button
        type="button"
        className="save-exploration-button"
        aria-pressed={saved}
        onClick={toggle}
        aria-label={
          fil
            ? `${
                saved ? "Alisin sa naka-save" : "I-save para balikan"
              }: ${destination.title}`
            : saved
              ? `Remove ${destination.title} from saved`
              : `Save ${destination.title} for later`
        }
      >
        <svg
          width="14"
          height="18"
          viewBox="0 0 14 18"
          fill={saved ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M2 1h10v15l-5-3-5 3V1Z" />
        </svg>
        {saved
          ? fil
            ? "Naka-save"
            : "Saved for later"
          : fil
            ? "I-save para balikan"
            : "Save for later"}
      </button>
      {saved && (
        <a href="/#saved-exploration">
          {fil ? "Tingnan ang koleksyon (English)" : "View saved collection"} ↗
        </a>
      )}
      <span className="save-exploration-feedback" role="status">
        {failed
          ? fil
            ? "Hindi ma-save sa browser na ito. Magagamit pa rin ang mga link."
            : "This browser could not save the list. You can still use all page links."
          : ""}
      </span>
    </div>
  )
}
