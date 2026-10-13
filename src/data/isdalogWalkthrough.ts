import type { WalkthroughRole } from "../lib/isdalogWalkthrough"
import telegram from "../assets/isdalog/02-telegram-ai-scan.png"
import bidding from "../assets/isdalog/07-buyer-place-bid.png"
import rider from "../assets/isdalog/08-rider-en-route-dashboard.png"
import tracking from "../assets/isdalog/09-buyer-live-tracking-otp.png"
import inspection from "../assets/isdalog/11-buyer-verify-release-escrow.png"

export interface WalkthroughStep {
  title: string
  actor: WalkthroughRole
  description: string
  decision: string
  perspectives: Record<WalkthroughRole, string>
}

export const walkthroughSteps: WalkthroughStep[] = [
  {
    title: "Register the catch",
    actor: "harvester",
    description:
      "A linked Telegram account submits a catch photo. In this example, the batch weighs 13 kg with a ₱120/kg asking price: a ₱1,560 floor value.",
    decision:
      "Image classification is separate from the catch's weight, asking price, and port selection. A local fallback can handle a cloud inference failure when that local service is reachable.",
    perspectives: {
      harvester:
        "Submit the photo and confirm the catch details before publishing.",
      buyer: "The catch is not on the auction floor yet.",
      rider: "There is no delivery run to claim yet.",
    },
  },
  {
    title: "Bid on the live floor",
    actor: "buyer",
    description:
      "The published Yellowstripe Scad listing enters the marketplace. A sample buyer places a ₱1,600 bid above its ₱1,560 floor value.",
    decision:
      "Laravel Reverb broadcasts bid changes so connected market views can reflect the current offer. The bid and the later acceptance are separate steps.",
    perspectives: {
      harvester: "Review the current offer for the published catch.",
      buyer: "Place a bid and wait for the harvester's acceptance.",
      rider: "Bidding does not create custody or authorize a pickup.",
    },
  },
  {
    title: "Accept and hold funds",
    actor: "harvester",
    description:
      "Accepting the winning bid stages the delivery order and moves the catch-price funds out of the buyer's available wallet balance into a held balance.",
    decision:
      "Wallet changes and order creation belong in a transaction. Merely placing a bid should not be confused with accepting an order.",
    perspectives: {
      harvester: "Accept the offer to begin the delivery workflow.",
      buyer:
        "After acceptance, ₱1,600 of the sample wallet is held for this catch.",
      rider:
        "A staged delivery run can now be claimed through a verified pickup.",
    },
  },
  {
    title: "Verify the pickup",
    actor: "rider",
    description:
      "The harvester shares the pickup code during the physical handoff. The rider must submit the correct code before taking custody.",
    decision:
      "Pickup and delivery use different verification codes. A wrong pickup code must not advance the order or change the held balance.",
    perspectives: {
      harvester: "Share the pickup code with the rider at the cargo handoff.",
      buyer: "Funds stay held while pickup is being verified.",
      rider:
        "Enter the pickup code. Try an incorrect code to see the transition remain blocked.",
    },
  },
  {
    title: "Track the delivery",
    actor: "rider",
    description:
      "Once pickup is verified, the rider is responsible for the consignment in transit. Advance the sample checkpoints to reach the destination.",
    decision:
      "The real project broadcasts courier coordinates through authorized order channels. This diagram uses illustrative checkpoints rather than live GPS.",
    perspectives: {
      harvester:
        "The catch has left the pickup point; settlement is still pending.",
      buyer: "Follow the delivery's progress toward the receiving point.",
      rider:
        "Advance the sample route to the destination before starting the delivery handoff.",
    },
  },
  {
    title: "Verify the delivery",
    actor: "rider",
    description:
      "At the destination, the buyer shares a separate delivery code. Verification marks the handoff as delivered, without immediately releasing the held funds.",
    decision:
      "Delivered and financially settled are different states. A delivery code proves a workflow handoff, while buyer inspection controls the next step.",
    perspectives: {
      harvester:
        "Delivery is being verified; the catch-price payout is not released yet.",
      buyer: "Share the delivery code when the rider arrives.",
      rider: "Enter the buyer's delivery code to complete the cargo handoff.",
    },
  },
  {
    title: "Inspect and confirm",
    actor: "buyer",
    description:
      "The buyer reviews the delivered catch and confirms inspection. The project also includes evaluations of catch freshness and courier handling.",
    decision:
      "The documented settlement is triggered by buyer confirmation after delivery. Delivery verification alone should not be presented as the release trigger.",
    perspectives: {
      harvester: "Wait for the buyer's inspection confirmation.",
      buyer:
        "Confirm the sample inspection to release the catch-price settlement.",
      rider:
        "The cargo handoff is complete; buyer confirmation remains outstanding.",
    },
  },
  {
    title: "Complete the settlement",
    actor: "buyer",
    description:
      "The sample ₱1,600 catch price is split into a ₱1,552 harvester share and a ₱48 platform share. The held catch-price balance returns to zero.",
    decision:
      "The actual project also credits a rider's delivery fee. This example follows only the catch-price funds so the held balance and 97/3 split are easy to inspect.",
    perspectives: {
      harvester: "The sample catch-price payout is ₱1,552.",
      buyer:
        "The order is settled. Repeating the confirmation must not release the same funds twice.",
      rider:
        "Delivery fees are a separate part of the real project's settlement and are outside this sample ledger.",
    },
  },
]

export const roleLabels: Record<WalkthroughRole, string> = {
  harvester: "Harvester",
  buyer: "Buyer",
  rider: "Rider",
}
export const routeCheckpoints = [
  "Landing port",
  "Pickup complete",
  "In transit",
  "Buyer destination",
]

export function perspectiveScreenshot(role: WalkthroughRole, step: number) {
  if (role === "harvester")
    return {
      src: telegram,
      width: 632,
      height: 885,
      alt: "Original IsdaLog Telegram catch classification interface",
    }
  if (role === "rider")
    return {
      src: rider,
      width: 1675,
      height: 1032,
      alt: "Original IsdaLog rider custody and dispatch dashboard",
    }
  if (step >= 6)
    return {
      src: inspection,
      width: 1406,
      height: 908,
      alt: "Original IsdaLog buyer inspection and escrow release interface",
    }
  if (step >= 4)
    return {
      src: tracking,
      width: 1480,
      height: 907,
      alt: "Original IsdaLog buyer delivery tracking and delivery code interface",
    }
  return {
    src: bidding,
    width: 952,
    height: 901,
    alt: "Original IsdaLog buyer auction and bidding interface",
  }
}
