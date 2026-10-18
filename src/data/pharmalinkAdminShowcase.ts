export const pharmalinkAdminScreens = [
  {
    id: "overview", title: "Overview", heading: "Read the pharmacy's daily snapshot.",
    summary: "The admin overview connects sales activity with stock and expiry attention, with shortcuts into the POS and inventory catalog.",
    alt: "PharmaLink admin overview with daily sales, transaction count, stock and expiry indicators, weekly revenue chart, and inventory shortcuts",
    guidance: [
      { title: "Distinguish the sales metrics", text: "Sales total today uses current corrected totals and excludes voids. Transactions counts sales originally recorded that day, including retained voids. These cards answer different questions and should not be treated as the same measure." },
      { title: "Find inventory needing attention", text: "Low stock identifies items at or below the displayed 10-unit threshold. Expired or due soon covers expired items and those due within 90 days. The inventory attention panel provides shortcuts for reviewing those conditions." },
      { title: "Review trends and move into work", text: "The seven-day revenue chart groups current corrected totals by original sale day and excludes voids. Refresh snapshot reloads the snapshot; Launch POS Terminal and Manage Inventory Catalog lead into daily operations. Values shown belong to this capture." },
    ],
  },
  {
    id: "pos", title: "POS Terminal", heading: "Build the cart before reviewing the sale.",
    summary: "The POS combines a searchable product catalog with a current cart, visible stock availability, quantity controls, and a review step.",
    alt: "PharmaLink admin POS terminal showing medicine cards, stock quantities, a five-line cart, quantity controls, and Review Sale",
    guidance: [
      { title: "Find a product", text: "Search product inventory by name or brand. Catalog cards show the product, unit price, and stock count so the operator can inspect availability before adding it to the cart." },
      { title: "Check quantities and totals", text: "The cart provides plus, minus, and remove controls alongside each line's unit price and amount. In this capture, five product lines total 35 units and ₱524.25; the unit count is different from the number of product lines." },
      { title: "Review before checkout", text: "Review Sale is the next visible step, rather than a completed transaction in this image. The separate portfolio walkthrough demonstrates sample checkout, stock deduction, failure, and void behavior." },
    ],
  },
  {
    id: "inventory", title: "Inventory", heading: "Keep stock, price, and expiry in view.",
    summary: "The inventory catalog groups medicine records with stock quantities, prices, expiry dates, and the maintenance controls available in this admin capture.",
    alt: "PharmaLink admin inventory catalog with low-stock and expiry filters, category filtering, search, Add Item, and stock, edit, and delete actions",
    guidance: [
      { title: "Narrow the catalog", text: "All, Low Stock, and Expired / 90 days provide focused views. Category selection and catalog search help locate a product without scanning the entire inventory." },
      { title: "Inspect the medicine record", text: "Each row brings the medicine name, category, stock quantity, unit price, and expiry date together. These captures explicitly use sample inventory for local testing." },
      { title: "Recognize admin controls", text: "Add Item and the per-row Stock, Edit, and Delete actions are visible in this administrator workspace. Switch to the pharmacist tour to compare its captured daily-work views; the pharmacist overview assigns medicine changes and restocking to an administrator." },
    ],
  },
  {
    id: "sales-history", title: "Sales History", heading: "Inspect recorded sales without losing their history.",
    summary: "Sales history lists receipts, transaction times, dispensed-item counts, current totals, and the admin's review, correction, and void entry points.",
    alt: "PharmaLink admin sales history with UTC+8 date filters, CSV export, receipt rows, current totals, and View, Correct, and Void controls",
    guidance: [
      { title: "Choose the reporting period", text: "Today, Yesterday, All dates, and From / To fields select a period. The screen explicitly states that date boundaries use UTC+8." },
      { title: "Inspect a receipt", text: "Rows identify the receipt, transaction time, number of dispensed items, and current total. View opens a sale for inspection; Correct and Void are separate actions visible for this admin account. Their dialogs are not shown in these captures." },
      { title: "Understand the export scope", text: "The export description includes every matching sale, including retained voids, with original and current amounts, up to 10,000 sales per report. This differs from the overview's sales total, which excludes voids." },
    ],
  },
  {
    id: "user-management", title: "User Management", heading: "Separate staff identity from role assignment.",
    summary: "The administrator's staff table identifies accounts and role privileges, with registration and account-maintenance controls.",
    alt: "PharmaLink user management showing admin and pharmacist accounts, role badges, registration, edit actions, and an active-session indicator",
    guidance: [
      { title: "Read the account and role", text: "The two captured accounts have distinct Admin and Pharmacist role badges. The table also displays account identity, email-registration state, and the total registered staff count." },
      { title: "Identify the current session", text: "The admin row is marked YOU and Active Session. The pharmacist row shows Edit and Delete, while the current account row displays Edit and its session indicator." },
      { title: "Inspect administration entry points", text: "Register New Employee and Edit are the entry points shown for staff-account maintenance. This image illustrates the admin interface; it does not show the pharmacist's own dashboard or prove server-side permission enforcement." },
    ],
  },
  {
    id: "profile", title: "My Profile", heading: "Manage the signed-in account's profile.",
    summary: "The account profile brings the administrator's photo, username, displayed system role, and optional password change into one settings view.",
    alt: "PharmaLink admin profile with a profile photo, read-only Admin role field, username, password and confirmation fields, and Save Profile Preferences",
    guidance: [
      { title: "Update profile identity", text: "The photo control lists JPG, JPEG, and PNG support with a 2 MB maximum. Account Details displays the Admin role separately from the username field; no role selector is shown here." },
      { title: "Recognize an optional password change", text: "The New Password field says that leaving it blank keeps the existing password. A separate confirmation field supports entering a replacement password consistently." },
      { title: "Save account preferences", text: "Save Profile Preferences is the visible submit action. The portfolio displays the captured screen only; it does not collect a password, upload a photo, or modify a staff account." },
    ],
  },
] as const

export type PharmaLinkAdminScreenId = (typeof pharmalinkAdminScreens)[number]["id"]
