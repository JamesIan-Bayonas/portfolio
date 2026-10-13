import test from "node:test"
import assert from "node:assert/strict"
import { findCaseStudyPage, projectPageHtml } from "../src/lib/caseStudyPages.ts"
import { searchDestination } from "../src/lib/search.ts"

const page = { projectId: "isdalog", path: "/projects/isdalog/", title: 'IsdaLog & "case"', description: 'A <sample> with literal $1' }
test("dedicated routes match with either trailing slash", () => {
  assert.equal(findCaseStudyPage([page], "/projects/isdalog"), page)
  assert.equal(findCaseStudyPage([page], page.path), page)
  assert.equal(findCaseStudyPage([page], "/"), undefined)
  assert.equal(findCaseStudyPage([page], "/projects/unknown"), undefined)
})
test("static metadata escapes content, preserves replacement characters and assets", () => {
  const html = projectPageHtml('<head><title>Home</title><meta name="description" content="Home description"><script src="/assets/app.js"></script></head>', page)
  assert.ok(html.includes('<title>IsdaLog &amp; &quot;case&quot;</title>'))
  assert.ok(html.includes('content="A &lt;sample&gt; with literal $1"'))
  assert.ok(html.includes('property="og:title"'))
  assert.ok(html.includes('src="/assets/app.js"'))
  assert.ok(!html.includes("Home description"))
})
test("search links reach the dedicated page, its walkthrough, and home projects", () => {
  assert.equal(searchDestination({ path: page.path, target: "case-study" }), page.path)
  assert.equal(searchDestination({ path: page.path, target: "walkthrough" }), `${page.path}#walkthrough`)
  assert.equal(searchDestination({ target: "project-dormfix" }), "/#project-dormfix")
})
