import { projects } from "../data/projects"
import { engineeringNotes } from "../data/notes"
import ContactAction from "./ContactAction"
import type { WalkthroughCompletionProps } from "./WalkthroughCompletion"
import { useEffect, useRef } from "react"

const decisions = {
  dormfix: "Text extraction, structured parsing, and business checks support a landlord's decision. They do not establish receipt authenticity or prove that funds were received.",
  isdalog: "Delivery verification changes custody status. Buyer inspection authorizes settlement, so the handoff and the release of held funds are separate steps.",
  centralog: "Keep custody and repair history when the asset returns to active use. CentraLog's valuation strategies calculate from those records under its downtime-adjustment policy.",
  pharmalink: "Record the void as a separate adjustment alongside the original sale. Stock is restored once and the history remains traceable; this sample does not process a refund.",
}

export default function WalkthroughCompletionPanel({ projectId, outcome, onReplay }: WalkthroughCompletionProps) {
  const heading = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    heading.current?.focus({ preventScroll: true })
    heading.current?.scrollIntoView({ behavior: "instant" })
  }, [])
  const project = projects.find(project => project.id === projectId)!
  const note = engineeringNotes.find(note => note.projectId === projectId)
  return <section className="walkthrough-completion-summary" aria-labelledby={`${projectId}-completion-title`}>
    <p className="project-eyebrow font-mono" role="status">{project.name} sample walkthrough complete</p>
    <h3 ref={heading} tabIndex={-1} id={`${projectId}-completion-title`}>What the sample demonstrated</h3>
    <p className="completion-outcome">{outcome}</p>
    <div className="completion-decision">
      <h4>The engineering decision</h4>
      <p>{decisions[projectId]}</p>
    </div>
    <div className="completion-reading font-mono">
      <a href={`${project.caseStudyPath}#${projectId}-decision`}>Read the {project.name} design decision ↗</a>
      {note && <a href={note.path}>{note.title} ↗</a>}
      {projectId === "centralog" && <a href="/lab/#demo-centralog">Explore the valuation lab ↗</a>}
    </div>
    <div className="completion-actions">
      <ContactAction projectId={projectId} label={`Discuss a system like ${project.name}`} className="completion-contact font-mono" />
      <button type="button" className="completion-replay font-mono" onClick={() => {
        onReplay()
        requestAnimationFrame(() => {
          const heading = document.getElementById("walkthrough")?.querySelector("h2")
          if (!heading) return
          heading.tabIndex = -1
          heading.focus({ preventScroll: true })
          heading.scrollIntoView({ behavior: "instant" })
        })
      }}>Replay the walkthrough</button>
    </div>
  </section>
}
