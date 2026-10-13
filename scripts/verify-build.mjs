import assert from "node:assert/strict"
import { readFile, access } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createHash } from "node:crypto"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const readJson = async name => JSON.parse(await readFile(path.join(root, "src/data", name), "utf8"))
const pages = [{ path: "/", title: "James Ian Bayonas | Full-Stack Developer" }, ...await readJson("caseStudyPages.json"), ...await readJson("sitePages.json")]
assert.equal(new Set(pages.map(page => page.path)).size, pages.length, "Duplicate static routes")
const assets = new Set()
const manifest = JSON.parse(await readFile(path.join(root, "dist/.vite/manifest.json"), "utf8"))
function staticDependencies(key, visited = new Set()) {
  if (visited.has(key)) return visited
  visited.add(key)
  for (const dependency of manifest[key]?.imports ?? []) staticDependencies(dependency, visited)
  return visited
}
for (const route of ["index.html", "src/components/Explore.tsx", "src/components/DedicatedCaseStudy.tsx", "src/components/Lab.tsx", "src/components/Notes.tsx"]) {
  assert.ok(manifest[route], `Missing route chunk: ${route}`)
  for (const key of staticDependencies(route)) {
    assert.ok(!/\/(?:motion|HomePage)-/.test(manifest[key].file), `Homepage runtime eagerly loaded by ${route}`)
  }
}
for (const page of pages) {
  const file = path.join(root, "dist", page.path, "index.html")
  const html = await readFile(file, "utf8")
  assert.ok(html.includes(`<title>${page.title}</title>`), `Incorrect title: ${page.path}`)
  assert.equal((html.match(/name="description"/g) ?? []).length, 1, `Description count: ${page.path}`)
  assert.equal((html.match(/property="og:title"/g) ?? []).length, 1, `Sharing title count: ${page.path}`)
  assert.ok(html.includes('name="viewport"'), `Missing viewport: ${page.path}`)
  const preloadsHome = /rel="modulepreload"[^>]+HomePage-/.test(html)
  assert.equal(preloadsHome, page.path === "/", `Homepage preload leaked or missing: ${page.path}`)
  if (page.path !== "/") assert.ok(!/rel="modulepreload"[^>]+\/motion-/.test(html), `Animation preload leaked: ${page.path}`)
  for (const match of html.matchAll(/(?:src|href)="(\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    const asset = match[1]
    await access(path.join(root, "dist", asset))
    assets.add(asset)
  }
}
await access(path.join(root, "dist/RESUME.pdf"))
const fontCss = await readFile(path.join(root, "src/fonts.css"), "utf8")
for (const match of fontCss.matchAll(/url\((\/fonts\/[^)]+)\)/g)) {
  const bytes = await readFile(path.join(root, "dist", match[1]))
  assert.equal(bytes.subarray(0, 4).toString(), "wOF2", `Invalid font: ${match[1]}`)
}
const screenshots = await readJson("screenshots.json")
let variantCount = 0
for (const [id, image] of Object.entries(screenshots)) {
  const original = await readFile(path.join(root, image.original))
  assert.equal(createHash("sha256").update(original).digest("hex"), image.originalSha256, `Regenerate changed screenshot: ${id}`)
  let previousWidth = 0
  for (const variant of image.variants) {
    const bytes = await readFile(path.join(root, "dist", variant.src))
    const metadata = await sharp(bytes).metadata()
    assert.equal(metadata.format, "webp", `Invalid screenshot: ${variant.src}`)
    assert.equal(metadata.width, variant.width, `Incorrect width: ${variant.src}`)
    assert.equal(metadata.height, variant.height, `Incorrect height: ${variant.src}`)
    assert.equal(bytes.length, variant.bytes, `Incorrect size: ${variant.src}`)
    assert.ok(variant.width > previousWidth && variant.width <= image.width, `Invalid width candidates: ${id}`)
    assert.ok(Math.abs(variant.height - variant.width * image.height / image.width) <= 1, `Changed aspect ratio: ${variant.src}`)
    previousWidth = variant.width
    variantCount++
  }
}
console.log(`Verified ${pages.length} static pages, ${assets.size} shared entry assets, ${variantCount} responsive screenshots, fonts, metadata, favicon, and resume.`)
