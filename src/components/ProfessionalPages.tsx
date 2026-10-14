import { professionalProfile as englishProfile } from "../data/professionalProfile"
import { filipinoProfile, filipinoProfessionalPages } from "../data/filipino"
import { currentLocale, localizeCoreHref } from "../lib/locale"
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
    summary: englishProfile.currentFocus,
  },
  "/work-with-me/": {
    label: "HOW I CAN HELP",
    title: "Let's discuss the system you need.",
    summary:
      "Explore the kinds of work reflected in my projects, then describe your build, improvement, or opportunity. We can use a relevant case study as a starting point.",
  },
} as const

function ProjectLinks({ ids }: { ids: readonly string[] }) {
  const fil = currentLocale() === "fil"
  return (
    <div className="professional-project-links font-mono">
      {ids.map((id) => {
        const project = projects.find((project) => project.id === id)
        return (
          project && (
            <a href={project.caseStudyPath} key={id} lang="en">
              {project.name} case study {fil ? "(English) " : ""}↗
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
  const locale = currentLocale()
  const fil = locale === "fil"
  const t = (english: string, filipino: string) => (fil ? filipino : english)
  const profile = fil ? filipinoProfile : englishProfile
  const page = fil ? filipinoProfessionalPages[path] : pages[path]
  const href = (value: string) => localizeCoreHref(value, locale)
  return (
    <div className="explore-page professional-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <a className="case-study-breadcrumb font-mono" href={href("/")}>
            ← {t("Portfolio home", "Pangunahing pahina")}
          </a>
          <p className="project-eyebrow font-mono">{page.label}</p>
          <h1>{page.title}</h1>
          <p>{page.summary}</p>
          <nav
            className="professional-page-links font-mono"
            aria-label={t("Professional profile", "Propesyonal na profile")}
          >
            <a
              href={href("/about/")}
              aria-current={path === "/about/" ? "page" : undefined}
            >
              {t("My journey", "Aking paglalakbay")}
            </a>
            <a
              href={href("/now/")}
              aria-current={path === "/now/" ? "page" : undefined}
            >
              {t("Current work", "Kasalukuyang gawain")}
            </a>
            <a
              href={href("/work-with-me/")}
              aria-current={path === "/work-with-me/" ? "page" : undefined}
            >
              {t("How I can help", "Paano ako makakatulong")}
            </a>
          </nav>
        </header>
        {path === "/about/" && (
          <>
            <section
              className="professional-education"
              aria-labelledby="education-title"
            >
              <p className="project-eyebrow font-mono">
                {t("EDUCATION", "PAG-AARAL")}
              </p>
              <h2 id="education-title" lang="en">
                {profile.education.degree}
              </h2>
              <p>
                {profile.education.institution} · {profile.location}
              </p>
              <p className="font-mono">
                {t("Expected completion", "Inaasahang pagtatapos")}:{" "}
                {profile.education.expectedCompletion}
              </p>
            </section>
            <section aria-labelledby="journey-title">
              <div className="explore-section-heading">
                <h2 id="journey-title">
                  {t(
                    "My development journey",
                    "Aking paglalakbay bilang developer",
                  )}
                </h2>
                <a
                  className="professional-inline-link font-mono"
                  href="/RESUME.pdf"
                  download="James_Ian_Bayonas_Resume.pdf"
                >
                  {t("Download resume", "I-download ang resume (English)")} ↓
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
              {t("Last updated", "Huling na-update")}{" "}
              <time dateTime={profile.updatedAt}>
                {new Intl.DateTimeFormat(fil ? "fil-PH" : "en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "Asia/Singapore",
                }).format(new Date(profile.updatedAt + "T00:00:00+08:00"))}
              </time>
            </p>
            <section aria-labelledby="current-focus-title">
              <div className="explore-section-heading">
                <h2 id="current-focus-title">
                  {t(
                    "Current focus: this portfolio",
                    "Kasalukuyang pokus: ang portfolio na ito",
                  )}
                </h2>
              </div>
              <p className="professional-lead">
                {t(
                  "I’m connecting case studies, interactive examples, engineering notes, and verified implementation evidence so technical reviewers can follow both the workflow and the reasoning behind it.",
                  "Pinag-uugnay ko ang mga case study, interactive na halimbawa, tala sa engineering, at sinuring ebidensiya ng implementasyon upang masundan ng mga reviewer ang workflow at ang pangangatwiran sa likod nito.",
                )}
              </p>
              <div className="professional-project-links font-mono">
                <a href={href("/explore/")}>
                  {t("Explore the systems", "Tuklasin ang mga system")} ↗
                </a>
                <a href="/notes/" hrefLang="en">
                  {t(
                    "Browse the engineering notes",
                    "Basahin ang mga tala sa engineering (English)",
                  )}{" "}
                  ↗
                </a>
              </div>
            </section>
            <section aria-labelledby="learning-title">
              <div className="explore-section-heading">
                <h2 id="learning-title">
                  {t(
                    "Learning through project work",
                    "Pagkatuto mula sa mga proyekto",
                  )}
                </h2>
              </div>
              <div className="professional-grid">
                {profile.learningThemes.map((theme) => (
                  <article className="professional-card" key={theme.title}>
                    <h3>{theme.title}</h3>
                    <p>{theme.detail}</p>
                    <a
                      className="professional-inline-link font-mono"
                      href={href(theme.href)}
                      hrefLang={
                        fil && theme.href !== "/explore/" ? "en" : undefined
                      }
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
              <h2 id="now-education-title">
                {t("Alongside my studies", "Kasabay ng aking pag-aaral")}
              </h2>
              <p>
                <span lang="en">{profile.education.degree}</span>{" "}
                {t("at", "sa")} {profile.education.institution},
                {t("with expected completion in", "na inaasahang matatapos sa")}{" "}
                {profile.education.expectedCompletion}.
              </p>
              <a
                className="professional-inline-link font-mono"
                href={href("/about/")}
              >
                {t("Follow my journey", "Sundan ang aking paglalakbay")} ↗
              </a>
            </section>
          </>
        )}
        {path === "/work-with-me/" && (
          <>
            <section aria-labelledby="work-areas-title">
              <div className="explore-section-heading">
                <h2 id="work-areas-title">
                  {t("Start with the work", "Magsimula sa gawain")}
                </h2>
              </div>
              <div className="professional-grid">
                {profile.workAreas.map((area) => (
                  <article className="professional-card" key={area.id}>
                    <h3>{area.title}</h3>
                    <p>{area.detail}</p>
                    <ProjectLinks ids={area.projectIds} />
                    <ContactAction
                      projectId={area.projectIds[0]}
                      label={t(
                        "Discuss this kind of work",
                        "Pag-usapan ang ganitong gawain",
                      )}
                    />
                  </article>
                ))}
              </div>
            </section>
            <section aria-labelledby="discussion-process-title">
              <div className="explore-section-heading">
                <h2 id="discussion-process-title">
                  {t("How we can begin", "Paano tayo magsisimula")}
                </h2>
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
                label={t(
                  "Describe your project or opportunity",
                  "Ilarawan ang iyong proyekto o oportunidad",
                )}
                className="professional-contact font-mono"
              />
            </section>
          </>
        )}
        <footer className="dedicated-case-footer">
          <div>
            <p className="project-eyebrow font-mono">
              {t("PROJECT EVIDENCE", "EBIDENSIYA NG MGA PROYEKTO")}
            </p>
            <h2>
              {t("Explore what I've built.", "Tuklasin ang mga binuo ko.")}
            </h2>
          </div>
          <a className="font-mono" href={href("/explore/")}>
            {t("Browse the case studies", "Tuklasin ang mga proyekto")} ↗
          </a>
        </footer>
      </div>
    </div>
  )
}
