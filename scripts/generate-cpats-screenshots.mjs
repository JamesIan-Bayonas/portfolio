import sharp from "sharp"
import { mkdir, writeFile, readFile, stat } from "node:fs/promises"
import { createHash } from "node:crypto"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const captures = [
  { id: "01-login", role: "Sign in", title: "Staff sign in", alt: "CPATS secure staff sign-in page with institutional email and masked password fields", caption: "The sign-in page introduces CPATS and shows a sample request moving through review, delivery, and audit." },
  { id: "02-request-new", role: "Requesting Office", title: "New purchase request", alt: "Requesting Office form for item details, quantities, justification, and request summary", caption: "Staff enter requested items, quantities, and a justification before submitting or saving a draft." },
  { id: "03-request-track", role: "Requesting Office", title: "Track requests", alt: "Requesting Office request list with status filters and procurement records", caption: "The office can search its records and see whether a request needs action, is in progress, approved, declined, or received." },
  { id: "04-request-help", role: "Requesting Office", title: "Requesting Office guide", alt: "CPATS help page for the Requesting Office role", caption: "Role-specific help links common tasks and answers to the request workspace." },
  { id: "05-business-evaluation", role: "Business Office", title: "Fiscal evaluation", alt: "Business Office fiscal evaluation queue with purchase-necessity and budget verification", caption: "The fiscal review records checks for purchase necessity and budget availability before an evaluation outcome." },
  { id: "06-business-history", role: "Business Office", title: "Evaluation history", alt: "Business Office read-only evaluation history for procurement requests", caption: "Saved evaluations remain available as history after the request moves to another office." },
  { id: "07-business-clearance", role: "Business Office", title: "Financial clearance", alt: "Business Office financial-clearance queue showing purchase order, billing, and payment controls", caption: "Financial clearance follows purchase-order preparation and records billing and payment checks." },
  { id: "08-business-help", role: "Business Office", title: "Business Office guide", alt: "CPATS help page for the Business Office role", caption: "The guide links fiscal evaluation, financial clearance, and notifications." },
  { id: "09-admin-review", role: "Admin Office", title: "Executive requisition review", alt: "Admin Office requisition review with three required executive authorization checks", caption: "The executive review presents the three authorization checks before recording a decision." },
  { id: "10-admin-history", role: "Admin Office", title: "Decision history", alt: "Admin Office read-only decision history showing the current procurement stage", caption: "Recorded decisions and the current request stage are shown together for later review." },
  { id: "11-admin-help", role: "Admin Office", title: "Admin Office guide", alt: "CPATS help page for the Admin Office role", caption: "The guide explains administrative review and links to decision history." },
  { id: "12-purchasing-prepare-po", role: "Purchasing Office", title: "Prepare purchase order", alt: "Purchasing Office approved-request queue and purchase-order preparation form", caption: "Purchasing selects an approved request, assigns a purchase-order number, and prepares its asset tag." },
  { id: "13-purchasing-track-orders", role: "Purchasing Office", title: "Track purchase orders", alt: "Purchasing Office order list with request references, offices, stages, and update times", caption: "The order register follows purchase requests through preparation, finance, delivery, and closure." },
  { id: "14-purchasing-reports", role: "Purchasing Office", title: "Monthly purchasing reports", alt: "Monthly purchasing report with transaction totals, value, and register export", caption: "The monthly register summarizes purchase orders and can be exported as CSV for Excel." },
  { id: "15-purchasing-assets", role: "Purchasing Office", title: "Asset register and QR preview", alt: "Individual equipment records with asset IDs, purchase-order units, receipt condition, and QR preview", caption: "Each physical unit has an asset identifier linked to its purchase order and receipt condition." },
  { id: "16-purchasing-help", role: "Purchasing Office", title: "Purchasing Office guide", alt: "CPATS help page for the Purchasing Office role", caption: "The guide links purchase-order preparation, order tracking, reports, and the asset register." },
  { id: "17-receiving-inspection", role: "Receiving Custodian", title: "Receive and inspect delivery", alt: "Receiving Custodian delivery form for attaching an invoice and equipment photo and recording inspection", caption: "The custodian attaches invoice and delivery evidence, then records the delivered quantity and condition." },
  { id: "18-receiving-history", role: "Receiving Custodian", title: "Receiving history", alt: "Read-only receiving history with completed inspections, delivery condition, and saved evidence", caption: "Completed reports retain inspection remarks and links to the saved invoice and delivery photo." },
  { id: "19-receiving-assets", role: "Receiving Custodian", title: "Receiving asset register", alt: "Receiving Custodian asset register with physical-unit QR preview and recorded condition", caption: "The asset view links individual equipment labels to purchase-order units and inspection outcomes." },
  { id: "20-receiving-help", role: "Receiving Custodian", title: "Receiving Custodian guide", alt: "CPATS help page for the Receiving Custodian role", caption: "The guide explains delivery inspection, receiving history, and asset labels." },
  { id: "21-audit-ledger", role: "Global Auditor", title: "Procurement audit ledger", alt: "Global Auditor read-only ledger with request search, status filters, and audit checkpoints", caption: "The auditor can inspect procurement status and saved workflow evidence without changing a request." },
  { id: "22-audit-assets", role: "Global Auditor", title: "Auditor asset register", alt: "Global Auditor equipment register with individual asset QR details and receiving condition", caption: "The read-only register makes purchase and receiving details available alongside asset identifiers." },
  { id: "23-audit-help", role: "Global Auditor", title: "Global Auditor guide", alt: "CPATS help page for the Global Auditor role", caption: "The guide describes the auditor's read-only ledger and asset-register views." },
  { id: "24-system-accounts", role: "System Administrator", title: "Departments and staff accounts", alt: "System Administration workspace for adding departments, inviting staff, and reviewing account status", caption: "Administrators create department records, assign staff roles and departments, and manage eligible invitation or access actions." },
  { id: "25-system-help", role: "System Administrator", title: "System Administrator guide", alt: "CPATS help page for the System Administrator role", caption: "The guide links staff-account and department management with access-related help." },
]

const output = path.join(root, "public/cpats")
await mkdir(path.join(output, "480"), { recursive: true })
await mkdir(path.join(output, "1200"), { recursive: true })
const manifest = []

for (const capture of captures) {
  const original = `public/cpats/originals/${capture.id}.png`
  const source = path.join(root, original)
  const metadata = await sharp(source).metadata()
  if (!metadata.width || !metadata.height) throw new Error(`Missing dimensions: ${original}`)

  const variants = []
  for (const width of [480, 1200]) {
    const target = path.join(output, String(width), `${capture.id}.webp`)
    const info = await sharp(source)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 84, effort: 6, smartSubsample: true })
      .toFile(target)
    variants.push({ src: `/cpats/${width}/${capture.id}.webp`, width: info.width, height: info.height, bytes: info.size })
  }

  manifest.push({
    ...capture,
    width: metadata.width,
    height: metadata.height,
    original: `/${original.replace("public/", "").replaceAll("\\", "/")}`,
    originalSha256: createHash("sha256").update(await readFile(source)).digest("hex"),
    originalBytes: (await stat(source)).size,
    variants,
  })
}

await writeFile(path.join(root, "src/data/cpatsScreenshots.json"), `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Generated responsive previews and metadata for ${manifest.length} CPATS screenshots.`)
