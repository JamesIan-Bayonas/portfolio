export const pharmalinkPharmacistScreens = [
  {
    id: "overview", title: "Overview", heading: "Start the shift with sales and inventory awareness.",
    summary: "The pharmacist overview presents daily sales, transaction counts, stock alerts, and revenue trends, with a viewing route into the inventory catalog.",
    alt: "PharmaLink pharmacist overview showing sales metrics, revenue trend, stock alerts, and View Inventory Catalog without administration links",
    guidance: [
      { title: "Read the daily snapshot", text: "Sales total today uses corrected totals and excludes voids. Transactions counts sales originally recorded that day, including retained voids. The weekly chart also uses corrected totals by original sale day, excluding voids." },
      { title: "Review inventory attention", text: "The capture flags stock at or below 10 units and expiry within 90 days. View Inventory Catalog opens the viewing workflow; the accompanying text explicitly assigns medicine changes and restocking to an administrator." },
      { title: "Recognize the role boundary", text: "The pharmacist sidebar shows daily work and My Profile, without the admin's Categories or User Management links. The captured overview offers View Inventory Catalog rather than the administrator's Manage Inventory Catalog shortcut." },
    ],
  },
  {
    id: "pos", title: "POS Terminal", heading: "Prepare a sale from the pharmacist workspace.",
    summary: "The pharmacist POS brings product search, stock availability, cart quantities, and sale review together in the daily-work interface.",
    alt: "PharmaLink pharmacist POS terminal with product cards, stock quantities, five cart lines, quantity controls, and Review Sale",
    guidance: [
      { title: "Find and inspect products", text: "Search by product name or brand and review the catalog's unit prices and stock counts. Product descriptions identify this as sample inventory for local testing." },
      { title: "Check the current cart", text: "Plus, minus, and remove controls adjust the visible cart. The captured five product lines contain 35 units totaling ₱524.25; the unit count is distinct from the number of different products." },
      { title: "Continue to sale review", text: "Review Sale is the next visible step, not proof of a completed checkout in this screenshot. The portfolio's separate sample walkthrough explains checkout, stock deduction, failure, and recorded void behavior; it is not a pharmacist permission demonstration." },
    ],
  },
  {
    id: "sales-history", title: "Sales History", heading: "Inspect recorded receipts with a view-only action.",
    summary: "The pharmacist sales history retains date filtering and CSV export, while its captured receipt rows offer View rather than the admin's Correct and Void actions.",
    alt: "PharmaLink pharmacist sales history with UTC+8 date filters, CSV export, receipt totals, and View-only row actions",
    guidance: [
      { title: "Select the reporting period", text: "Today, Yesterday, All dates, and the From / To fields define the reporting window. Date boundaries explicitly use UTC+8." },
      { title: "Inspect rather than correct", text: "Each row identifies the receipt, transaction time, dispensed-item count, and current total. Only View is shown in these pharmacist captures. The admin captures additionally show Correct and Void; those actions are not presented here." },
      { title: "Read the export scope", text: "Export CSV remains visible. The report description includes every matching sale, retained voids, and original and current amounts, with a maximum of 10,000 sales per report. A retained void in an export does not imply that this role can perform a void." },
    ],
  },
  {
    id: "profile", title: "My Profile", heading: "Maintain the pharmacist's own account profile.",
    summary: "The profile screen shows the signed-in pharmacist's identity, role, photo, and optional password change, separate from staff administration.",
    alt: "PharmaLink pharmacist profile with Pharmacist badge, username, profile photo, optional password fields, and Save Profile Preferences",
    guidance: [
      { title: "Identify the signed-in role", text: "The account badge and System Role field both display Pharmacist, and the username is pharmacist. No role selector or staff-account administration table is shown in this profile screen." },
      { title: "Update profile details", text: "The photo control supports JPG, JPEG, and PNG with a 2 MB maximum. The username and photo settings relate to this signed-in account." },
      { title: "Recognize optional credential changes", text: "The password field states that leaving it blank keeps the existing password, with a separate confirmation field for a replacement. Save Profile Preferences submits changes in the application; this portfolio tour only displays the capture." },
    ],
  },
] as const

export type PharmaLinkWorkspaceRole = "admin" | "pharmacist"

// Keep a shared screen when switching roles; never fall back to an admin capture.
export function pharmacistScreenSelection(screen: string) {
  return pharmalinkPharmacistScreens.find(item => item.id === screen)?.id ?? "overview"
}
