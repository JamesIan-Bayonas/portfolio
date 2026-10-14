import { readFile, writeFile, rename, unlink } from "node:fs/promises"
import path from "node:path"
import { createHash, randomUUID } from "node:crypto"
import { validateEditableContent } from "../src/lib/contentEditing.ts"

const filenames = { professional: "professionalContent.json", notes: "notesContent.json", milestones: "projectEvolutionContent.json", reflections: "reflectionsContent.json" }
const hash = text => createHash("sha256").update(text).digest("hex")
export function createContentStore(directory) {
  let queue = Promise.resolve()
  const filename = kind => {
    if (!Object.hasOwn(filenames, kind)) throw Object.assign(new Error("Unknown content collection."), { status: 400 })
    return path.join(directory, filenames[kind])
  }
  async function read(kind) {
    const source = await readFile(filename(kind), "utf8")
    return { value: JSON.parse(source), version: hash(source) }
  }
  async function save(kind, value, version) {
    const operation = queue.then(async () => {
      const target = filename(kind)
      const current = await read(kind)
      if (version !== current.version) throw Object.assign(new Error("This content changed outside the editor. Reload it before saving."), { status: 409 })
      try { validateEditableContent(kind, value, current.value) } catch (error) { error.status = 400; throw error }
      const source = JSON.stringify(value, null, 2) + "\n"
      const temporary = target + "." + randomUUID() + ".tmp"
      try {
        await writeFile(temporary, source, { flag: "wx" })
        if ((await read(kind)).version !== version) throw Object.assign(new Error("This content changed while saving. Reload it before saving."), { status: 409 })
        await rename(temporary, target)
      } finally { await unlink(temporary).catch(error => { if (error.code !== "ENOENT") throw error }) }
      return { value, version: hash(source) }
    })
    queue = operation.catch(() => {})
    return operation
  }
  return { read, save }
}
