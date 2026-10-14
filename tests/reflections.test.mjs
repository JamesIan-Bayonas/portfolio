import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { reflections, reflectionCopy, reflectionReadingMinutes } from "../src/data/reflections.ts"
import { reflectionPages } from "../src/data/reflectionPages.ts"
import { languageDestination, localeFromPath } from "../src/lib/locale.ts"
import { reflectionsFeedXml, notesFeedXml } from "../src/lib/notesFeed.ts"
import { projectPageHtml } from "../src/lib/caseStudyPages.ts"

test("reflections have paired translations, stable section anchors, and real writing dates", () => {
  assert.equal(new Set(reflections.map(item => item.path)).size, reflections.length)
  for (const item of reflections) {
    assert.equal(item.path, `/reflections/${item.id}/`)
    assert.match(item.writtenAt, /^\d{4}-\d{2}-\d{2}$/)
    assert.equal(new Date(item.writtenAt).toISOString().slice(0,10), item.writtenAt)
    assert.deepEqual(item.sections.map(section => section.id), item.filipino.sections.map(section => section.id))
    assert.equal(new Set(item.sections.map(section => section.id)).size, item.sections.length)
    for (const locale of ["en", "fil"]) {
      const copy = reflectionCopy(item,locale)
      assert.ok(copy.title && copy.summary && copy.sourceContext && copy.topic)
      assert.ok(reflectionReadingMinutes(copy) >= 1)
      assert.ok(copy.sections.every(section => /^[a-z0-9-]+$/.test(section.id) && section.paragraphs.every(text => text.trim().length > 0)))
    }
  }
})
test("supporting reflection references resolve to published content and known contribution anchors", () => {
  const load = name => JSON.parse(readFileSync(new URL(`../src/data/${name}`,import.meta.url),"utf8"))
  const routes = new Set([...load("caseStudyPages.json"),...load("sitePages.json"),...load("notesContent.json")].map(item => item.path))
  for (const item of reflections) for (const reference of item.references) {
    const [path,hash] = reference.path.split("#")
    assert.ok(routes.has(path), reference.path)
    if(hash) assert.equal(hash, `${path.split("/")[2]}-contribution`)
  }
})
test("reflection language switching preserves article and section with reciprocal metadata", () => {
  assert.equal(reflectionPages.length, 2 + reflections.length * 2)
  for (const item of reflections) {
    const anchor = `#${item.sections[0].id}`
    assert.equal(languageDestination(item.path + anchor,"fil"), `/fil${item.path}${anchor}`)
    assert.equal(languageDestination(`/fil${item.path}${anchor}`,"en"), item.path + anchor)
    for(const path of [item.path,`/fil${item.path}`]) {
      const page = reflectionPages.find(page => page.path === path)
      assert.equal(page.description, reflectionCopy(item,localeFromPath(path)).summary)
      const html = projectPageHtml('<html lang="en"><head><title>Home</title><meta name="description" content="Home"/></head></html>',page)
      assert.ok(html.includes(`hreflang="en" href="https://jamesian-portfolio.vercel.app${item.path}"`))
      assert.ok(html.includes(`hreflang="tl" href="https://jamesian-portfolio.vercel.app/fil${item.path}"`))
      assert.ok(html.includes('href="/reflections/feed.xml"'))
    }
  }
})
test("reflections feed includes English articles only and rejects duplicate or wrong-collection identities", () => {
  const xml = reflectionsFeedXml(reflections)
  assert.equal((xml.match(/<item>/g) ?? []).length,reflections.length)
  assert.match(xml, /<language>en<\/language>/)
  assert.ok(!xml.includes("<pubDate>") && !xml.includes("/fil/"))
  assert.throws(() => reflectionsFeedXml([reflections[0],reflections[0]]), /duplicate/)
  assert.throws(() => reflectionsFeedXml([{...reflections[0],path:"/notes/example/"}]), /Invalid/)
  assert.throws(() => notesFeedXml(reflections), /Invalid/)
  assert.match(reflectionsFeedXml([{...reflections[0],title:"A & B < C"}]), /A &amp; B &lt; C/)
})
