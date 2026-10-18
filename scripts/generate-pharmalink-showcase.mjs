import sharp from "sharp"
import { mkdir, writeFile } from "node:fs/promises"

for (const [role, screens] of Object.entries({
  admin: ["login", "overview", "pos", "inventory", "sales-history", "user-management", "profile"],
  pharmacist: ["overview", "pos", "sales-history", "profile"],
})) {
const manifest = {}
await mkdir(`public/screenshots/pharmalink-${role}`, { recursive: true })
for (const screen of screens) {
  for (const mode of ["light", "dark"]) {
    const id = `${screen}-${mode}`
    const source = `src/assets/pharmalink/${role}/${id}.png`
    const { width, height } = await sharp(source).metadata()
    const variants = []
    for (const target of [...new Set([640, 1280, width].filter(size => size <= width))]) {
      const src = `/screenshots/pharmalink-${role}/${id}-${target}.webp`
      await sharp(source).resize({ width: target }).webp({ quality: 88 }).toFile(`public${src}`)
      variants.push({ src, width: target })
    }
    manifest[id] = { width, height, variants }
  }
}
await writeFile(`src/data/pharmalink${role === "admin" ? "Admin" : "Pharmacist"}Screenshots.json`, JSON.stringify(manifest, null, 2) + "\n")
console.log(`Generated ${Object.keys(manifest).length} theme-matched PharmaLink ${role} captures.`)
}
