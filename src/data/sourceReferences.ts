export interface SourceReference {
  id: string
  title: string
  description: string
  path: string
  symbol: string
  commit: string
  startLine: number
  endLine: number
  context?: string
}

// Each entry was read at the exact commit below. Keep descriptions scoped to
// what the linked code demonstrates, especially client-side API contracts.
export const sourceReferences: Record<string, SourceReference[]> = {
  dormfix: [
    {
      id: "receipt-parsing",
      title: "Receipt text to structured fields",
      description: "Tesseract extracts receipt text, then a local Ollama model receives that text with a Zod-defined response format for payment fields.",
      path: "server/src/services/aiService.ts",
      symbol: "analyzePaymentImage",
      commit: "be2d607e6068967ef637fbfc72c876d89b49c428",
      startLine: 1,
      endLine: 69,
      context: "Historical local pipeline described in this case study. The current service uses Gemini; the Zod response format here does not independently validate parsed JSON at runtime.",
    },
    {
      id: "receipt-checks",
      title: "Amount and date checks",
      description: "The payment controller flags receipts older than seven days, mismatched nonzero amounts, and failed analysis, then records the findings for landlord review.",
      path: "server/src/controllers/paymentController.ts",
      symbol: "processTenantPayment",
      commit: "55d6076fd4d36d390b2fc4d76985a3041cdca519",
      startLine: 18,
      endLine: 117,
      context: "This later version uses the current analysis service; these checks are separate from the historical parsing implementation above.",
    },
  ],
  isdalog: [
    {
      id: "custody-verification",
      title: "Separate pickup and delivery handoffs",
      description: "Pickup and delivery methods check different codes and order states inside transactions. Delivery also checks the assigned rider before marking cargo delivered.",
      path: "app/Http/Controllers/DispatchController.php",
      symbol: "claim / deliver",
      commit: "df1ca46b37737a5811ef5c19393d7d276da6febb",
      startLine: 85,
      endLine: 188,
    },
    {
      id: "wallet-settlement",
      title: "Buyer confirmation and wallet settlement",
      description: "The confirmation method locks the order, checks buyer ownership and repeat settlement, credits the harvester and rider, and clears the held balance in one transaction.",
      path: "app/Http/Controllers/OrderController.php",
      symbol: "confirm",
      commit: "df1ca46b37737a5811ef5c19393d7d276da6febb",
      startLine: 15,
      endLine: 115,
    },
  ],
  centralog: [
    {
      id: "straight-line",
      title: "Straight-line valuation",
      description: "The strategy subtracts recorded maintenance days from elapsed time, calculates monthly depreciation, and floors the rounded result at salvage value.",
      path: "CentraLog.Infrastructure/Services/Depreciation/StraightLineStrategy.cs",
      symbol: "CalculateBookValue",
      commit: "2374c261689c9f2bec1617a2d12757c4c3f8cbe9",
      startLine: 11,
      endLine: 44,
    },
    {
      id: "double-declining",
      title: "Double-declining valuation",
      description: "An interchangeable strategy applies a declining remaining-value factor to active months, using the same maintenance-day adjustment and salvage floor.",
      path: "CentraLog.Infrastructure/Services/Depreciation/DoubleDecliningStrategy.cs",
      symbol: "CalculateBookValue",
      commit: "2374c261689c9f2bec1617a2d12757c4c3f8cbe9",
      startLine: 11,
      endLine: 43,
    },
    {
      id: "bulk-transfer",
      title: "Asset transfers with audit entries",
      description: "Bulk transfers update rooms and custodians alongside audit records in an EF Core transaction, rejecting assets under maintenance or already disposed.",
      path: "CentraLog.Infrastructure/Services/AssetService.cs",
      symbol: "ExecuteBulkTransferAsync",
      commit: "2374c261689c9f2bec1617a2d12757c4c3f8cbe9",
      startLine: 67,
      endLine: 121,
    },
  ],
  pharmalink: [
    {
      id: "sale-contract",
      title: "Sale recording and adjustment contracts",
      description: "The client defines sale items, original and effective records, request identifiers, and revision numbers, with API calls to create sales, record adjustments, and look up requests.",
      path: "src/services/saleService.ts",
      symbol: "createSale / adjustSale / findSaleAdjustment",
      commit: "31524d96da2f40dd1c34fe47fcf957ae03c84d5b",
      startLine: 27,
      endLine: 116,
      context: "Client API contract. Backend stock updates and transaction guarantees are not established by this file.",
    },
    {
      id: "void-recovery",
      title: "Void adjustments and uncertain outcomes",
      description: "The adjustment dialog retains the reason, revision, and request key. When the outcome is unknown, it checks that request before allowing a retry with the same key.",
      path: "src/features/sales/SaleAdjustmentModal.tsx",
      symbol: "submit / reconcile",
      commit: "31524d96da2f40dd1c34fe47fcf957ae03c84d5b",
      startLine: 86,
      endLine: 131,
      context: "Client recovery workflow for corrections and voids; inventory restoration is performed by the API.",
    },
  ],
}

export function sourceReferenceUrl(repositoryUrl: string, reference: Pick<SourceReference, "path" | "commit" | "startLine" | "endLine">): string {
  const path = reference.path.split("/").map(encodeURIComponent).join("/")
  return `${repositoryUrl}/blob/${reference.commit}/${path}#L${reference.startLine}-L${reference.endLine}`
}
