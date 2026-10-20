import sharp from "sharp"
import { mkdir, writeFile, copyFile } from "node:fs/promises"
// Regenerate from committed originals; optionally pass the source capture folder to import them.
const sourceFolder = process.argv[2]
const pairs = {
  login: ["005139", "005135"], "buyer-dashboard": ["005208", "005204"],
  "buyer-marketplace": ["005236", "005233"], "fisherman-dashboard": ["005332", "005323"],
  "fisherman-details": ["005628", "005607"], "rider-dashboard": ["005718", "005716"],
  "rider-marketplace": ["005726", "005724"], "rider-dispatch": ["005733", "005731"],
}
await mkdir("src/assets/isdalog/workspaces", { recursive: true })
await mkdir("public/screenshots/isdalog-workspaces", { recursive: true })
const manifest = {}
for (const [screen, times] of Object.entries(pairs)) {
  for (const [index, mode] of ["light", "dark"].entries()) {
    const id = `${screen}-${mode}`
    const original = `src/assets/isdalog/workspaces/${id}.png`
    if (sourceFolder) await copyFile(`${sourceFolder}/Screenshot 2026-10-21 ${times[index]}.png`, original)
    const { width, height } = await sharp(original).metadata()
    const variants = []
    for (const target of [...new Set([640, 1280, width].filter(size => size <= width))]) {
      const src = `/screenshots/isdalog-workspaces/${id}-${target}.webp`
      await sharp(original).resize({ width: target }).webp({ quality: 88 }).toFile(`public${src}`)
      variants.push({ src, width: target })
    }
    manifest[id] = { width, height, variants }
  }
}
await writeFile("src/data/isdalogWorkspaceScreenshots.json", JSON.stringify(manifest, null, 2) + "\n")
console.log("Generated 16 IsdaLog captures and 48 responsive variants.")
