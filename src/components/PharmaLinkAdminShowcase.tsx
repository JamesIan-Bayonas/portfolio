import { useState } from "react"
import { usePortfolioTheme } from "../lib/usePortfolioTheme"
import captures from "../data/pharmalinkAdminScreenshots.json"
import pharmacistCaptures from "../data/pharmalinkPharmacistScreenshots.json"
import { pharmalinkAdminScreens, type PharmaLinkAdminScreenId } from "../data/pharmalinkAdminShowcase"
import { pharmalinkPharmacistScreens, pharmacistScreenSelection, type PharmaLinkWorkspaceRole } from "../data/pharmalinkPharmacistShowcase"
import type { ScreenshotAsset } from "./ResponsiveScreenshot"
import ResponsiveScreenshot from "./ResponsiveScreenshot"
import ScreenshotPreview from "./ScreenshotPreview"
import "./CentraLogAdminShowcase.css"

export default function PharmaLinkAdminShowcase() {
  const [role, setRole] = useState<PharmaLinkWorkspaceRole>("admin")
  const [selected, setSelected] = useState<PharmaLinkAdminScreenId>("overview")
  const mode = usePortfolioTheme()
  const screens = role === "admin" ? pharmalinkAdminScreens : pharmalinkPharmacistScreens
  const roleName = role === "admin" ? "Admin" : "Pharmacist"
  const roleCaptures: Record<string, ScreenshotAsset> = role === "admin" ? captures : pharmacistCaptures
  const screen = screens.find(item => item.id === selected)!
  const asset = roleCaptures[`${selected}-${mode}`]
  function chooseRole(next: PharmaLinkWorkspaceRole) {
    if (next === "pharmacist") setSelected(pharmacistScreenSelection(selected))
    setRole(next)
  }
  const gallery = screens.map(item => {
    const image = roleCaptures[`${item.id}-${mode}`]
    return {
      id: item.id, src: image.variants[image.variants.length - 1].src,
      width: image.width, height: image.height, alt: item.alt,
      title: `PharmaLink · ${roleName} · ${item.title} · ${mode} mode`, caption: item.summary,
    }
  })
  return (
    <section className="admin-showcase" id="admin-showcase" aria-labelledby="admin-showcase-title" lang="en">
      <div className="admin-showcase-heading">
        <div>
          <p className="project-eyebrow font-mono">PHARMALINK / ROLE-BASED WORKSPACES</p>
          <h2 id="admin-showcase-title">Explore the pharmacy workspaces.</h2>
          <p>Compare the admin's operational and staff controls with the pharmacist's daily-work interface.</p>
        </div>
        <span className="admin-showcase-role font-mono">ROLE / {roleName}</span>
      </div>
      <p className="admin-showcase-context">Captured application screens using sample data. Choose a role and screen to explore; controls inside the images are not interactive.</p>
      <div className="admin-screen-picker workspace-role-picker" role="group" aria-label="Workspace role">
        <button type="button" aria-pressed={role === "admin"} aria-controls="admin-screen-content" onClick={() => chooseRole("admin")}>Admin</button>
        <button type="button" aria-pressed={role === "pharmacist"} aria-controls="admin-screen-content" onClick={() => chooseRole("pharmacist")}>Pharmacist</button>
      </div>
      <p className="workspace-role-summary">{role === "admin"
        ? "Admin captures include stock maintenance, staff management, and receipt correction and void entry points."
        : "Pharmacist captures show sale preparation, receipt viewing, and personal profile settings. Sales rows show View only; staff administration links are absent. The overview assigns medicine changes and restocking to an administrator."}</p>
      <div className="admin-screen-picker" role="group" aria-label={`${roleName} screens`}>
        {screens.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls="admin-screen-content" onClick={() => setSelected(item.id)}>
            <span className="font-mono">0{index + 1}</span>{item.title}
          </button>
        ))}
      </div>
      <div id="admin-screen-content">
        <div className="admin-screen-heading">
          <h3>{screen.heading}</h3>
          <p className="font-mono" role="status">{roleName} · {screen.title} · {mode === "dark" ? "Dark" : "Light"} screenshot · follows portfolio theme</p>
        </div>
        <p className="admin-screen-summary">{screen.summary}</p>
        <figure className="admin-screen-figure">
          <ScreenshotPreview key={role} images={gallery} selectedId={selected} label={`Inspect ${role} ${screen.title} screenshot`}>
            <ResponsiveScreenshot asset={asset} alt={`${screen.alt} (${mode} mode)`} sizes="(min-width: 1520px) 1440px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 32px)" />
          </ScreenshotPreview>
          <figcaption>{screen.summary} Select the image to zoom and inspect the original capture.</figcaption>
        </figure>
        <div className="admin-screen-guidance">
          {screen.guidance.map((item, index) => <article key={item.title}>
            <p className="font-mono">0{index + 1} / WHAT TO LOOK FOR</p>
            <h4>{item.title}</h4><p>{item.text}</p>
          </article>)}
        </div>
        <div className="admin-screen-actions font-mono">
          {selected === "overview" && <button type="button" onClick={() => setSelected("pos")}>Next: inspect the POS capture →</button>}
          {selected === "pos" && <a href="#walkthrough">Try the sample sale and stock walkthrough ↓</a>}
          {selected === "inventory" && <button type="button" onClick={() => setSelected("sales-history")}>Inspect recorded sales →</button>}
          {selected === "sales-history" && <a href="#walkthrough">Explore the separate sample sale walkthrough ↓</a>}
          {selected === "user-management" && <button type="button" onClick={() => setSelected("profile")}>Inspect the admin's profile →</button>}
          {selected === "profile" && role === "admin" && <button type="button" onClick={() => setSelected("user-management")}>← Return to staff administration</button>}
          {selected === "profile" && role === "pharmacist" && <button type="button" onClick={() => setSelected("overview")}>← Return to the pharmacist overview</button>}
        </div>
      </div>
    </section>
  )
}
