import { createServer } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { randomBytes } from "node:crypto"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createContentStore } from "./content-store.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const store = createContentStore(path.join(root, "src/data"))
const token = randomBytes(32).toString("hex")
const origin = "http://127.0.0.1:4186"
const server = await createServer({
  root,
  configFile: false,
  // Saving content must not broadcast a reload that discards other drafts.
  server: { host: "127.0.0.1", port: 4186, strictPort: true, open: false, cors: false, hmr: false },
  plugins: [react(), tailwindcss(), {
    name: "local-content-editor",
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url?.startsWith("/api/content-editor")) return next()
        const send = (status, data) => { response.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" }); response.end(JSON.stringify(data)) }
        if (request.headers.host !== "127.0.0.1:4186" || (request.headers.origin && request.headers.origin !== origin)) return send(403, { error: "Use the local editor address." })
        const route = request.url.split("?")[0]
        try {
          if (request.method === "GET" && route === "/api/content-editor") return send(200, { notes: await store.read("notes"), milestones: await store.read("milestones"), reflections: await store.read("reflections"), professional: await store.read("professional"), token })
          if (request.method !== "POST" || !/^\/api\/content-editor\/(notes|milestones|reflections|professional)$/.test(route)) return send(404, { error: "Unknown editor action." })
          if (request.headers.origin !== origin || request.headers["x-editor-token"] !== token || !request.headers["content-type"]?.startsWith("application/json")) return send(403, { error: "Reload the local editor before saving." })
          const chunks = []
          let size = 0
          for await (const chunk of request) {
            size += chunk.length
            if (size > 1024 * 1024) return send(413, { error: "Content is too large." })
            chunks.push(chunk)
          }
          let payload
          try { payload = JSON.parse(Buffer.concat(chunks).toString("utf8")) } catch { return send(400, { error: "Invalid content request." }) }
          if (!payload || typeof payload !== "object" || typeof payload.version !== "string") return send(400, { error: "Invalid content request." })
          const kind = route.split("/").at(-1)
          send(200, await store.save(kind, payload.value, payload.version))
        } catch (error) { send(error.status ?? 500, { error: error.status ? error.message : "Content could not be saved. The repository files remain available." }) }
      })
    },
  }],
})
await server.listen()
console.log(`Content workspace: ${origin}/editor/`)
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, async () => { await server.close(); process.exit(0) })
