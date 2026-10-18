import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import sharp from "sharp"
import { dormfixLandlordScreens, dormfixLandlordCaptureIds } from "../src/data/dormfixLandlordShowcase.ts"

test("DormFix landlord captures and login have both themes and valid responsive images", async () => {
  const manifest = JSON.parse(await readFile(new URL("../src/data/dormfixLandlordScreenshots.json", import.meta.url), "utf8"))
  for (const id of [...dormfixLandlordCaptureIds, "login"]) {
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

test("the scrolled overview remains a continuation rather than an extra workspace screen", () => {
  assert.equal(dormfixLandlordScreens.filter(screen => screen.id === "overview").length, 1)
  assert.ok(!dormfixLandlordScreens.some(screen => screen.id === "overview-details"))
  assert.ok(dormfixLandlordCaptureIds.includes("overview-details"))
  for (const screen of dormfixLandlordScreens) assert.ok(dormfixLandlordCaptureIds.includes(screen.id))
})
