import { bookValueAt, defaultScenario } from "../lib/depreciation"
import { receiptScenarios } from "../lib/dormfixWalkthrough"
import {
  advanceSaleWalkthrough,
  initialSaleWalkthrough,
  SAMPLE_UNIT_PRICE,
} from "../lib/pharmalinkWalkthrough"
import {
  advanceWalkthrough,
  initialWalkthrough,
  walkthroughBalances,
  SAMPLE_PICKUP_CODE,
  SAMPLE_DELIVERY_CODE,
  SAMPLE_CATCH_PRICE,
  type WalkthroughAction,
} from "../lib/isdalogWalkthrough"

const money = (value: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(
    value,
  )
const sale = advanceSaleWalkthrough(
  advanceSaleWalkthrough(initialSaleWalkthrough(), { type: "review" }),
  { type: "checkout", fail: false },
)
const deliveryActions: WalkthroughAction[] = [
  { type: "publish", cloudTimeout: false },
  { type: "bid" },
  { type: "accept" },
  { type: "pickup", code: SAMPLE_PICKUP_CODE },
  { type: "checkpoint" },
  { type: "checkpoint" },
  { type: "checkpoint" },
  { type: "arrive" },
  { type: "deliver", code: SAMPLE_DELIVERY_CODE },
]
const delivered = deliveryActions.reduce(
  advanceWalkthrough,
  initialWalkthrough(),
)
const settled = walkthroughBalances(
  advanceWalkthrough(delivered, { type: "inspect" }),
)
const receipt = receiptScenarios.matching
const valuation = bookValueAt(
  defaultScenario,
  "straight-line",
  defaultScenario.elapsedDays,
)

export const valuationPreviewPoints = Array.from({ length: 61 }, (_, index) => {
  const day = (defaultScenario.elapsedDays * index) / 60
  const value = bookValueAt(defaultScenario, "straight-line", day)
  return `${((index / 60) * 240).toFixed(2)},${(68 - (value / defaultScenario.cost) * 56).toFixed(2)}`
}).join(" ")

export const toolPreviews = {
  centralog: {
    title: "Asset inputs → calculated value",
    inputLabel: "Sample asset inputs",
    input: [
      `Cost: ${money(defaultScenario.cost)}`,
      `Life: ${defaultScenario.lifespanMonths} months · salvage: ${money(defaultScenario.salvage)}`,
      `Day ${defaultScenario.elapsedDays} · repair: ${defaultScenario.repairDays} days from day ${defaultScenario.repairStartDay}`,
    ],
    operation: "CALCULATE",
    outputLabel: "Straight-line valuation",
    output: [
      {
        label: `Book value at day ${defaultScenario.elapsedDays}`,
        value: money(valuation),
      },
      {
        label: "Repair adjustment",
        value: `${defaultScenario.repairDays} days excluded`,
      },
    ],
    note: "Fixed sample using the Lab's valuation function and one repair window. The curve ends at day 730.",
  },
  dormfix: {
    title: "Receipt text → review fields",
    inputLabel: "Fixed receipt text",
    input: receipt.text.split("\n"),
    operation: "STRUCTURE",
    outputLabel: "Sample structured result",
    output: [
      { label: "Amount", value: money(receipt.amount!) },
      { label: "Reference", value: receipt.reference! },
      { label: "Review decision", value: "Awaiting landlord" },
    ],
    note: "Predefined fields from the matching receipt sample. No OCR or model runs here; a person still decides whether to verify it.",
  },
  isdalog: {
    title: "Buyer inspection → settlement",
    inputLabel: "Sample delivery state",
    input: [
      "Delivery code verified",
      `Catch price held: ${money(SAMPLE_CATCH_PRICE)}`,
      "Buyer confirms inspection",
    ],
    operation: "SETTLE",
    outputLabel: "Sample catch-price allocation",
    output: [
      { label: "Harvester", value: money(settled.harvester) },
      { label: "Platform", value: money(settled.platform) },
      { label: "Remaining held", value: money(settled.held) },
    ],
    note: "Inspection releases this sample settlement. Delivery alone keeps funds held. Delivery fees are separate; no payment is sent.",
  },
  pharmalink: {
    title: "Sample checkout → sale & stock",
    inputLabel: "Sample cart",
    input: [
      `Quantity: ${sale.quantity} units`,
      `Unit price: ${money(SAMPLE_UNIT_PRICE)}`,
      `Starting stock: ${initialSaleWalkthrough().stock} units`,
    ],
    operation: "CHECKOUT",
    outputLabel: "Successful sample result",
    output: [
      { label: "Recorded sale", value: money(sale.originalTotal) },
      { label: "Remaining stock", value: `${sale.stock} units` },
      { label: "History", value: `${sale.history.length} sale entry` },
    ],
    note: "Illustrates the successful checkout path. A failed checkout leaves stock unchanged. No live sale or stock update occurs.",
  },
} as const
