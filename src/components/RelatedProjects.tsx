import { projects, type Project } from "../data/projects"
import { engineeringCapabilities } from "../data/capabilities"
import { relatedProjects } from "../lib/relatedProjects"
import { emptyExploreFilters, exploreFilterSearch } from "../lib/explore"

export default function RelatedProjects({ project }: { project: Project }) {
  const recommendations = relatedProjects(project, projects, engineeringCapabilities)
  return <footer className="related-projects" aria-labelledby="related-projects-title">
    <div className="explore-section-heading">
      <div>
        <p className="project-eyebrow font-mono">CONTINUE EXPLORING</p>
        <h2 id="related-projects-title">Explore connected work.</h2>
      </div>
      <a className="related-explore-link font-mono" href="/explore/">Browse all projects ↗</a>
    </div>
    <p className="related-intro">Connections based on documented capabilities and shared backend technologies.</p>
    <div className="related-projects-grid">
      {recommendations.map(({ project: related, sharedCapabilities, sharedTechnologies }) => <article key={related.id} className="related-project-card" aria-labelledby={`related-${related.id}`}>
        <p className="project-eyebrow font-mono">{related.category}</p>
        <h3 id={`related-${related.id}`}>{related.name}</h3>
        <p className="related-project-title">{related.title}</p>
        <dl className="project-credits">
          <div><dt>My role</dt><dd>{related.role}</dd></div>
          <div><dt>Context</dt><dd>{related.context}</dd></div>
        </dl>
        <div className="related-reasons">
          {sharedCapabilities.length > 0 && <p><strong>Shared capabilities</strong><span>{sharedCapabilities.join(" · ")}</span></p>}
          {sharedTechnologies.length > 0 && <p><strong>Shared technologies</strong><span>{sharedTechnologies.join(" · ")}</span></p>}
        </div>
        <div className="project-links font-mono">
          <a href={related.caseStudyPath}>Read {related.name} case study ↗</a>
          <a href={`/explore/${exploreFilterSearch(emptyExploreFilters, [project.id, related.id])}`} aria-label={`Compare ${project.name} and ${related.name}`}>Compare these projects ↗</a>
        </div>
      </article>)}
    </div>
  </footer>
}
