import ProjectStoryPreview from "./ProjectStoryPreview"
import { projectPreview } from "../data/projectPreviews"
import { usePortfolioTheme } from "../lib/usePortfolioTheme"
import { useRef } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import "./ProjectScrollDepth.css"
import { usePortfolioReducedMotion as useReducedMotion } from "../lib/usePortfolioReducedMotion"

import { projects, projectScreenshot, type Project } from "../data/projects"

import ProjectCaseStudy from "./ProjectCaseStudy"

import ResponsiveScreenshot from "./ResponsiveScreenshot"

import ScreenshotPreview from "./ScreenshotPreview"

import { cardAccentStyles } from "../lib/projectCardAccents"

interface ProjectCardProps {
  project: Project

  index: number
}

function ProjectCard({ project: sourceProject, index }: ProjectCardProps) {
  const mode = usePortfolioTheme()
  const project = projectPreview(sourceProject, mode)

  const reduced = useReducedMotion()
  const visualRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: visualRef,
    offset: ["start end", "end start"],
  })
  const depthY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [8, -8])
  const depthRotation = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-0.35, 0.35])

  const featured = index === 0

  return (
    <motion.article
      id={`project-${project.id}`}
      className={`interactive-surface project-card project-accent-card${
        featured ? " project-card-featured" : ""
      }`}
      style={cardAccentStyles[project.id]}
      aria-labelledby={`${project.id}-title`}
      initial={reduced ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
    >
      <div className="project-card-main">
        <motion.div ref={visualRef} className="project-visual project-scroll-depth" style={{ y: depthY, rotate: depthRotation }}>
          <div className="project-image-bar font-mono">
            <span>
              {String(index + 1).padStart(2, "0")} / {project.name}
            </span>
            <span>{featured ? "FEATURED PROJECT" : project.context}</span>
          </div>
          <ScreenshotPreview
            images={projects.map((item) =>
              projectScreenshot(projectPreview(item, mode)),
            )}
            selectedId={project.id}
            label={`Inspect ${project.name} screenshot`}
          >
            <ResponsiveScreenshot
              asset={project.screenshot}
              alt={project.imageAlt}
              sizes="(min-width: 1520px) 672px, (min-width: 1024px) calc((100vw - 160px) / 2), (min-width: 640px) calc(100vw - 110px), calc(100vw - 76px)"
            />
          </ScreenshotPreview>
        </motion.div>
        <div className="project-overview">
          <p className="project-eyebrow font-mono">{project.category}</p>
          <h3 id={`${project.id}-title`} className="project-name">
            {project.name}
          </h3>
          <p className="project-title">{project.title}</p>
          <p className="project-description">{project.description}</p>
          <ProjectStoryPreview project={project} />
          <p className="project-version-label font-mono">
            {project.versionLabel}
          </p>
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
            {project.caseStudyPath && (
              <a href={project.caseStudyPath}>
                Explore the full case study <span aria-hidden="true">↗</span>
              </a>
            )}
            {project.demoAvailable !== false ? (
              <a href={project.demo} target="_blank" rel="noopener noreferrer">
                Live demo <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <span className="demo-unavailable">Live demo unavailable</span>
            )}
            <a href={project.source} target="_blank" rel="noopener noreferrer">
              Source code <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
      <ProjectCaseStudy project={project} />
    </motion.article>
  )
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="project-section relative z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="project-section-heading">
          <div>
            <p className="project-eyebrow font-mono">01 — SELECTED WORK</p>
            <h2>
              Systems built around
              <br />
              real workflows.
            </h2>
          </div>
          <p>
            From a local fisheries marketplace to institutional asset
            management. Explore the problem, my contribution, and the decisions
            behind each system.
          </p>
        </div>
        <nav className="project-index font-mono" aria-label="Jump to a project">
          <a href="/explore/">
            Explore & filter all projects <span aria-hidden="true">↗</span>
          </a>
          {projects.map((project, index) => (
            <a
              key={project.id}
              href={`#project-${project.id}`}
              className="project-index-link"
              style={cardAccentStyles[project.id]}
            >
              <span className="project-index-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              {project.name}
              <span aria-hidden="true">↓</span>
            </a>
          ))}
        </nav>
        <div className="project-list">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
