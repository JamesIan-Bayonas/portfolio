import { useEffect, useRef, useState } from "react"
import { portfolioSearchEntries } from "../data/searchEntries"
import {
  searchEntries,
  searchDestination,
  type SearchEntry,
} from "../lib/search"

interface PortfolioSearchProps {
  open: boolean
  onClose: () => void
}

export default function PortfolioSearch({
  open,
  onClose,
}: PortfolioSearchProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState(0)
  const results = searchEntries(portfolioSearchEntries, query)
  const activeIndex = Math.min(selected, Math.max(0, results.length - 1))

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setQuery("")
      setSelected(0)
      dialog.showModal()
      inputRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    if (open)
      document
        .getElementById(`search-result-${results[activeIndex]?.id}`)
        ?.scrollIntoView({ block: "nearest" })
  }, [open, activeIndex, query])

  function navigate(entry: SearchEntry) {
    dialogRef.current?.close()
    onClose()
    const destination = new URL(
      searchDestination(entry),
      window.location.origin,
    )
    if (
      destination.pathname.replace(/\/$/, "") !==
      window.location.pathname.replace(/\/$/, "") ||
      destination.search !== window.location.search
    ) {
      window.location.assign(destination.pathname + destination.search + destination.hash)
      return
    }
    const target = document.getElementById(entry.target === "case-study" ? "main-content" : entry.target)
    if (!target) return
    if (entry.expandCaseStudy) {
      const study = target.querySelector("details")
      if (study) study.open = true
    }
    if (entry.target === "case-study") window.history.replaceState(null, "", destination.pathname + destination.search)
    else window.location.hash = entry.target
    target.scrollIntoView({ behavior: "auto", block: "start" })
    target.setAttribute("tabindex", "-1")
    target.focus({ preventScroll: true })
  }

  return (
    <dialog
      ref={dialogRef}
      className="portfolio-search"
      aria-labelledby="search-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return
        if (!event.shiftKey && document.activeElement === inputRef.current) {
          event.preventDefault()
          closeButtonRef.current?.focus()
        } else if (
          event.shiftKey &&
          document.activeElement === closeButtonRef.current
        ) {
          event.preventDefault()
          inputRef.current?.focus()
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="search-heading">
        <div>
          <p className="project-eyebrow font-mono">EXPLORE THE PORTFOLIO</p>
          <h2 id="search-title">Find a project or jump to a section.</h2>
        </div>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close search"
        >
          ×
        </button>
      </div>
      <div className="search-input-wrap">
        <span aria-hidden="true">⌕</span>
        <input
          ref={inputRef}
          role="combobox"
          type="search"
          aria-label="Search projects, technologies, and sections"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="portfolio-search-results"
          aria-activedescendant={
            results.length
              ? `search-result-${results[activeIndex].id}`
              : undefined
          }
          placeholder="Try IsdaLog, MSSQL, or depreciation…"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setSelected(0)
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault()
              event.stopPropagation()
              onClose()
            } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
              event.preventDefault()
              setSelected((current) =>
                results.length
                  ? (current +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      results.length) %
                    results.length
                  : 0,
              )
            } else if (event.key === "Enter" && results[activeIndex]) {
              event.preventDefault()
              navigate(results[activeIndex])
            }
          }}
        />
      </div>
      <p className="search-count font-mono" role="status">
        {query
          ? `${results.length} result${results.length === 1 ? "" : "s"}`
          : "Projects & shortcuts"}
      </p>
      <div
        id="portfolio-search-results"
        role="listbox"
        tabIndex={-1}
        aria-label="Search results"
        className="search-results"
      >
        {results.map((entry, index) => (
          <button
            key={entry.id}
            id={`search-result-${entry.id}`}
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            tabIndex={-1}
            className={
              index === activeIndex
                ? "search-result search-result-active"
                : "search-result"
            }
            onClick={() => navigate(entry)}
          >
            <span>
              <span className="search-result-category font-mono">
                {entry.category}
              </span>
              <strong>{entry.label}</strong>
              <span className="search-result-description">
                {entry.description}
              </span>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      {results.length === 0 && (
        <p className="search-empty">
          No matches. Try a project name or a technology such as React or MySQL.
        </p>
      )}
      <div className="search-footer font-mono">
        <span>↑↓ Browse · Enter Open</span>
        <span>Esc Close</span>
      </div>
    </dialog>
  )
}
