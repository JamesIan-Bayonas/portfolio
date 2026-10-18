import { useState } from "react"
import { usePortfolioTheme } from "../lib/usePortfolioTheme"
import captures from "../data/dormfixTenantScreenshots.json"
import { dormfixTenantScreens, dormfixTenantCaptureIds, dormfixTenantShortcuts, type DormFixTenantScreenId } from "../data/dormfixTenantShowcase"
import ResponsiveScreenshot from "./ResponsiveScreenshot"
import ScreenshotPreview from "./ScreenshotPreview"
import "./CentraLogAdminShowcase.css"

export default function DormFixTenantShowcase() {
  const [selected, setSelected] = useState<DormFixTenantScreenId>("overview")
  const [overviewActions, setOverviewActions] = useState(false)
  const mode = usePortfolioTheme()
  const screen = dormfixTenantScreens.find(item => item.id === selected)!
  const captureId = selected === "overview" && overviewActions ? "overview-actions" : selected
  const asset = captures[`${captureId}-${mode}`]
  const detailAlt = "DormFix tenant Overview Dashboard lower section with Submit payment proof, Report an issue, Message landlord, and House rules shortcuts above active requests"
  const gallery = dormfixTenantCaptureIds.map(id => {
    const item = dormfixTenantScreens.find(screen => screen.id === (id === "overview-actions" ? "overview" : id))!
    const image = captures[`${id}-${mode}`]
    return {
      id, src: image.variants[image.variants.length - 1].src, width: image.width, height: image.height,
      alt: id === "overview-actions" ? detailAlt : item.alt,
      title: `DormFix · Tenant · ${id === "overview-actions" ? "Overview Dashboard: actions & active requests" : item.title} · ${mode} mode`,
      caption: id === "overview-actions" ? "The lower section of the same Overview Dashboard, with its four shortcuts and active requests." : item.summary,
    }
  })
  function choose(id: DormFixTenantScreenId) { setSelected(id); setOverviewActions(false) }
  return (
    <div id="tenant-showcase">
      <div className="admin-screen-picker" role="group" aria-label="Tenant screens">
        {dormfixTenantScreens.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls="tenant-screen-content" onClick={() => choose(item.id)}>
          <span className="font-mono">0{index + 1}</span>{item.title}
        </button>)}
      </div>
      {selected === "overview" && <>
        <div className="admin-screen-picker" role="group" aria-label="Tenant overview scroll positions">
          <button type="button" aria-pressed={!overviewActions} aria-controls="tenant-screen-content" onClick={() => setOverviewActions(false)}>Summary</button>
          <button type="button" aria-pressed={overviewActions} aria-controls="tenant-screen-content" onClick={() => setOverviewActions(true)}>Actions & active requests</button>
        </div>
        <div className="admin-screen-picker" role="group" aria-label="Overview Dashboard shortcuts">
          {dormfixTenantShortcuts.map(id => <button key={id} type="button" aria-controls="tenant-screen-content" onClick={() => choose(id)}>{dormfixTenantScreens.find(item => item.id === id)!.title} →</button>)}
        </div>
      </>}
      <div id="tenant-screen-content">
        <div className="admin-screen-heading">
          <h3>{screen.heading}</h3>
          <p className="font-mono" role="status">Tenant · {screen.title}{captureId === "overview-actions" ? " / lower section" : ""} · {mode === "dark" ? "Dark" : "Light"} screenshot</p>
        </div>
        <p className="admin-screen-summary">{screen.summary}</p>
        <figure className="admin-screen-figure">
          <ScreenshotPreview images={gallery} selectedId={captureId} label={`Inspect tenant ${screen.title}${captureId === "overview-actions" ? " lower section" : ""} screenshot`}>
            <ResponsiveScreenshot asset={asset} alt={`${captureId === "overview-actions" ? detailAlt : screen.alt} (${mode} mode)`} sizes="(min-width: 1520px) 1440px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 32px)" />
          </ScreenshotPreview>
          <figcaption>{captureId === "overview-actions" ? "Continuation of the Overview Dashboard after scrolling: four shortcuts and active requests. " : ""}Screenshots follow the portfolio theme. Select the image to zoom.</figcaption>
        </figure>
        <div className="admin-screen-guidance">
          {screen.guidance.map((item, index) => <article key={item.title}>
            <p className="font-mono">0{index + 1} / WHAT TO LOOK FOR</p><h4>{item.title}</h4><p>{item.text}</p>
          </article>)}
        </div>
        <div className="admin-screen-actions font-mono">
          {selected !== "overview" && <button type="button" onClick={() => { choose("overview"); setOverviewActions(true) }}>← Return to Overview Dashboard shortcuts</button>}
          {selected === "submit-payment" && <button type="button" onClick={() => choose("payments")}>Inspect payment history →</button>}
          {selected === "report-issue" && <button type="button" onClick={() => choose("maintenance")}>Inspect maintenance history →</button>}
          {selected === "payments" && <a href="#walkthrough">Try the sample receipt-review walkthrough ↓</a>}
        </div>
      </div>
    </div>
  )
}
