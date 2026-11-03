import { mkdir, writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import path from "node:path"
import sharp from "sharp"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const output = path.join(root, "public/technology-logos")
await mkdir(output, { recursive: true })

async function get(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`${response.status}: ${url}`)
  return response
}
async function revision(repo, branch) {
  const data = await (
    await get(`https://api.github.com/repos/${repo}/commits/${branch}`)
  ).json()
  return data.sha
}

const deviconCommit = await revision("devicons/devicon", "master")
const simpleCommit = await revision("simple-icons/simple-icons", "develop")
const deviconRoot = `https://raw.githubusercontent.com/devicons/devicon/${deviconCommit}`
const simpleRoot = `https://raw.githubusercontent.com/simple-icons/simple-icons/${simpleCommit}`
const simpleMetadata = await (
  await get(`${simpleRoot}/data/simple-icons.json`)
).json()
const sources = []

async function saveSvg(name, url, license, color) {
  let svg = await (await get(url)).text()
  if (
    !svg.includes("<svg") ||
    /<script\b|<foreignObject\b|\bon\w+\s*=|(?:href|src)\s*=\s*["'](?:https?:|\/\/|data:|javascript:)/i.test(
      svg,
    )
  ) {
    throw new Error(`Expected a self-contained SVG: ${url}`)
  }
  if (color) svg = svg.replace(/<svg\b/, `<svg fill="#${color}"`)
  await writeFile(path.join(output, `${name}.svg`), svg)
  sources.push({ file: `${name}.svg`, source: url, license })
}
async function saveRaster(name, url, license) {
  const bytes = Buffer.from(await (await get(url)).arrayBuffer())
  await sharp(bytes)
    .resize({ width: 96, height: 96, fit: "inside", withoutEnlargement: true })
    .webp({ lossless: true })
    .toFile(path.join(output, `${name}.webp`))
  sources.push({
    file: `${name}.webp`,
    source: url,
    license,
    processing: "Resized to fit 96px; lossless WebP",
  })
}

const devicons = [
  "dotnetcore",
  "csharp",
  "entityframeworkcore",
  "express",
  "inertiajs",
  "jwt",
  "laravel",
  "microsoftsqlserver",
  "mysql",
  "mariadb",
  "sqlite",
  "nodejs",
  "ollama",
  "postgresql",
  "react",
  "redis",
  "socketio",
  "tailwindcss",
  "typescript",
  "vitest",
]
// Download static image data only; the website makes no requests to these hosts.
await Promise.all(
  devicons.map((name) =>
    saveSvg(
      name,
      `${deviconRoot}/icons/${name}/${name}-original.svg`,
      "Devicon MIT; underlying trademarks belong to their owners",
    ),
  ),
)
for (const [name, title] of [
  ["daisyui", "daisyUI"],
  ["googlegemini", "Google Gemini"],
  ["leaflet", "Leaflet"],
  ["zod", "Zod"],
]) {
  const icon = (
    Array.isArray(simpleMetadata) ? simpleMetadata : simpleMetadata.icons
  ).find((icon) => icon.title.toLowerCase() === title.toLowerCase())
  if (!icon) throw new Error(`Missing icon metadata: ${title}`)
  await saveSvg(
    name,
    `${simpleRoot}/icons/${name}.svg`,
    "Simple Icons CC0; underlying trademarks belong to their owners",
    icon.hex,
  )
}

for (const [name, repo, branch, sourcePath, raster, license] of [
  [
    "reverb",
    "laravel/reverb",
    "main",
    "resources/views/components/icons/reverb.blade.php",
    false,
    "MIT",
  ],
  [
    "xunit",
    "xunit/media",
    "main",
    "logo-transparent.svg",
    false,
    "Upstream xUnit.net brand asset; see source repository",
  ],
  [
    "dapper",
    "DapperLib/Dapper",
    "main",
    "docs/assets/icon.png",
    true,
    "Apache-2.0",
  ],
  [
    "tesseract",
    "naptha/tesseract.js",
    "master",
    "docs/images/tesseract.png",
    true,
    "Apache-2.0",
  ],
]) {
  const commit = await revision(repo, branch)
  const url = `https://raw.githubusercontent.com/${repo}/${commit}/${sourcePath}`
  if (raster) await saveRaster(name, url, license)
  else await saveSvg(name, url, license)
}
for (const [name, url] of [
  ["DEVICON-LICENSE.txt", `${deviconRoot}/LICENSE`],
  ["SIMPLE-ICONS-LICENSE.txt", `${simpleRoot}/LICENSE.md`],
]) {
  await writeFile(path.join(output, name), await (await get(url)).text())
}
await writeFile(
  path.join(output, "sources.json"),
  JSON.stringify(
    {
      note: "Logos identify project technologies, not endorsements. Preserve source notices and brand proportions.",
      sources: sources.sort((a, b) => a.file.localeCompare(b.file)),
    },
    null,
    2,
  ) + "\n",
)
console.log(`Saved ${sources.length} technology logos with pinned source URLs.`)
