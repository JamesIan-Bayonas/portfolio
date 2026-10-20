import { useId, useState } from "react"
import type { ProfessionalContent } from "../data/professionalProfile"
import { projects } from "../data/projects"
import { localizeCoreHref, type PortfolioLocale } from "../lib/locale"
import { cardAccentStyles } from "../lib/projectCardAccents"
import "./AboutStory.css"

interface AboutStoryProps {
  profile: ProfessionalContent["en"]["profile"]
  locale: PortfolioLocale
}

export function AboutOverview({ profile, locale }: AboutStoryProps) {
  const fil = locale === "fil"
  const t = (en: string, translated: string) => (fil ? translated : en)
  return (
    <section className="about-overview" aria-labelledby="about-overview-title">
      <div className="about-identity">
        <div className="about-monogram" aria-hidden="true">
          <span>J</span>
          <span>I</span>
          <span>B</span>
          <i />
        </div>
        <p className="about-kicker">
          {t(
            "THE PERSON BEHIND THE SYSTEMS",
            "ANG TAO SA LIKOD NG MGA SISTEMA",
          )}
        </p>
        <h2 id="about-overview-title">{profile.name}</h2>
        <p className="about-role">{profile.title}</p>
        <p className="about-location">
          <span aria-hidden="true">↗</span>
          {profile.location}
        </p>
        <dl className="about-project-facts">
          <div>
            <dt>{t("Systems explored here", "Mga sistemang matutuklasan")}</dt>
            <dd>{String(projects.length).padStart(2, "0")}</dd>
          </div>
          <div>
            <dt>{t("Built independently", "Binuo nang mag-isa")}</dt>
            <dd>
              {String(
                projects.filter((project) => project.role === "Sole developer")
                  .length,
              ).padStart(2, "0")}
            </dd>
          </div>
        </dl>
        <a href="/RESUME.pdf" download="James_Ian_Bayonas_Resume.pdf">
          {t("Download my resume", "I-download ang resume (English)")}{" "}
          <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className="about-overview-notes">
        <div className="about-focus">
          <p className="about-kicker">
            01 / {t("WHAT I’M WORKING ON", "KASALUKUYANG GAWAIN")}
          </p>
          <h3>
            {t(
              "Making the work easier to explore.",
              "Mas madaling tuklasin ang aking gawain.",
            )}
          </h3>
          <p>{profile.currentFocus}</p>
          <div className="about-focus-footer">
            <span>
              {t("Profile updated", "Na-update ang profile")}{" "}
              <time dateTime={profile.updatedAt}>
                {new Intl.DateTimeFormat(fil ? "fil-PH" : "en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  timeZone: "Asia/Singapore",
                }).format(new Date(profile.updatedAt + "T00:00:00+08:00"))}
              </time>
            </span>
            <a href={localizeCoreHref("/now/", locale)}>
              {t("Read the current focus", "Basahin ang kasalukuyang pokus")} ↗
            </a>
          </div>
        </div>
        <div className="about-studies">
          <p className="about-kicker">
            02 / {t("LEARNING & EDUCATION", "PAGKATUTO AT PAG-AARAL")}
          </p>
          <h3 lang="en">{profile.education.degree}</h3>
          <p>{profile.education.institution}</p>
          <p className="about-completion">
            {t("Expected completion", "Inaasahang pagtatapos")}{" "}
            <strong>{profile.education.expectedCompletion}</strong>
          </p>
        </div>
      </div>
    </section>
  )
}

const evidenceGroups = [
  ["pharmalink", "isdalog"],
  ["dormfix", "centralog"],
  ["centralog", "pharmalink"],
]

export function AboutApproach({ profile, locale }: AboutStoryProps) {
  const [selected, setSelected] = useState(0)
  const id = useId()
  const fil = locale === "fil"
  const t = (en: string, translated: string) => (fil ? translated : en)
  const theme = profile.learningThemes[selected] ?? profile.learningThemes[0]
  if (!theme) return null
  const evidence = projects.filter((project) =>
    evidenceGroups[selected % evidenceGroups.length].includes(project.id),
  )
  return (
    <section className="about-approach" aria-labelledby={`${id}-title`}>
      <div className="about-section-heading">
        <div>
          <p className="about-kicker">
            {t("THE WAY I THINK ABOUT THE WORK", "ANG AKING PANANAW SA GAWAIN")}
          </p>
          <h2 id={`${id}-title`}>
            {t("An approach you can inspect.", "Isang paraang masusuri mo.")}
          </h2>
        </div>
        <p>
          {t(
            "Choose a focus. Follow it into the work.",
            "Pumili ng pokus. Sundan ito sa mga proyekto.",
          )}
        </p>
      </div>
      <div className="about-approach-layout">
        <div
          className="about-theme-picker"
          role="group"
          aria-label={t(
            "Explore my working approach",
            "Tuklasin ang aking paraan ng paggawa",
          )}
        >
          {profile.learningThemes.map((item, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={selected === index}
              aria-controls={`${id}-evidence`}
              onClick={() => setSelected(index)}
            >
              <span className="about-kicker">0{index + 1}</span>
              <strong>{item.title}</strong>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div
          className="about-theme-detail"
          id={`${id}-evidence`}
          role="region"
          aria-labelledby={`${id}-selected`}
        >
          <p className="about-kicker">
            {t("FROM PRINCIPLE TO PROJECT", "MULA PRINSIPYO HANGGANG PROYEKTO")}
          </p>
          <h3 id={`${id}-selected`}>{theme.title}</h3>
          <p>{theme.detail}</p>
          <p className="sr-only" role="status" aria-atomic="true">
            {theme.title}.{" "}
            {t(
              "Project examples updated.",
              "Na-update ang mga halimbawa ng proyekto.",
            )}
          </p>
          <div className="about-evidence-grid">
            {evidence.map((project) => (
              <article
                key={project.id}
                className="about-evidence-card project-accent-card"
                style={cardAccentStyles[project.id]}
              >
                <p className="about-kicker">{project.name}</p>
                <h4 lang="en">{project.title}</h4>
                <p lang="en">
                  {project.role} · {project.context}
                </p>
                <a
                  href={localizeCoreHref(
                    project.caseStudyPath ?? "/explore/",
                    locale,
                  )}
                >
                  {t("Inspect the case study", "Suriin ang proyekto")}
                  {fil && !["centralog", "dormfix"].includes(project.id)
                    ? " (English)"
                    : ""}{" "}
                  ↗
                </a>
                <a href={`/lab/#demo-${project.id}`} hrefLang="en">
                  {t(
                    "Try the sample workflow",
                    "Subukan ang halimbawa (English)",
                  )}{" "}
                  ↗
                </a>
              </article>
            ))}
          </div>
          <a
            className="about-theme-link"
            href={localizeCoreHref(theme.href, locale)}
          >
            {theme.label} ↗
          </a>
        </div>
      </div>
    </section>
  )
}
