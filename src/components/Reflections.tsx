import { useEffect } from "react"
import {
  reflections,
  reflectionCopy,
  reflectionReadingMinutes,
} from "../data/reflections"
import {
  canonicalContentPath,
  currentLocale,
  localizeCoreHref,
} from "../lib/locale"
import FollowNotes from "./FollowNotes"

export default function Reflections() {
  useEffect(() => {
    let id: string
    try {
      id = decodeURIComponent(window.location.hash.slice(1))
    } catch {
      return
    }
    if (!id) return
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: "auto" }),
    )
    return () => cancelAnimationFrame(frame)
  }, [])
  const locale = currentLocale()
  const fil = locale === "fil"
  const t = (en: string, translated: string) => (fil ? translated : en)
  const href = (path: string) => localizeCoreHref(path, locale)
  const reflection = reflections.find(
    (item) => item.path === canonicalContentPath(window.location.pathname),
  )
  const copy = reflection && reflectionCopy(reflection, locale)
  const date = (value: string) =>
    new Intl.DateTimeFormat(fil ? "fil-PH" : "en-GB", {
      dateStyle: "long",
      timeZone: "Asia/Singapore",
    }).format(new Date(`${value}T00:00:00+08:00`))
  return (
    <article className="explore-page notes-page reflections-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <a
            className="case-study-breadcrumb font-mono"
            href={href(reflection ? "/reflections/" : "/about/")}
          >
            ←{" "}
            {reflection
              ? t("All reflections", "Lahat ng pagninilay")
              : t("My journey", "Aking paglalakbay")}
          </a>
          <p className="project-eyebrow font-mono">
            {t(
              "REFLECTIONS / LEARNING THROUGH PROJECTS",
              "MGA PAGNINILAY / PAGKATUTO SA MGA PROYEKTO",
            )}
          </p>
          <h1>
            {copy?.title ??
              t(
                "Thinking through the work.",
                "Mga pagninilay sa aking mga proyekto.",
              )}
          </h1>
          <p>
            {copy?.summary ??
              t(
                "Personal reflections on collaboration, project ownership, and the decisions I am learning to explain through my work.",
                "Mga personal na pagninilay tungkol sa pakikipagtulungan, pinagmulan ng mga proyekto, at mga desisyong natututuhan kong ipaliwanag sa aking gawain.",
              )}
          </p>
          {reflection && copy && (
            <p className="reflection-byline font-mono">
              James Ian Bayonas · {t("Written", "Isinulat noong")}{" "}
              <time dateTime={reflection.writtenAt}>
                {date(reflection.writtenAt)}
              </time>{" "}
              · {reflectionReadingMinutes(copy)}{" "}
              {t("min read", "minutong pagbasa")}
            </p>
          )}
        </header>
        {!reflection ? (
          <div className="reflection-grid">
            {reflections.map((item) => {
              const entry = reflectionCopy(item, locale)
              return (
                <section className="professional-card" key={item.id}>
                  <p className="project-eyebrow font-mono">{entry.topic}</p>
                  <h2>
                    <a href={href(item.path)}>{entry.title}</a>
                  </h2>
                  <p>{entry.summary}</p>
                  <p className="reflection-byline font-mono">
                    <time dateTime={item.writtenAt}>
                      {date(item.writtenAt)}
                    </time>{" "}
                    · {reflectionReadingMinutes(entry)}{" "}
                    {t("min read", "minutong pagbasa")}
                  </p>
                  <a
                    className="professional-inline-link font-mono"
                    href={href(item.path)}
                  >
                    {t("Read reflection", "Basahin ang pagninilay")} ↗
                  </a>
                </section>
              )
            })}
          </div>
        ) : (
          copy && (
            <div className="note-layout">
              <nav
                className="note-contents font-mono"
                aria-label={t("On this page", "Sa pahinang ito")}
              >
                <p>{t("On this page", "Sa pahinang ito")}</p>
                {copy.sections.map((section) => (
                  <a href={`#${section.id}`} key={section.id}>
                    {section.title}
                  </a>
                ))}
              </nav>
              <div className="note-body">
                {copy.sections.map((section) => (
                  <section key={section.id} aria-labelledby={section.id}>
                    <h2 id={section.id}>{section.title}</h2>
                    {section.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </section>
                ))}
                <aside className="note-reference">
                  <h2>
                    {t(
                      "Context and supporting reading",
                      "Konteksto at mga kaugnay na babasahin",
                    )}
                  </h2>
                  <p>{copy.sourceContext}</p>
                  <div className="reflection-references font-mono">
                    {reflection.references.map((reference) => (
                      <a href={reference.path} key={reference.path} lang="en">
                        {reference.label}
                        {fil ? " (English)" : ""} ↗
                      </a>
                    ))}
                  </div>
                </aside>
                <aside className="reflection-related">
                  <h2>{t("Another reflection", "Isa pang pagninilay")}</h2>
                  {reflections
                    .filter((item) => item.id !== reflection.id)
                    .map((item) => (
                      <a
                        className="professional-inline-link"
                        href={href(item.path)}
                        key={item.id}
                      >
                        {reflectionCopy(item, locale).title} ↗
                      </a>
                    ))}
                </aside>
              </div>
            </div>
          )
        )}
        <FollowNotes collection="reflections" locale={locale} />
        <a
          className="professional-inline-link font-mono"
          href={href("/explore/")}
        >
          {t("Browse projects", "Tuklasin ang mga proyekto")} ↗
        </a>
      </div>
    </article>
  )
}
