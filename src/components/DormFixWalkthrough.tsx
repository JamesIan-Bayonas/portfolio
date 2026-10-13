import { useReducer } from "react"
import {
  advanceReceiptReview,
  EXPECTED_RENT,
  initialReceiptReview,
  receiptFlags,
  receiptScenarios,
  type ReceiptScenario,
} from "../lib/dormfixWalkthrough"

const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})
const stages = [
  {
    title: "Submit the receipt",
    actor: "TENANT",
    description:
      "The tenant submits a payment screenshot for review. Choose a sample to see how different receipt details affect the process.",
    reason:
      "A submitted screenshot is a payment claim. It needs to be checked against the expected record before a landlord records a decision.",
  },
  {
    title: "Extract the text",
    actor: "OCR / TESSERACT",
    description:
      "Tesseract extracts text from the uploaded image. The text below is a fixed illustration of OCR output for this sample.",
    reason:
      "Text extraction can lose details when a receipt is blurred or cropped. A readable-looking output does not prove that the receipt is authentic.",
  },
  {
    title: "Parse structured fields",
    actor: "LOCAL MODEL / SCHEMA",
    description:
      "Local Ollama parsing turns extracted text into fields, with Zod checking the output structure. Here, those fields are predefined sample data.",
    reason:
      "A valid schema checks the shape of the result. It does not guarantee that the extracted amount, date, or reference is correct.",
  },
  {
    title: "Check and review",
    actor: "BUSINESS RULES / LANDLORD",
    description:
      "Compare the extracted amount with the expected rent and check for a date drift greater than seven days. The landlord then reviews the submitted evidence.",
    reason:
      "An anomaly is a reason to investigate. Matching these two checks also leaves authenticity and actual payment confirmation for review.",
  },
]

