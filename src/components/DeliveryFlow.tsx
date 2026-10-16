import { useId, type CSSProperties } from "react"
import { routeCheckpoints } from "../data/isdalogWalkthrough"
import { walkthroughBalances, type WalkthroughState } from "../lib/isdalogWalkthrough"
import "./DeliveryFlow.css"

interface DeliveryFlowProps {
  state: WalkthroughState
  reviewing: boolean
}

const money = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" })

export default function DeliveryFlow({ state, reviewing }: DeliveryFlowProps) {
  const id = useId()
  const pickedUp = state.step >= 4
  const delivered = state.step >= 6
  const settled = state.step === 7
  const held = state.step >= 3 && !settled
  const checkpoint = pickedUp ? state.checkpoint : 0
  const balances = walkthroughBalances(state)
  const custody = delivered ? "Buyer" : pickedUp ? "Rider" : "Harvester"
  const position = 12.5 + checkpoint * 25

  return (
    <figure className="delivery-flow" aria-labelledby={`${id}-title`}>
      <figcaption id={`${id}-title`} className="delivery-flow-caption">
        <span className="font-mono">CUSTODY & CATCH-PRICE FUNDS</span>
        <span>{reviewing ? "Current simulation state · reviewing an earlier step" : "Current simulation state · fixed sample"}</span>
      </figcaption>
      <div className="delivery-flow-route">
        <div className="delivery-flow-heading">
          <h4>Catch custody: {custody}</h4>
          <span>{delivered ? "Delivery code verified" : pickedUp ? "Pickup code verified" : "Awaiting verified pickup"}</span>
        </div>
        <div className="delivery-flow-track" aria-hidden="true"
          style={{ "--delivery-position": `${position}%` } as CSSProperties}>
          <div className="delivery-flow-progress" />
          <span className="delivery-flow-marker">
            <svg viewBox="0 0 32 24" fill="none">
              <path d="M3 5H19V17H3ZM19 10H25L29 14V17H19M8 5V2M6 2H10" />
              <circle cx="8" cy="19" r="3" /><circle cx="24" cy="19" r="3" />
            </svg>
          </span>
        </div>
        <ol className="delivery-flow-checkpoints" aria-label="Illustrative delivery route">
          {routeCheckpoints.map((point, index) => (
            <li key={point} data-reached={pickedUp && index <= checkpoint ? "true" : undefined}
              aria-current={pickedUp && index === checkpoint ? "step" : undefined}>
              <span aria-hidden="true">0{index + 1}</span><strong>{point}</strong>
            </li>
          ))}
        </ol>
        <p>{delivered
          ? settled ? "Buyer custody confirmed; inspection has released the sample funds." : "The buyer has the catch. Funds remain held until inspection is confirmed."
          : pickedUp ? `Illustrative checkpoint: ${routeCheckpoints[checkpoint]}. The rider retains custody until the delivery code is verified.`
          : "The catch stays with the harvester until the pickup code is verified."}</p>
      </div>
      <div className="delivery-flow-funds" data-funds={settled ? "settled" : held ? "held" : "available"}>
        <div className="delivery-flow-heading">
          <h4>Catch-price funds: {settled ? "Settled" : held ? "Held" : "Not held"}</h4>
          <span>Delivery fees are separate</span>
        </div>
        <dl>
          <div><dt>Buyer available</dt><dd>{money.format(balances.buyer)}</dd></div>
          <div className="delivery-flow-held"><dt>Held catch price</dt><dd>{money.format(balances.held)}</dd></div>
          <div className="delivery-flow-payout"><dt>Harvester / platform</dt><dd>{money.format(balances.harvester)} / {money.format(balances.platform)}</dd></div>
        </dl>
        <p>{settled
          ? "Buyer inspection released the catch price: 97% to the harvester and 3% to the platform."
          : held
            ? "Only buyer-confirmed inspection releases this sample settlement. Route progress and delivery verification keep the funds held."
            : "Placing a bid does not hold funds. Acceptance moves the sample catch price into the held balance."}</p>
      </div>
      <p className="delivery-flow-note">Illustrative checkpoints · no live GPS, custody transfers, or payments.</p>
    </figure>
  )
}
