import { professionalProfile as profile } from "../data/professionalProfile"
import { projects } from "../data/projects"
import ContactAction from "./ContactAction"

const pages = {
  "/about/": {
    label: "ABOUT / JOURNEY",
    title: "Learning through the systems I build.",
    summary:
      "I'm James Ian Bayonas, a junior full-stack developer and BS Information Technology student in Dipolog City, Philippines. My projects bring interfaces, APIs, and business records into shared workflows.",
  },
  "/now/": {
    label: "CURRENT WORK / NOW",
    title: "What I'm focused on now.",
    summary: profile.currentFocus,
  },
  "/work-with-me/": {
    label: "HOW I CAN HELP",
    title: "Let's discuss the system you need.",
    summary:
      "Explore the kinds of work reflected in my projects, then describe your build, improvement, or opportunity. We can use a relevant case study as a starting point.",
  },
} as const

function ProjectLinks({ ids }: { ids: readonly string[] }) {
  return (
    <div className="professional-project-links font-mono">
      {ids.map((id) => {
        const project = projects.find((project) => project.id === id)
        return (
          project && (
            <a href={project.caseStudyPath} key={id}>
              {project.name} case study ↗
            </a>
          )
        )
      })}
    </div>
  )
}

export default function ProfessionalPages({
  path,
}: {
  path: keyof typeof pages
}) {
  const page = pages[path]
  return (
    <div className="explore-page professional-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <a className="case-study-breadcrumb font-mono" href="/">
            ← Portfolio home
          </a>
          <p className="project-eyebrow font-mono">{page.label}</p>
          <h1>{page.title}</h1>
          <p>{page.summary}</p>
          <nav
            className="professional-page-links font-mono"
            aria-label="Professional profile"
          >
            <a
              href="/about/"
              aria-current={path === "/about/" ? "page" : undefined}
            >
              My journey
            </a>
            <a
              href="/now/"
              aria-current={path === "/now/" ? "page" : undefined}
            >
              Current work
            </a>
            <a
              href="/work-with-me/"
              aria-current={path === "/work-with-me/" ? "page" : undefined}
            >
              How I can help
            </a>
          </nav>
        </header>
        {path === "/about/" && (
          <>
            <section
              className="professional-education"
              aria-labelledby="education-title"
            >
              <p className="project-eyebrow font-mono">EDUCATION</p>
              <h2 id="education-title">{profile.education.degree}</h2>
              <p>
                {profile.education.institution} · {profile.location}
              </p>
              <p className="font-mono">
                Expected completion: {profile.education.expectedCompletion}
              </p>
            </section>
            <section aria-labelledby="journey-title">
              <div className="explore-section-heading">
                <h2 id="journey-title">My development journey</h2>
                <a
                  className="professional-inline-link font-mono"
                  href="/RESUME.pdf"
                  download="James_Ian_Bayonas_Resume.pdf"
                >
                  Download resume ↓
                </a>
              </div>
              <ol className="professional-journey">
                {profile.journey.map((milestone) => (
                  <li key={milestone.id}>
                    <p className="project-eyebrow font-mono">
                      {milestone.period}
                    </p>
                    <h3>{milestone.title}</h3>
                    <p>{milestone.detail}</p>
                    <ProjectLinks ids={milestone.projectIds} />
                  </li>
                ))}
              </ol>
            </section>
          </>
        )}
        {path === "/now/" && (
          <>
            <p className="professional-update font-mono">
              Last updated{" "}
              <time dateTime={profile.updatedAt}>14 October 2026</time>
            </p>
            <section aria-labelledby="current-focus-title">
              <div className="explore-section-heading">
                <h2 id="current-focus-title">Current focus: this portfolio</h2>
              </div>
              <p className="professional-lead">
                I’m connecting case studies, interactive examples, engineering
                notes, and verified implementation evidence so technical
                reviewers can follow both the workflow and the reasoning behind
                it.
              </p>
              <div className="professional-project-links font-mono">
                <a href="/explore/">Explore the systems ↗</a>
                <a href="/notes/">Browse the engineering notes ↗</a>
              </div>
            </section>
            <section aria-labelledby="learning-title">
              <div className="explore-section-heading">
                <h2 id="learning-title">Learning through project work</h2>
              </div>
              <div className="professional-grid">
                {profile.learningThemes.map((theme) => (
                  <article className="professional-card" key={theme.title}>
                    <h3>{theme.title}</h3>
                    <p>{theme.detail}</p>
                    <a
                      className="professional-inline-link font-mono"
                      href={theme.href}
                    >
                      {theme.label} ↗
                    </a>
                  </article>
                ))}
              </div>
            </section>
            <section
              className="professional-education"
              aria-labelledby="now-education-title"
            >
              <h2 id="now-education-title">Alongside my studies</h2>
              <p>
                {profile.education.degree} at {profile.education.institution},
                with expected completion in{" "}
                {profile.education.expectedCompletion}.
              </p>
              <a className="professional-inline-link font-mono" href="/about/">
                Follow my journey ↗
              </a>
            </section>
          </>
        )}
        {path === "/work-with-me/" && (
          <>
            <section aria-labelledby="work-areas-title">
              <div className="explore-section-heading">
                <h2 id="work-areas-title">Start with the work</h2>
              </div>
              <div className="professional-grid">
                {profile.workAreas.map((area) => (
                  <article className="professional-card" key={area.id}>
                    <h3>{area.title}</h3>
                    <p>{area.detail}</p>
                    <ProjectLinks ids={area.projectIds} />
                    <ContactAction
                      projectId={area.projectIds[0]}
                      label="Discuss this kind of work"
                    />
                  </article>
                ))}
              </div>
            </section>
            <section aria-labelledby="discussion-process-title">
              <div className="explore-section-heading">
                <h2 id="discussion-process-title">How we can begin</h2>
              </div>
              <ol className="professional-process">
                {profile.process.map((step, index) => (
                  <li key={step.title}>
                    <span className="font-mono">0{index + 1}</span>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <ContactAction
                label="Describe your project or opportunity"
                className="professional-contact font-mono"
              />
            </section>
          </>
        )}
        <footer className="dedicated-case-footer">
          <div>
            <p className="project-eyebrow font-mono">PROJECT EVIDENCE</p>
            <h2>Explore what I've built.</h2>
          </div>
          <a className="font-mono" href="/explore/">
            Browse the case studies ↗
          </a>
        </footer>
      </div>
    </div>
  )
}
