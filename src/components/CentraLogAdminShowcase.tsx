import { useState } from "react"
import { usePortfolioTheme } from "../lib/usePortfolioTheme"
import captures from "../data/centralogAdminScreenshots.json"
import { centralogAdminScreens, type CentraLogAdminScreenId } from "../data/centralogAdminShowcase"
import ResponsiveScreenshot from "./ResponsiveScreenshot"
import ScreenshotPreview from "./ScreenshotPreview"
import "./CentraLogAdminShowcase.css"

export default function CentraLogAdminShowcase() {
  const [selected, setSelected] = useState<CentraLogAdminScreenId>("overview")
  const mode = usePortfolioTheme()
  const screen = centralogAdminScreens.find(item => item.id === selected)!
  const asset = captures[`${selected}-${mode}`]
  const gallery = centralogAdminScreens.map(item => {
    const image = captures[`${item.id}-${mode}`]
    return {
      id: item.id, src: image.variants[image.variants.length - 1].src,
      width: image.width, height: image.height, alt: item.alt,
      title: `CentraLog · Admin · ${item.title} · ${mode} mode`, caption: item.summary,
    }
  })
  return (
    <section className="admin-showcase" id="admin-showcase" aria-labelledby="admin-showcase-title" lang="en">
      <div className="admin-showcase-heading">
        <div>
          <p className="project-eyebrow font-mono">CENTRALOG / ADMINISTRATOR WORKSPACE</p>
          <h2 id="admin-showcase-title">Explore the admin workspace.</h2>
          <p>Follow the asset from its inventory record to custody, valuation, and recorded history.</p>
        </div>
        <span className="admin-showcase-role font-mono">ROLE / SystemAdmin</span>
      </div>
      <p className="admin-showcase-context">Captured application screens. Use the screen buttons to explore; controls inside the images are not interactive. This tour shows the administrator workspace, without implying access for other roles.</p>
      <div className="admin-screen-picker" role="group" aria-label="Administrator screens">
        {centralogAdminScreens.map((item, index) => (
          <button key={item.id} type="button" aria-pressed={selected === item.id} aria-controls="admin-screen-content" onClick={() => setSelected(item.id)}>
            <span className="font-mono">0{index + 1}</span>{item.title}
          </button>
        ))}
      </div>
      <div id="admin-screen-content">
        <div className="admin-screen-heading">
          <h3>{screen.heading}</h3>
          <p className="font-mono" role="status">{screen.title} · {mode === "dark" ? "Dark" : "Light"} screenshot · follows portfolio theme</p>
        </div>
        <p className="admin-screen-summary">{screen.summary}</p>
        <figure className="admin-screen-figure">
          <ScreenshotPreview images={gallery} selectedId={selected} label={`Inspect admin ${screen.title} screenshot`}>
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
          {selected === "overview" && <button type="button" onClick={() => setSelected("asset-details")}>Next: inspect an asset →</button>}
          {selected === "asset-details" && <button type="button" onClick={() => setSelected("property-details")}>View the property details capture →</button>}
          {selected === "property-details" && <button type="button" onClick={() => setSelected("asset-details")}>← Return to the asset drawer capture</button>}
          {selected === "financial-ledger" && <a href="#lab">Try the sample valuation lab ↓</a>}
          {selected === "audit-log" && <a href="#centralog-test-evidence">Explore the test evidence ↓</a>}
        </div>
      </div>
    </section>
  )
}
