import { useMemo, useState } from "react"
import captures from "../data/cpatsScreenshots.json"
import type { ScreenshotAsset } from "./ResponsiveScreenshot"
import type { GalleryScreenshot } from "./ScreenshotViewer"
import ResponsiveScreenshot from "./ResponsiveScreenshot"
import ScreenshotPreview from "./ScreenshotPreview"
import ExplorationNext from "./ExplorationNext"
import "./CpatsCaseStudy.css"

type Capture = (typeof captures)[number]

const workflowRoles = [
  "Requesting Office",
  "Business Office",
  "Admin Office",
  "Purchasing Office",
  "Receiving Custodian",
]

const roleDescriptions: Record<string, string> = {
  "Sign in": "The staff entry point and a short preview of how a purchase record moves through the system.",
  "Requesting Office": "Create and track requests for a department, with role-specific help.",
  "Business Office": "Review necessity and budget, retain evaluation history, and record financial clearance.",
  "Admin Office": "Review requisitions, confirm required authorizations, and preserve decisions for later reference.",
  "Purchasing Office": "Prepare purchase orders, monitor later stages, report monthly activity, and inspect asset records.",
  "Receiving Custodian": "Attach invoice and delivery evidence, record inspection results, and review completed reports.",
  "Global Auditor": "Inspect the procurement ledger and asset register through read-only views.",
  "System Administrator": "Maintain department records and staff accounts, including invitations and eligible access actions.",
}

function screenshotAsset(capture: Capture): ScreenshotAsset {
  return {
    width: capture.width,
    height: capture.height,
    variants: capture.variants.map(({ src, width }) => ({ src, width })),
  }
}

function galleryImage(capture: Capture): GalleryScreenshot {
  return {
    id: capture.id,
    src: capture.original,
    width: capture.width,
    height: capture.height,
    alt: capture.alt,
    title: `CPATS · ${capture.role} · ${capture.title}`,
    caption: capture.caption,
  }
}

