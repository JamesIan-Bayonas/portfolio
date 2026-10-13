import { useReducer } from "react"
import {
  advanceAssetWalkthrough,
  initialAssetWalkthrough,
} from "../lib/centralogWalkthrough"

const stages = [
  {
    title: "Register the asset",
    actor: "INVENTORY STAFF",
    description:
      "A sample laptop begins in the receiving room with a procurement record and an assigned custodian.",
    reason:
      "The asset record connects physical equipment with its purchase and custody information.",
    action: "Activate the sample asset",
    type: "activate",
  },
  {
    title: "Activate for use",
    actor: "INVENTORY STAFF",
    description:
      "The laptop is now in the active fleet. Move it to the computer lab and assign its next custodian.",
    reason:
      "CentraLog groups location, custodian, and audit-log updates inside a transaction. This example shows one asset from that transfer workflow.",
    action: "Transfer to the computer lab",
    type: "transfer",
  },
  {
    title: "Transfer with a record",
    actor: "MANAGER",
    description:
      "The location and custodian have changed together. The history records the transfer, making the handoff visible.",
    reason:
      "A location update alone would lose the custody story. The corresponding audit entry lets staff follow where the asset went.",
    action: "Open sample maintenance",
    type: "repair",
  },
  {
    title: "Track maintenance",
    actor: "INVENTORY STAFF",
    description:
      "The asset is in maintenance. Resolve a sample 30-day repair window to restore it to active use.",
    reason:
      "A repair window records time out of service. CentraLog's valuation policy uses these timestamps to adjust depreciable time; opening the same maintenance loop again should not create a duplicate.",
    action: "Resolve the 30-day sample repair",
    type: "resolve",
  },
  {
    title: "Restore active use",
    actor: "INVENTORY STAFF",
    description:
      "The laptop is active again. Its location and custodian are preserved, and the completed repair window remains in its history.",
    reason:
      "Repair resolution changes the lifecycle state while retaining the maintenance record used by later valuation calculations.",
    action: "Review the sample report",
    type: "report",
  },
  {
    title: "Review and calculate",
    actor: "ACCOUNTANT",
    description:
      "The history now connects registration, activation, custody, and maintenance. Explore the valuation lab below to compare straight-line and double-declining calculations.",
    reason:
      "CentraLog calculates valuation from asset and maintenance records on read. The lab uses independent sample inputs to illustrate that application policy, rather than a live financial ledger.",
    action: "",
    type: "report",
  },
] as const

export default function CentraLogWalkthrough() {
  const [state, dispatch] = useReducer(
    advanceAssetWalkthrough,
    undefined,
    initialAssetWalkthrough,
  )
  const stage = stages[state.step]
  return (
    <section
      id="walkthrough"
      className="isdalog-walkthrough"
      aria-labelledby="asset-walkthrough-title"
    >
      <div className="project-section-heading">
        <div>
          <p className="project-eyebrow font-mono">GUIDED ASSET LIFECYCLE</p>
          <h2 id="asset-walkthrough-title">
            Know where it is.
            <br />
            Keep its history.
          </h2>
        </div>
        <p>
          Follow a sample laptop from procurement through a transfer and repair.
          This browser simulation illustrates the workflow; it does not update
          live inventory or execute database transactions.
        </p>
      </div>
      <div className="walkthrough-shell">
        <div className="walkthrough-bar font-mono">
          <span>CENTRALOG / SAMPLE LAPTOP CL-DEMO-01</span>
          <button type="button" onClick={() => dispatch({ type: "reset" })}>
            Reset walkthrough ↺
          </button>
        </div>
        <div className="walkthrough-layout">
          <nav
            className="walkthrough-steps"
            aria-label="Asset lifecycle stages"
          >
            <p className="project-eyebrow font-mono">
              STEP {state.step + 1} OF 6
            </p>
            <ol>
              {stages.map((item, index) => (
                <li key={item.title}>
                  <div
                    className={`receipt-stage ${
                      index === state.step ? "receipt-stage-current" : ""
                    }`}
                    aria-current={index === state.step ? "step" : undefined}
                  >
                    <span className="font-mono">0{index + 1}</span>
                    <span>
                      <strong>{item.title}</strong>
                      <small>
                        {index < state.step
                          ? "Completed"
                          : index === state.step
                            ? "Current step"
                            : "Upcoming"}
                      </small>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
          <div className="walkthrough-main">
            <div className="walkthrough-step-content">
              <p className="project-eyebrow font-mono">
                0{state.step + 1} / {stage.actor}
              </p>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </div>
            <div className="receipt-fields">
              <h4>Current sample asset record</h4>
              <dl>
                <div>
                  <dt>Lifecycle</dt>
                  <dd>{state.lifecycle}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{state.location}</dd>
                </div>
                <div>
                  <dt>Custodian</dt>
                  <dd>{state.custodian}</dd>
                </div>
                <div>
                  <dt>Completed repair time</dt>
                  <dd>{state.repairDays} days</dd>
                </div>
              </dl>
            </div>
            <div className="walkthrough-controls">
              {state.step < 5 ? (
                <button
                  type="button"
                  className="walkthrough-primary"
                  onClick={() => dispatch({ type: stage.type })}
                >
                  {stage.action}
                </button>
              ) : (
                <>
                  <p className="walkthrough-feedback" role="status">
                    Sample lifecycle complete. Reporting preserves the custody
                    and maintenance records.
                  </p>
                  <a className="asset-lab-link font-mono" href="#lab">
                    Explore the valuation lab ↓
                  </a>
                </>
              )}
            </div>
            <div className="walkthrough-decision">
              <h4>Why this step matters</h4>
              <p>{stage.reason}</p>
            </div>
            <div className="asset-history">
              <h4>Sample record history</h4>
              <ol>
                {state.history.map((entry, index) => (
                  <li key={entry}>
                    <span className="font-mono">0{index + 1}</span>
                    <p>{entry}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
