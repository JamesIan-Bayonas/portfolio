import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import DormFixLandlordShowcase from "./DormFixLandlordShowcase"
import DormFixTenantShowcase from "./DormFixTenantShowcase"
import "./DormFixWorkspaceShowcase.css"

type WorkspaceRole = "landlord" | "tenant"
const roles = ["landlord", "tenant"] as const

export default function DormFixWorkspaceShowcase() {
  const [role, setRole] = useState<WorkspaceRole>(() => window.location.hash === "#tenant-showcase" ? "tenant" : "landlord")
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const section = useRef<HTMLElement>(null)

  useEffect(() => {
    function followLegacyLink() {
      const hash = window.location.hash
      if (hash === "#tenant-showcase" || hash === "#landlord-showcase") {
        setRole(hash === "#tenant-showcase" ? "tenant" : "landlord")
        // Old shared role links now lead to the common selector.
        section.current?.scrollIntoView({ block: "start" })
      }
    }
    followLegacyLink()
    window.addEventListener("hashchange", followLegacyLink)
    return () => window.removeEventListener("hashchange", followLegacyLink)
  }, [])

  function navigateRoles(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") next = 1 - index
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = 1
    else return
    event.preventDefault()
    setRole(roles[next])
    tabs.current[next]?.focus()
  }

  return (
    <section ref={section} className="admin-showcase dormfix-workspace" id="workspace-showcase" aria-labelledby="dormfix-workspace-title" lang="en">
      <div className="admin-showcase-heading">
        <div>
          <p className="project-eyebrow font-mono">DORMFIX / ROLE WORKSPACES</p>
          <h2 id="dormfix-workspace-title">Explore the dormitory workspaces.</h2>
          <p>Choose a role to follow its dashboard and screen flow in this workspace.</p>
        </div>
        <span className="admin-showcase-role font-mono" role="status">ROLE / {role === "landlord" ? "Landlord" : "Tenant"}</span>
      </div>
      <p className="admin-showcase-context">Captured application screens. Choose a role and screen to explore; controls inside the images are not interactive. DormFix is a collaborative capstone; my contribution is described in the written case study.</p>
      <div className="admin-screen-picker workspace-role-picker dormfix-role-tabs" role="tablist" aria-label="DormFix workspace role">
        {roles.map((item, index) => <button key={item} ref={element => { tabs.current[index] = element }} type="button" role="tab" id={`dormfix-role-${item}`} aria-selected={role === item} aria-controls={`dormfix-panel-${item}`} tabIndex={role === item ? 0 : -1} onClick={() => setRole(item)} onKeyDown={event => navigateRoles(event, index)}>
          {item === "landlord" ? "Landlord" : "Tenant"}
        </button>)}
      </div>
      <p className="workspace-role-summary">{role === "landlord"
        ? "Landlord · Manage occupancy and tenant assignments, review receipts, follow maintenance, and publish dormitory guidance."
        : "Tenant · View your room and requests, submit payment proof, report an issue, message the landlord, and read house rules."}</p>
      <div id="dormfix-panel-landlord" role="tabpanel" aria-labelledby="dormfix-role-landlord" hidden={role !== "landlord"} className="dormfix-role-panel">
        <DormFixLandlordShowcase />
      </div>
      <div id="dormfix-panel-tenant" role="tabpanel" aria-labelledby="dormfix-role-tenant" hidden={role !== "tenant"} className="dormfix-role-panel">
        <DormFixTenantShowcase />
      </div>
    </section>
  )
}
