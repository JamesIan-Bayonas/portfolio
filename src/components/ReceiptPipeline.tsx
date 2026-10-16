import { useId } from "react"
import type { ReceiptReviewState, SampleReceipt } from "../lib/dormfixWalkthrough"
import "./ReceiptPipeline.css"

interface ReceiptPipelineProps {
  receipt: SampleReceipt
  state: ReceiptReviewState
}

const money = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" })

export default function ReceiptPipeline({ receipt, state }: ReceiptPipelineProps) {
  const id = useId()
  const extracted = state.step >= 1
  const structured = state.step >= 2
  const missing = receipt.amount === null || receipt.ageDays === null
  const fields = [
    { label: "Amount", value: receipt.amount === null ? "Unavailable" : money.format(receipt.amount) },
    { label: "Receipt age", value: receipt.ageDays === null ? "Unavailable" : `${receipt.ageDays} day(s)` },
    { label: "Reference", value: receipt.reference ?? "Unavailable" },
  ]

  return (
    <figure className="receipt-pipeline" aria-labelledby={`${id}-title`}>
      <figcaption id={`${id}-title`} className="receipt-pipeline-caption">
        <span className="font-mono">RECEIPT → TEXT → FIELDS → REVIEW</span>
        <span>Fixed sample · advance with the controls below</span>
      </figcaption>
      <div className="receipt-pipeline-grid" key={`${state.scenario}-${state.step}`}>
        <div className={`receipt-pipeline-source ${state.step === 1 ? "receipt-pipeline-extracting" : ""}`}>
          <div className="receipt-pipeline-label font-mono">
            <span>{extracted ? "02 / EXTRACTED TEXT" : "01 / RECEIPT CONTENT"}</span>
            <span aria-hidden="true">▤</span>
          </div>
          <pre>{receipt.text.split("\n").map((line, index) => (
            <span key={index} style={{ animationDelay: `${index * 90}ms` }}>{line}{"\n"}</span>
          ))}</pre>
          {state.step === 1 && <span className="receipt-pipeline-scan" aria-hidden="true" />}
          <p>{extracted ? "Sample OCR output is available." : "Waiting for sample submission."}</p>
        </div>
        <div className={`receipt-pipeline-link ${structured ? "receipt-pipeline-link-ready" : ""}`} aria-hidden="true">
          <svg viewBox="0 0 80 40" fill="none">
            <path d="M0 20H74M64 10L74 20L64 30" />
            {state.step === 2 && <path className="receipt-pipeline-signal" d="M0 20H74" pathLength="1" />}
          </svg>
          <span>{structured ? "PARSED" : extracted ? "TEXT READY" : "WAITING"}</span>
        </div>
        <div className={`receipt-pipeline-output ${state.step === 2 ? "receipt-pipeline-resolving" : ""}`}>
          <h4>{structured ? missing ? "Parsing needs manual review" : "Sample structured fields" : "Structured fields"}</h4>
          <dl className="receipt-fields">
            {fields.map((field, index) => (
              <div key={field.label} style={{ animationDelay: `${index * 100}ms` }}
                data-missing={structured && field.value === "Unavailable" ? "true" : undefined}>
                <dt>{field.label}</dt>
                <dd>{structured ? field.value : "Pending"}</dd>
              </div>
            ))}
          </dl>
          <p>{structured
            ? missing ? "Missing details stay unavailable; no values are guessed." : "Predefined fields from this sample. Ready for the separate checks."
            : "Fields appear after you parse the sample text."}</p>
        </div>
      </div>
      <div className="receipt-pipeline-review" data-review-active={state.step === 3 ? "true" : undefined}>
        <span className="font-mono">04 / REVIEW</span>
        <p>{state.decision
          ? `Sample reviewer decision: ${state.decision}.`
          : state.step === 3
            ? "Checks are available below. A landlord decision is still pending."
            : "Amount and date checks follow parsing. A reviewer records the decision."}</p>
      </div>
    </figure>
  )
}
