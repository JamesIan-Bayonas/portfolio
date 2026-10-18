import { useState } from "react"
import { usePortfolioTheme } from "../lib/usePortfolioTheme"
import captures from "../data/dormfixLandlordScreenshots.json"
import { dormfixLandlordScreens, dormfixLandlordCaptureIds, type DormFixLandlordScreenId } from "../data/dormfixLandlordShowcase"
import ResponsiveScreenshot from "./ResponsiveScreenshot"
import ScreenshotPreview from "./ScreenshotPreview"
import "./CentraLogAdminShowcase.css"

export default function DormFixLandlordShowcase() {
  const [selected, setSelected] = useState<DormFixLandlordScreenId>("overview")
  const [overviewDetails, setOverviewDetails] = useState(false)
  const mode = usePortfolioTheme()
  const screen = dormfixLandlordScreens.find(item => item.id === selected)!
  const captureId = selected === "overview" && overviewDetails ? "overview-details" : selected
  const asset = captures[`${captureId}-${mode}`]
  const detailAlt = "DormFix overview lower section showing searchable room-status cards with occupancy and maintenance labels beside dated recent activity"
  const gallery = dormfixLandlordCaptureIds.map(id => {
    const item = dormfixLandlordScreens.find(screen => screen.id === (id === "overview-details" ? "overview" : id))!
    const image = captures[`${id}-${mode}`]
    return {
      id, src: image.variants[image.variants.length - 1].src, width: image.width, height: image.height,
      alt: id === "overview-details" ? detailAlt : item.alt,
      title: `DormFix · Landlord · ${id === "overview-details" ? "Overview: room status & activity" : item.title} · ${mode} mode`,
      caption: id === "overview-details" ? "The lower section of the same Overview page, continuing with room status and recent activity." : item.summary,
    }
  })
  function choose(id: DormFixLandlordScreenId) { setSelected(id); setOverviewDetails(false) }
  return (
    <div id="landlord-showcase">
      <div className="admin-screen-picker" role="group" aria-label="Landlord screens">
        {dormfixLandlordScreens.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls="landlord-screen-content" onClick={() => choose(item.id)}>
          <span className="font-mono">0{index + 1}</span>{item.title}
        </button>)}
      </div>
      {selected === "overview" && <div className="admin-screen-picker" role="group" aria-label="Overview scroll positions">
        <button type="button" aria-pressed={!overviewDetails} aria-controls="landlord-screen-content" onClick={() => setOverviewDetails(false)}>Summary</button>
        <button type="button" aria-pressed={overviewDetails} aria-controls="landlord-screen-content" onClick={() => setOverviewDetails(true)}>Room status & activity</button>
      </div>}
      <div id="landlord-screen-content">
        <div className="admin-screen-heading">
          <h3>{screen.heading}</h3>
          <p className="font-mono" role="status">Landlord · {screen.title}{captureId === "overview-details" ? " / lower section" : ""} · {mode === "dark" ? "Dark" : "Light"} screenshot</p>
        </div>
        <p className="admin-screen-summary">{screen.summary}</p>
        <figure className="admin-screen-figure">
          <ScreenshotPreview images={gallery} selectedId={captureId} label={`Inspect landlord ${screen.title}${captureId === "overview-details" ? " lower section" : ""} screenshot`}>
            <ResponsiveScreenshot asset={asset} alt={`${captureId === "overview-details" ? detailAlt : screen.alt} (${mode} mode)`} sizes="(min-width: 1520px) 1440px, (min-width: 1024px) calc(100vw - 80px), calc(100vw - 32px)" />
          </ScreenshotPreview>
          <figcaption>{captureId === "overview-details" ? "Continuation of Overview after scrolling: room status and recent activity. " : ""}Screenshots follow the portfolio theme. Select the image to zoom.</figcaption>
        </figure>
        <div className="admin-screen-guidance">
          {screen.guidance.map((item, index) => <article key={item.title}>
            <p className="font-mono">0{index + 1} / WHAT TO LOOK FOR</p><h4>{item.title}</h4><p>{item.text}</p>
          </article>)}
        </div>
        <div className="admin-screen-actions font-mono">
          {selected === "overview" && <button type="button" onClick={() => choose("rooms")}>Inspect the rooms capture →</button>}
          {selected === "rooms" && <button type="button" onClick={() => choose("overview")}>← Return to Overview</button>}
          {selected === "payments" && <a href="#walkthrough">Try the sample receipt-review walkthrough ↓</a>}
          {selected === "maintenance" && <button type="button" onClick={() => choose("messages")}>Inspect tenant communication →</button>}
        </div>
      </div>
    </div>
  )
}
