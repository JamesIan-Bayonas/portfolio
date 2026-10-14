import { createRoot } from "react-dom/client"
import ContentEditor from "./ContentEditor"
import "../fonts.css"
import "./editor.css"

const root = createRoot(document.getElementById("root")!)
if (new URLSearchParams(window.location.search).has("preview")) {
  import("./NotePreview").then(({ default: NotePreview }) =>
    root.render(<NotePreview />),
  )
} else root.render(<ContentEditor />)