export default function CpatsCaseStudy() {
  const images = useMemo(() => captures.map(galleryImage), [])
  const roles = useMemo(() => {
    const grouped = new Map<string, Capture[]>()
    for (const capture of captures) {
      const group = grouped.get(capture.role) ?? []
      group.push(capture)
      grouped.set(capture.role, group)
    }
    return [...grouped.entries()].filter(([role]) => role !== "Sign in")
  }, [])
  const [selectedRole, setSelectedRole] = useState("Requesting Office")
  const [selectedCaptureId, setSelectedCaptureId] = useState("02-request-new")
  const selectedRoleCaptures = roles.find(([role]) => role === selectedRole)?.[1] ?? []
  const selectedCapture = selectedRoleCaptures.find(({ id }) => id === selectedCaptureId) ?? selectedRoleCaptures[0]
  const oversightRoles = roles.filter(([role]) => !workflowRoles.includes(role))
  const hero = captures.find((capture) => capture.id === "01-login")!

  return (
    <article className="cpats-page px-4 sm:px-6 lg:px-10">
      <div className="cpats-page-inner">
        <nav className="case-study-breadcrumb font-mono" aria-label="Breadcrumb">
          <a href="/explore/">← Explore projects</a>
          <span aria-hidden="true">/</span>
          <span>Other notable projects</span>
          <span aria-hidden="true">/</span>
          <span>CPATS</span>
        </nav>

        <header className="cpats-hero" id="overview">
          <figure className="cpats-hero-visual">
            <ScreenshotPreview images={images} selectedId={hero.id} label="Inspect the CPATS staff sign-in screenshot">
              <ResponsiveScreenshot asset={screenshotAsset(hero)} alt={hero.alt} sizes="(min-width: 1100px) 54vw, 100vw" loading="eager" />
            </ScreenshotPreview>
            <figcaption className="font-mono">CPATS / Staff sign in</figcaption>
          </figure>
          <div className="cpats-hero-copy">
            <p className="project-eyebrow font-mono">OTHER NOTABLE PROJECTS / SCHOOL CAPSTONE</p>
            <h1>CPATS</h1>
            <p className="cpats-full-name">Campus Procurement Automation &amp; Tracking System</p>
            <p className="cpats-intro">
              I built CPATS as a school capstone for DMC College Foundation, Inc. A shared
              procurement record connects a department request to fiscal review, executive
              authorization, purchase-order processing, delivery, and audit.
            </p>
            <dl className="cpats-project-facts">
              <div><dt>Project context</dt><dd>DMC school capstone</dd></div>
              <div><dt>Workflow scope</dt><dd>Seven role-based workspaces</dd></div>
              <div><dt>Demo link</dt><dd>Not supplied</dd></div>
            </dl>
            <div className="cpats-hero-links font-mono">
              <a href="#workflow">Follow the workflow ↓</a>
              <a href="#screenshots">Browse role screens ↓</a>
            </div>
          </div>
        </header>

        <aside className="cpats-demo-note" aria-label="Demonstration data note">
          <span aria-hidden="true">i</span>
          <p>
            CPATS is shown in its current light interface; this portfolio page follows the
            visitor's theme. These captures show the demonstration environment, including
            sample records and role account identifiers. Passwords are not displayed, and
            the screenshots do not provide sign-in access.
          </p>
        </aside>

        <section className="cpats-gallery" id="screenshots" aria-labelledby="cpats-gallery-title">
          <div className="cpats-section-heading">
            <p className="project-eyebrow font-mono">25 CAPTURES / 7 ROLES</p>
            <h2 id="cpats-gallery-title">Explore the workspaces.</h2>
            <p>Select a processing office to see its workspace. The arrows show the request path; the auditor and administrator support the process across roles.</p>
          </div>
          <ol className="cpats-role-flow" aria-label="Procurement workflow offices">
            {workflowRoles.map((role, index) => (
              <li key={role}>
                <button type="button" aria-pressed={selectedRole === role} onClick={() => { setSelectedRole(role); setSelectedCaptureId(roles.find(([name]) => name === role)?.[1][0]?.id ?? "") }}>
                  <span className="cpats-role-step font-mono">{String(index + 1).padStart(2, "0")}</span>
                  {role}
                </button>
                {index < workflowRoles.length - 1 && <span className="cpats-flow-arrow" aria-hidden="true">→</span>}
              </li>
            ))}
          </ol>
          <div className="cpats-oversight-switcher" role="group" aria-label="Supporting workspaces">
            <span className="project-eyebrow font-mono">SUPPORTING ROLES</span>
            {oversightRoles.map(([role, roleCaptures]) => (
              <button key={role} type="button" aria-pressed={selectedRole === role} onClick={() => { setSelectedRole(role); setSelectedCaptureId(roleCaptures[0]?.id ?? "") }}>
                {role}
              </button>
            ))}
          </div>
          {selectedCapture && (
            <section key={selectedRole} className="cpats-role-workspace" aria-labelledby="cpats-selected-role" aria-live="polite">
              <div className="cpats-role-heading">
                <p className="project-eyebrow font-mono">{String(selectedRoleCaptures.length).padStart(2, "0")} SCREENS</p>
                <h3 id="cpats-selected-role">{selectedRole}</h3>
                <p>{roleDescriptions[selectedRole]}</p>
              </div>
              <div className="cpats-screen-tabs" role="group" aria-label={`Choose a ${selectedRole} screen`}>
                {selectedRoleCaptures.map((capture, index) => (
                  <button key={capture.id} type="button" aria-pressed={selectedCapture.id === capture.id} onClick={() => setSelectedCaptureId(capture.id)}>
                    <span className="font-mono">{String(index + 1).padStart(2, "0")}</span>{capture.title}
                  </button>
                ))}
              </div>
              <figure key={selectedCapture.id} className="cpats-capture cpats-active-capture interactive-surface" aria-label={selectedCapture.title}>
                <ScreenshotPreview images={images} selectedId={selectedCapture.id} label={`Inspect ${selectedRole}: ${selectedCapture.title}`}>
                  <ResponsiveScreenshot asset={screenshotAsset(selectedCapture)} alt={selectedCapture.alt} sizes="(min-width: 1280px) 1120px, calc(100vw - 48px)" />
                </ScreenshotPreview>
                <figcaption>
                  <strong>{selectedCapture.title}</strong>
                  <span>{selectedCapture.caption}</span>
                </figcaption>
              </figure>
            </section>
          )}
        </section>

        <section className="cpats-workflow" id="workflow" aria-labelledby="cpats-workflow-title">
          <div className="cpats-section-heading">
            <p className="project-eyebrow font-mono">SIX STAGES / SEVEN ROLES</p>
            <h2 id="cpats-workflow-title">From request to receiving record.</h2>
            <p>The proposed cycle is implemented as role-specific queues and histories, with procurement stages visible as the request moves forward.</p>
          </div>
          <p className="cpats-flow-summary">
            Requesting Office <span aria-hidden="true">→</span> Business Office <span aria-hidden="true">→</span> Admin Office <span aria-hidden="true">→</span> Purchasing Office <span aria-hidden="true">→</span> Receiving Custodian
          </p>
          <p className="cpats-flow-footnote">After purchase-order preparation, the Business Office records financial clearance before delivery inspection.</p>
        </section>

        <section className="cpats-blueprint" aria-labelledby="cpats-blueprint-title">
          <div>
            <p className="project-eyebrow font-mono">BLUEPRINT CONTEXT</p>
            <h2 id="cpats-blueprint-title">The screens follow the proposed purchasing cycle.</h2>
          </div>
          <div className="cpats-blueprint-copy">
            <p>
              The supplied blueprint describes request submission, Business Office checks,
              Admin Office authorization, purchase-order processing, receiving inspection,
              and monitoring. Those stages are visible across the supplied role screens.
            </p>
            <p>
              It also proposes optional approval by mobile notification, a shortcut for
              requests with previously approved letters, and forwarding completed
              receiving documents to Accounting. The screenshots do not demonstrate those
              specific paths, so this page presents them as blueprint context rather than
              confirmed features.
            </p>
          </div>
        </section>

        <ExplorationNext context="projects" />
      </div>
    </article>
  )
}
