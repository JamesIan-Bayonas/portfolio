import { access, readFile } from "node:fs/promises"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { preview } from "vite"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

export async function startReleasePreview({
  outDir = path.join(root, "dist"),
  port = 0,
} = {}) {
  await access(path.join(outDir, "index.html"))
  const deployment = JSON.parse(
    await readFile(path.join(root, "vercel.json"), "utf8"),
  )
  const headers = deployment.headers ?? []
  if (headers.some((rule) => !/^\/[\w/.-]+$/.test(rule.source))) {
    throw new Error(
      "Release preview supports exact header paths. Update its matcher for new routing rules.",
    )
  }
  const server = await preview({
    configFile: false,
    root,
    appType: "mpa",
    logLevel: "error",
    build: { outDir },
    preview: {
      host: "127.0.0.1",
      port,
      strictPort: true,
      open: false,
      cors: false,
    },
    plugins: [
      {
        name: "release-preview-headers",
        configurePreviewServer(server) {
          server.middlewares.use((request, response, next) => {
            const pathname = new URL(request.url, "http://127.0.0.1").pathname
            for (const rule of headers) {
              if (rule.source !== pathname) continue
              for (const header of rule.headers)
                response.setHeader(header.key, header.value)
            }
            next()
          })
        },
      },
    ],
  })
  const address = server.httpServer.address()
  if (!address || typeof address === "string") {
    await server.close()
    throw new Error("Release preview did not bind to a local TCP port.")
  }
  return { server, origin: `http://127.0.0.1:${address.port}/` }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const verify = process.argv.includes("--verify")
  const { server, origin } = await startReleasePreview({
    port: verify ? 0 : 4173,
  })
  if (verify) {
    try {
      const { stdout } = await promisify(execFile)(
        process.execPath,
        [
          path.join(root, "scripts/verify-live.mjs"),
          origin,
          path.join(root, ".tmp-release-preview-verification.json"),
        ],
        { cwd: root, timeout: 120000, maxBuffer: 1024 * 1024 },
      )
      console.log(
        "Local production-artifact verification; nothing was deployed.",
      )
      process.stdout.write(stdout)
    } finally {
      await server.close()
    }
  } else {
    console.log(`Production artifact preview: ${origin}`)
    console.log(
      "Serves dist only, with generated page routes and deployment feed headers.",
    )
    process.once("SIGINT", async () => {
      await server.close()
    })
  }
}
