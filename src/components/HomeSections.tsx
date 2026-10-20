import { useEffect } from "react"
import About from "./About"
import HomeChapter from "./HomeChapter"
import SignatureIntroduction from "./SignatureIntroduction"
import PortfolioDirectory from "./PortfolioDirectory"
import RecentExploration from "./RecentExploration"
import SavedExploration from "./SavedExploration"
import Process from "./Process"
import Projects from "./Projects"
import EngineeringLab from "./EngineeringLab"
import SkillsMatrix from "./SkillsMatrix"
import ContactFooter from "./ContactFooter"

export default function HomeSections() {
  useEffect(() => {
    if (!window.location.hash) return
    let id: string
    try {
      id = decodeURIComponent(window.location.hash.slice(1))
    } catch {
      return
    }
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
  return (
    <>
      <SignatureIntroduction />
      <HomeChapter number="01" label="FOLLOW YOUR CURIOSITY"><PortfolioDirectory /></HomeChapter>
      <RecentExploration />
      <SavedExploration />
      <HomeChapter number="02" label="THE PERSON BEHIND THE SYSTEMS"><About /></HomeChapter>
      <Process />
      <HomeChapter number="03" label="IDEAS INTO WORKING SYSTEMS"><Projects /></HomeChapter>
      <EngineeringLab />
      <HomeChapter number="04" label="THE TOOLS BEHIND THE WORK"><SkillsMatrix /></HomeChapter>
      <ContactFooter />
    </>
  )
}
