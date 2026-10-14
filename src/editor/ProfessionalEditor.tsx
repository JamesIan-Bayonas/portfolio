import { useEffect, useId, useRef, useState } from "react"
import type {
  ProfessionalContent,
  ProfessionalPath,
} from "../data/professionalProfile"
import { professionalFieldLabel } from "../lib/professionalEditing"

function CopyFields({
  value,
  change,
  path = [],
}: {
  value: unknown
  change: (path: string[], value: string) => void
  path?: string[]
}) {
  const id = useId()
  if (typeof value === "string") {
    const key = path.at(-1)!
    if (
      ["id", "href", "name", "degree", "institution", "updatedAt"].includes(
        key,
      ) ||
      path.includes("projectIds") ||
      (path.includes("/now/") && key === "summary")
    )
      return null
    const label = professionalFieldLabel(path)
    return (
      <div className="editor-field">
        <label htmlFor={id} lang="en">
          {label}
        </label>
        <textarea
          id={id}
          rows={
            key === "detail" ||
            key === "summary" ||
            key === "currentFocus" ||
            key === "focusDetail"
              ? 4
              : 2
          }
          value={value}
          onChange={(event) => change(path, event.target.value)}
        />
      </div>
    )
  }
  if (!value || typeof value !== "object") return null
  return (
    <>
      {Object.entries(value).map(([key, child]) => (
        <CopyFields
          key={key}
          value={child}
          path={[...path, key]}
          change={change}
        />
      ))}
    </>
  )
}

export default function ProfessionalEditor({
  content,
  change,
}: {
  content: ProfessionalContent
  change: (content: ProfessionalContent) => void
}) {
  const [page, setPage] = useState<ProfessionalPath>("/about/")
  const [language, setLanguage] = useState<"en" | "fil">("en")
  const frame = useRef<HTMLIFrameElement>(null)
  const id = useId()
  function preview() {
    frame.current?.contentWindow?.postMessage(
      { kind: "professional-preview", content },
      window.location.origin,
    )
  }
  useEffect(preview, [content, page, language])
  useEffect(() => {
    function ready(event: MessageEvent) {
      if (
        event.origin === window.location.origin &&
        event.source === frame.current?.contentWindow &&
        event.data?.kind === "professional-preview-ready"
      )
        preview()
    }
    window.addEventListener("message", ready)
    return () => window.removeEventListener("message", ready)
  }, [content])
  function edit(
    lang: "en" | "fil",
    scope: "profile" | "pages",
    path: string[],
    value: string,
  ) {
    const next = structuredClone(content)
    let target: any = next[lang][scope]
    for (const key of path.slice(0, -1)) target = target[key]
    target[path.at(-1)!] = value
    if (scope === "profile" && path[0] === "currentFocus")
      next[lang].pages["/now/"].summary = value
    change(next)
  }
  const profileKeys =
    page === "/about/"
      ? ["title", "location", "education", "journey"]
      : page === "/now/"
        ? ["currentFocus", "learningThemes"]
        : ["workAreas", "process"]
  return (
    <>
      <label htmlFor={id}>Choose a professional page</label>
      <select
        id={id}
        value={page}
        onChange={(event) => setPage(event.target.value as ProfessionalPath)}
      >
        <option value="/about/">About</option>
        <option value="/now/">Now</option>
        <option value="/work-with-me/">How I can help</option>
      </select>
      <div className="editor-field">
        <label htmlFor={id + "-date"}>
          Profile update date · both languages
        </label>
        <input
          id={id + "-date"}
          type="date"
          value={content.en.profile.updatedAt}
          onChange={(event) => {
            const next = structuredClone(content)
            next.en.profile.updatedAt = next.fil.profile.updatedAt =
              event.target.value
            change(next)
          }}
        />
      </div>
      <div className="editor-professional-columns">
        {(["en", "fil"] as const).map((lang) => (
          <section
            key={lang}
            lang={lang}
            aria-label={lang === "en" ? "English copy" : "Filipino copy"}
          >
            <h2>{lang === "en" ? "English" : "Filipino"}</h2>
            <CopyFields
              value={{ [page]: content[lang].pages[page] }}
              change={(path, value) => edit(lang, "pages", path, value)}
            />
            {profileKeys.map((key) => (
              <CopyFields
                key={key}
                value={{
                  [key]:
                    content[lang].profile[
                      (key as keyof typeof content.en.profile)
                    ],
                }}
                change={(path, value) => edit(lang, "profile", path, value)}
              />
            ))}
          </section>
        ))}
      </div>
      <section aria-label="Professional page preview">
        <h2>Page preview · unsaved changes</h2>
        <label htmlFor={id + "-language"}>Preview language</label>
        <select
          id={id + "-language"}
          value={language}
          onChange={(event) => setLanguage(event.target.value as "en" | "fil")}
        >
          <option value="en">English</option>
          <option value="fil">Filipino</option>
        </select>
        <p className="editor-hint">
          This preview uses the public layout. Review both languages before
          saving; preview links open saved local pages.
        </p>
        <iframe
          ref={frame}
          title={`${
            language === "en" ? "English" : "Filipino"
          } professional page draft`}
          src={`/editor/?professional-preview=${encodeURIComponent(page)}&language=${language}`}
          onLoad={preview}
          className="editor-professional-preview"
        />
      </section>
    </>
  )
}
