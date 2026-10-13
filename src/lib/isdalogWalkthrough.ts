export type WalkthroughRole = "harvester" | "buyer" | "rider"

export const SAMPLE_PICKUP_CODE = "766973"
export const SAMPLE_DELIVERY_CODE = "388403"
export const SAMPLE_CATCH_PRICE = 1600
export const SAMPLE_BUYER_BALANCE = 10000

export interface WalkthroughState {
  step: number
  checkpoint: number
  inference: "pending" | "cloud" | "local"
  feedback: string
  error: boolean
}

interface PublishAction {
  type: "publish"
  cloudTimeout: boolean
}

interface HandshakeAction {
  type: "pickup" | "deliver"
  code: string
}

export type WalkthroughAction = PublishAction | HandshakeAction | { type: "bid" } | { type: "accept" } | { type: "checkpoint" } | { type: "arrive" } | { type: "inspect" } | { type: "reset" }

export function initialWalkthrough(): WalkthroughState {
  return {
    step: 0,
    checkpoint: 0,
    inference: "pending",
    feedback: "",
    error: false,
  }
}

export function advanceWalkthrough(
  state: WalkthroughState,
  action: WalkthroughAction,
): WalkthroughState {
  const advance = (feedback: string): WalkthroughState => ({
    ...state,
    step: state.step + 1,
    feedback,
    error: false,
  })
  switch (action.type) {
    case "reset":
      return initialWalkthrough()
    case "publish":
      if (state.step !== 0) return state
      return {
        ...advance(
          action.cloudTimeout
            ? "Simulated cloud timeout: a reachable local Ollama instance classified the sample catch. The listing is published."
            : "The sample catch is classified and published for bidding.",
        ),
        inference: action.cloudTimeout ? "local" : "cloud",
      }
    case "bid":
      return state.step === 1
        ? advance(
            "A sample ₱1,600 bid is placed. Funds are not held until the harvester accepts it.",
          )
        : state
    case "accept":
      return state.step === 2
        ? advance(
            "The bid is accepted. ₱1,600 is held from the sample buyer's wallet for this catch.",
          )
        : state
    case "pickup":
      if (state.step !== 3) return state
      return action.code === SAMPLE_PICKUP_CODE
        ? advance(
            "Pickup verified. The rider takes custody; the catch-price funds remain held.",
          )
        : {
            ...state,
            error: true,
            feedback:
              "Incorrect sample pickup code. Custody and held funds are unchanged. Try the displayed sample code.",
          }
    case "checkpoint":
      if (state.step !== 4 || state.checkpoint >= 3) return state
      return {
        ...state,
        checkpoint: state.checkpoint + 1,
        error: false,
        feedback:
          "The illustrative delivery checkpoint advances. Funds are still held.",
      }
    case "arrive":
      return state.step === 4 && state.checkpoint === 3
        ? advance(
            "The sample rider reaches the destination. A separate delivery code is required for the handoff.",
          )
        : state
    case "deliver":
      if (state.step !== 5) return state
      return action.code === SAMPLE_DELIVERY_CODE
        ? advance(
            "Delivery verified. The catch is delivered, but funds remain held until the buyer confirms inspection.",
          )
        : {
            ...state,
            error: true,
            feedback:
              "Incorrect sample delivery code. Delivery remains unconfirmed and funds remain held.",
          }
    case "inspect":
      return state.step === 6
        ? advance(
            "Buyer inspection confirmed. Catch-price settlement completes: ₱1,552 to the harvester and ₱48 to the platform.",
          )
        : state
  }
}

export function walkthroughBalances(state: WalkthroughState) {
  const held = state.step >= 3 && state.step < 7
  const settled = state.step === 7
  return {
    buyer: SAMPLE_BUYER_BALANCE - (state.step >= 3 ? SAMPLE_CATCH_PRICE : 0),
    held: held ? SAMPLE_CATCH_PRICE : 0,
    harvester: settled ? 1552 : 0,
    platform: settled ? 48 : 0,
  }
}
