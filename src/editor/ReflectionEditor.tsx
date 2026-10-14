import { useId } from "react"
import type { Reflection, ReflectionCopy } from "../data/reflections"
import { reflectionReadingMinutes } from "../data/reflections"

function CopyField({
  label,
  value,
  multiline,
  change,
}: {
  label: string
  value: string
  multiline?: boolean
  change: (value: string) => void
}) {
  const id = useId()
  return (
    <div className="editor-field">
      <label htmlFor={id} lang="en">{label}</label>
      {multiline ? (
        <textarea
          id={id}
          rows={5}
          value={value}
          onChange={(event) => change(event.target.value)}
        />
      ) : (
        <input
          id={id}
          value={value}
          onChange={(event) => change(event.target.value)}
        />
      )}
    </div>
  )
}

export default function ReflectionEditor({
  reflection,
  change,
}: {
  reflection: Reflection
  change: (value: Reflection) => void
}) {
  function edit(language: "en" | "fil", copy: ReflectionCopy) {
    change(
      language === "en"
        ? { ...reflection, ...copy }
        : { ...reflection, filipino: copy },
    )
  }
  return (
    <>
      <p className="editor-hint">
        Writing date: {reflection.writtenAt} · Route: {reflection.path}
        <br />
        Review both languages before saving. Separate paragraphs with a blank
        line.
      </p>
      <div className="editor-language-columns">
        {(["en", "fil"] as const).map((language) => {
          const name = language === "en" ? "English" : "Filipino"
          const copy: ReflectionCopy =
            language === "en" ? reflection : reflection.filipino
          const update = (
            field: keyof ReflectionCopy,
            value: string | ReflectionCopy["sections"],
          ) => edit(language, { ...copy, [field]: value })
          return (
            <section key={language} aria-label={`${name} reflection fields`}>
              <h2>{name}</h2>
              <div lang={language}>
                {(["title", "summary", "topic", "sourceContext"] as const).map(
                  (field) => (
                    <CopyField
                      key={field}
                      label={`${name} ${
                        field === "sourceContext" ? "supporting context" : field
                      }`}
                      value={copy[field]}
                      multiline={
                        field === "summary" || field === "sourceContext"
                      }
                      change={(value) => update(field, value)}
                    />
                  ),
                )}
                {copy.sections.map((section, index) => (
                  <div className="editor-section" key={section.id}>
                    <h3>Section {index + 1}</h3>
                    <CopyField
                      label={`${name} section ${index + 1} title`}
                      value={section.title}
                      change={(value) =>
                        update(
                          "sections",
                          copy.sections.map((item, i) =>
                            i === index ? { ...item, title: value } : item,
                          ),
                        )
                      }
                    />
                    <CopyField
                      label={`${name} section ${index + 1} paragraphs`}
                      multiline
                      value={section.paragraphs.join("\n\n")}
                      change={(value) =>
                        update(
                          "sections",
                          copy.sections.map((item, i) =>
                            i === index
                              ? { ...item, paragraphs: value.split("\n\n") }
                              : item,
                          ),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
              <section
                className="editor-preview"
                aria-label={`${name} draft preview`}
              >
                <p className="editor-eyebrow">
                  {name.toUpperCase()} DRAFT PREVIEW
                </p>
                <a
                  href={`${language === "fil" ? "/fil" : ""}${reflection.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open saved {name} reflection ↗
                </a>
                <div lang={language}>
                  <h2>{copy.title}</h2>
                  <p>{copy.summary}</p>
                  <p className="editor-hint">
                    {copy.topic} · {reflectionReadingMinutes(copy)}{" "}
                    {language === "fil" ? "minutong pagbasa" : "min read"}
                  </p>
                  {copy.sections.map((section) => (
                    <section key={section.id}>
                      <h3>{section.title}</h3>
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </section>
                  ))}
                  <h3>
                    {language === "fil" ? "Konteksto" : "Supporting context"}
                  </h3>
                  <p>{copy.sourceContext}</p>
                </div>
              </section>
            </section>
          )
        })}
      </div>
      <aside
        className="editor-preview"
        aria-label="Protected supporting references"
      >
        <h2>Supporting references</h2>
        <p className="editor-hint">
          These links, section anchors, and the writing date stay fixed in this
          workspace.
        </p>
        {reflection.references.map((reference) => (
          <a
            key={reference.path}
            href={reference.path}
            target="_blank"
            rel="noopener noreferrer"
          >
            {reference.label} ↗
          </a>
        ))}
      </aside>
    </>
  )
}
