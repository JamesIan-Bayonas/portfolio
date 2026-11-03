import captures from "../data/cpatsScreenshots.json"
import { cardAccentStyles } from "../lib/projectCardAccents"
import ResponsiveScreenshot from "./ResponsiveScreenshot"
import "./NotableProjects.css"

const preview = captures[0]

export default function NotableProjects() {
  return (
    <section
      id="project-cpats"
      className="notable-projects"
      aria-labelledby="notable-projects-title"
    >
      <div className="notable-projects-heading">
        <div>
          <p className="project-eyebrow font-mono">SCHOOL CAPSTONE</p>
          <h2 id="notable-projects-title">Other notable projects</h2>
        </div>
        <p>
          Another system I built, with a closer look at the people and workflows
          it connects.
        </p>
      </div>
      <a
        className="notable-project-card interactive-surface project-accent-card"
        href="/projects/cpats/"
        style={cardAccentStyles.cpats}
        aria-labelledby="cpats-project-name"
      >
        <ResponsiveScreenshot
          asset={preview}
          alt={preview.alt}
          sizes="(min-width: 1520px) 760px, (min-width: 768px) 55vw, 100vw"
        />
        <div>
          <span className="project-eyebrow font-mono">
            DMC · PROCUREMENT WORKFLOW
          </span>
          <h3 id="cpats-project-name">CPATS</h3>
          <p>Campus Procurement Automation &amp; Tracking System</p>
          <span className="notable-project-summary">
            A school capstone connecting seven role-based workspaces, from
            request submission to receiving and read-only audit.
          </span>
          <ul
            className="project-tech notable-project-tech"
            aria-label="CPATS technologies"
          >
            {[
              "Next.js 16",

              "React 19",

              "TypeScript",

              "Tailwind CSS 4",

              "Prisma",

              "MariaDB",

              "Zod",

              "Nodemailer",

              "QR asset labels",
            ].map((tech) => (
              <li key={tech} className="font-mono">
                {tech}
              </li>
            ))}
          </ul>
          <span className="notable-project-action font-mono">
            Explore CPATS · 25 screenshots <span aria-hidden="true">↗</span>
          </span>
        </div>
      </a>
    </section>
  )
}
