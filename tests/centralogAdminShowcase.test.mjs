import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import sharp from "sharp"
import { centralogAdminScreens } from "../src/data/centralogAdminShowcase.ts"

test("every admin screen has matching theme captures and valid responsive files", async () => {
  const manifest = JSON.parse(await readFile(new URL("../src/data/centralogAdminScreenshots.json", import.meta.url), "utf8"))
  for (const screen of [...centralogAdminScreens, { id: "login" }]) {
    const light = manifest[`${screen.id}-light`]
    const dark = manifest[`${screen.id}-dark`]
    assert.ok(light && dark, `Missing theme pair for ${screen.id}`)
    assert.equal(light.width, dark.width)
    assert.equal(light.height, dark.height)
    for (const asset of [light, dark]) {
      assert.ok(asset.variants.length >= 2)
      for (const variant of asset.variants) {
        const bytes = await readFile(new URL(`../public${variant.src}`, import.meta.url))
        const image = await sharp(bytes).metadata()
        assert.equal(image.format, "webp")
        assert.equal(image.width, variant.width)
        assert.ok(image.width <= asset.width, "Do not upscale captured interfaces")
        assert.ok(Math.abs(image.height - asset.height * variant.width / asset.width) <= 1)
      }
    }
  }
})
