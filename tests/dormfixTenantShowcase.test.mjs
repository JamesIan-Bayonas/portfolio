import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import sharp from "sharp"
import { dormfixTenantScreens, dormfixTenantCaptureIds, dormfixTenantShortcuts } from "../src/data/dormfixTenantShowcase.ts"

test("tenant overview shortcuts resolve to captured destinations and keep scroll positions together", () => {
  assert.equal(dormfixTenantScreens.filter(screen => screen.id === "overview").length, 1)
  assert.ok(!dormfixTenantScreens.some(screen => screen.id === "overview-actions"))
  assert.ok(dormfixTenantCaptureIds.includes("overview-actions"))
  assert.equal(dormfixTenantShortcuts.length, 4)
  for (const id of dormfixTenantShortcuts) assert.ok(dormfixTenantScreens.some(screen => screen.id === id))
  for (const screen of dormfixTenantScreens) assert.ok(dormfixTenantCaptureIds.includes(screen.id))
})

test("all tenant captures have both themes and valid responsive variants", async () => {
  const manifest = JSON.parse(await readFile(new URL("../src/data/dormfixTenantScreenshots.json", import.meta.url), "utf8"))
  for (const id of dormfixTenantCaptureIds) {
    for (const mode of ["light", "dark"]) {
      const asset = manifest[`${id}-${mode}`]
      assert.ok(asset, `Missing ${id} ${mode}`)
      assert.ok(asset.variants.length >= 2)
      for (const variant of asset.variants) {
        const image = await sharp(await readFile(new URL(`../public${variant.src}`, import.meta.url))).metadata()
        assert.equal(image.format, "webp")
        assert.equal(image.width, variant.width)
        assert.ok(image.width <= asset.width)
        assert.ok(Math.abs(image.height - asset.height * variant.width / asset.width) <= 1)
      }
    }
  }
})
