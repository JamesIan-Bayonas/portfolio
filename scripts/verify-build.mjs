import assert from "node:assert/strict"
import { readFile, access } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const readJson = async name => JSON.parse(await readFile(path.join(root, "src/data", name), "utf8"))
const pages = [{ path: "/", title: "James Ian Bayonas | Full-Stack Developer" }, ...await readJson("caseStudyPages.json"), ...await readJson("sitePages.json")]
assert.equal(new Set(pages.map(page => page.path)).size, pages.length, "Duplicate static routes")
const assets = new Set()
for (const page of pages) {
  const file = path.join(root, "dist", page.path, "index.html")
  const html = await readFile(file, "utf8")
  assert.ok(html.includes(`<title>${page.title}</title>`), `Incorrect title: ${page.path}`)
  assert.equal((html.match(/name="description"/g) ?? []).length, 1, `Description count: ${page.path}`)
  assert.equal((html.match(/property="og:title"/g) ?? []).length, 1, `Sharing title count: ${page.path}`)
  assert.ok(html.includes('name="viewport"'), `Missing viewport: ${page.path}`)
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
console.log(`Verified ${pages.length} static pages, ${assets.size} shared entry assets, metadata, favicon, and resume.`)
