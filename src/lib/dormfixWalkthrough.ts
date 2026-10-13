export type ReceiptScenario = "matching" | "mismatch" | "old" | "unreadable"
export type ReviewDecision = "verified" | "rejected"

export interface SampleReceipt {
  title: string
  text: string
  amount: number | null
  ageDays: number | null
  reference: string | null
}

export const EXPECTED_RENT = 3500
export const receiptScenarios: Record<ReceiptScenario, SampleReceipt> = {
  matching: { title: "Matching details", text: "TRANSFER CONFIRMED\nAmount: PHP 3,500.00\nDate: 12 Oct 2026\nReference: DEMO-1042", amount: 3500, ageDays: 1, reference: "DEMO-1042" },
  mismatch: { title: "Amount mismatch", text: "TRANSFER CONFIRMED\nAmount: PHP 2,800.00\nDate: 12 Oct 2026\nReference: DEMO-1043", amount: 2800, ageDays: 1, reference: "DEMO-1043" },
  old: { title: "Old receipt", text: "TRANSFER CONFIRMED\nAmount: PHP 3,500.00\nDate: 03 Oct 2026\nReference: DEMO-1044", amount: 3500, ageDays: 10, reference: "DEMO-1044" },
  unreadable: { title: "Unreadable details", text: "TR... CONF...\nAmount: PHP ?,???.??\nDate: --\nReference: [blurred]", amount: null, ageDays: null, reference: null },
}

export interface ReceiptReviewState {
  scenario: ReceiptScenario
  step: number
  decision: ReviewDecision | null
}
interface SelectScenarioAction {
  type: "select"
  scenario: ReceiptScenario
}
interface DecisionAction {
  type: "decide"
  decision: ReviewDecision
}
export type ReceiptReviewAction = SelectScenarioAction | DecisionAction | { type: "next" } | { type: "reset" }

export function initialReceiptReview(): ReceiptReviewState {
  return { scenario: "matching", step: 0, decision: null }
}

export function receiptFlags(receipt: SampleReceipt): string[] {
  if (receipt.amount === null || receipt.ageDays === null || receipt.reference === null) return ["Required details could not be parsed. Manual review needed."]
  const flags: string[] = []
  if (receipt.amount !== EXPECTED_RENT) flags.push("Extracted amount differs from the expected ₱3,500 rent.")
  if (receipt.ageDays > 7) flags.push("Receipt is more than seven days old at the sample review date.")
  return flags
}

export function advanceReceiptReview(state: ReceiptReviewState, action: ReceiptReviewAction): ReceiptReviewState {
  switch (action.type) {
    case "reset": return initialReceiptReview()
    case "select": return { scenario: action.scenario, step: 0, decision: null }
    case "next": return state.step < 3 ? { ...state, step: state.step + 1 } : state
    case "decide": return state.step === 3 && state.decision === null ? { ...state, decision: action.decision } : state
  }
}
