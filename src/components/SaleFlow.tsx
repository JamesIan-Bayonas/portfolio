import { useId } from "react"
import { SAMPLE_STOCK, SAMPLE_UNIT_PRICE, type SaleWalkthroughState } from "../lib/pharmalinkWalkthrough"
import "./SaleFlow.css"

const money = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" })

export default function SaleFlow({ state }: { state: SaleWalkthroughState }) {
  const id = useId()
  const recorded = state.status !== "Not recorded"
  const voided = state.status === "Voided"
  const failed = state.step === 1 && Boolean(state.error)
  const phase = voided ? "voided" : recorded ? "recorded" : failed ? "failed" : "pending"

  return (
    <figure className="sale-flow" aria-labelledby={`${id}-title`} data-sale-phase={phase}>
      <figcaption id={`${id}-title`} className="sale-flow-caption">
        <span className="font-mono">CART → SALE RECORD → STOCK</span>
        <span>Fictional item · current sample state</span>
      </figcaption>
      <div className="sale-flow-grid" key={phase}>
        <section className="sale-flow-card" aria-labelledby={`${id}-cart`}>
          <h4 id={`${id}-cart`}>Sample cart</h4>
          <dl>
            <div><dt>Units in cart</dt><dd>{state.quantity}</dd></div>
            <div><dt>Unit price</dt><dd>{money.format(SAMPLE_UNIT_PRICE)}</dd></div>
            <div><dt>Cart total</dt><dd>{money.format(state.quantity * SAMPLE_UNIT_PRICE)}</dd></div>
          </dl>
          <p>Reviewing the cart leaves stock unchanged.</p>
        </section>
        <div className="sale-flow-link sale-flow-record-link" aria-hidden="true">
          <svg viewBox="0 0 64 32" fill="none">
            <path d="M0 16H58M50 8L58 16L50 24" />
            {phase === "recorded" && <path className="sale-flow-signal" pathLength="1" d="M0 16H58" />}
          </svg>
          <span>{failed ? "BLOCKED" : recorded ? "RECORDED" : "REVIEW"}</span>
        </div>
        <section className="sale-flow-card sale-flow-record" aria-labelledby={`${id}-record`}>
          <h4 id={`${id}-record`}>Sale record</h4>
          <p className="sale-flow-status font-mono">{state.status}</p>
          <dl>
            <div><dt>Original total</dt><dd>{money.format(state.originalTotal)}</dd></div>
            <div><dt>Effective total</dt><dd>{money.format(state.effectiveTotal)}</dd></div>
            <div><dt>History entries</dt><dd>{state.history.length}</dd></div>
          </dl>
          <p>{voided ? "Original receipt retained beside its void adjustment." : recorded ? "Sale and stock deduction recorded together." : "No sale or history entry has been recorded."}</p>
        </section>
        <div className="sale-flow-link sale-flow-stock-link" aria-hidden="true">
          <svg viewBox="0 0 64 32" fill="none">
            <path d="M0 16H58M50 8L58 16L50 24" />
            {(phase === "recorded" || voided) && <path className="sale-flow-signal" pathLength="1" d="M0 16H58" />}
          </svg>
          <span>{voided ? "RESTORED" : failed ? "UNCHANGED" : recorded ? "DEDUCTED" : "WAITING"}</span>
        </div>
        <section className="sale-flow-card sale-flow-stock" aria-labelledby={`${id}-stock`}>
          <h4 id={`${id}-stock`}>Inventory</h4>
          <p className="sale-flow-stock-total"><strong>{state.stock}</strong> / {SAMPLE_STOCK} units available</p>
          <div className="sale-flow-units" aria-hidden="true">
            {Array.from({ length: SAMPLE_STOCK }, (_, index) => (
              <span key={index} data-available={index < state.stock ? "true" : "false"}
                className={voided && index >= SAMPLE_STOCK - state.quantity ? "sale-flow-restored-unit" : undefined} />
            ))}
          </div>
          <p>{voided ? `${state.quantity} units restored once. No refund is processed.` : recorded ? `${state.quantity} units deducted from the sample stock.` : "All ten units remain available until checkout succeeds."}</p>
        </section>
      </div>
      <p className="sale-flow-summary">
        {failed ? "Checkout failed: no sale recorded, no history entry added, and no stock deducted."
          : voided ? "A separate void adjustment restores stock and sets the effective total to zero. The original sale stays in history."
            : recorded ? "Successful sample checkout: the sale record and stock deduction took effect together."
              : "The cart is a preview. Recording a successful checkout updates the sale and inventory together."}
      </p>
      <p className="sale-flow-note">Browser illustration only · no database transaction, payment, or refund.</p>
    </figure>
  )
}
