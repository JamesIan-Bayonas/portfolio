import test from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile, rm, realpath } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import { startReleasePreview } from "../scripts/release-preview.mjs"

test("release preview serves generated routes and deployed feed headers without SPA fallbacks", async () => {
  const tempRoot = await realpath(tmpdir())
  const directory = await mkdtemp(
    path.join(tempRoot, "portfolio-release-preview-"),
  )
  let server
  try {
    await mkdir(path.join(directory, "explore"))
    await mkdir(path.join(directory, "notes"))
    await mkdir(path.join(directory, "assets"))
    await writeFile(
      path.join(directory, "index.html"),
      "<h1>Home artifact</h1>",
    )
    await writeFile(
      path.join(directory, "explore/index.html"),
      "<h1>Explore artifact</h1>",
    )
    await writeFile(
      path.join(directory, "notes/feed.xml"),
      "<rss>fixture</rss>",
    )
    await writeFile(
      path.join(directory, "assets/app.js"),
      "export const artifact = true",
    )
    const preview = await startReleasePreview({ outDir: directory })
    server = preview.server
    const home = await fetch(new URL("/", preview.origin))
    assert.equal(home.status, 200)
    assert.equal(await home.text(), "<h1>Home artifact</h1>")
    const explore = await fetch(new URL("/explore/", preview.origin))
    assert.equal(explore.status, 200)
    assert.equal(await explore.text(), "<h1>Explore artifact</h1>")
    const feed = await fetch(new URL("/notes/feed.xml", preview.origin))
    assert.equal(feed.status, 200)
    assert.match(feed.headers.get("content-type"), /^application\/rss\+xml/)
    assert.equal(
      feed.headers.get("cache-control"),
      "public, max-age=0, must-revalidate",
    )
    assert.equal(await feed.text(), "<rss>fixture</rss>")
    const asset = await fetch(new URL("/assets/app.js", preview.origin))
    assert.equal(asset.status, 200)
    assert.match(asset.headers.get("content-type"), /javascript/)
    assert.equal(await asset.text(), "export const artifact = true")
    for (const route of [
      "/editor/",
      "/api/content-editor",
      "/tests/fixtures/example.html",
      "/unknown-page/",
      "/assets/missing.js",
    ]) {
      const response = await fetch(new URL(route, preview.origin))
      assert.equal(response.status, 404, route)
      assert.ok(!(await response.text()).includes("Home artifact"), route)
    }
  } finally {
    await server?.close()
    assert.equal(path.dirname(directory), tempRoot)
    assert.ok(path.basename(directory).startsWith("portfolio-release-preview-"))
    await rm(directory, { recursive: true, force: true })
  }
})
