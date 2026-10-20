export interface IsdaLogWorkspaceScreen {
  id: string
  title: string
  heading: string
  summary: string
  alt: string
  guidance: { title: string; text: string }[]
}
export const isdalogWorkspaceRoles = [
  { id: "fisherman", title: "Fisherman", summary: "Record catches, review auction activity, and follow sales proceeds and withdrawals." },
  { id: "buyer", title: "Buyer", summary: "Follow bids and purchases, wallet funds, shipment tracking, and delivery confirmation." },
  { id: "rider", title: "Rider", summary: "View delivery workload, browse listings, and follow assigned runs in dispatch." },
] as const
export type IsdaLogWorkspaceRole = typeof isdalogWorkspaceRoles[number]["id"]
export const isdalogWorkspaceScreens: Record<IsdaLogWorkspaceRole, IsdaLogWorkspaceScreen[]> = {
  fisherman: [{
    id: "fisherman-dashboard", title: "Dashboard", heading: "Follow catches, auctions, and secured proceeds.",
    summary: "The fisherman dashboard combines balances, recorded catch totals, work needing attention, Telegram connection, and active auctions. Its lower section continues into sales, earnings, and recent catch records.",
    alt: "IsdaLog fisherman dashboard with available balance, net earnings, pending escrow, 161 kilograms of recorded catch, attention cards, Telegram connection, and active auctions",
    guidance: [
      { title: "Separate available and pending funds", text: "The capture shows zero available balance and net earnings, with ₱873 pending in escrow. Pending proceeds are not yet released; the card ties release to buyer delivery confirmation." },
      { title: "Read catch and auction activity", text: "Six catch batches total 161 kg. Attention cards show offers, pickups, and buyer confirmations separately, while five auctions are shown as live in the marketplace." },
      { title: "Continue down the same dashboard", text: "Choose Sales, earnings & records to inspect the lower portion of this dashboard. It includes the sale’s fee and net proceeds, withdrawal history filters, and recent catch search." },
    ],
  }],
  buyer: [{
    id: "buyer-dashboard", title: "Dashboard", heading: "Review purchases, funds, and shipment status.",
    summary: "The buyer dashboard presents active bids, won purchases, wallet balance, escrow in transit, and active shipment cards, with a separate entry point to apply for fisherman access.",
    alt: "IsdaLog buyer dashboard with wallet balance of 9100 pesos, 900 pesos in escrow, one won purchase, and an in-transit sea crab shipment",
    guidance: [
      { title: "Distinguish wallet and escrow", text: "The captured wallet balance is ₱9,100, while ₱900 is held for delivery. The shipment card shows a 6 kg sea crab order in transit with an assigned courier." },
      { title: "Inspect confirmation entry points", text: "Confirm Delivery & Release Payout appears on the shipment card. This is a captured control; viewing the tour does not confirm delivery or release money." },
      { title: "Keep the records’ scopes visible", text: "The top summary shows zero active bids and one won purchase, while the lower watchlist contains a winning-top-bid card. These are the values shown in the capture, not live reconciled counts." },
    ],
  }, {
    id: "buyer-marketplace", title: "Marketplace & tracking", heading: "Follow an active delivery beside marketplace listings.",
    summary: "The buyer marketplace includes active delivery tracking, a route map, escrow custody, a delivery verification code, and catch listings below.",
    alt: "IsdaLog buyer marketplace with an in-transit delivery, three-stage logistics tracker, port map, escrow custody, delivery verification code, and catch listings",
    guidance: [
      { title: "Read the delivery stage", text: "The tracker distinguishes Awaiting Courier, Cargo In Transit, and Arrived at Destination. The captured delivery is en route, with a map centered near Dipolog Port." },
      { title: "Connect verification to handover", text: "The code panel instructs the buyer to present the six-digit delivery code to the courier on physical arrival. This screenshot is a recorded example, not a live delivery session." },
      { title: "Separate tracking from bidding", text: "Active delivery tracking appears above the marketplace listings. Five listings are indicated in the header; the visible cards begin below the tracking panel." },
    ],
  }],
  rider: [{
    id: "rider-dashboard", title: "Dashboard", heading: "Start with delivery workload and recorded activity.",
    summary: "The rider dashboard summarizes completed deliveries and available jobs, provides a dispatch entry point, and shows recent delivery activity.",
    alt: "IsdaLog rider dashboard showing zero completed deliveries, zero available jobs, Galas Port dispatch workspace, and empty recent activity",
    guidance: [
      { title: "Read the empty states", text: "The capture shows zero completed deliveries, zero jobs available, and no recent activity entries for this account. These values describe this recorded screen." },
      { title: "Open the delivery workspace", text: "The Galas Port delivery board links to dispatch. The separate dispatch capture shows the rider’s assigned in-transit run, so available jobs and assigned runs remain distinct." },
      { title: "Follow the role’s navigation", text: "Dashboard, Marketplace, and Dispatch are separate rider views. Use the tour’s screen picker to inspect the captures without leaving the shared role workspace." },
    ],
  }, {
    id: "rider-marketplace", title: "Marketplace", heading: "Browse catches while bidding remains a buyer action.",
    summary: "The rider marketplace displays catch images, weights, landing ports, and highest bids, with buyer-only bidding labels on the listing cards.",
    alt: "IsdaLog rider marketplace with five catch listings, weights, landing ports, highest bids, and Buyer bidding only labels",
    guidance: [
      { title: "Inspect the listing context", text: "Five cards show Acetes Shrimp, Mullet, Eel, Yellowstripe Scad, and Sardine, with weights and landing ports beside current highest bids." },
      { title: "Notice the role boundary", text: "The cards read Buyer bidding only · View listing details. The rider can inspect marketplace context in this capture without a buyer bid control." },
      { title: "Move to dispatch for delivery work", text: "Marketplace listings are separate from delivery assignments. The Dispatch view is where the captured assigned run and delivery-completion entry point appear." },
    ],
  }, {
    id: "rider-dispatch", title: "Dispatch", heading: "Follow assigned runs and the delivery verification step.",
    summary: "The rider dispatch board separates active deliveries from available jobs, showing one assigned en-route run and no unclaimed jobs in this capture.",
    alt: "IsdaLog rider dispatch board with one en-route sea crab delivery, six kilograms cargo, 900 pesos consignment value, and Complete Delivery Enter OTP control",
    guidance: [
      { title: "Separate assigned and available work", text: "The header shows one active delivery and zero available jobs. The assigned run is en route, while the available-jobs section has an empty state." },
      { title: "Read the run details", text: "Run #1 carries 6 kg of sea crab with a ₱900 consignment value and lists Galas Port as pickup. The buyer tracking capture separately names Dipolog Port; the tour preserves both recorded labels." },
      { title: "Identify the completion entry point", text: "Complete Delivery · Enter OTP leads into delivery verification in the application. The capture does not show an entered code or a completed handover." },
    ],
  }],
}
export const isdalogFishermanDetails = {
  id: "fisherman-details", title: "Sales, earnings & records",
  alt: "Lower section of the IsdaLog fisherman dashboard showing sale and escrow breakdown, empty earnings and withdrawal history, and searchable recent catch records",
  caption: "Continuation of the fisherman dashboard after scrolling: sales and escrow, earnings and withdrawal history, and recent catch records.",
  guidance: [
    { title: "Read the sale breakdown", text: "The ₱900 gross sale has a ₱27 platform fee (3%), leaving ₱873 net proceeds (97%). The row is In transit and labels the net amount Expected · not yet released." },
    { title: "Distinguish review from provider payment", text: "The empty earnings and withdrawal history includes type, status, and date filters. Its explanation says pending withdrawals reserve balance and approval records a review decision, rather than confirming provider payment." },
    { title: "Understand the search scope", text: "Recent catch records show six loaded records, with search by fish or landing location and a landing-location filter. The page limits this search to the latest ten catch records." },
  ],
}
export const isdalogWorkspaceCaptureIds = ["login", "fisherman-dashboard", "fisherman-details", "buyer-dashboard", "buyer-marketplace", "rider-dashboard", "rider-marketplace", "rider-dispatch"] as const
