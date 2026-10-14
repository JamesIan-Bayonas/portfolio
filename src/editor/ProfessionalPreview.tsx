import { useEffect, useState } from "react"
import ProfessionalPages from "../components/ProfessionalPages"
import {
  professionalContent,
  type ProfessionalContent,
  type ProfessionalPath,
} from "../data/professionalProfile"
import { validateProfessionalContent } from "../lib/professionalEditing"
import "../index.css"

export default function ProfessionalPreview() {
  const query = new URLSearchParams(window.location.search)
  const requested = query.get("professional-preview") ?? "/about/"
  const path = Object.prototype.hasOwnProperty.call(
    professionalContent.en.pages,
    requested,
  )
    ? requested as ProfessionalPath
    : "/about/"
  const locale = query.get("language") === "fil" ? "fil" : "en"
  const [content, setContent] = useState(professionalContent)
  useEffect(() => {
    document.documentElement.lang = locale
    let active = true
    let receivedDraft = false
    function receive(event: MessageEvent) {
      if (
        event.origin !== window.location.origin ||
        event.source !== window.parent ||
        event.data?.kind !== "professional-preview"
      )
        return
      try {
        validateProfessionalContent(event.data.content, undefined, true)
        receivedDraft = true
        setContent(event.data.content as ProfessionalContent)
      } catch {
        /* Keep the last valid preview shape. */
      }
    }
    window.addEventListener("message", receive)
    window.parent.postMessage(
      { kind: "professional-preview-ready" },
      window.location.origin,
    )
    fetch("/api/content-editor", { cache: "no-store" })
      .then((response) => response.json())
      .then((result) => {
        if (active && !receivedDraft && result.professional)
          setContent(result.professional.value)
      })
      .catch(() => {})
    return () => {
      active = false
      window.removeEventListener("message", receive)
    }
  }, [locale])
  // An incomplete date is recoverable, but must not crash the public renderer.
  const preview = structuredClone(content)
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(preview[locale].profile.updatedAt) ||
    !Number.isFinite(Date.parse(preview[locale].profile.updatedAt))
  )
    preview[locale].profile.updatedAt =
      professionalContent[locale].profile.updatedAt
  return (
    <main id="main-content" lang={locale}>
      <ProfessionalPages path={path} content={preview} previewLocale={locale} />
    </main>
  )
}
