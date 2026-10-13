export interface AssetWalkthroughState {
  step: number
  lifecycle: "Procured" | "Active Fleet" | "In Maintenance"
  location: string
  custodian: string
  repairDays: number
  history: string[]
}
export type AssetWalkthroughAction = { type: "activate" } | { type: "transfer" } | { type: "repair" } | { type: "resolve" } | { type: "report" } | { type: "reset" }

export function initialAssetWalkthrough(): AssetWalkthroughState {
  return { step: 0, lifecycle: "Procured", location: "Receiving room", custodian: "Inventory team", repairDays: 0, history: ["Sample laptop registered in the receiving room."] }
}

export function advanceAssetWalkthrough(state: AssetWalkthroughState, action: AssetWalkthroughAction): AssetWalkthroughState {
  switch (action.type) {
    case "reset": return initialAssetWalkthrough()
    case "activate": return state.step === 0 ? { ...state, step: 1, lifecycle: "Active Fleet", history: [...state.history, "Asset activated for use."] } : state
    case "transfer": return state.step === 1 ? { ...state, step: 2, location: "Computer lab", custodian: "Lab custodian", history: [...state.history, "Transferred to the computer lab and assigned to the lab custodian."] } : state
    case "repair": return state.step === 2 ? { ...state, step: 3, lifecycle: "In Maintenance", history: [...state.history, "Maintenance opened; asset marked as in repair."] } : state
    case "resolve": return state.step === 3 ? { ...state, step: 4, lifecycle: "Active Fleet", repairDays: 30, history: [...state.history, "Sample 30-day repair resolved; asset restored to active use."] } : state
    case "report": return state.step === 4 ? { ...state, step: 5 } : state
  }
}
