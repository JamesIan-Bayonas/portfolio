export const projectStories: Record<string, {
  problem: string
  workflow: string
  result: string
}> = {
  isdalog: {
    problem: "Catch pricing and delivery handoffs are difficult to follow.",
    workflow: "Register → bid → dispatch → verify → settle",
    result: "Buyer-confirmed delivery connects custody to settlement.",
  },
  dormfix: {
    problem:
      "Tenant requests, receipts, and property records need a shared workflow.",
    workflow: "Submit → extract → validate → review",
    result:
      "A landlord can inspect receipt checks before making a payment decision.",
  },
  centralog: {
    problem: "Asset custody, repairs, and valuation need connected records.",
    workflow: "Activate → assign → transfer → maintain",
    result:
      "Custody history and repair periods inform the asset record and calculated value.",
  },
  pharmalink: {
    problem: "Sales, stock changes, and reversals must stay consistent.",
    workflow: "Check stock → checkout → record → adjust",
    result: "A void restores stock while retaining the original sale history.",
  },
}

export const labVisualStages: Record<string, readonly string[]> = {
  centralog: [
    "Set cost",
    "Choose strategy",
    "Add repair window",
    "Compare values",
  ],
  dormfix: [
    "Choose receipt",
    "Extract fields",
    "Check records",
    "Review decision",
  ],
  isdalog: [
    "Register catch",
    "Publish & bid",
    "Verify handoffs",
    "Confirm settlement",
  ],
  pharmalink: [
    "Check stock",
    "Complete sale",
    "Record changes",
    "Void & restore",
  ],
}
