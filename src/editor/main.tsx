import { createRoot } from "react-dom/client"
import ContentEditor from "./ContentEditor"
import "../fonts.css"
import "./editor.css"

createRoot(document.getElementById("root")!).render(<ContentEditor />)
