import { useEffect } from "react"
import About from "./About"
import Process from "./Process"
import Projects from "./Projects"
import EngineeringLab from "./EngineeringLab"
import SkillsMatrix from "./SkillsMatrix"
import ContactFooter from "./ContactFooter"

export default function HomeSections() {
  useEffect(() => {
    if (!window.location.hash) return
    let id: string
    try { id = decodeURIComponent(window.location.hash.slice(1)) } catch { return }
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(id)
      if (id.startsWith("project-")) {
        const details = target?.querySelector("details")
        if (details) details.open = true
      }
      target?.scrollIntoView({ behavior: "auto" })
    })
    return () => cancelAnimationFrame(frame)
  }, [])
  return <><About /><Process /><Projects /><EngineeringLab /><SkillsMatrix /><ContactFooter /></>
}
