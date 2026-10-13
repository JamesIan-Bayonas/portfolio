export const labDemos = [
  { id: "centralog", title: "Asset valuation", label: "CentraLog", description: "Compare depreciation strategies and see how repair time changes a sample asset's value.", detail: "Change the cost, useful life, and repair window. Compare the chart with its exact values table.", kind: "Calculator" },
  { id: "dormfix", title: "Receipt review", label: "DormFix", description: "Try matching, mismatched, old, and unreadable sample receipts before a landlord decision.", detail: "Follow text extraction, structured parsing, deterministic checks, and reviewer decisions using fixed examples.", kind: "Guided simulation" },
  { id: "isdalog", title: "Custody & settlement", label: "IsdaLog", description: "Follow one catch through bidding, separate handoff codes, and buyer-confirmed settlement.", detail: "Try a cloud timeout or incorrect code, and watch when sample funds become held and released.", kind: "Guided simulation" },
  { id: "pharmalink", title: "Sale & stock", label: "PharmaLink", description: "Explore failed checkout, stock deduction, and a void that preserves the original sale.", detail: "Choose a sample quantity, test a failed checkout, then record a reasoned inventory adjustment.", kind: "Guided simulation" },
] as const
export type LabDemoId = (typeof labDemos)[number]["id"]

export function labDemoFromHash(hash: string): LabDemoId {
  return labDemos.find(demo => hash === `#demo-${demo.id}`)?.id ?? "centralog"
}
