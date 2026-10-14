export interface CapabilityEvidence {
  projectId: string
  summary: string
  section: "decision" | "workflow" | "walkthrough"
  linkLabel: string
}

export interface EngineeringCapability {
  id: string
  name: string
  description: string
  evidence: CapabilityEvidence[]
}

// Examples describe the documented implementations, without adoption or performance claims.
export const engineeringCapabilities: EngineeringCapability[] = [
  {
    id: "ai-workflows",
    name: "AI-assisted workflows",
    description: "Connect model output to validation, fallback paths, and human decisions.",
    evidence: [
      { projectId: "dormfix", summary: "Explore the historical OCR/local-model design, its requested response shape, explicit payment checks, and landlord review.", section: "walkthrough", linkLabel: "Try the receipt review" },
      { projectId: "isdalog", summary: "Attempt cloud catch classification, then use a reachable local vision model when cloud inference fails.", section: "decision", linkLabel: "Read the fallback decision" },
    ],
  },
  {
    id: "transaction-integrity",
    name: "Transaction integrity",
    description: "Keep related records consistent when a workflow succeeds, fails, or is reversed.",
    evidence: [
      { projectId: "isdalog", summary: "Hold buyer funds through delivery and release settlement after inspection, using database transactions and row locks.", section: "walkthrough", linkLabel: "Follow the settlement" },
      { projectId: "pharmalink", summary: "Coordinate a sale with stock deduction, then record a void adjustment while retaining the original sale history.", section: "walkthrough", linkLabel: "Try the sale and void" },
    ],
  },
  {
    id: "real-time-communication",
    name: "Real-time communication",
    description: "Connect role-specific interfaces through live events and scoped communication channels.",
    evidence: [
      { projectId: "isdalog", summary: "Distribute marketplace bid updates through Laravel Reverb and coordinate the delivery workflow across roles.", section: "workflow", linkLabel: "Read the marketplace workflow" },
      { projectId: "dormfix", summary: "Connect landlord and tenant messaging through Socket.io alongside the property's management workflows.", section: "workflow", linkLabel: "Read the tenant workflow" },
    ],
  },
  {
    id: "asset-lifecycle",
    name: "Asset lifecycle management",
    description: "Connect equipment state, custody history, maintenance, and calculated valuation.",
    evidence: [
      { projectId: "centralog", summary: "Track activation, transfers, and repair history with explicit lifecycle rules and audit records.", section: "walkthrough", linkLabel: "Try the asset lifecycle" },
      { projectId: "centralog", summary: "Calculate valuation from asset and maintenance records with interchangeable depreciation strategies.", section: "decision", linkLabel: "Read the valuation decision" },
    ],
  },
]

export function capabilityTarget(evidence: CapabilityEvidence): string {
  return evidence.section === "walkthrough" ? "walkthrough" : `${evidence.projectId}-${evidence.section}`
}
