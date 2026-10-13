export const SAMPLE_STOCK = 10
export const SAMPLE_UNIT_PRICE = 25

export interface SaleWalkthroughState {
  step: number
  quantity: number
  stock: number
  originalTotal: number
  effectiveTotal: number
  status: "Not recorded" | "Recorded" | "Voided"
  history: string[]
  error: string
}
interface QuantityAction {
  type: "quantity"
  quantity: number
}
interface CheckoutAction {
  type: "checkout"
  fail: boolean
}
interface VoidAction {
  type: "void"
  reason: string
}
export type SaleWalkthroughAction = QuantityAction | CheckoutAction | VoidAction | { type: "review" } | { type: "reset" }

export function initialSaleWalkthrough(): SaleWalkthroughState {
  return { step: 0, quantity: 3, stock: SAMPLE_STOCK, originalTotal: 0, effectiveTotal: 0, status: "Not recorded", history: [], error: "" }
}

export function advanceSaleWalkthrough(state: SaleWalkthroughState, action: SaleWalkthroughAction): SaleWalkthroughState {
  switch (action.type) {
    case "reset": return initialSaleWalkthrough()
    case "quantity":
      if (state.step !== 0) return state
      return Number.isInteger(action.quantity) && action.quantity >= 1 && action.quantity <= state.stock
        ? { ...state, quantity: action.quantity, error: "" }
        : { ...state, error: "Choose a whole quantity from 1 to 10 for this sample." }
    case "review": return state.step === 0 && !state.error ? { ...state, step: 1, error: "" } : state
    case "checkout":
      if (state.step !== 1) return state
      if (action.fail) return { ...state, error: "Simulated checkout failure. No sale was recorded and stock is unchanged. Turn off the failure example to retry." }
      return { ...state, step: 2, stock: state.stock - state.quantity, originalTotal: state.quantity * SAMPLE_UNIT_PRICE, effectiveTotal: state.quantity * SAMPLE_UNIT_PRICE, status: "Recorded", history: [`Original sample sale: ${state.quantity} units at ₱25 each.`], error: "" }
    case "void":
      if (state.step !== 2) return state
      if (action.reason.trim().length < 3 || action.reason.trim().length > 500) return { ...state, error: "Enter a reason between 3 and 500 characters." }
      return { ...state, step: 3, stock: state.stock + state.quantity, effectiveTotal: 0, status: "Voided", history: [...state.history, `Sample void adjustment: ${action.reason.trim()}. ${state.quantity} units restored once.`], error: "" }
  }
}
