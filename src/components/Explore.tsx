import { useEffect, useState } from "react"
import { projects, projectScreenshot } from "../data/projects"
import ResponsiveScreenshot from "./ResponsiveScreenshot"
import ScreenshotPreview from "./ScreenshotPreview"
import ProjectComparison from "./ProjectComparison"
import {
  emptyExploreFilters,
  exploreFilterSearch,
  filterProjects,
  readExploreFilters,
  readComparison,
} from "../lib/explore"

const domains = [...new Set(projects.map((project) => project.category))]
const projectIds = projects.map(project => project.id)
const searchableProjects = projects.map((project) => ({
  ...project,
  searchText: [
    project.caseStudy.problem,
    project.caseStudy.approach,
    ...project.caseStudy.workflow.map((step) => step.detail),
  ].join(" "),
}))
const technologies = [
  ...new Set(projects.flatMap((project) => project.tech)),
].sort((a, b) => a.localeCompare(b))

export default function Explore() {
  const [filters, setFilters] = useState(() =>
    readExploreFilters(window.location.search, domains, technologies),
  )
  const results = filterProjects(searchableProjects, filters)
  const [comparison, setComparison] = useState(() => readComparison(window.location.search, projectIds))
  const filtered = Boolean(
    filters.query || filters.domain || filters.technology,
  )
  useEffect(() => {
    const search = exploreFilterSearch(filters, comparison.filter(Boolean))
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${search}${window.location.hash}`,
    )
  }, [filters, comparison])
  useEffect(() => {
    function restoreFilters() {
      setComparison(readComparison(window.location.search, projectIds))
      setFilters(
        readExploreFilters(window.location.search, domains, technologies),
      )
    }
    window.addEventListener("popstate", restoreFilters)
    return () => window.removeEventListener("popstate", restoreFilters)
  }, [])

  return (
    <div className="explore-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <a href="/" className="case-study-breadcrumb font-mono">
            ← Portfolio home
          </a>
          <p className="project-eyebrow font-mono">
            PROJECTS / WALKTHROUGHS / WORKING SYSTEMS
          </p>
          <h1>
            Find a system.
            <br />
            Explore how it works.
          </h1>
          <p>
            Four projects across fisheries, housing, institutional assets, and
            pharmacy operations. Browse the work, follow a sample workflow, or
            open the live system.
          </p>
        </header>
        <aside className="explore-ask-link">
          <p>Have a question about the work?</p>
          <a className="font-mono" href="/ask/">Ask about projects and engineering evidence ↗</a>
        </aside>
        <ProjectComparison selected={comparison} onChange={setComparison} />
        <section aria-labelledby="explore-projects-title">
          <div className="explore-section-heading">
            <h2 id="explore-projects-title">Explore the projects</h2>
            <p className="font-mono">
              {projects.length} projects · {projects.length} guided walkthroughs
            </p>
          </div>
          <form
            className="explore-filters"
            onSubmit={(event) => event.preventDefault()}
            role="search"
            aria-label="Filter projects"
          >
            <div>
              <label htmlFor="explore-query">
                Search projects and technologies
              </label>
              <input
                id="explore-query"
                type="search"
                placeholder="Try OCR, React, or inventory"
                value={filters.query}
                onChange={(event) =>
                  setFilters({ ...filters, query: event.target.value })
                }
              />
            </div>
            <div>
              <label htmlFor="explore-domain">Domain</label>
              <select
                id="explore-domain"
                value={filters.domain}
                onChange={(event) =>
                  setFilters({ ...filters, domain: event.target.value })
                }
              >
                <option value="">All domains</option>
                {domains.map((domain) => (
                  <option key={domain}>{domain}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="explore-technology">Technology</label>
              <select
                id="explore-technology"
                value={filters.technology}
                onChange={(event) =>
                  setFilters({ ...filters, technology: event.target.value })
                }
              >
                <option value="">All technologies</option>
                {technologies.map((tech) => (
                  <option key={tech}>{tech}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => setFilters({ ...emptyExploreFilters })}
              disabled={!filtered}
            >
              Clear filters
            </button>
          </form>
          <p
            className="explore-results-status"
            role="status"
            aria-live="polite"
          >
            {results.length} {results.length === 1 ? "project" : "projects"}{" "}
            found{filtered ? " with your filters" : ""}.
          </p>
          {results.length ? (
            <div className="explore-grid">
              {results.map((project) => (
                <article
                  key={project.id}
                  className="explore-card"
                  aria-labelledby={`explore-${project.id}`}
                >
                  <ScreenshotPreview
                    className="explore-image"
                    images={results.map(projectScreenshot)}
                    selectedId={project.id}
                    label={`Inspect ${project.name} screenshot`}
                  >
                    <ResponsiveScreenshot
                      asset={project.screenshot}
                      alt={project.imageAlt}
                      sizes="(min-width: 1520px) 704px, (min-width: 1024px) calc((100vw - 110px) / 2), (min-width: 768px) calc((100vw - 78px) / 2), (min-width: 640px) calc(100vw - 50px), calc(100vw - 34px)"
                    />
                  </ScreenshotPreview>
                  <div className="explore-card-body">
                    <p className="project-eyebrow font-mono">
                      {project.category}
                    </p>
                    <h3 id={`explore-${project.id}`}>{project.name}</h3>
                    <p className="explore-card-title">{project.title}</p>
                    <p className="project-version-label font-mono">{project.versionLabel}</p>
                    <dl className="project-credits">
                      <div>
                        <dt>My role</dt>
                        <dd>{project.role}</dd>
                      </div>
                      <div>
                        <dt>Context</dt>
                        <dd>{project.context}</dd>
                      </div>
                    </dl>
                    <ul
                      className="project-tech"
                      aria-label={`${project.name} technologies`}
                    >
                      {project.tech.map((tech) => (
                        <li key={tech} className="font-mono">
                          {tech}
                        </li>
                      ))}
                    </ul>
                    <div className="project-links font-mono">
                      <a href={project.caseStudyPath}>Read case study ↗</a>
                      <a href={`${project.caseStudyPath}#walkthrough`}>
                        Try walkthrough ↓
                      </a>
                      {project.demoAvailable !== false ? (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live system ↗
                        </a>
                      ) : (
                        <span className="demo-unavailable">
                          Live demo unavailable
                        </span>
                      )}
                      <a
                        href={project.source}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source code ↗
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="explore-empty">
              <h3>No projects match this combination.</h3>
              <p>
                Try another domain or technology, or clear the filters to see
                all four systems.
              </p>
              <button
                type="button"
                onClick={() => setFilters({ ...emptyExploreFilters })}
              >
                Show all projects
              </button>
            </div>
          )}
        </section>
        <section className="explore-lab" aria-labelledby="explore-lab-title">
          <div>
            <p className="project-eyebrow font-mono">TRY THE ENGINEERING</p>
            <h2 id="explore-lab-title">What does repair time change?</h2>
            <p>
              Adjust a sample asset's useful life and repair duration in the
              CentraLog valuation lab. Compare two depreciation strategies and
              inspect the values.
            </p>
          </div>
          <a className="asset-lab-link font-mono" href="/lab/#demo-centralog">
            Open the valuation lab ↗
          </a>
        </section>
        <footer className="dedicated-case-footer">
          <div>
            <p className="project-eyebrow font-mono">HAVE A SIMILAR PROBLEM?</p>
            <h2>Let's talk about the system you need.</h2>
          </div>
          <a href="/#contact" className="font-mono">
            Contact James ↗
          </a>
        </footer>
      </div>
    </div>
  )
}
