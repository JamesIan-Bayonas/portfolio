import sharp from "sharp"
import { mkdir, writeFile, readFile, stat } from "node:fs/promises"
import { createHash } from "node:crypto"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const sources = {
  isdalog: "src/components/docs/demo/isdalog-demo.png",
  dormfix: "src/components/docs/demo/dorm-fix-demo.png",
  centralog: "src/components/docs/demo/centralog-demo.png",
  pharmalink: "src/components/docs/demo/pharmalink-demo.png",
  "isdalog-telegram": "src/assets/isdalog/02-telegram-ai-scan.png",
  "isdalog-bidding": "src/assets/isdalog/07-buyer-place-bid.png",
  "isdalog-rider": "src/assets/isdalog/08-rider-en-route-dashboard.png",
  "isdalog-tracking": "src/assets/isdalog/09-buyer-live-tracking-otp.png",
  "isdalog-inspection": "src/assets/isdalog/11-buyer-verify-release-escrow.png",
}
await mkdir(path.join(root, "public/screenshots"), { recursive: true })
const manifest = {}
for (const [id, original] of Object.entries(sources)) {
  const source = path.join(root, original)
  const { width, height } = await sharp(source).metadata()
  if (!width || !height) throw new Error(`Missing dimensions: ${original}`)
  const widths = [...new Set([480, 800, 1200, Math.min(width, 1600)].filter(size => size <= width))].sort((a, b) => a - b)
  const variants = []
  for (const targetWidth of widths) {
    const src = `/screenshots/${id}-${targetWidth}.webp`
    const { data, info } = await sharp(source)
      .resize({ width: targetWidth, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6, smartSubsample: true })
      .toBuffer({ resolveWithObject: true })
    await writeFile(path.join(root, "public", src), data)
    variants.push({ src, width: info.width, height: info.height, bytes: info.size })
  }
  const originalSha256 = createHash("sha256").update(await readFile(source)).digest("hex")
  manifest[id] = { original, originalSha256, width, height, originalBytes: (await stat(source)).size, variants }
  console.log(`${id}: ${manifest[id].originalBytes} B original → ${variants.map(v => `${v.width}w/${v.bytes} B`).join(", ")}`)
}
await writeFile(path.join(root, "src/data/screenshots.json"), `${JSON.stringify(manifest, null, 2)}\n`)
