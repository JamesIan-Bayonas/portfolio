import assert from "node:assert/strict"
import { readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { createHash } from "node:crypto"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const output = path.join(root, "dist")
const origin = new URL(
  process.argv[2] ?? "https://jamesian-portfolio.vercel.app/",
)
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex")
async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => htmlFiles(path.join(directory, entry.name))),
  )
  return [
    ...entries
      .filter((entry) => entry.isFile() && entry.name === "index.html")
      .map((entry) => path.join(directory, entry.name)),
    ...nested.flat(),
  ]
}
async function response(route) {
  return fetch(new URL(route, origin), {
    headers: { "Cache-Control": "no-cache" },
    signal: AbortSignal.timeout(30000),
  })
}
const checks = []
const pages = await htmlFiles(output)
for (const filename of pages) {
  const relative = path.relative(output, filename).replaceAll("\\", "/")
  const route =
    relative === "index.html" ? "/" : "/" + relative.replace(/index\.html$/, "")
  checks.push(async () => {
    const expected = await readFile(filename, "utf8")
    const actualResponse = await response(route)
    assert.equal(actualResponse.status, 200, `Page status: ${route}`)
    const actual = await actualResponse.text()
    for (const pattern of [
      /<title>[\s\S]*?<\/title>/g,
      /<html lang="[^"]+">/g,
      /<meta name="description"[^>]+>/g,
      /<meta property="og:(?:title|description)"[^>]+>/g,
      /<link rel="alternate"[^>]+>/g,
    ]) {
      assert.deepEqual(
        actual.match(pattern),
        expected.match(pattern),
        `Metadata mismatch: ${route}`,
      )
    }
  })
}
const manifest = JSON.parse(
  await readFile(path.join(output, ".vite/manifest.json"), "utf8"),
)
const assets = [
  ...new Set(
    Object.values(manifest).flatMap((entry) => [
      entry.file,
      ...(entry.css ?? []),
    ]),
  ),
]
for (const asset of assets)
  checks.push(async () => {
    const actual = await response("/" + asset)
    assert.equal(actual.status, 200, `Asset status: ${asset}`)
    assert.equal(
      hash(Buffer.from(await actual.arrayBuffer())),
      hash(await readFile(path.join(output, asset))),
      `Asset mismatch: ${asset}`,
    )
  })
for (const route of [
  "/notes/feed.xml",
  "/reflections/feed.xml",
  "/verification/application-tests-2026-10-14.json",
])
  checks.push(async () => {
    const actual = await response(route)
    assert.equal(actual.status, 200, `Publication status: ${route}`)
    assert.equal(
      await actual.text(),
      await readFile(path.join(output, route), "utf8"),
      `Publication mismatch: ${route}`,
    )
    if (route.endsWith(".xml"))
      assert.match(
        actual.headers.get("content-type"),
        /^application\/rss\+xml/,
        `RSS content type: ${route}`,
      )
  })
const briefs = JSON.parse(
  await readFile(path.join(root, "public/briefs/manifest.json"), "utf8"),
)
for (const brief of briefs.files)
  checks.push(async () => {
    const actual = await response(`/briefs/${brief.filename}`)
    assert.equal(actual.status, 200, `Brief status: ${brief.filename}`)
    assert.equal(
      hash(Buffer.from(await actual.arrayBuffer())),
      brief.sha256,
      `Brief mismatch: ${brief.filename}`,
    )
  })
for (const route of [
  "/editor/",
  "/api/content-editor",
  "/api/content-editor/notes",
  "/api/content-editor/reflections",
  "/api/content-editor/professional",
])
  checks.push(async () => {
    assert.equal(
      (await response(route)).status,
      404,
      `Owner-only route exposed: ${route}`,
    )
  })
const failures = []
const developmentRoutes = (await readdir(path.join(root, "tests/fixtures")))
  .filter((name) => /\.(html|tsx)$/.test(name))
  .map((name) => `/tests/fixtures/${name}`)
for (const route of developmentRoutes)
  checks.push(async () => {
    assert.equal((await response(route)).status, 404, `Development fixture exposed: ${route}`)
  })
for (let index = 0; index < checks.length; index += 6) {
  const results = await Promise.allSettled(
    checks.slice(index, index + 6).map((check) => check()),
  )
  for (const result of results)
    if (result.status === "rejected") failures.push(result.reason.message)
}
const result = {
  origin: origin.origin,
  checkedAt: new Date().toISOString(),
  pages: pages.length,
  assets: assets.length,
  briefs: briefs.files.length,
  feeds: 2,
  executionDownload: true,
  ownerRoutes: 5,
  developmentRoutes: developmentRoutes.length,
  failures,
}
await writeFile(
  process.argv[3] ? path.resolve(process.argv[3]) : path.join(root, ".tmp-live-verification.json"),
  JSON.stringify(result, null, 2) + "\n",
)
assert.equal(failures.length, 0, failures.join("\n"))
console.log(
  `Verified ${result.pages} live routes, ${result.assets} built assets, ${result.briefs} PDF hashes, both RSS feeds, execution evidence, ${result.ownerRoutes} excluded owner routes, and ${result.developmentRoutes} excluded development routes at ${result.origin}.`,
)
