import sharp from "sharp"
import { mkdir, writeFile } from "node:fs/promises"

const manifest = {}
await mkdir("public/screenshots/centralog-admin", { recursive: true })
for (const screen of ["login", "overview", "asset-details", "property-details", "financial-ledger", "audit-log"]) {
  for (const mode of ["light", "dark"]) {
    const id = `${screen}-${mode}`
    const source = `src/assets/centralog/admin/${id}.png`
    const { width, height } = await sharp(source).metadata()
    const variants = []
    for (const target of [640, 1280, width]) {
      const src = `/screenshots/centralog-admin/${id}-${target}.webp`
      await sharp(source).resize({ width: target }).webp({ quality: 88 }).toFile(`public${src}`)
      variants.push({ src, width: target })
    }
    manifest[id] = { width, height, variants }
  }
}
await writeFile("src/data/centralogAdminScreenshots.json", JSON.stringify(manifest, null, 2) + "\n")
console.log("Generated 12 theme-matched CentraLog captures in three responsive sizes each.")
