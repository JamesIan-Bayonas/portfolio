import { useId, useState, type CSSProperties } from "react"
import { labDemos } from "../data/labDemos"
import { projects } from "../data/projects"
import "./Toolbox.css"
import StackFlow from "./StackFlow"
import DecodeText from "./DecodeText"
import ResizingPanel from "./ResizingPanel"
import ToolPreview from "./ToolPreview"

const accents = ["#59cbd6", "#b59aff", "#e9b65d", "#74cda4"]
const marks = [
  "M5 17V7m5 10V4m5 13v-6m5 6V2",
  "M6 3h12v18l-3-2-3 2-3-2-3 2V3m3 5h6m-6 4h6",
  "M4 6h16M4 18h16m-5-9 3 3-3 3M9 9l-3 3 3 3",
  "m4 7 8-4 8 4v10l-8 4-8-4V7m0 0 8 4 8-4m-8 4v10",
]

export default function Toolbox() {
  const [selected, setSelected] = useState(0)
  const panelId = useId()
  const demo = labDemos[selected]
  const project = projects.find((item) => item.id === demo.id)!
  const accent = { "--tool-accent": accents[selected] } as CSSProperties

  return (
    <section id="tools" className="toolbox" aria-labelledby="toolbox-title">
      <header className="toolbox-heading">
        <div>
          <p className="project-eyebrow font-mono">
            TOOLBOX / BUILT INTO THE WORK
          </p>
          <h3 id="toolbox-title">
            <DecodeText text="Tools behind the systems." />
          </h3>
          <p>
            Select a tool to trace its workflow, technology stack, and project
            evidence.
          </p>
        </div>
        <span className="toolbox-count font-mono">
          {String(labDemos.length).padStart(2, "0")} TOOLS{" "}
          <span aria-hidden="true">/</span>{" "}
          {String(new Set(labDemos.map((item) => item.id)).size).padStart(
            2,
            "0",
          )}{" "}
          PROJECTS
        </span>
      </header>

      <div
        className="toolbox-grid"
        role="group"
        aria-label="Choose a project tool"
      >
        {labDemos.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className="toolbox-card"
            style={{ "--tool-accent": accents[index] } as CSSProperties}
            aria-pressed={selected === index}
            aria-controls={panelId}
            onClick={() => setSelected(index)}
          >
            <span className="toolbox-card-top">
              <span className="toolbox-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={marks[index]} pathLength="1" />
                </svg>
              </span>
              <span className="font-mono">
                0{index + 1} <span aria-hidden="true">↗</span>
              </span>
            </span>
            <span className="toolbox-project font-mono">{item.label}</span>
            <strong>{item.title}</strong>
            <span className="toolbox-card-description">{item.description}</span>
            <span className="toolbox-card-footer font-mono">
              <span>{item.kind}</span>
              <span>{selected === index ? "Selected ✓" : "View stack +"}</span>
            </span>
            <span className="toolbox-card-scan" aria-hidden="true" />
            <svg
              className="toolbox-watermark"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth=".7"
              aria-hidden="true"
            >
              <path d={marks[index]} />
            </svg>
          </button>
        ))}
      </div>

      <p className="sr-only" role="status">
        {demo.title} selected. Technology and project details updated below.
      </p>
      <ResizingPanel revision={demo.id}>
        <div
          id={panelId}
          className="toolbox-detail"
          style={accent}
          role="region"
          aria-label={`${demo.title} technology and evidence`}
        >
          <div className="toolbox-detail-intro" key={demo.id}>
            <p className="project-eyebrow font-mono">
              0{selected + 1} / {project.name.toUpperCase()} / TOOL DETAILS
            </p>
            <h4>
              <DecodeText text={demo.title} />
              <span className="toolbox-title-stop" aria-hidden="true">
                .
              </span>
            </h4>
            <p>{demo.detail}</p>
            <p className="toolbox-credit">
              {project.context} <span aria-hidden="true">·</span> {project.role}
            </p>
            <p className="toolbox-scope">
              {project.versionLabel}. The linked browser example uses sample
              data.
            </p>
            <div className="toolbox-actions font-mono">
              <a href={`/lab/#demo-${demo.id}`}>
                Try the{" "}
                {demo.kind === "Calculator" ? "calculator" : "walkthrough"}{" "}
                <span aria-hidden="true">↗</span>
              </a>
              <a href={project.caseStudyPath}>
                Inspect the case study <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
          <div className="toolbox-stack">
            <p className="project-eyebrow font-mono">
              PROJECT STACK / HOW THE PIECES CONNECT
            </p>
            <StackFlow
              key={project.id}
              projectName={project.name}
              layers={project.caseStudy.architecture}
            />
            <p className="toolbox-stack-label">
              Explore this project's technologies
            </p>
            <ul
              className="toolbox-technologies"
              aria-label={`${project.name} technology filters`}
            >
              {project.tech.map((tech) => (
                <li key={tech}>
                  <a href={`/explore/?tech=${encodeURIComponent(tech)}`}>
                    {tech}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ToolPreview key={`preview-${demo.id}`} projectId={demo.id} />
        </div>
      </ResizingPanel>
      <p className="toolbox-footnote">
        Tools are features within the projects shown here. Stack details follow
        each documented project version.
      </p>
    </section>
  )
}
