import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import sharp from "sharp"
import { isdalogWorkspaceRoles, isdalogWorkspaceScreens, isdalogFishermanDetails, isdalogWorkspaceCaptureIds } from "../src/data/isdalogWorkspaceShowcase.ts"

test("IsdaLog captures include both themes and proportional responsive files", async () => {
  const manifest = JSON.parse(await readFile(new URL("../src/data/isdalogWorkspaceScreenshots.json", import.meta.url), "utf8"))
  assert.equal(Object.keys(manifest).length, 16)
  for (const id of isdalogWorkspaceCaptureIds) for (const mode of ["light", "dark"]) {
    const asset = manifest[`${id}-${mode}`]
    assert.ok(asset, `Missing ${id} ${mode}`)
    assert.ok(asset.variants.length >= 2)
    const original = await sharp(await readFile(new URL(`../src/assets/isdalog/workspaces/${id}-${mode}.png`, import.meta.url))).metadata()
    assert.equal(asset.width, original.width)
    assert.equal(asset.height, original.height)
    for (const variant of asset.variants) {
      const image = await sharp(await readFile(new URL(`../public${variant.src}`, import.meta.url))).metadata()
      assert.equal(image.format, "webp")
      assert.equal(image.width, variant.width)
      assert.ok(image.width <= asset.width)
      assert.ok(Math.abs(image.height - asset.height * variant.width / asset.width) <= 1)
    }
  }
})

test("role screen flows resolve to captures and the fisherman lower view remains part of its dashboard", () => {
  assert.deepEqual(isdalogWorkspaceRoles.map(role => role.id), ["fisherman", "buyer", "rider"])
  for (const role of isdalogWorkspaceRoles) {
    assert.ok(isdalogWorkspaceScreens[role.id].length)
    for (const screen of isdalogWorkspaceScreens[role.id]) assert.ok(isdalogWorkspaceCaptureIds.includes(screen.id))
  }
  assert.equal(isdalogWorkspaceScreens.fisherman.length, 1)
  assert.ok(!isdalogWorkspaceScreens.fisherman.some(screen => screen.id === isdalogFishermanDetails.id))
  assert.ok(isdalogWorkspaceCaptureIds.includes(isdalogFishermanDetails.id))
})
