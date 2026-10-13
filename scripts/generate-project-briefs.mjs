import { readFile, mkdir, writeFile, copyFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"
import path from "node:path"
import vm from "node:vm"
import ts from "typescript"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const hash = bytes => createHash("sha256").update(bytes).digest("hex")
const source = await readFile(path.join(root, "src/data/projects.ts"), "utf8")
const ast = ts.createSourceFile("projects.ts", source, ts.ScriptTarget.Latest, true)
let initializer
for (const statement of ast.statements) {
  if (!ts.isVariableStatement(statement)) continue
  for (const declaration of statement.declarationList.declarations) {
    if (declaration.name.getText(ast) === "projects") initializer = declaration.initializer
  }
}
if (!initializer || !ts.isArrayLiteralExpression(initializer)) throw new Error("Expected the shared projects array")
const projects = vm.runInNewContext(`(${initializer.getText(ast)})`, {
  caseStudyPages: JSON.parse(await readFile(path.join(root, "src/data/caseStudyPages.json"), "utf8")),
  screenshots: JSON.parse(await readFile(path.join(root, "src/data/screenshots.json"), "utf8")),
  dormFixImg: "", isdaLogImg: "", centraLogImg: "", pharmaLinkImg: "",
}, { timeout: 1000 })
const output = path.join(root, "output/pdf")
const publicDir = path.join(root, "public/briefs")
await mkdir(output, { recursive: true })
await mkdir(publicDir, { recursive: true })
const pythonIndex = process.argv.indexOf("--python")
const python = pythonIndex >= 0 ? process.argv[pythonIndex + 1] : process.env.PORTFOLIO_PYTHON ?? "python"
if (!python) throw new Error("Provide a Python executable after --python")
const result = spawnSync(python, [path.join(root, "scripts/render-project-briefs.py"), output], {
  input: JSON.stringify(projects), encoding: "utf8", maxBuffer: 1024 * 1024,
})
if (result.status !== 0) throw new Error(result.stderr || result.error?.message || "PDF generation failed")
const files = JSON.parse(result.stdout)
for (const file of files) {
  await copyFile(path.join(output, file.filename), path.join(publicDir, file.filename))
  const bytes = await readFile(path.join(publicDir, file.filename))
  file.sha256 = hash(bytes)
  file.bytes = bytes.length
}
const sourceHashes = {}
for (const name of ["src/data/projects.ts", "src/data/caseStudyPages.json", "scripts/generate-project-briefs.mjs", "scripts/render-project-briefs.py", "scripts/briefs-requirements.txt"]) {
  sourceHashes[name] = hash((await readFile(path.join(root, name), "utf8")).replace(/\r\n/g, "\n"))
}
await writeFile(path.join(publicDir, "manifest.json"), JSON.stringify({ sourceHashes, files }, null, 2) + "\n")
console.log(`Generated and verified ${files.length} one-page project briefs.`)
