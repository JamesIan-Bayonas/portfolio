import { useId } from "react"
import type { AssetWalkthroughState } from "../lib/centralogWalkthrough"
import "./AssetLifecycle.css"

const milestones = [
  { label: "Procured", step: 0 },
  { label: "Active", step: 1 },
  { label: "In repair", step: 3 },
  { label: "Restored", step: 4 },
] as const

export default function AssetLifecycle({
  state,
}: {
  state: AssetWalkthroughState
}) {
  const id = useId()
  const transferred = state.step >= 2
  const repairing = state.lifecycle === "In Maintenance"
  const resolved = state.step >= 4
  const current = resolved ? 3 : repairing ? 2 : state.step >= 1 ? 1 : 0
  const summary = [
    "The registered laptop starts in the receiving room with the inventory team.",
    "Activation puts the laptop in the active fleet. Its location and custodian stay the same.",
    "The transfer updates location, custodian, and history together. The laptop remains active.",
    "Maintenance takes the laptop out of active use. Its assigned location and custodian are retained.",
    "Repair resolution restores active use and retains a completed 30-day repair window and custody history.",
    "Reporting reads the existing record. It adds no history entry and leaves custody and repair time unchanged.",
  ][state.step]

  return (
    <figure
      className="asset-lifecycle"
      aria-labelledby={`${id}-title`}
      data-asset-step={state.step}
    >
      <figcaption id={`${id}-title`} className="asset-lifecycle-caption">
        <span className="font-mono">ONE ASSET · CONNECTED RECORDS</span>
        <span>CL-DEMO-01 / sample laptop</span>
      </figcaption>
      <ol className="asset-lifecycle-track" aria-label="Sample asset lifecycle">
        {milestones.map((milestone, index) => (
          <li
            key={milestone.label}
            data-reached={state.step >= milestone.step}
            aria-current={index === current ? "step" : undefined}
          >
            <span className="asset-lifecycle-node" aria-hidden="true">
              0{index + 1}
            </span>
            <strong>{milestone.label}</strong>
            <small>
              {index === current
                ? "Current"
                : index < current
                  ? "Recorded"
                  : "Upcoming"}
            </small>
          </li>
        ))}
      </ol>
      <div className="asset-lifecycle-grid" key={state.step}>
        <section
          className="asset-lifecycle-card asset-lifecycle-equipment"
          aria-labelledby={`${id}-asset`}
        >
          <svg
            className="asset-lifecycle-laptop"
            viewBox="0 0 120 76"
            fill="none"
            aria-hidden="true"
          >
            <rect x="22" y="6" width="76" height="50" rx="4" />
            <path d="M28 13H92V49H28ZM22 56L9 67V70H111V67L98 56M49 63H71" />
            <path
              className="asset-lifecycle-screen"
              pathLength="1"
              d="M45 31L55 40L76 22"
            />
          </svg>
          <h4 id={`${id}-asset`}>Current sample asset</h4>
          <p className="asset-lifecycle-value font-mono">{state.lifecycle}</p>
          <p>
            {repairing
              ? "Out of active use during repair."
              : state.step === 0
                ? "Registered and awaiting activation."
                : "Available in the active fleet."}
          </p>
        </section>
        <div className="asset-lifecycle-link" aria-hidden="true">
          <svg viewBox="0 0 40 24" fill="none">
            <path d="M0 12H36M29 5L36 12L29 19" />
            {state.step === 2 && (
              <path
                className="asset-lifecycle-signal"
                pathLength="1"
                d="M0 12H36"
              />
            )}
          </svg>
        </div>
        <section
          className="asset-lifecycle-card asset-lifecycle-custody"
          aria-labelledby={`${id}-custody`}
        >
          <h4 id={`${id}-custody`}>Location & custodian</h4>
          <dl>
            <div>
              <dt>Assigned location</dt>
              <dd>{state.location}</dd>
            </div>
            <div>
              <dt>Assigned custodian</dt>
              <dd>{state.custodian}</dd>
            </div>
          </dl>
          <p>
            {transferred
              ? "Transfer recorded. Maintenance preserves this assignment."
              : "Initial assignment retained until transfer."}
          </p>
        </section>
        <div className="asset-lifecycle-link" aria-hidden="true">
          <svg viewBox="0 0 40 24" fill="none">
            <path d="M0 12H36M29 5L36 12L29 19" />
            {(state.step === 3 || state.step === 4) && (
              <path
                className="asset-lifecycle-signal"
                pathLength="1"
                d="M0 12H36"
              />
            )}
          </svg>
        </div>
        <section
          className="asset-lifecycle-card asset-lifecycle-maintenance"
          aria-labelledby={`${id}-repair`}
        >
          <h4 id={`${id}-repair`}>Repair window</h4>
          <p className="asset-lifecycle-value font-mono">
            {resolved ? "Resolved" : repairing ? "Open" : "Not opened"}
          </p>
          <dl>
            <div>
              <dt>Completed repair time</dt>
              <dd>{state.repairDays} days</dd>
            </div>
          </dl>
          <p>
            {resolved
              ? "The completed window stays available for valuation."
              : repairing
                ? "Resolve the sample window to record its 30 days."
                : "No completed repair time is recorded."}
          </p>
        </section>
      </div>
      <div className="asset-lifecycle-summary" role="status" aria-atomic="true">
        <span className="font-mono">
          {state.history.length} history{" "}
          {state.history.length === 1 ? "entry" : "entries"} ·{" "}
          {state.step === 5 ? "Report reviewed" : "Current sample state"}
        </span>
        <p>{summary}</p>
      </div>
    </figure>
  )
}
