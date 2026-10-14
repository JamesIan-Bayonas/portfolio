import test from "node:test"
import assert from "node:assert/strict"
import runs from "../src/data/applicationTestRuns.json" with { type: "json" }
import {
  sourceReferences,
  sourceReferenceUrl,
} from "../src/data/sourceReferences.ts"
import { testEvidence } from "../src/data/testEvidence.ts"
import { projectEvolution } from "../src/data/projectEvolution.ts"
import {
  filipinoCentraLogSources,
  filipinoCentraLogTests,
  filipinoCentraLogMilestones,
} from "../src/data/filipinoCentralog.ts"
import { projectPageHtml } from "../src/lib/caseStudyPages.ts"
import {
  filipinoDormFixSources,
  filipinoDormFixTests,
  filipinoDormFixMilestones,
  translateDormFix,
} from "../src/data/filipinoDormfix.ts"

test("translated engineering evidence retains every canonical commit, source location, date, and identity", () => {
  for (const [english, filipino] of [
    [sourceReferences.centralog, filipinoCentraLogSources],
    [testEvidence.centralog, filipinoCentraLogTests],
    [projectEvolution.centralog, filipinoCentraLogMilestones],
    [sourceReferences.dormfix, filipinoDormFixSources],
    [testEvidence.dormfix, filipinoDormFixTests],
    [projectEvolution.dormfix, filipinoDormFixMilestones],
  ]) {
    assert.equal(filipino.length, english.length)
    for (const [index, record] of english.entries()) {
      for (const key of [
        "id",
        "path",
        "commit",
        "startLine",
        "endLine",
        "committedAt",
        "evidencePaths",
      ])
        assert.deepEqual(filipino[index][key], record[key])
      assert.notEqual(filipino[index].title, record.title)
    }
  }
  const html = projectPageHtml(
    '<html lang="en"><head><title>Home</title><meta name="description" content="Home"/></head></html>',
    {
      path: "/fil/projects/centralog/",
      title: "CentraLog",
      description: "Filipino",
    },
  )
  assert.ok(html.includes('lang="fil"'))
  assert.ok(
    html.includes(
      'hreflang="en" href="https://jamesian-portfolio.vercel.app/projects/centralog/"',
    ),
  )
  assert.ok(
    html.includes(
      'hreflang="tl" href="https://jamesian-portfolio.vercel.app/fil/projects/centralog/"',
    ),
  )
})

test("DormFix's translated story retains team credit, historical scope, and reciprocal section links", () => {
  const original = {
    id: "dormfix",
    name: "DormFix",
    source: "https://github.com/JamesIan-Bayonas/dormfix",
    caseStudyPath: "/projects/dormfix/",
    tech: ["Tesseract", "Ollama", "Zod", "MSSQL"],
  }
  const translated = translateDormFix(original)
  assert.deepEqual(translated.tech, original.tech)
  assert.equal(translated.caseStudyPath, original.caseStudyPath)
  assert.match(translated.caseStudy.contribution, /kaklase.*bahagi ng pangkat/)
  assert.match(translated.versionSummary, /naunang.*Gemini.*PostgreSQL/)
  assert.match(
    translated.caseStudy.approach,
    /Hindi.*bina-validate.*parsed JSON/,
  )
  assert.match(filipinoDormFixSources[0].context, /hindi.*bina-validate/)
  assert.match(
    filipinoDormFixMilestones[2].outcome,
    /hindi.*matagumpay na release/,
  )
  const html = projectPageHtml(
    '<html lang="en"><head><title>Home</title><meta name="description" content="Home"/></head></html>',
    {
      path: "/fil/projects/dormfix/",
      title: "DormFix",
      description: "Filipino",
    },
  )
  assert.ok(html.includes('lang="fil"'))
  assert.ok(
    html.includes(
      'hreflang="en" href="https://jamesian-portfolio.vercel.app/projects/dormfix/"',
    ),
  )
  assert.ok(
    html.includes(
      'hreflang="tl" href="https://jamesian-portfolio.vercel.app/fil/projects/dormfix/"',
    ),
  )
})
test("execution records retain historical failures, selected scope, and referenced versions", () => {
  for (const run of runs) {
    assert.ok(
      testEvidence[run.projectId].some(
        (record) => record.commit === run.commit,
      ),
    )
    assert.equal(run.passed + run.failed, run.total)
    assert.ok(run.detail.length > 100 && run.detailFil.length > 100)
    assert.ok(
      sourceReferenceUrl(`https://github.com/example/${run.projectId}`, {
        ...run,
        startLine: 1,
        endLine: 1,
      }).includes(`/blob/${run.commit}/`),
    )
    if (run.status === "passed") {
      assert.equal(run.failed, 0)
      assert.ok(run.total > 0)
    }
    if (run.status === "not-run") assert.equal(run.total, 0)
  }
  const isdalog = runs.find((run) => run.projectId === "isdalog")
  assert.equal(isdalog.status, "failed")
  assert.equal(isdalog.failed, 1)
  assert.match(isdalog.detail, /OrderController::store/)
  const transfer = runs.find(
    (run) => run.projectId === "centralog" && run.path.includes("Integration"),
  )
  assert.equal(transfer.status, "passed")
  assert.equal(transfer.total, 1)
  assert.match(transfer.detail, /Only the hard-coded database name/)
})
