import ExplorationNext from "./ExplorationNext"
import ExplorationNav from "./ExplorationNav"
import { lazy, Suspense, useEffect, useState } from "react"
import { labDemos, labDemoFromHash, type LabDemoId } from "../data/labDemos"
import { projects } from "../data/projects"
import { engineeringNotes } from "../data/notes"
import LoadingState from "./LoadingState"
import SaveExplorationButton from "./SaveExplorationButton"
import { cardAccentStyles } from "../lib/projectCardAccents"
import ProjectSignal from "./ProjectSignal"
import { labVisualStages } from "../data/projectStories"

const AssetValuationDemo = lazy(() => import("./AssetValuationDemo"))
const DormFixWalkthrough = lazy(() => import("./DormFixWalkthrough"))
const IsdaLogWalkthrough = lazy(() => import("./IsdaLogWalkthrough"))
const PharmaLinkWalkthrough = lazy(() => import("./PharmaLinkWalkthrough"))

export default function Lab() {
  const [selected, setSelected] = useState<LabDemoId>(() =>
    labDemoFromHash(window.location.hash),
  )
  const [revision, setRevision] = useState(0)
  const demo = labDemos.find((item) => item.id === selected)!
  const project = projects.find((item) => item.id === selected)!
  useEffect(() => {
    function restore() {
      setSelected(labDemoFromHash(window.location.hash))
    }
    window.addEventListener("hashchange", restore)
    const frame = requestAnimationFrame(() => {
      if (window.location.hash.startsWith("#demo-"))
        document
          .getElementById(window.location.hash.slice(1))
          ?.scrollIntoView({ behavior: "auto", block: "start" })
    })
    return () => {
      window.removeEventListener("hashchange", restore)
      cancelAnimationFrame(frame)
    }
  }, [])
  function choose(id: LabDemoId) {
    setRevision(0)
    setSelected(id)
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}#demo-${id}`,
    )
    window.dispatchEvent(new Event("portfolio:experiment-selected"))
  }
  return (
    <div className="explore-page lab-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <ExplorationNav active="lab" />
          <a href="/explore/" className="case-study-breadcrumb font-mono">
            ← Explore the projects
          </a>
          <div className="page-introduction">
            <div className="page-introduction-copy">
              <p className="project-eyebrow font-mono">ENGINEERING LAB / INTERACTIVE EXAMPLES</p>
              <h1>Try the logic.<br /><em>See what changes.</em></h1>
              <p>Four demonstrations drawn from the systems I've built. Change
                inputs, test a failure, or follow a workflow to see the reasoning
                behind each project.</p>
              <a className="page-introduction-action font-mono" href="#lab-picker-title">Choose an experiment <span aria-hidden="true">↓</span></a>
            </div>
            <div className="page-introduction-art" key={selected}>
              <ProjectSignal projectId={selected} projectName={project.name} stages={labVisualStages[selected]} />
            </div>
          </div>
        </header>
        <section aria-labelledby="lab-picker-title">
          <div className="explore-section-heading">
            <h2 id="lab-picker-title">Choose an experiment</h2>
            <p className="font-mono">{labDemos.length} demos / sample data</p>
          </div>
          <div className="lab-demo-picker">
            {labDemos.map((item) => (
              <button
                key={item.id}
                className="interactive-surface project-accent-card"
                style={cardAccentStyles[item.id]}
                id={`demo-${item.id}`}
                type="button"
                aria-pressed={selected === item.id}
                aria-controls="lab-demo-panel"
                onClick={() => choose(item.id)}
              >
                <span className="project-eyebrow font-mono">
                  {item.label} / {item.kind}
                </span>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </button>
            ))}
          </div>
        </section>
        <section
          className="lab-demo-panel lab-project-theme"
          style={cardAccentStyles[selected]}
          id="lab-demo-panel"
          aria-labelledby="lab-demo-title"
        >
          <div className="lab-workbench-bar font-mono">
            <span>
              <i aria-hidden="true" /> EXPERIMENT{" "}
              {String(
                labDemos.findIndex((item) => item.id === selected) + 1,
              ).padStart(2, "0")}{" "}
              / {String(labDemos.length).padStart(2, "0")}
            </span>
            <span>SAMPLE DATA</span>
            <button
              type="button"
              onClick={() => setRevision((value) => value + 1)}
            >
              Reset experiment ↺
            </button>
          </div>
          <div className="lab-demo-intro">
            <div>
              <p className="project-eyebrow font-mono">
                {demo.label.toUpperCase()} / SELECTED EXPERIMENT
              </p>
              <h2 id="lab-demo-title">{demo.title}</h2>
              <p>{demo.detail}</p>
            </div>
            <a
              className="asset-lab-link font-mono"
              href={project.caseStudyPath}
            >
              Read the {project.name} case study ↗
            </a>
          </div>
          <SaveExplorationButton id={`lab:${selected}`} />
          <p className="lab-sample-notice">
            These examples run in your browser with sample data. They perform no
            live inference, transactions, inventory updates, payments, or
            refunds. Switching experiments starts a fresh example.
          </p>
          <details className="lab-guide">
            <summary>How to explore this experiment</summary>
            <ol>
              <li>Change the labelled inputs or choose a scenario.</li>
              <li>Follow the displayed result and any validation messages.</li>
              <li>
                Open the case study or engineering note for the implementation
                and its limits.
              </li>
            </ol>
          </details>
          <div role="status" className="sr-only">
            Selected experiment: {demo.title}
            {revision > 0 ? `. Example reset ${revision} times.` : ""}
          </div>
          <Suspense
            key={`${selected}-${revision}`}
            fallback={
              <LoadingState label={`Preparing ${demo.title.toLowerCase()}…`} />
            }
          >
            {selected === "centralog" ? (
              <AssetValuationDemo
                caseStudyHref={`${project.caseStudyPath}#engineering`}
              />
            ) : selected === "dormfix" ? (
              <DormFixWalkthrough />
            ) : selected === "isdalog" ? (
              <IsdaLogWalkthrough />
            ) : (
              <PharmaLinkWalkthrough />
            )}
          </Suspense>
          {engineeringNotes
            .filter((note) => note.projectId === selected)
            .map((note) => (
              <aside className="project-note-link" key={note.id}>
                <p className="project-eyebrow font-mono">READ THE REASONING</p>
                <h3>
                  <a href={note.path}>{note.title} ↗</a>
                </h3>
                <p>{note.summary}</p>
              </aside>
            ))}
        </section>
        <ExplorationNext context="lab" project={project} />
      </div>
    </div>
  )
}
