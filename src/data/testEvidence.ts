import type { SourceReference } from "./sourceReferences"

export interface TestEvidence extends Pick<SourceReference, "path" | "commit" | "startLine" | "endLine"> {
  id: string
  title: string
  scenario: string
  expectedOutcome: string
  scope: "Application test" | "Portfolio simulation test"
  scopeDetail: string
  repository: string
}

// Descriptions report assertions inspected at these commits, not execution
// results. Portfolio examples test sample logic independently of live systems.
const portfolioRepository = "https://github.com/JamesIan-Bayonas/portfolio"
const portfolioCommit = "d743f5c8e165decf15696dac621a85510f4554e7"

export const testEvidence: Record<string, TestEvidence[]> = {
  dormfix: [
    {
      id: "scan-and-review-status",
      title: "A scan result keeps landlord review separate",
      scenario: "Payment presentation helpers receive pending, anomalous, verified, and unknown statuses, plus a scan response.",
      expectedOutcome: "Pending reads as awaiting landlord review; verified reads as verified by the landlord. Missing scan data stays unknown, and only string warnings are retained.",
      scope: "Application test",
      scopeDetail: "DormFix client unit test of status and response helpers. OCR, model accuracy, and server approval rules are outside this test.",
      repository: "https://github.com/JamesIan-Bayonas/dormfix",
      path: "client/tests/payments.test.mjs",
      commit: "55d6076fd4d36d390b2fc4d76985a3041cdca519",
      startLine: 50,
      endLine: 60,
    },
    {
      id: "receipt-boundaries",
      title: "Receipt flags cover boundaries and missing fields",
      scenario: "Sample receipts reach the seven-day boundary, exceed it, or omit amount, age, or reference data.",
      expectedOutcome: "Seven days adds no age flag; eight days does. Each missing field requests review, and combined amount and age problems produce two flags.",
      scope: "Portfolio simulation test",
      scopeDetail: "Tests the fixed receipt walkthrough logic in this portfolio. It runs no OCR or inference and makes no payment updates.",
      repository: portfolioRepository,
      path: "tests/dormfixWalkthrough.test.mjs",
      commit: portfolioCommit,
      startLine: 11,
      endLine: 17,
    },
  ],
  isdalog: [
    {
      id: "invalid-pickup",
      title: "An incorrect pickup code preserves custody",
      scenario: "A rider tries to claim a pending cargo order with a code that differs from the stored pickup code.",
      expectedOutcome: "The request returns a pickup-code error. The database still shows no assigned rider and a pending-dispatch status.",
      scope: "Application test",
      scopeDetail: "Laravel feature test of the claim endpoint and stored order state using generated test records.",
      repository: "https://github.com/JamesIan-Bayonas/isdalog",
      path: "tests/Feature/CargoHandshakeTest.php",
      commit: "df1ca46b37737a5811ef5c19393d7d276da6febb",
      startLine: 102,
      endLine: 151,
    },
    {
      id: "settlement-payouts",
      title: "Buyer confirmation distributes the expected amounts",
      scenario: "The buyer confirms a delivered order with a ₱1,000 catch price and a ₱150 delivery fee.",
      expectedOutcome: "The harvester receives ₱970 and the rider ₱150. The order becomes completed, its held balance becomes zero, and reviews are stored.",
      scope: "Application test",
      scopeDetail: "Laravel integration test with a test database. Events and the SMS queue are faked; external notification delivery is outside its scope.",
      repository: "https://github.com/JamesIan-Bayonas/isdalog",
      path: "tests/Feature/OrderSettlementIntegrationTest.php",
      commit: "df1ca46b37737a5811ef5c19393d7d276da6febb",
      startLine: 19,
      endLine: 105,
    },
  ],
  centralog: [
    {
      id: "disposed-transfer",
      title: "Disposed assets cannot be transferred",
      scenario: "An authenticated manager submits a bulk transfer for an asset marked as disposed in the test database.",
      expectedOutcome: "The transfer endpoint returns HTTP 422 (Unprocessable Entity).",
      scope: "Application test",
      scopeDetail: "ASP.NET Core integration test using an isolated MySQL database. This assertion checks the response status; it does not assert rollback or audit-record contents.",
      repository: "https://github.com/JamesIan-Bayonas/centralog",
      path: "CentraLog.Tests/Integration/AssetControllerTests.cs",
      commit: "2374c261689c9f2bec1617a2d12757c4c3f8cbe9",
      startLine: 160,
      endLine: 177,
    },
    {
      id: "valuation-repair-window",
      title: "A repair window pauses the sample valuation",
      scenario: "Both valuation strategies calculate sample values before, during, and after a recorded repair window.",
      expectedOutcome: "Value stays at the repair-start amount during the window, falls when active time resumes, and exceeds the value calculated without the repair adjustment.",
      scope: "Portfolio simulation test",
      scopeDetail: "Tests this portfolio's valuation calculator using fixed sample inputs. It does not execute CentraLog's C# strategies or connect to its asset ledger.",
      repository: portfolioRepository,
      path: "tests/depreciation.test.mjs",
      commit: portfolioCommit,
      startLine: 20,
      endLine: 28,
    },
  ],
  pharmalink: [
    {
      id: "sale-export-history",
      title: "Sale exports retain original and current values",
      scenario: "The CSV builder receives corrected and voided sale records alongside their original totals.",
      expectedOutcome: "The exported rows retain the original 12.50 amount and include the current status, revision, item count, and total for each adjustment.",
      scope: "Application test",
      scopeDetail: "PharmaLink client unit test of CSV output using synthetic records. It does not execute backend sale or stock transactions.",
      repository: "https://github.com/JamesIan-Bayonas/pharmalink",
      path: "tests/exportSalesCsv.test.mjs",
      commit: "31524d96da2f40dd1c34fe47fcf957ae03c84d5b",
      startLine: 83,
      endLine: 90,
    },
    {
      id: "void-once",
      title: "A sample void restores stock only once",
      scenario: "A recorded sample sale is voided with a reason, then receives a second void attempt.",
      expectedOutcome: "Stock returns to ten, the original 75 total remains, the effective total becomes zero, and a repeated void leaves the state unchanged.",
      scope: "Portfolio simulation test",
      scopeDetail: "Tests the portfolio's in-memory sale walkthrough. It does not contact PharmaLink's API, change real inventory, or process a refund.",
      repository: portfolioRepository,
      path: "tests/pharmalinkWalkthrough.test.mjs",
      commit: portfolioCommit,
      startLine: 35,
      endLine: 47,
    },
  ],
}
