import sharp from "sharp"
import { mkdir, writeFile, copyFile } from "node:fs/promises"
const source = "C:/Users/James Ian/OneDrive/Pictures/Screenshots"
const pairs = { overview: ["154345", "154348"], "overview-actions": ["154729", "154736"], "submit-payment": ["155213", "155216"], "report-issue": ["155316", "155321"], messages: ["155014", "155018"], "house-rules": ["155847", "155852"], payments: ["154826", "154836"], maintenance: ["154923", "154927"], announcements: ["155044", "155048"] }
await mkdir("src/assets/dormfix/tenant", { recursive: true })
await mkdir("public/screenshots/dormfix-tenant", { recursive: true })
const manifest = {}
for (const [screen, times] of Object.entries(pairs)) {
  for (const [index, mode] of ["light", "dark"].entries()) {
    const id = `${screen}-${mode}`
    const original = `src/assets/dormfix/tenant/${id}.png`
    await copyFile(`${source}/Screenshot 2026-10-18 ${times[index]}.png`, original)
    const { width, height } = await sharp(original).metadata()
    const variants = []
    for (const target of [...new Set([640, 1280, width].filter(size => size <= width))]) {
      const src = `/screenshots/dormfix-tenant/${id}-${target}.webp`
      await sharp(original).resize({ width: target }).webp({ quality: 88 }).toFile(`public${src}`)
      variants.push({ src, width: target })
    }
    manifest[id] = { width, height, variants }
  }
}
await writeFile("src/data/dormfixTenantScreenshots.json", JSON.stringify(manifest, null, 2) + "\n")
console.log("Generated 18 tenant captures and 54 responsive variants.")
