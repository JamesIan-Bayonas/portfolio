import { useReducer, useState } from "react"
import {
  advanceWalkthrough,
  initialWalkthrough,
  SAMPLE_DELIVERY_CODE,
  SAMPLE_PICKUP_CODE,
  walkthroughBalances,
  type WalkthroughAction,
  type WalkthroughRole,
} from "../lib/isdalogWalkthrough"
import {
  perspectiveScreenshot,
  roleLabels,
  routeCheckpoints,
  walkthroughSteps,
} from "../data/isdalogWalkthrough"

const money = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
})
const roles: WalkthroughRole[] = ["harvester", "buyer", "rider"]

export default function IsdaLogWalkthrough() {
  const [state, dispatch] = useReducer(
    advanceWalkthrough,
    undefined,
    initialWalkthrough,
  )
  const [viewedStep, setViewedStep] = useState(0)
  const [role, setRole] = useState<WalkthroughRole>("harvester")
  const [code, setCode] = useState("")
  const [cloudTimeout, setCloudTimeout] = useState(false)
  const step = walkthroughSteps[viewedStep]
  const balances = walkthroughBalances(state)
  const screenshot = perspectiveScreenshot(role, viewedStep)
  const current = viewedStep === state.step
  const actor = walkthroughSteps[state.step].actor
  const expectedCode =
    state.step === 3 ? SAMPLE_PICKUP_CODE : SAMPLE_DELIVERY_CODE

  function perform(action: WalkthroughAction) {
    const next = advanceWalkthrough(state, action)
    dispatch(action)
    if (next.step !== state.step || action.type === "reset") {
      setViewedStep(next.step)
      setRole(walkthroughSteps[next.step].actor)
      setCode("")
    }
    if (action.type === "reset") setCloudTimeout(false)
  }

  function currentStep() {
    setViewedStep(state.step)
    setRole(actor)
    setCode("")
  }

  function controls() {
    if (!current)
      return (
        <div className="walkthrough-past">
          <p>You are reviewing a completed step.</p>
          <button type="button" onClick={currentStep}>
            Return to the current step
          </button>
        </div>
      )
    if (state.step === 7)
      return (
        <div className="walkthrough-complete">
          <h4>One catch. A completed chain of custody.</h4>
          <p>
            The sample held balance is zero. The catch-price shares add up to
            ₱1,600.
          </p>
          <button type="button" onClick={() => perform({ type: "reset" })}>
            Replay the walkthrough
          </button>
        </div>
      )
    if (role !== actor)
      return (
        <div className="walkthrough-past">
          <p>{roleLabels[actor]} takes the next action in this step.</p>
          <button type="button" onClick={() => setRole(actor)}>
            Continue as {roleLabels[actor]}
          </button>
        </div>
      )
    switch (state.step) {
      case 0:
        return (
          <>
            <label className="walkthrough-timeout">
              <input
                type="checkbox"
                checked={cloudTimeout}
                onChange={(event) => setCloudTimeout(event.target.checked)}
              />
              Simulate a cloud inference timeout
            </label>
            <button
              type="button"
              className="walkthrough-primary"
              onClick={() => perform({ type: "publish", cloudTimeout })}
            >
              Classify & publish the sample catch
            </button>
            <p className="walkthrough-action-note">
              The fallback example assumes the local Ollama service is
              reachable.
            </p>
          </>
        )
      case 1:
        return (
          <button
            type="button"
            className="walkthrough-primary"
            onClick={() => perform({ type: "bid" })}
          >
            Place the sample ₱1,600 bid
          </button>
        )
      case 2:
        return (
          <button
            type="button"
            className="walkthrough-primary"
            onClick={() => perform({ type: "accept" })}
          >
            Accept the bid & hold sample funds
          </button>
        )
      case 3:
      case 5:
        return (
          <form
            className="walkthrough-handshake"
            onSubmit={(event) => {
              event.preventDefault()
              perform(
                state.step === 3
                  ? { type: "pickup", code }
                  : { type: "deliver", code },
              )
            }}
          >
            <p className="walkthrough-sample-code font-mono">
              SAMPLE {state.step === 3 ? "PICKUP" : "DELIVERY"} CODE:{" "}
              <strong>{expectedCode}</strong>
            </p>
            <label htmlFor="sample-handshake-code">
              Enter the {state.step === 3 ? "pickup" : "delivery"} code
            </label>
            <input
              id="sample-handshake-code"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={6}
              value={code}
              onChange={(event) =>
                setCode(event.target.value.replace(/\D/g, ""))
              }
              aria-describedby="sample-code-help"
            />
            <p id="sample-code-help" className="walkthrough-action-note">
              These fixed example codes are part of the simulation.
            </p>
            <div className="walkthrough-control-buttons">
              <button type="submit" className="walkthrough-primary">
                Verify the sample {state.step === 3 ? "pickup" : "delivery"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCode("000000")
                  perform(
                    state.step === 3
                      ? { type: "pickup", code: "000000" }
                      : { type: "deliver", code: "000000" },
                  )
                }}
              >
                Try an incorrect code
              </button>
              <button type="button" onClick={() => setCode(expectedCode)}>
                Use the sample code
              </button>
            </div>
          </form>
        )
      case 4:
        return (
          <>
            <ol
              className="walkthrough-route"
              aria-label="Illustrative delivery route"
            >
              {routeCheckpoints.map((point, index) => (
                <li
                  key={point}
                  aria-current={index === state.checkpoint ? "step" : undefined}
                  className={index <= state.checkpoint ? "route-reached" : ""}
                >
                  <span aria-hidden="true">{index + 1}</span>
                  <strong>{point}</strong>
                </li>
              ))}
            </ol>
            <p className="walkthrough-action-note">
              Illustrative checkpoints · no live GPS data.
            </p>
            {state.checkpoint < 3 ? (
              <button
                type="button"
                className="walkthrough-primary"
                onClick={() => perform({ type: "checkpoint" })}
              >
                Advance the sample delivery checkpoint
              </button>
            ) : (
              <button
                type="button"
                className="walkthrough-primary"
                onClick={() => perform({ type: "arrive" })}
              >
                Start the delivery handoff
              </button>
            )}
          </>
        )
      case 6:
        return (
          <button
            type="button"
            className="walkthrough-primary"
            onClick={() => perform({ type: "inspect" })}
          >
            Confirm inspection & release sample funds
          </button>
        )
    }
  }

  return (
    <section
      id="walkthrough"
      className="isdalog-walkthrough"
      aria-labelledby="walkthrough-title"
    >
      <div className="project-section-heading">
        <div>
          <p className="project-eyebrow font-mono">GUIDED SYSTEM WALKTHROUGH</p>
          <h2 id="walkthrough-title">
            Follow one catch.
            <br />
            See every handoff.
          </h2>
        </div>
        <p>
          Move through the harvester, buyer, and rider perspectives. This is an
          interactive simulation with sample data, independent of the live
          system.
        </p>
      </div>
      <div className="walkthrough-shell">
        <div className="walkthrough-bar font-mono">
          <span>YELLOWSTRIPE SCAD / 13 KG / SAMPLE ORDER</span>
          <button type="button" onClick={() => perform({ type: "reset" })}>
            Reset walkthrough ↺
          </button>
        </div>
        <div className="walkthrough-layout">
          <nav className="walkthrough-steps" aria-label="Walkthrough steps">
            <p className="project-eyebrow font-mono">
              {state.step === 7
                ? "WALKTHROUGH COMPLETE"
                : `STEP ${state.step + 1} OF 8`}
            </p>
            <ol>
              {walkthroughSteps.map((item, index) => (
                <li key={item.title}>
                  <button
                    type="button"
                    disabled={index > state.step}
                    aria-current={index === viewedStep ? "step" : undefined}
                    onClick={() => {
                      setViewedStep(index)
                      setRole(item.actor)
                      setCode("")
                    }}
                  >
                    <span className="font-mono">
                      {String(index + 1).padStart(2, "0")}
                    </span>
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
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="walkthrough-main">
            <fieldset className="walkthrough-roles">
              <legend>View this step as</legend>
              {roles.map((item) => (
                <label key={item}>
                  <input
                    type="radio"
                    name="walkthrough-perspective"
                    checked={role === item}
                    onChange={() => setRole(item)}
                  />
                  {roleLabels[item]}
                </label>
              ))}
            </fieldset>
            <div className="walkthrough-step-content">
              <p className="project-eyebrow font-mono">
                {String(viewedStep + 1).padStart(2, "0")} /{" "}
                {roleLabels[step.actor].toUpperCase()}
              </p>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <div className="walkthrough-perspective">
                <span className="font-mono">
                  {roleLabels[role].toUpperCase()} PERSPECTIVE
                </span>
                <p>{step.perspectives[role]}</p>
              </div>
            </div>
            <div className="walkthrough-controls">{controls()}</div>
            {state.feedback && (
              <p
                className={
                  state.error
                    ? "walkthrough-feedback walkthrough-feedback-error"
                    : "walkthrough-feedback"
                }
                role={state.error ? "alert" : "status"}
              >
                {state.feedback}
              </p>
            )}
            <div className="walkthrough-decision">
              <h4>Why this step matters</h4>
              <p>{step.decision}</p>
            </div>
            <details
              className="walkthrough-screenshot"
              key={`${role}-${viewedStep}`}
            >
              <summary>
                See the original {roleLabels[role].toLowerCase()} interface
              </summary>
              <figure>
                <a
                  href={screenshot.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open full screenshot: ${screenshot.alt}`}
                >
                  <img
                    src={screenshot.src}
                    alt={screenshot.alt}
                    loading="lazy"
                  />
                </a>
                <figcaption>
                  Original project screenshot. Its account balances belong to
                  that captured session; the walkthrough ledger below uses
                  separate sample data.
                </figcaption>
              </figure>
            </details>
          </div>
        </div>
        <div
          className="walkthrough-ledger"
          aria-label="Current sample catch-price ledger"
        >
          <div>
            <span>Buyer available</span>
            <strong>{money.format(balances.buyer)}</strong>
          </div>
          <div>
            <span>Catch-price funds held</span>
            <strong>{money.format(balances.held)}</strong>
          </div>
          <div>
            <span>Harvester payout</span>
            <strong>{money.format(balances.harvester)}</strong>
          </div>
          <div>
            <span>Platform share</span>
            <strong>{money.format(balances.platform)}</strong>
          </div>
        </div>
        <p className="walkthrough-ledger-note">
          Sample catch-price funds only. The real project handles delivery fees
          separately during settlement.
        </p>
      </div>
    </section>
  )
}
