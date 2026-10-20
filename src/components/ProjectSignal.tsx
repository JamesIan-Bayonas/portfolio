import type { CSSProperties } from "react"
import { projectAccents } from "../data/projectAccents"
import "./ProjectSignal.css"

type ProjectId = keyof typeof projectAccents

// Decorative drawings describe the project's domain; the ordered text is the workflow.
function DomainDrawing({ projectId }: { projectId: string }) {
  if (projectId === "isdalog")
    return (
      <>
        <path d="M76 84c28-32 74-32 102 0-28 32-74 32-102 0ZM76 84 52 62v44l24-22Z" />
        <circle cx="153" cy="79" r="3" fill="currentColor" stroke="none" />
        <path d="m102 61 14-15 22 15M105 108l14 13 17-14M42 136c16-9 27 9 43 0s27 9 43 0 27 9 43 0 27 9 43 0" />
      </>
    )
  if (projectId === "dormfix")
    return (
      <>
        <path d="M90 39h69l16 17v96l-9-6-9 6-9-6-9 6-9-6-9 6-9-6-9 6-13-6V39Z" />
        <path d="M157 39v19h18M108 72h46M108 88h34M108 104h26m-24 22 8 8 17-20M49 70l16-14 16 14m-27-5v29h22" />
        <path d="m185 109 9 9 18-20" />
      </>
    )
  if (projectId === "centralog")
    return (
      <>
        <path d="m62 66 36-19 36 19-36 20-36-20Zm0 0v43l36 20 36-20V66M98 86v43M79 57l37 20M155 61v68h60" />
        <path d="m163 79 13 9 11 15h10l15 16" />
        <circle cx="176" cy="88" r="3" />
        <circle cx="197" cy="103" r="3" />
      </>
    )
  return (
    <>
      <path d="M61 57h22l10 51h84l13-39H86M103 123h66M113 43v37m-18-18h37" />
      <circle cx="107" cy="139" r="7" />
      <circle cx="164" cy="139" r="7" />
      <path d="m192 104 9 9 18-20M193 40h20v30h-20z" />
    </>
  )
}

export default function ProjectSignal({
  projectId,
  projectName,
  stages,
  compact = false,
}: {
  projectId: string
  projectName: string
  stages: readonly string[]
  compact?: boolean
}) {
  const colors = projectAccents[(projectId as ProjectId)]
  if (!colors) return null
  return (
    <figure
      className={`project-signal${compact ? " project-signal-compact" : ""}`}
      style={
        {
          "--signal-dark": colors.accent,
          "--signal-light": colors.lightAccent,
        } as CSSProperties
      }
      aria-label={`${projectName} workflow overview`}
    >
      {!compact && (
        <>
          <figcaption>
            <span>{projectName}</span>
            <span>INPUT → RESULT</span>
          </figcaption>
          <svg viewBox="0 0 260 180" fill="none" aria-hidden="true">
            <g className="signal-guides">
              <path d="M20 90h220M130 16v148" />
              <circle cx="130" cy="90" r="68" />
              <circle cx="130" cy="90" r="82" strokeDasharray="2 8" />
            </g>
            <g
              className="signal-domain"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <DomainDrawing projectId={projectId} />
            </g>
            <g className="signal-points" fill="currentColor">
              <circle cx="20" cy="90" r="3" />
              <circle cx="240" cy="90" r="3" />
              <circle cx="130" cy="16" r="3" />
              <circle cx="130" cy="164" r="3" />
            </g>
          </svg>
        </>
      )}
      <ol>
        {stages.map((stage, index) => (
          <li key={stage}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span>{stage}</span>
          </li>
        ))}
      </ol>
    </figure>
  )
}
