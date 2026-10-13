import { engineeringCapabilities, capabilityTarget } from "../data/capabilities"
import { projects } from "../data/projects"

export default function CapabilitiesMap() {
  return <div className="capabilities-grid">
    {engineeringCapabilities.map((capability, index) => <section key={capability.id} id={`capability-${capability.id}`} className="capability-card" aria-labelledby={`capability-title-${capability.id}`}>
      <p className="project-eyebrow font-mono">{String(index + 1).padStart(2, "0")} / CAPABILITY</p>
      <h3 id={`capability-title-${capability.id}`}>{capability.name}</h3>
      <p className="capability-description">{capability.description}</p>
      <ul className="capability-evidence">
        {capability.evidence.map(evidence => {
          const project = projects.find(project => project.id === evidence.projectId)!
          return <li key={`${evidence.projectId}-${evidence.section}`}>
            <div className="capability-project-heading"><h4>{project.name}</h4><span>{project.role} · {project.context}</span></div>
            <p>{evidence.summary}</p>
            <a className="font-mono" href={`${project.caseStudyPath}#${capabilityTarget(evidence)}`}>{evidence.linkLabel} <span aria-hidden="true">↗</span></a>
          </li>
        })}
      </ul>
    </section>)}
  </div>
}
