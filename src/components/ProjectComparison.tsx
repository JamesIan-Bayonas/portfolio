import { projects } from "../data/projects"
import ContactAction from "./ContactAction"

interface ProjectComparisonProps {
  selected: string[]
  onChange: (selected: string[]) => void
}

export default function ProjectComparison({ selected, onChange }: ProjectComparisonProps) {
  const comparison = selected.map(id => projects.find(project => project.id === id)!).filter(Boolean)
  return <section className="project-comparison" aria-labelledby="comparison-title">
    <div className="explore-section-heading">
      <div>
        <p className="project-eyebrow font-mono">LOOK CLOSER</p>
        <h2 id="comparison-title">Compare two projects</h2>
      </div>
      <button type="button" disabled={!selected.length} onClick={() => onChange([])}>Clear comparison</button>
    </div>
    <p>Choose two systems to compare my contribution and the decisions behind each build. Your selection stays available when you filter projects.</p>
    <div className="comparison-selectors">
      {[0, 1].map(index => <div key={index}>
        <label htmlFor={`comparison-${index}`}>Project {index + 1}</label>
        <select id={`comparison-${index}`} value={selected[index] ?? ""} onChange={event => {
          const next = [...selected]
          next[index] = event.target.value
          onChange(next)
        }}>
          <option value="">Choose a project</option>
          {projects.map(project => <option key={project.id} value={project.id} disabled={selected[1 - index] === project.id}>{project.name}</option>)}
        </select>
      </div>)}
    </div>
    <p className="comparison-status" role="status">
      {comparison.length === 2 ? `Comparing ${comparison[0].name} and ${comparison[1].name}. This page link includes your selection.` : "Choose two different projects to open the comparison."}
    </p>
    {comparison.length === 2 && <div className="comparison-grid">
      {comparison.map(project => <article key={project.id} className="comparison-card" aria-labelledby={`compare-${project.id}`}>
        <p className="project-eyebrow font-mono">{project.category}</p>
        <h3 id={`compare-${project.id}`}>{project.name}</h3>
        <dl>
          <div><dt>Problem solved</dt><dd>{project.caseStudy.problem}</dd></div>
          <div><dt>My role · {project.context}</dt><dd>{project.role}. {project.caseStudy.contribution}</dd></div>
          <div><dt>Case-study version</dt><dd>{project.versionLabel}. {project.versionSummary}</dd></div>
          <div><dt>Case-study technologies</dt><dd><ul className="project-tech" aria-label={`${project.name} comparison technologies`}>{project.tech.map(tech => <li key={tech} className="font-mono">{tech}</li>)}</ul></dd></div>
          <div><dt>Engineering approach</dt><dd>{project.caseStudy.approach}</dd></div>
          <div><dt>Trade-off</dt><dd>{project.caseStudy.tradeoff}</dd></div>
        </dl>
        <div className="project-links font-mono">
          <a href={project.caseStudyPath}>Read {project.name} case study ↗</a>
          <a href={`${project.caseStudyPath}#walkthrough`}>Try {project.name} walkthrough ↓</a>
        </div>
        <ContactAction projectId={project.id} label={`Discuss a system like ${project.name}`} />
      </article>)}
    </div>}
  </section>
}
