export const dormfixLandlordScreens = [
  {
    id: "overview", title: "Overview", heading: "Start with occupancy and work that needs attention.",
    summary: "The landlord overview combines room capacity, payment review, maintenance, applications, and room assignments. Its lower section continues with room status and recent activity.",
    alt: "DormFix landlord overview with room and bed totals, verified payments, needs-attention items, and occupancy",
    guidance: [
      { title: "Read capacity correctly", text: "The capture shows six rooms with fourteen beds: eleven occupied and three available, rounded to 79% occupancy. Bed occupancy is based on room assignments, not the number of rooms." },
      { title: "Find work needing attention", text: "Maintenance, payment review, applications, and room assignments have separate counts and shortcuts. Verified this month counts verified payment receipts, not every submitted receipt." },
      { title: "Continue down the same overview", text: "Choose Room status & activity to see the lower part of this page. It contains room or tenant search, occupancy cards with maintenance flags, and dated activity records. These are a continuation of Overview, rather than a separate dashboard." },
    ],
  },
  {
    id: "tenants", title: "Tenants", heading: "Connect approved tenants with their assigned rooms.",
    summary: "The tenants workspace brings tenant search, filtering, contact details, and room-assignment status into a landlord management view.",
    alt: "DormFix landlord tenants page with search, tenant filter, assigned tenants, room badges, and Remove tenant controls",
    guidance: [
      { title: "Find a tenant", text: "Search by name, email, or room and use Show tenants to narrow the list. The captured section lists eleven approved tenants with room assignments." },
      { title: "Read assignment context", text: "Rows pair tenant identity and contact information with room and assignment status. Several records are explicitly marked Demo." },
      { title: "Recognize landlord actions", text: "Remove tenant is visible alongside assigned tenants. The screenshot shows the entry point, without showing its confirmation or outcome; viewing this portfolio does not change an assignment." },
    ],
  },
  {
    id: "rooms", title: "Rooms", heading: "Inspect available places within each room.",
    summary: "The rooms view breaks the dormitory's occupancy into individual room capacities, with an Add room entry point for the landlord.",
    alt: "DormFix landlord rooms screen with 79 percent occupancy, fourteen total places, and six room occupancy cards",
    guidance: [
      { title: "Compare overall and room occupancy", text: "The total shows fourteen places, eleven occupied, and three available. Room 100 has one of four places occupied, while the five demo rooms each have two of two places occupied." },
      { title: "Distinguish available from full", text: "Room cards combine a count, progress bar, and Available or Full label. The labels communicate occupancy alongside the visual bars." },
      { title: "Move between planning views", text: "Add room begins room creation in the application. Back to overview returns to the broader operational snapshot; this tour offers equivalent screen navigation without submitting a room." },
    ],
  },
  {
    id: "payments", title: "Payments", heading: "Keep receipt scanning separate from payment approval.",
    summary: "The landlord reviews submitted receipts and records a verdict. The screen explicitly states that receipt scans help review and do not approve payments.",
    alt: "DormFix landlord payments screen with receipt totals, needs-review status, search, payment-type filters, pagination, and receipt details links",
    guidance: [
      { title: "Inspect the review queue", text: "This capture shows three total receipts, all needing review, with zero verified or rejected. The receipt list distinguishes tenant, room, payment type, date, amount, and status." },
      { title: "Narrow and inspect receipts", text: "Search by tenant, room, or receipt reference. Status, payment type, date range, sorting, and pagination help locate a submission; Details is the entry point for inspecting and reviewing it." },
      { title: "Retain a human verdict", text: "A receipt's extracted data or review flag is not payment approval. The separate portfolio walkthrough demonstrates sample extraction, checks, and a reviewer decision, with its historical implementation scope explained in the case study." },
    ],
  },
  {
    id: "maintenance", title: "Maintenance", heading: "Track urgency independently from repair progress.",
    summary: "The maintenance workspace separates the severity of an issue from its current progress, with search and filters for reviewing requests.",
    alt: "DormFix landlord maintenance queue with total, active, high-emergency, and completed counts plus separate urgency and progress columns",
    guidance: [
      { title: "Read the queue totals", text: "The capture shows twenty-one requests, eleven active, two high or emergency, and ten completed. The filtered list shows ten of eleven matching requests on the first of two pages." },
      { title: "Separate severity and progress", text: "Urgency labels such as High or Medium describe priority. Awaiting review and In progress describe workflow state. A high-urgency request can be in either progress state." },
      { title: "Inspect before updating", text: "Search supports tenant, room, issue, or description, with request-state and urgency filters. Details opens the full issue and landlord notes, where the application supports reviewing and updating progress." },
    ],
  },
  {
    id: "messages", title: "Messages", heading: "Keep tenant conversations beside their room context.",
    summary: "The landlord messaging view pairs a searchable tenant list with the selected tenant's room, contact information, and dated conversation history.",
    alt: "DormFix landlord messages screen with tenant search, a selected room conversation, presence information, call and SMS shortcuts, and message composer",
    guidance: [
      { title: "Choose the conversation", text: "Search tenants by name, room, or phone. The highlighted tenant identifies the selected conversation, with the room and contact context visible above the thread." },
      { title: "Distinguish connection and presence", text: "The capture displays Connected while the tenant is Offline with last-seen information unavailable. A connection indicator should not be interpreted as proof that the tenant is currently online." },
      { title: "Review and respond", text: "Dated incoming and outgoing messages retain the discussion context. Refresh history, Call, SMS, and the Message composer are visible application controls; the portfolio displays their captured interface without sending a message." },
    ],
  },
  {
    id: "announcements", title: "Announcements", heading: "Publish notices to the intended tenants.",
    summary: "The landlord announcement workspace supports dormitory-wide or room-specific updates, with publication state, dates, and notice-maintenance controls.",
    alt: "DormFix landlord announcements view with a published notice, audience, publication and expiry dates, New announcement, Edit, and Archive controls",
    guidance: [
      { title: "Read audience and state", text: "The visible notice is marked Published for All tenants, with a publication time and expiry date. Its content is part of the captured example, rather than a current announcement from this portfolio." },
      { title: "Find the notices to review", text: "Show announcements is set to Current published notices. Refresh reloads the list in the application." },
      { title: "Maintain a notice", text: "New announcement starts authoring; Edit announcement changes an existing notice; Archive is a separate action. This capture shows these controls rather than their dialogs or resulting changes." },
    ],
  },
  {
    id: "house-rules", title: "House rules", heading: "Make rule scope and priority explicit.",
    summary: "The landlord can publish instructions for all rooms or a specific room, categorize them, and distinguish priority rules in the published list.",
    alt: "DormFix landlord house rules screen showing publication form, room scope, category, priority checkbox, search filters, and published rule cards",
    guidance: [
      { title: "Define where a rule applies", text: "Applies to selects all rooms or a specific room. The form explains that All rooms includes every tenant in the dormitory." },
      { title: "State and prioritize the instruction", text: "Category and rule text describe the instruction. Mark as priority adds a visible priority label and places priority rules first; line breaks in the text are preserved." },
      { title: "Review published rules", text: "Search, scope, category, and Priority rules only narrow the list. Each card shows its category and audience, with a priority badge where applicable and a separate Delete rule action." },
    ],
  },
] as const

export type DormFixLandlordScreenId = (typeof dormfixLandlordScreens)[number]["id"]
export const dormfixLandlordCaptureIds = ["overview", "overview-details", "tenants", "rooms", "payments", "maintenance", "messages", "announcements", "house-rules"] as const
