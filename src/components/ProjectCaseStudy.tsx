import type { Project } from "../data/projects"
import ContactAction from "./ContactAction"
import { sourceReferences, sourceReferenceUrl } from "../data/sourceReferences"
import { testEvidence } from "../data/testEvidence"
import { projectEvolution } from "../data/projectEvolution"
import { milestoneDate } from "../lib/projectEvolution"
import { caseStudyText } from "../lib/caseStudyCopy"
import ApplicationTestResults from "./ApplicationTestResults"

interface CaseStudyContentProps {
  project: Project
  headingLevel?: 2 | 4
  locale?: "en" | "fil"
  sources?: typeof sourceReferences[string]
  evidence?: typeof testEvidence[string]
  milestones?: typeof projectEvolution[string]
}

export function CaseStudyContent({
  project,
  headingLevel = 4,
  locale = "en",
  sources = sourceReferences[project.id] ?? [],
  evidence = testEvidence[project.id] ?? [],
  milestones = projectEvolution[project.id] ?? [],
}: CaseStudyContentProps) {
  const study = project.caseStudy
  const Heading = headingLevel === 2 ? "h2" : "h4"
  const StepHeading = headingLevel === 2 ? "h3" : "h5"
  const t = (text: string) => caseStudyText(locale, text)

  return (
    <div className="case-study-body">
      <div className="case-study-intro">
        <section aria-labelledby={`${project.id}-problem`}>
          <p className="project-eyebrow font-mono">{t("01 / THE PROBLEM")}</p>
          <Heading id={`${project.id}-problem`}>
            {t("Who this is built for")}
          </Heading>
          <p>{study.problem}</p>
          <p className="case-study-audience font-mono">{study.audience}</p>
        </section>
        <section aria-labelledby={`${project.id}-contribution`}>
          <p className="project-eyebrow font-mono">
            {t("02 / MY CONTRIBUTION")}
          </p>
          <Heading id={`${project.id}-contribution`}>{project.role}</Heading>
          <p>{study.contribution}</p>
        </section>
      </div>
      <section
        className="case-study-architecture"
        aria-labelledby={`${project.id}-architecture`}
      >
        <p className="project-eyebrow font-mono">
          {t("03 / SYSTEM STRUCTURE")}
        </p>
        <Heading id={`${project.id}-architecture`}>
          {t("How the pieces connect")}
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
          <p className="project-eyebrow font-mono">{t("04 / THE WORKFLOW")}</p>
          <Heading id={`${project.id}-workflow`}>
            {t("Follow the system")}
          </Heading>
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
          <p className="project-eyebrow font-mono">
            {t("05 / ENGINEERING DECISION")}
          </p>
          <Heading id={`${project.id}-decision`}>
            {t("The reasoning behind the design")}
          </Heading>
          <dl>
            <div>
              <dt>{t("Challenge")}</dt>
              <dd>{study.challenge}</dd>
            </div>
            <div>
              <dt>{t("Approach")}</dt>
              <dd>{study.approach}</dd>
            </div>
            <div>
              <dt>{t("Trade-off")}</dt>
              <dd>{study.tradeoff}</dd>
            </div>
          </dl>
        </section>
      </div>
      <section
        className="case-study-sources"
        id={`${project.id}-source-code`}
        aria-labelledby={`${project.id}-source-code-title`}
      >
        <p className="project-eyebrow font-mono">{t("06 / SOURCE CODE")}</p>
        <Heading id={`${project.id}-source-code-title`}>
          {t("Explore the implementation")}
        </Heading>
        <p>
          {t(
            "Follow the engineering decisions into the code. Each link opens the reviewed version at a fixed commit.",
          )}
        </p>
        <ul className="source-reference-list">
          {sources.map((reference) => (
            <li key={reference.id}>
              <StepHeading>{reference.title}</StepHeading>
              <p>{reference.description}</p>
              {reference.context && (
                <p className="source-reference-context">{reference.context}</p>
              )}
              <div className="source-reference-location font-mono">
                <span>{reference.path}</span>
                <span>
                  {reference.symbol} · {locale === "fil" ? "linya" : "lines"}{" "}
                  {reference.startLine}–{reference.endLine} · commit{" "}
                  {reference.commit.slice(0, 7)}
                </span>
              </div>
              <a
                className="source-reference-link font-mono"
                href={sourceReferenceUrl(project.source, reference)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("View implementation")}: ${reference.title} (${
                  locale === "fil" ? "bagong tab" : "opens in a new tab"
                })`}
              >
                {t("View implementation")} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
      <section
        className="case-study-sources case-study-test-evidence"
        id={`${project.id}-test-evidence`}
        aria-labelledby={`${project.id}-test-evidence-title`}
      >
        <p className="project-eyebrow font-mono">{t("07 / TEST EVIDENCE")}</p>
        <Heading id={`${project.id}-test-evidence-title`}>
          {t("What the tests check")}
        </Heading>
        <p>
          {t(
            "Explore the scenarios, expected outcomes, and scope of the tests. Each link opens reviewed test code at a fixed commit.",
          )}
        </p>
        <ul className="source-reference-list test-evidence-list">
          {evidence.map((evidence) => (
            <li key={evidence.id}>
              <span className="test-evidence-scope font-mono">
                {t(evidence.scope)}
              </span>
              <StepHeading>{evidence.title}</StepHeading>
              <dl>
                <div>
                  <dt>{t("Scenario")}</dt>
                  <dd>{evidence.scenario}</dd>
                </div>
                <div>
                  <dt>{t("Expected outcome")}</dt>
                  <dd>{evidence.expectedOutcome}</dd>
                </div>
                <div>
                  <dt>{t("Test scope")}</dt>
                  <dd>{evidence.scopeDetail}</dd>
                </div>
              </dl>
              <div className="source-reference-location font-mono">
                <span>{evidence.path}</span>
                <span>
                  {locale === "fil" ? "linya" : "lines"} {evidence.startLine}–
                  {evidence.endLine} · commit {evidence.commit.slice(0, 7)}
                </span>
              </div>
              <a
                className="source-reference-link font-mono"
                href={sourceReferenceUrl(evidence.repository, evidence)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t("View test")}: ${evidence.title} (${
                  locale === "fil" ? "bagong tab" : "opens in a new tab"
                })`}
              >
                {t("View test")} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="test-evidence-review-note">
          {t(
            "Simulation tests cover this portfolio's sample logic. Execution results below apply only to the named suite and commit.",
          )}
        </p>
        <ApplicationTestResults
          headingLevel={headingLevel === 2 ? 3 : 5}
          projectId={project.id}
          repository={project.source}
          locale={locale}
        />
      </section>
      <section
        className="case-study-sources"
        id={`${project.id}-evolution`}
        aria-labelledby={`${project.id}-evolution-title`}
      >
        <p className="project-eyebrow font-mono">
          {t("08 / PROJECT EVOLUTION")}
        </p>
        <Heading id={`${project.id}-evolution-title`}>
          {t("How the system evolved")}
        </Heading>
        <p>
          {t(
            "Selected changes from the repository's history, with the design context and outcome of each revision. Dates use commit timestamps in Singapore time.",
          )}
        </p>
        <ol className="project-evolution-list">
          {milestones.map((milestone) => (
            <li key={milestone.id}>
              <div className="project-evolution-date font-mono">
                <time dateTime={milestone.committedAt}>
                  {milestoneDate(milestone.committedAt, locale)}
                </time>
                <span>commit {milestone.commit.slice(0, 7)}</span>
              </div>
              <div className="project-evolution-detail">
                <StepHeading>{milestone.title}</StepHeading>
                <dl>
                  <div>
                    <dt>{t("What changed")}</dt>
                    <dd>{milestone.change}</dd>
                  </div>
                  <div>
                    <dt>{t("Design context")}</dt>
                    <dd>{milestone.reason}</dd>
                  </div>
                  <div>
                    <dt>{t("Outcome & trade-off")}</dt>
                    <dd>{milestone.outcome}</dd>
                  </div>
                </dl>
                <a
                  className="source-reference-link font-mono"
                  href={`${project.source}/commit/${milestone.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${t("View commit")}: ${milestone.title} (${
                    locale === "fil" ? "bagong tab" : "opens in a new tab"
                  })`}
                >
                  {t("View commit")} <span aria-hidden="true">↗</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
        <p className="test-evidence-review-note">
          {t(
            "These are selected implementation milestones. Commit dates do not establish release dates or production performance.",
          )}
        </p>
      </section>
      <ContactAction
        projectId={project.id}
        label={
          locale === "fil"
            ? "Pag-usapan ang katulad na system"
            : "Discuss a similar system"
        }
      />
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
