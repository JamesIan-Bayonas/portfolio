import sharp from "sharp"
import { mkdir, writeFile } from "node:fs/promises"

const manifest = {}
await mkdir("public/screenshots/dormfix-landlord", { recursive: true })
for (const screen of ["login", "overview", "overview-details", "tenants", "rooms", "payments", "maintenance", "messages", "announcements", "house-rules"]) {
  for (const mode of ["light", "dark"]) {
    const id = `${screen}-${mode}`
    const { width, height } = await sharp(`src/assets/dormfix/landlord/${id}.png`).metadata()
    const variants = []
    for (const target of [...new Set([640, 1280, width].filter(size => size <= width))]) {
      const src = `/screenshots/dormfix-landlord/${id}-${target}.webp`
      await sharp(`src/assets/dormfix/landlord/${id}.png`).resize({ width: target }).webp({ quality: 88 }).toFile(`public${src}`)
      variants.push({ src, width: target })
    }
    manifest[id] = { width, height, variants }
  }
}
await writeFile("src/data/dormfixLandlordScreenshots.json", JSON.stringify(manifest, null, 2) + "\n")
console.log("Generated 20 theme-matched DormFix login and landlord captures.")