export default function DormFixWalkthrough() {
  const [state, dispatch] = useReducer(
    advanceReceiptReview,
    undefined,
    initialReceiptReview,
  )
  const receipt = receiptScenarios[state.scenario]
  const stage = stages[state.step]
  const flags = receiptFlags(receipt)
  const parsed = receipt.amount !== null && receipt.ageDays !== null

  return (
    <section
      id="walkthrough"
      className="isdalog-walkthrough"
      aria-labelledby="receipt-walkthrough-title"
    >
      <div className="project-section-heading">
        <div>
          <p className="project-eyebrow font-mono">GUIDED RECEIPT REVIEW</p>
          <h2 id="receipt-walkthrough-title">
            From a screenshot
            <br />
            to a review decision.
          </h2>
        </div>
        <p>
          Follow one payment claim through the tenant and landlord workflow.
          This simulation uses fixed sample data; it runs no OCR, model
          inference, or live payment updates.
        </p>
      </div>
      <div className="walkthrough-shell">
        <div className="walkthrough-bar font-mono">
          <span>DORMFIX / SAMPLE RENT PAYMENT</span>
          <button type="button" onClick={() => dispatch({ type: "reset" })}>
            Reset walkthrough ↺
          </button>
        </div>
        <div className="walkthrough-layout">
          <nav className="walkthrough-steps" aria-label="Receipt-review stages">
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
            <fieldset className="receipt-scenarios">
              <legend>Choose a sample receipt</legend>
              {(Object.keys(receiptScenarios) as ReceiptScenario[]).map(
                (scenario) => (
                  <label key={scenario}>
                    <input
                      type="radio"
                      name="receipt-scenario"
                      checked={state.scenario === scenario}
                      onChange={() => dispatch({ type: "select", scenario })}
                    />
                    {receiptScenarios[scenario].title}
                  </label>
                ),
              )}
            </fieldset>
            <p className="walkthrough-action-note">
              Changing the sample restarts its review. Sample review date: 13
              October 2026.
            </p>
            <div className="walkthrough-step-content">
              <p className="project-eyebrow font-mono">
                0{state.step + 1} / {stage.actor}
              </p>
              <h3>{stage.title}</h3>
              <p>{stage.description}</p>
            </div>
            {state.step < 2 ? (
              <figure className="receipt-paper">
                <figcaption className="font-mono">
                  {state.step === 0
                    ? "ILLUSTRATIVE RECEIPT CONTENT"
                    : "SAMPLE EXTRACTED TEXT"}
                </figcaption>
                <pre>{receipt.text}</pre>
              </figure>
            ) : (
              <div className="receipt-fields">
                <h4>
                  {parsed
                    ? "Sample structured fields"
                    : "Parsing needs manual review"}
                </h4>
                <dl>
                  <div>
                    <dt>Amount</dt>
                    <dd>
                      {receipt.amount === null
                        ? "Unavailable"
                        : money.format(receipt.amount)}
                    </dd>
                  </div>
                  <div>
                    <dt>Receipt age</dt>
                    <dd>
                      {receipt.ageDays === null
                        ? "Unavailable"
                        : `${receipt.ageDays} day(s)`}
                    </dd>
                  </div>
                  <div>
                    <dt>Reference</dt>
                    <dd>{receipt.reference ?? "Unavailable"}</dd>
                  </div>
                </dl>
                {!parsed && (
                  <p>
                    Required fields are missing. The simulation carries this
                    issue to landlord review rather than filling in guessed
                    values.
                  </p>
                )}
              </div>
            )}
            {state.step === 3 && (
              <div className="receipt-audit">
                <h4>
                  {flags.length ? "Review flags" : "No amount or date flags"}
                </h4>
                {flags.length ? (
                  <ul>
                    {flags.map((flag) => (
                      <li key={flag}>{flag}</li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    The extracted amount matches and the receipt is within seven
                    days of the sample review date.
                  </p>
                )}
                <p>
                  These checks do not establish receipt authenticity or confirm
                  that funds were received.
                </p>
              </div>
            )}
            <div className="walkthrough-controls">
              {state.step < 3 ? (
                <button
                  type="button"
                  className="walkthrough-primary"
                  onClick={() => dispatch({ type: "next" })}
                >
                  {
                    [
                      "Submit the sample receipt",
                      "Parse the sample text",
                      "Run the sample checks",
                    ][state.step]
                  }
                </button>
              ) : state.decision === null ? (
                <>
                  <p className="walkthrough-action-note">
                    After reviewing the evidence, choose a sample landlord
                    decision. No live ledger will change.
                  </p>
                  <div className="walkthrough-control-buttons">
                    <button
                      type="button"
                      className="walkthrough-primary"
                      onClick={() =>
                        dispatch({ type: "decide", decision: "verified" })
                      }
                    >
                      Record sample verification
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({ type: "decide", decision: "rejected" })
                      }
                    >
                      Record sample rejection
                    </button>
                  </div>
                </>
              ) : (
                <p className="walkthrough-feedback" role="status">
                  Sample landlord decision: {state.decision}. This decision was
                  made by the reviewer, not automatically by the model. Choose
                  another receipt to explore a different review.
                </p>
              )}
            </div>
            <div className="walkthrough-decision">
              <h4>Why this step matters</h4>
              <p>{stage.reason}</p>
            </div>
          </div>
        </div>
        <div className="walkthrough-ledger">
          <div>
            <span>Expected rent</span>
            <strong>{money.format(EXPECTED_RENT)}</strong>
          </div>
          <div>
            <span>Extracted amount</span>
            <strong>
              {state.step < 2
                ? "Pending"
                : receipt.amount === null
                  ? "Unreadable"
                  : money.format(receipt.amount)}
            </strong>
          </div>
          <div>
            <span>Review flags</span>
            <strong>{state.step < 3 ? "Pending" : flags.length}</strong>
          </div>
          <div>
            <span>Sample decision</span>
            <strong>{state.decision ?? "Pending"}</strong>
          </div>
        </div>
        <p className="walkthrough-ledger-note">
          Illustration of the documented OCR → local parsing → validation →
          review flow. All receipt references and amounts here are sample data.
        </p>
      </div>
    </section>
  )
}
