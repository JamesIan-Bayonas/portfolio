export const centralogAdminScreens = [
  {
    id: "overview", title: "Overview", heading: "Start with the asset workspace.",
    summary: "The administrator's overview brings inventory health, purchase value, reporting, and asset registration into one workspace.",
    alt: "CentraLog administrator overview with five summary cards, inventory printing, and an asset registration form",
    guidance: [
      { title: "Read the summary", text: "Total assets, active assets, maintenance, and urgent alerts provide a quick operational check. The overview's total asset value represents recorded purchase costs; the ledger separately shows current book value." },
      { title: "Register equipment", text: "The visible form captures the asset name, category, procurement cost, optional photo, room, and custodian. These connect the item to its classification, location, and accountable person." },
      { title: "Review and report", text: "Print inventory report prepares the current inventory view for review and filing. Selecting an asset in the inventory opens its details drawer, shown in the next capture." },
    ],
  },
  {
    id: "asset-details", title: "Asset details", heading: "Inspect one asset without losing the inventory context.",
    summary: "The drawer keeps the inventory visible while presenting the selected laptop's valuation inputs, custody, and recorded history.",
    alt: "CentraLog asset details drawer for a Lenovo Legion R7 with depreciation, location, custodian, history, and asset actions",
    guidance: [
      { title: "Check valuation inputs", text: "The capture shows a ₱65,000 procurement cost, double-declining balance method, 60-month lifespan, and ₱6,500 salvage value. These are the inputs associated with this asset, rather than its current calculated book value." },
      { title: "Check custody and history", text: "Room #101 and Custodian #1 identify the current assignment. The history entry provides an actor, timestamp, and recorded description so the administrator can inspect the context of a change." },
      { title: "Choose the next action", text: "Open property details leads to the full property page. Start maintenance is also available in this captured drawer. The portfolio's screen buttons let you inspect those views without changing the application." },
    ],
  },
  {
    id: "property-details", title: "Property details", heading: "Follow the property record beyond the drawer.",
    summary: "Opening property details reveals the fuller record for SPHV-2026-02-0001, with identification, assignment, history, and reporting controls.",
    alt: "CentraLog full property record showing a laptop photo, property number, serial number, current end user, actions, and transfer history",
    guidance: [
      { title: "Identify the property", text: "The photograph, property number, serial number, unit value, account classification, and acquisition date distinguish the physical item from other inventory. The current end user card summarizes custody and room assignment." },
      { title: "Maintain the record", text: "Update End User changes the assignment; Edit Property opens property editing; Record Inventory records inventory status. The captured Queued for Printing state indicates the property has been added to the sticker queue." },
      { title: "Inspect history and print", text: "Transfer History and Inventory Logs separate assignment history from inventory records. The visible entries include the actor, time, and custodian, even where the displayed room remains the same. Print property page provides a report of this record." },
    ],
  },
  {
    id: "financial-ledger", title: "Financial Ledger", heading: "Separate purchase cost from calculated value.",
    summary: "The ledger brings each asset's depreciation method and valuation results into a financial reporting view.",
    alt: "CentraLog financial ledger with status and classification filters, historical cost and current book value totals, export and print controls, and depreciation rows",
    guidance: [
      { title: "Narrow the report", text: "Status and classification filters let the administrator choose the assets to review. The count identifies how many assets are shown in the captured report." },
      { title: "Read the valuation columns", text: "Historical cost records the purchase amount. Accumulated depreciation shows the reduction calculated to date; current book value shows the remaining calculated value. Residual salvage is shown separately, alongside each asset's depreciation method." },
      { title: "Export or print", text: "Export CSV and Print ledger support further analysis and a printable report. The shown totals and generated timestamp belong to this capture; they are not live portfolio calculations. Try the separate valuation lab to explore sample inputs." },
    ],
  },
  {
    id: "audit-log", title: "Audit Log", heading: "Trace what changed, when, and by whom.",
    summary: "The read-only audit view records asset changes, maintenance events, custodian handoffs, and room relocations.",
    alt: "CentraLog audit log showing ten timestamped asset events with change descriptions, custodian handoff, room relocation, and performed-by columns",
    guidance: [
      { title: "Follow the event trail", text: "Each row associates a timestamp and asset with a description of the event. This capture includes maintenance resolution and asset-record changes for the same laptop." },
      { title: "Distinguish the change", text: "Custodian handoff and room relocation have their own columns. A dash means no value is displayed for that field in the captured event; it should not be read as a transfer." },
      { title: "Identify the actor", text: "Performed by identifies the account associated with each event. The banner confirms restoration from maintenance, while the rows retain the surrounding recorded events. This screen presents history rather than editing controls." },
    ],
  },
] as const

export type CentraLogAdminScreenId = (typeof centralogAdminScreens)[number]["id"]
