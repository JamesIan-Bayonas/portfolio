import { motion, useReducedMotion } from "motion/react"
import { skillGroups } from "../data/skills"
import CapabilitiesMap from "./CapabilitiesMap"

export default function SkillsMatrix() {
  const reduced = useReducedMotion()
  return (
    <section
      id="skills"
      className="skills-section relative z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="project-section-heading">
          <div>
            <p className="project-eyebrow font-mono">03 — SKILLS & EVIDENCE</p>
            <h2>
              What I build,
              <br />
              with evidence.
            </h2>
          </div>
          <p>
            Start with a capability, then inspect the project decisions or try
            a sample workflow. Each example includes my role and project context.
          </p>
        </div>
        <CapabilitiesMap />
        <div className="technology-evidence-heading">
          <h3>Explore by technology</h3>
          <p>Open a tool to see the projects where I used it.</p>
        </div>
        <div className="evidence-grid">
          {skillGroups.map((group, index) => (
            <motion.section
              key={group.name}
              className="evidence-card"
              aria-labelledby={`skill-group-${index}`}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4 }}
            >
              <span className="project-eyebrow font-mono">
                {String(index + 1).padStart(2, "0")} /
              </span>
              <h4 id={`skill-group-${index}`}>{group.name}</h4>
              <p>{group.description}</p>
              <div className="evidence-tools">
                {group.tools.map((tool) => (
                  <details key={tool.name} className="evidence-tool">
                    <summary>
                      <span>{tool.name}</span>
                      <span className="font-mono">
                        {tool.projects.length}{" "}
                        <span className="evidence-count-label">
                          project{tool.projects.length === 1 ? "" : "s"}
                        </span>
                        <span aria-hidden="true"> +</span>
                      </span>
                    </summary>
                    <ul aria-label={`${tool.name} project evidence`}>
                      {tool.projects.map((project) => (
                        <li key={project.id}>
                          <a href={project.caseStudyPath ?? `#project-${project.id}`}>
                            <span>{project.name}</span>
                            <span aria-hidden="true">↗</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </section>
  )
}
