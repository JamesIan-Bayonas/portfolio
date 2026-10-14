import { useEffect, useState } from "react"
import Notes from "../components/Notes"
import type { EngineeringNote } from "../data/notes"
import "../index.css"

export default function NotePreview() {
  const [note, setNote] = useState<EngineeringNote>()
  const [message, setMessage] = useState("Loading saved local article…")
  useEffect(() => {
    let active = true
    fetch("/api/content-editor", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok)
          throw new Error("The local editor could not load the saved article.")
        const result = await response.json()
        const id = new URLSearchParams(window.location.search).get("preview")
        const article = result.notes.value.find(
          (item: EngineeringNote) => item.id === id,
        )
        if (!article)
          throw new Error(
            "Save this note in the editor before opening its page preview.",
          )
        if (active) {
          setNote(article)
          document.title = `${article.title || "Untitled draft"} | Local preview`
        }
      })
      .catch((error) => {
        if (active) setMessage(error.message)
      })
    return () => {
      active = false
    }
  }, [])
  return (
    <main id="main-content">
      <a href="/editor/" className="case-study-breadcrumb">
        ← Return to the local editor
      </a>
      {note ? <Notes previewNote={note} /> : <p role="status">{message}</p>}
    </main>
  )
}
