import { useRef, useState, type KeyboardEvent } from "react"
import { usePortfolioTheme } from "../lib/usePortfolioTheme"
import captures from "../data/isdalogWorkspaceScreenshots.json"
import { isdalogWorkspaceRoles, isdalogWorkspaceScreens, isdalogFishermanDetails, type IsdaLogWorkspaceRole } from "../data/isdalogWorkspaceShowcase"
import type { ScreenshotAsset } from "./ResponsiveScreenshot"
import ResponsiveScreenshot from "./ResponsiveScreenshot"
import ScreenshotPreview from "./ScreenshotPreview"
import "./CentraLogAdminShowcase.css"
import "./IsdaLogWorkspaceShowcase.css"

const assets: Record<string, ScreenshotAsset> = captures

function RoleScreens({ role }: { role: IsdaLogWorkspaceRole }) {
  const screens = isdalogWorkspaceScreens[role]
  const [selected, setSelected] = useState(screens[0].id)
  const [details, setDetails] = useState(false)
  const mode = usePortfolioTheme()
  const screen = screens.find(item => item.id === selected)!
  const lower = role === "fisherman" && details
  const captureId = lower ? isdalogFishermanDetails.id : selected
  const asset = assets[`${captureId}-${mode}`]
  const roleName = isdalogWorkspaceRoles.find(item => item.id === role)!.title
  const roleCaptures = role === "fisherman" ? [...screens, { ...isdalogFishermanDetails, summary: isdalogFishermanDetails.caption }] : screens
  const gallery = roleCaptures.map(item => {
    const image = assets[`${item.id}-${mode}`]
    return {
      id: item.id, src: image.variants[image.variants.length - 1].src, width: image.width, height: image.height,
      alt: item.alt, title: `IsdaLog · ${roleName} · ${item.title} · ${mode} mode`, caption: item.summary,
    }
  })
  const guidance = lower ? isdalogFishermanDetails.guidance : screen.guidance
  return <>
    <div className="admin-screen-picker" role="group" aria-label={`${roleName} screens`}>
      {screens.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls={`isdalog-${role}-content`} onClick={() => { setSelected(item.id); setDetails(false) }}>
        <span className="font-mono">0{index + 1}</span>{item.title}
      </button>)}
    </div>
    {role === "fisherman" && <div className="admin-screen-picker" role="group" aria-label="Fisherman dashboard scroll positions">
      <button type="button" aria-pressed={!details} aria-controls="isdalog-fisherman-content" onClick={() => setDetails(false)}>Overview</button>
      <button type="button" aria-pressed={details} aria-controls="isdalog-fisherman-content" onClick={() => setDetails(true)}>Sales, earnings & records</button>
    </div>}
    <div id={`isdalog-${role}-content`}>
      <div className="admin-screen-heading">
        <h3>{lower ? "Continue through sales, earnings, and catch history." : screen.heading}</h3>
        <p className="font-mono" role="status">{roleName} · {screen.title}{lower ? " / lower section" : ""} · {mode === "dark" ? "Dark" : "Light"} screenshot</p>
      </div>
      <p className="admin-screen-summary">{lower ? isdalogFishermanDetails.caption : screen.summary}</p>
      <figure className="admin-screen-figure">
        <ScreenshotPreview images={gallery} selectedId={captureId} label={`Inspect ${role} ${screen.title}${lower ? " lower section" : ""} screenshot`}>
          <ResponsiveScreenshot asset={asset} alt={`${lower ? isdalogFishermanDetails.alt : screen.alt} (${mode} mode)`} sizes="(min-width: 1520px) 1440px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 32px)" />
        </ScreenshotPreview>
        <figcaption>{lower ? "Lower section of the same fisherman dashboard. " : ""}Screenshots follow the portfolio theme. Select the image to zoom.</figcaption>
      </figure>
      <div className="admin-screen-guidance">
        {guidance.map((item, index) => <article key={item.title}>
          <p className="font-mono">0{index + 1} / WHAT TO LOOK FOR</p><h4>{item.title}</h4><p>{item.text}</p>
        </article>)}
      </div>
      <div className="admin-screen-actions font-mono">
        <a href="#walkthrough">Follow the sample catch-to-delivery walkthrough ↓</a>
      </div>
    </div>
  </>
}

export default function IsdaLogWorkspaceShowcase() {
  const [role, setRole] = useState<IsdaLogWorkspaceRole>("fisherman")
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const selectedRole = isdalogWorkspaceRoles.find(item => item.id === role)!
  function navigateRoles(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    if (event.key === "ArrowRight") next = (index + 1) % isdalogWorkspaceRoles.length
    else if (event.key === "ArrowLeft") next = (index + isdalogWorkspaceRoles.length - 1) % isdalogWorkspaceRoles.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = isdalogWorkspaceRoles.length - 1
    else return
    event.preventDefault()
    setRole(isdalogWorkspaceRoles[next].id)
    tabs.current[next]?.focus()
  }
  return <section className="admin-showcase isdalog-workspace" id="workspace-showcase" aria-labelledby="isdalog-workspace-title" lang="en">
    <div className="admin-showcase-heading">
      <div>
        <p className="project-eyebrow font-mono">ISDALOG / ROLE WORKSPACES</p>
        <h2 id="isdalog-workspace-title">Explore the maritime workspaces.</h2>
        <p>Switch roles to follow the captured fisherman, buyer, and rider views in one workspace.</p>
      </div>
      <span className="admin-showcase-role font-mono" role="status">ROLE / {selectedRole.title}</span>
    </div>
    <p className="admin-showcase-context">Captured application screens. Choose a role and screen to explore; controls inside the images are not interactive. Balances, delivery states, and codes reflect the captured example.</p>
    <div className="admin-screen-picker workspace-role-picker isdalog-role-tabs" role="tablist" aria-label="IsdaLog workspace role">
      {isdalogWorkspaceRoles.map((item, index) => <button key={item.id} ref={element => { tabs.current[index] = element }} type="button" role="tab" id={`isdalog-role-${item.id}`} aria-selected={role === item.id} aria-controls={`isdalog-panel-${item.id}`} tabIndex={role === item.id ? 0 : -1} onClick={() => setRole(item.id)} onKeyDown={event => navigateRoles(event, index)}>{item.title}</button>)}
    </div>
    <p className="workspace-role-summary">{selectedRole.title} · {selectedRole.summary}</p>
    {isdalogWorkspaceRoles.map(item => <div key={item.id} id={`isdalog-panel-${item.id}`} role="tabpanel" aria-labelledby={`isdalog-role-${item.id}`} hidden={role !== item.id} className="isdalog-role-panel">
      <RoleScreens role={item.id} />
    </div>)}
  </section>
}
