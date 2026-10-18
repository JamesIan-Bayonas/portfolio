export const dormfixTenantScreens = [
  { id: "overview", title: "Overview Dashboard", heading: "Start with your room, receipts, and requests.", summary: "The tenant Home page is the Overview Dashboard. Its summary and lower action section belong to the same page; the four shortcuts lead to payment submission, issue reporting, landlord messaging, and house rules.", alt: "DormFix tenant Home overview with Room 100, payment proof awaiting review, active maintenance, and dorm announcements", guidance: [
    { title: "Know your current status", text: "The summary shows the assigned room and landlord, a recorded payment proof needing review, and one pending maintenance request. A submitted receipt still needs the landlord’s verdict." },
    { title: "Continue to the four shortcuts", text: "Choose Actions & active requests to see the lower section of the same Overview Dashboard. Follow the four tour shortcuts to inspect each destination." },
    { title: "Follow the recorded progress", text: "The lower section shows an active plumbing report, separate urgency and progress labels, landlord notes, and an account and housing details disclosure." },
  ] },
  { id: "submit-payment", title: "Submit payment proof", heading: "Attach a receipt for landlord review.", summary: "Reached from Submit payment proof on the Overview Dashboard, this form collects an amount, payment type, receipt image, and optional notes.", alt: "DormFix tenant payment proof form with amount, date paid, payment type, receipt upload, and optional notes", guidance: [
    { title: "Provide the claim and evidence", text: "The amount and attached receipt support the submission. Notes can add context or a transaction reference for the landlord to check." },
    { title: "Read the date limitation", text: "The captured form explicitly states that history records the submission date and does not retain the selected payment date. The tour preserves that limitation." },
    { title: "Keep submission and approval separate", text: "The landlord reviews each submission. This capture shows the empty form, not a successful upload or a verified payment." },
  ] },
  { id: "report-issue", title: "Report an issue", heading: "Describe the issue and its impact.", summary: "Reached from Report an issue on the Overview Dashboard, this form captures issue type, urgency, and a description for landlord assessment.", alt: "DormFix tenant issue report form with Plumbing type, Low urgency, description, and disabled Submit report button", guidance: [
    { title: "Classify and describe", text: "Issue type and urgency are separate choices. The description asks for the problem’s location and impact so the landlord can assess the report." },
    { title: "Notice the empty state", text: "The screenshot shows Plumbing and Low selected with an empty description. The submit control remains disabled until a description is entered." },
    { title: "Follow up in maintenance", text: "After reporting, the maintenance history is where tenants follow recorded progress and landlord notes. Urgency describes severity; progress describes the request’s state." },
  ] },
  { id: "messages", title: "Message landlord", heading: "Keep the conversation with your landlord in context.", summary: "Message landlord opens the tenant’s conversation with the landlord, with dated messages, a composer, contact shortcuts, and presence information.", alt: "DormFix tenant landlord conversation with dated incoming and outgoing messages, call and SMS shortcuts, and message composer", guidance: [
    { title: "Read both sides of the thread", text: "Landlord messages and the tenant’s replies use distinct alignment and appearance. Sender labels and timestamps preserve the conversation’s sequence." },
    { title: "Distinguish connection and presence", text: "The captured connection badge reads Connected while landlord presence reads Offline with last seen unavailable. These labels describe different states." },
    { title: "Use the communication entry points", text: "The screen includes a message composer and Call and SMS shortcuts. The tour displays the captured interface; it does not send messages or place calls." },
  ] },
  { id: "house-rules", title: "House rules", heading: "Read rules that apply to your dorm and room.", summary: "Reached from House rules on the Overview Dashboard, this view presents applicable published rules, their scope and category, and priority ordering.", alt: "DormFix tenant house rules with filter disclosure, two published rules, priority and room scope badges, and expanded account details", guidance: [
    { title: "Read scope and priority", text: "Both captured rules apply to all rooms and have the General category. The priority rule appears first and carries a visible label." },
    { title: "Find applicable guidance", text: "Find or filter rules is a collapsible control. The capture shows two of two rules and an expanded account and housing details section beneath them." },
    { title: "Compare the two roles", text: "The tenant capture presents published rules for reading. The landlord tour shows the corresponding publication form and management controls." },
  ] },
  { id: "payments", title: "Payment history", heading: "Track submissions and the landlord’s verdict.", summary: "Payment history lists the tenant’s submitted receipt records, review status, amounts, recorded dates, and details entry points.", alt: "DormFix tenant payment history with three receipts needing review, search and status filters, amounts, and Details links", guidance: [
    { title: "Read the review totals", text: "The capture contains three receipts, all needing review, with zero verified and zero rejected. These counts describe submitted proofs rather than completed payments." },
    { title: "Find a receipt", text: "Search accepts a receipt reference or record ID. Status, payment type, date range, sorting, and pagination help narrow the history." },
    { title: "Inspect the supporting details", text: "The page directs tenants to Details for notes, scan warnings, and the receipt image. The captured list does not show an opened details view." },
  ] },
  { id: "maintenance", title: "Maintenance history", heading: "Follow reports and the landlord’s recorded progress.", summary: "The maintenance list keeps the tenant’s reports searchable, with submitted dates, urgency, progress, and details entry points.", alt: "DormFix tenant maintenance history with one Plumbing request, Low urgency, Awaiting review progress, and filtering controls", guidance: [
    { title: "Separate severity and progress", text: "The captured Plumbing request has Low urgency and Awaiting review progress. An urgency label does not indicate whether work has started or finished." },
    { title: "Find a report", text: "Search by issue or description and filter requests and urgency. More filters and sorting, pagination, refresh, and clear controls support browsing." },
    { title: "Return to reporting", text: "Report an issue opens the submission form; Details is the entry point for the full issue and landlord notes. This screenshot shows the request list." },
  ] },
  { id: "announcements", title: "Announcements", heading: "Read updates for your dormitory and room.", summary: "The tenant announcements page presents landlord-published notices with audience, publication time, expiry, and a current-announcements filter.", alt: "DormFix tenant announcements with current announcement filter and published Earthquake Inspection notice including audience and expiry", guidance: [
    { title: "Check audience and dates", text: "The captured notice is addressed to all tenants and includes publication and expiry dates. The inspection text is example content from the capture." },
    { title: "Browse the notice history", text: "The page explains that expired and archived notices remain in history. The screenshot has Current announcements selected and includes Refresh." },
    { title: "Connect back to Home", text: "Home includes a dorm announcements preview and a link to all announcements. This dedicated page expands that part of the tenant overview." },
  ] },
] as const
export type DormFixTenantScreenId = typeof dormfixTenantScreens[number]["id"]
export const dormfixTenantCaptureIds = ["overview", "overview-actions", "submit-payment", "report-issue", "messages", "house-rules", "payments", "maintenance", "announcements"] as const
export const dormfixTenantShortcuts = ["submit-payment", "report-issue", "messages", "house-rules"] as const
