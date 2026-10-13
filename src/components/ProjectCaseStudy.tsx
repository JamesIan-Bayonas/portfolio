import type { Project } from "../data/projects"
import ContactAction from "./ContactAction"

interface CaseStudyContentProps {
  project: Project
  headingLevel?: 2 | 4
}

export function CaseStudyContent({
  project,
  headingLevel = 4,
}: CaseStudyContentProps) {
  const study = project.caseStudy
  const Heading = headingLevel === 2 ? "h2" : "h4"
  const StepHeading = headingLevel === 2 ? "h3" : "h5"

  return (
    <div className="case-study-body">
      <div className="case-study-intro">
        <section aria-labelledby={`${project.id}-problem`}>
          <p className="project-eyebrow font-mono">01 / THE PROBLEM</p>
          <Heading id={`${project.id}-problem`}>Who this is built for</Heading>
          <p>{study.problem}</p>
          <p className="case-study-audience font-mono">{study.audience}</p>
        </section>
        <section aria-labelledby={`${project.id}-contribution`}>
          <p className="project-eyebrow font-mono">02 / MY CONTRIBUTION</p>
          <Heading id={`${project.id}-contribution`}>{project.role}</Heading>
          <p>{study.contribution}</p>
        </section>
      </div>
      <section
        className="case-study-architecture"
        aria-labelledby={`${project.id}-architecture`}
      >
        <p className="project-eyebrow font-mono">03 / SYSTEM STRUCTURE</p>
        <Heading id={`${project.id}-architecture`}>
          How the pieces connect
        </Heading>
        <ol className="architecture-flow">
          {study.architecture.map((node, index) => (
            <li key={node.name}>
              <span className="architecture-number font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{node.name}</strong>
              <span>{node.detail}</span>
            </li>
          ))}
        </ol>
      </section>
      <div className="case-study-detail-grid">
        <section aria-labelledby={`${project.id}-workflow`}>
          <p className="project-eyebrow font-mono">04 / THE WORKFLOW</p>
          <Heading id={`${project.id}-workflow`}>Follow the system</Heading>
          <ol className="case-study-workflow">
            {study.workflow.map((step, index) => (
              <li key={step.title}>
                <span className="workflow-number font-mono" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <StepHeading>{step.title}</StepHeading>
                  <p>{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
        <section
          className="case-study-decision"
          aria-labelledby={`${project.id}-decision`}
        >
          <p className="project-eyebrow font-mono">05 / ENGINEERING DECISION</p>
          <Heading id={`${project.id}-decision`}>
            The reasoning behind the design
          </Heading>
          <dl>
            <div>
              <dt>Challenge</dt>
              <dd>{study.challenge}</dd>
            </div>
            <div>
              <dt>Approach</dt>
              <dd>{study.approach}</dd>
            </div>
            <div>
              <dt>Trade-off</dt>
              <dd>{study.tradeoff}</dd>
            </div>
          </dl>
        </section>
      </div>
      <ContactAction projectId={project.id} />
    </div>
  )
}

export default function ProjectCaseStudy({ project }: { project: Project }) {
  return (
    <details className="project-case-study">
      <summary>
        <span>
          <span className="case-study-marker font-mono" aria-hidden="true">
            +
          </span>
          Read the case study{" "}
          <span className="case-study-project">/ {project.name}</span>
        </span>
        <span className="case-study-hint font-mono">
          Problem · contribution · decisions
        </span>
      </summary>
      <CaseStudyContent project={project} />
    </details>
  )
}
