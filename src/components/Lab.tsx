import { lazy, Suspense, useEffect, useState } from "react"
import { labDemos, labDemoFromHash, type LabDemoId } from "../data/labDemos"
import { projects } from "../data/projects"
import { engineeringNotes } from "../data/notes"
import LoadingState from "./LoadingState"

const AssetValuationDemo = lazy(() => import("./AssetValuationDemo"))
const DormFixWalkthrough = lazy(() => import("./DormFixWalkthrough"))
const IsdaLogWalkthrough = lazy(() => import("./IsdaLogWalkthrough"))
const PharmaLinkWalkthrough = lazy(() => import("./PharmaLinkWalkthrough"))

export default function Lab() {
  const [selected, setSelected] = useState<LabDemoId>(() =>
    labDemoFromHash(window.location.hash),
  )
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
    setSelected(id)
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}#demo-${id}`,
    )
  }
  return (
    <div className="explore-page lab-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <a href="/explore/" className="case-study-breadcrumb font-mono">
            ← Explore the projects
          </a>
          <p className="project-eyebrow font-mono">
            ENGINEERING LAB / INTERACTIVE EXAMPLES
          </p>
          <h1>
            Try the logic.
            <br />
            See what changes.
          </h1>
          <p>
            Four demonstrations drawn from the systems I've built. Change
            inputs, test a failure, or follow a workflow to see the reasoning
            behind each project.
          </p>
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
          className="lab-demo-panel"
          id="lab-demo-panel"
          aria-labelledby="lab-demo-title"
        >
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
          <p className="lab-sample-notice">
            These examples run in your browser with sample data. They perform no
            live inference, transactions, inventory updates, payments, or
            refunds. Switching experiments starts a fresh example.
          </p>
          <div role="status" className="sr-only">
            Selected experiment: {demo.title}
          </div>
          <Suspense
            key={selected}
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
          {engineeringNotes.filter(note => note.projectId === selected).map(note => <aside className="project-note-link" key={note.id}><p className="project-eyebrow font-mono">READ THE REASONING</p><h3><a href={note.path}>{note.title} ↗</a></h3><p>{note.summary}</p></aside>)}
        </section>
        <footer className="dedicated-case-footer">
          <div>
            <p className="project-eyebrow font-mono">GO DEEPER</p>
            <h2>See the systems behind the examples.</h2>
          </div>
          <a className="font-mono" href="/explore/">
            Explore the case studies ↗
          </a>
        </footer>
      </div>
    </div>
  )
}
