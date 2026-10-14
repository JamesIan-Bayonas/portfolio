import { projects } from "../data/projects"
import { filipinoProjectCopy } from "../data/filipino"
import ContactAction from "./ContactAction"

export default function FilipinoOverview() {
  return (
    <div className="explore-page filipino-overview px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <p className="project-eyebrow font-mono">PORTFOLIO / MGA PROYEKTO</p>
          <h1>
            Kilalanin ang mga system
            <br />
            na binubuo ko.
          </h1>
          <p>
            Ako si James Ian Bayonas. Gumagawa ako ng mga full-stack na system
            para sa pangisdaan, pabahay, pamamahala ng kagamitan, at operasyon
            ng botika.
          </p>
          <div className="professional-project-links font-mono">
            <a href="#projects">Tuklasin ang mga proyekto ↓</a>
            <a href="/fil/about/">Kilalanin ako ↗</a>
            <a href="/fil/reflections/">Mga pagninilay ↗</a>
            <a href="/fil/work-with-me/">Pag-usapan ang iyong proyekto ↗</a>
          </div>
        </header>
        <section aria-labelledby="filipino-projects-title" id="projects">
          <div className="explore-section-heading">
            <h2 id="filipino-projects-title">
              Apat na proyekto, magkakaibang workflow.
            </h2>
          </div>
          <div className="filipino-project-grid">
            {projects.map((project) => (
              <article
                className="professional-card"
                key={project.id}
                id={`project-${project.id}`}
              >
                <p className="project-eyebrow font-mono">
                  {project.context === "Collaborative capstone"
                    ? "PANGKATANG CAPSTONE"
                    : project.context === "School project"
                      ? "PROYEKTO SA PAARALAN"
                      : "SARILING PROYEKTO"}
                </p>
                <h3>{project.name}</h3>
                <p>{filipinoProjectCopy[project.id].summary}</p>
                <p className="font-mono">
                  Tungkulin:{" "}
                  {project.role === "Sole developer"
                    ? "Nag-iisang developer"
                    : "Developer ng mga feature"}
                </p>
                <p className="filipino-project-version">
                  {filipinoProjectCopy[project.id].version}
                </p>
                <div className="professional-project-links font-mono">
                  <a href={project.caseStudyPath} lang="en">
                    Case study (English) ↗
                  </a>
                  <a href={`${project.caseStudyPath}#walkthrough`} lang="en">
                    Walkthrough (English) ↗
                  </a>
                </div>
                <ContactAction
                  projectId={project.id}
                  label="Pag-usapan ang katulad na system"
                />
              </article>
            ))}
          </div>
        </section>
        <section
          className="filipino-resource-panel"
          id="english-resources"
          aria-labelledby="filipino-resources-title"
        >
          <h2 id="filipino-resources-title">Suriin ang mga detalye.</h2>
          <p>
            Nasa English ang mga detalyadong case study, tala sa engineering,
            sample demo, at mga source reference. May Filipino na bersiyon ang
            pangkalahatang-ideya at mga pahinang Tungkol, Kasalukuyang Gawain,
            at Paano Ako Makakatulong.
          </p>
          <div className="professional-project-links font-mono">
            <a href="/explore/" lang="en">
              Project explorer (English) ↗
            </a>
            <a href="/notes/" lang="en">
              Engineering Notes (English) ↗
            </a>
            <a href="/lab/" lang="en">
              Engineering Lab (English) ↗
            </a>
            <a href="/ask/" lang="en">
              Portfolio questions (English) ↗
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}
