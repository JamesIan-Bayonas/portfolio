import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import {
  localeFromPath,
  canonicalContentPath,
  localizeCoreHref,
  languageDestination,
} from "../src/lib/locale.ts"
import { projectPageHtml } from "../src/lib/caseStudyPages.ts"
import { filipinoProfile, filipinoProjectCopy } from "../src/data/filipino.ts"
import { professionalProfile } from "../src/data/professionalProfile.ts"
import { siteMetadata } from "../src/data/siteMetadata.ts"

test("supported language routes round trip and retain professional section links", () => {
  for (const path of ["/", "/about/", "/now/", "/work-with-me/"]) {
    const translated = "/fil" + path
    assert.equal(localeFromPath(translated), "fil")
    assert.equal(localeFromPath(translated.slice(0, -1)), "fil")
    assert.equal(canonicalContentPath(translated), path)
    assert.equal(languageDestination(path, "fil"), translated)
    assert.equal(languageDestination(translated, "en"), path)
    assert.ok(siteMetadata.some((page) => page.path === translated))
  }
  assert.equal(
    languageDestination("/now/#learning-title", "fil"),
    "/fil/now/#learning-title",
  )
  assert.equal(
    languageDestination("/fil/now/#learning-title", "en"),
    "/now/#learning-title",
  )
})

test("untranslated resources use explicit English destinations or the relevant Filipino overview", () => {
  assert.equal(localeFromPath("/notes/"), "en")
  assert.equal(localeFromPath("/fil/projects/pharmalink/"), "en")
  assert.equal(localizeCoreHref("/notes/", "fil"), "/notes/")
  assert.equal(localizeCoreHref("/explore/", "fil"), "/fil/#projects")
  assert.equal(
    languageDestination("/projects/dormfix/", "fil"),
    "/fil/projects/dormfix/",
  )
  assert.equal(
    languageDestination("/projects/dormfix/#dormfix-contribution", "fil"),
    "/fil/projects/dormfix/#dormfix-contribution",
  )
  assert.equal(
    languageDestination("/fil/projects/dormfix/#dormfix-contribution", "en"),
    "/projects/dormfix/#dormfix-contribution",
  )
  assert.equal(
    languageDestination("/notes/dormfix-receipt-review/", "fil"),
    "/fil/#english-resources",
  )
  assert.equal(
    languageDestination("/projects/centralog/#centralog-decision", "fil"),
    "/fil/projects/centralog/#centralog-decision",
  )
  assert.equal(
    languageDestination("/fil/projects/centralog/#centralog-decision", "en"),
    "/projects/centralog/#centralog-decision",
  )
  assert.equal(languageDestination("https://example.com/", "en"), "/")
  assert.equal(languageDestination("//example.com/", "fil"), "/fil/")
})

test("Filipino copy retains project connections, dates, institutions, and contribution boundaries", () => {
  assert.equal(filipinoProfile.updatedAt, professionalProfile.updatedAt)
  assert.equal(
    filipinoProfile.education.institution,
    professionalProfile.education.institution,
  )
  assert.equal(
    filipinoProfile.education.degree,
    professionalProfile.education.degree,
  )
  assert.equal(filipinoProfile.education.expectedCompletion, "Agosto 2027")
  for (const key of ["journey", "workAreas"]) {
    assert.deepEqual(
      filipinoProfile[key].map((item) => item.projectIds),
      professionalProfile[key].map((item) => item.projectIds),
    )
  }
  const projects = JSON.parse(
    readFileSync(
      new URL("../src/data/caseStudyPages.json", import.meta.url),
      "utf8",
    ),
  )
  assert.deepEqual(
    Object.keys(filipinoProjectCopy).sort(),
    projects.map((project) => project.projectId).sort(),
  )
  assert.match(
    filipinoProjectCopy.dormfix.summary,
    /kaklase.*bahagi ng pangkat/,
  )
  assert.match(
    filipinoProjectCopy.dormfix.version,
    /naunang.*Gemini.*PostgreSQL/,
  )
  assert.match(filipinoProjectCopy.isdalog.version, /97\/3.*walang tahasang/)
})

test("language alternatives are reciprocal, static, and separate from RSS discovery", () => {
  const template =
    '<html lang="en"><head><title>Home</title><meta name="description" content="Home"/><link rel="alternate" type="application/rss+xml" href="/notes/feed.xml"/></head></html>'
  for (const path of ["/about/", "/fil/about/"]) {
    const html = projectPageHtml(template, {
      path,
      title: "A & B",
      description: "A < B",
    })
    assert.ok(
      html.includes(`<html lang="${path.startsWith("/fil/") ? "fil" : "en"}">`),
    )
    assert.ok(
      html.includes(
        'hreflang="en" href="https://jamesian-portfolio.vercel.app/about/"',
      ),
    )
    assert.ok(
      html.includes(
        'hreflang="tl" href="https://jamesian-portfolio.vercel.app/fil/about/"',
      ),
    )
    assert.equal((html.match(/type="application\/rss\+xml"/g) ?? []).length, 1)
    assert.equal((html.match(/property="og:title"/g) ?? []).length, 1)
  }
})
