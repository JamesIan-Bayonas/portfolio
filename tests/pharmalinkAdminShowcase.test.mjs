import test from "node:test"
import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import sharp from "sharp"
import { pharmalinkAdminScreens } from "../src/data/pharmalinkAdminShowcase.ts"
import { pharmalinkPharmacistScreens, pharmacistScreenSelection } from "../src/data/pharmalinkPharmacistShowcase.ts"

for (const [role, screens] of [["Admin", [...pharmalinkAdminScreens, { id: "login" }]], ["Pharmacist", pharmalinkPharmacistScreens]]) {
test(`PharmaLink ${role} screens have paired themes and valid responsive captures`, async () => {
  const manifest = JSON.parse(await readFile(new URL(`../src/data/pharmalink${role}Screenshots.json`, import.meta.url), "utf8"))
  for (const screen of screens) {
    const light = manifest[`${screen.id}-light`]
    const dark = manifest[`${screen.id}-dark`]
    assert.ok(light && dark, `Missing theme pair for ${screen.id}`)
    assert.equal(light.width, dark.width)
    assert.equal(light.height, dark.height)
    for (const asset of [light, dark]) {
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
}

test("switching to pharmacist preserves shared screens and resets admin-only screens", () => {
  for (const id of ["overview", "pos", "sales-history", "profile"]) assert.equal(pharmacistScreenSelection(id), id)
  for (const id of ["inventory", "user-management", "unknown"]) assert.equal(pharmacistScreenSelection(id), "overview")
})
