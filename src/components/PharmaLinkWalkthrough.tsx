import { useReducer, useState } from "react"
import {
  advanceSaleWalkthrough,
  initialSaleWalkthrough,
  SAMPLE_UNIT_PRICE,
} from "../lib/pharmalinkWalkthrough"

const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})
const stages = [
  {
    title: "Review inventory",
    actor: "PHARMACIST",
    description:
      "Start with ten units of a fictional inventory item priced at ₱25 each. Choose how many units to include in the sample sale.",
    reason:
      "Staff need available stock and expiration information before checkout. This example isolates stock accounting and provides no medicine or dispensing guidance.",
  },
  {
    title: "Review the sale",
    actor: "PHARMACIST",
    description:
      "The cart has not changed inventory. Record the sample sale, or simulate a failed checkout to see why related writes need to succeed together.",
    reason:
      "The project documentation describes the sale, line items, and stock deductions within an explicit PostgreSQL transaction. This browser example illustrates the intended all-or-nothing outcome; it executes no database transaction.",
  },
  {
    title: "Record and deduct",
    actor: "SALES HISTORY",
    description:
      "The sale is recorded and the units are deducted. To reverse the recorded sale, provide a reason for a separate sample void adjustment.",
    reason:
      "The current PharmaLink interface retains the original receipt and records an adjustment with an actor, time, and reason. A void restores the current recorded quantities once; it does not process payment or a refund.",
  },
  {
    title: "Void with a record",
    actor: "SALES HISTORY",
    description:
      "The original sale remains in the history. A separate void adjustment restores the units and sets the effective recorded sale total to zero.",
    reason:
      "Keeping the original record and its adjustment makes the change traceable. Repeating the completed sample action cannot restore the same stock a second time.",
  },
]

export default function PharmaLinkWalkthrough() {
  const [state, dispatch] = useReducer(
    advanceSaleWalkthrough,
    undefined,
    initialSaleWalkthrough,
  )
  const [fail, setFail] = useState(false)
  const [reason, setReason] = useState("")
  const stage = stages[state.step]
  function reset() {
    dispatch({ type: "reset" })
    setFail(false)
    setReason("")
  }
  return (
    <section
      id="walkthrough"
      className="isdalog-walkthrough"
      aria-labelledby="sale-walkthrough-title"
    >
      <div className="project-section-heading">
        <div>
          <p className="project-eyebrow font-mono">
            GUIDED SALE & INVENTORY FLOW
          </p>
          <h2 id="sale-walkthrough-title">
            Keep the sale
            <br />
            and stock together.
          </h2>
        </div>
        <p>
          Explore checkout and a recorded void using fictional inventory. This
          simulation makes no live stock changes, sales, payments, or refunds.
        </p>
      </div>
      <div className="walkthrough-shell">
        <div className="walkthrough-bar font-mono">
          <span>PHARMALINK / FICTIONAL ITEM PL-DEMO-01</span>
          <button type="button" onClick={reset}>
            Reset walkthrough ↺
          </button>
        </div>
        <div className="walkthrough-layout">
          <nav
            className="walkthrough-steps"
            aria-label="Sale and inventory stages"
          >
            <p className="project-eyebrow font-mono">
              STEP {state.step + 1} OF 4
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
              <h4>Sample cart and sale</h4>
              <dl>
                <div>
                  <dt>Units in cart</dt>
                  <dd>{state.quantity}</dd>
                </div>
                <div>
                  <dt>Unit price</dt>
                  <dd>{money.format(SAMPLE_UNIT_PRICE)}</dd>
                </div>
                <div>
                  <dt>Cart total</dt>
                  <dd>{money.format(state.quantity * SAMPLE_UNIT_PRICE)}</dd>
                </div>
                <div>
                  <dt>Record status</dt>
                  <dd>{state.status}</dd>
                </div>
              </dl>
            </div>
            <div className="walkthrough-controls">
              {state.step === 0 && (
                <>
                  <div className="walkthrough-handshake">
                    <label htmlFor="sample-sale-quantity">
                      Sample quantity (1–10)
                    </label>
                    <input
                      id="sample-sale-quantity"
                      type="number"
                      min="1"
                      max="10"
                      step="1"
                      value={state.quantity}
                      onChange={(event) =>
                        dispatch({
                          type: "quantity",
                          quantity: Number(event.target.value),
                        })
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className="walkthrough-primary"
                    onClick={() => dispatch({ type: "review" })}
                  >
                    Review the sample cart
                  </button>
                </>
              )}
              {state.step === 1 && (
                <>
                  <label className="walkthrough-timeout">
                    <input
                      type="checkbox"
                      checked={fail}
                      onChange={(event) => setFail(event.target.checked)}
                    />
                    Simulate a checkout failure
                  </label>
                  <button
                    type="button"
                    className="walkthrough-primary"
                    onClick={() => dispatch({ type: "checkout", fail })}
                  >
                    Record the sample sale
                  </button>
                </>
              )}
              {state.step === 2 && (
                <form
                  className="walkthrough-handshake"
                  onSubmit={(event) => {
                    event.preventDefault()
                    dispatch({ type: "void", reason })
                  }}
                >
                  <label htmlFor="sample-void-reason">
                    Reason for the sample void
                  </label>
                  <textarea
                    id="sample-void-reason"
                    rows={3}
                    minLength={3}
                    maxLength={500}
                    required
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                  />
                  <p className="walkthrough-action-note">
                    This records an inventory adjustment, not a refund.
                  </p>
                  <button type="submit" className="walkthrough-primary">
                    Record sample void & restore stock
                  </button>
                </form>
              )}
              {state.step === 3 && (
                <p className="walkthrough-feedback" role="status">
                  Sample void recorded. Stock is restored once and the original
                  sale remains visible. Reset to explore another checkout.
                </p>
              )}
            </div>
            {state.error && (
              <p
                className="walkthrough-feedback walkthrough-feedback-error"
                role="alert"
              >
                {state.error}
              </p>
            )}
            <div className="walkthrough-decision">
              <h4>Why this step matters</h4>
              <p>{stage.reason}</p>
            </div>
            <div className="asset-history">
              <h4>Sample sale history</h4>
              {state.history.length ? (
                <ol>
                  {state.history.map((entry, index) => (
                    <li key={entry}>
                      <span className="font-mono">0{index + 1}</span>
                      <p>{entry}</p>
                    </li>
                  ))}
                </ol>
              ) : (
                <p>No sale recorded yet.</p>
              )}
              <a
                className="asset-lab-link font-mono"
                href="https://github.com/JamesIan-Bayonas/pharmalink/blob/main/src/features/sales/SaleAdjustmentModal.tsx"
                target="_blank"
                rel="noopener noreferrer"
              >
                View the adjustment interface source ↗
              </a>
            </div>
          </div>
        </div>
        <div className="walkthrough-ledger">
          <div>
            <span>Units available</span>
            <strong>{state.stock}</strong>
          </div>
          <div>
            <span>Original sale total</span>
            <strong>{money.format(state.originalTotal)}</strong>
          </div>
          <div>
            <span>Effective sale total</span>
            <strong>{money.format(state.effectiveTotal)}</strong>
          </div>
          <div>
            <span>Record status</span>
            <strong>{state.status}</strong>
          </div>
        </div>
        <p className="walkthrough-ledger-note">
          Sample inventory accounting only. The original record remains after a
          void; no payment gateway or refund is involved.
        </p>
      </div>
    </section>
  )
}
