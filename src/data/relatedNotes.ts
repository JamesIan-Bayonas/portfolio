export interface RelatedNoteConnection {
  noteId: string
  reason: string
}

// Curated from the article content. Order reflects the suggested reading path.
export const relatedNoteConnections: Record<string, RelatedNoteConnection[]> = {
  "dormfix-receipt-review": [
    {
      noteId: "isdalog-delivery-settlement",
      reason:
        "Both articles separate evidence from a decision: reading a receipt precedes landlord review, while a delivery handoff precedes buyer inspection and settlement.",
    },
    {
      noteId: "pharmalink-void-adjustment",
      reason:
        "Follow the idea of recording an explicit review decision into a workflow where a sale correction or void keeps its reason and original record visible.",
    },
  ],
  "isdalog-delivery-settlement": [
    {
      noteId: "pharmalink-void-adjustment",
      reason:
        "Both workflows coordinate financial records with operational changes. PharmaLink extends the discussion to reasoned adjustments and repeat-action handling after a sale.",
    },
    {
      noteId: "dormfix-receipt-review",
      reason:
        "Compare buyer inspection before settlement with landlord review after receipt parsing. Each workflow gives evidence gathering and the recorded decision separate responsibilities.",
    },
  ],
  "centralog-calculated-valuation": [
    {
      noteId: "pharmalink-void-adjustment",
      reason:
        "Compare a value derived from asset and repair records with a sale's effective total after adjustments. Both articles distinguish source history from the current result.",
    },
    {
      noteId: "isdalog-delivery-settlement",
      reason:
        "CentraLog separates custody changes from valuation. IsdaLog applies a similar separation to cargo handoffs and the financial state of held funds.",
    },
  ],
  "pharmalink-void-adjustment": [
    {
      noteId: "isdalog-delivery-settlement",
      reason:
        "Continue from coordinating sale and stock updates to coordinating order and wallet changes, with distinct workflow events and repeat-action handling.",
    },
    {
      noteId: "centralog-calculated-valuation",
      reason:
        "PharmaLink retains the original sale while presenting effective totals. CentraLog explores another way to keep source records separate from a calculated current value.",
    },
  ],
}
