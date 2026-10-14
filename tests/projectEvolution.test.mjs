import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { projectEvolution } from "../src/data/projectEvolution.ts"
import { milestoneDate } from "../src/lib/projectEvolution.ts"

const pages = JSON.parse(
  readFileSync(
    new URL("../src/data/caseStudyPages.json", import.meta.url),
    "utf8",
  ),
)

test("every case study has distinct milestones in chronological commit order", () => {
  assert.deepEqual(
    Object.keys(projectEvolution).sort(),
    pages.map((page) => page.projectId).sort(),
  )
  for (const milestones of Object.values(projectEvolution)) {
    assert.equal(milestones.length, 3)
    assert.equal(
      new Set(milestones.map((milestone) => milestone.id)).size,
      milestones.length,
    )
    assert.equal(
      new Set(milestones.map((milestone) => milestone.commit)).size,
      milestones.length,
    )
    let previousTime = 0
    for (const milestone of milestones) {
      const time = Date.parse(milestone.committedAt)
      assert.ok(Number.isFinite(time) && time > previousTime)
      assert.match(
        milestone.committedAt,
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
      )
      assert.match(milestone.commit, /^[a-f0-9]{40}$/)
      assert.ok(milestone.change && milestone.reason && milestone.outcome)
      assert.ok(milestone.evidencePaths.length > 0)
      previousTime = time
    }
  }
})

test("milestone dates consistently use Singapore time across UTC midnight", () => {
  assert.equal(milestoneDate("2026-08-16T15:59:59Z"), "16 Aug 2026")
  assert.equal(milestoneDate("2026-08-16T16:00:00Z"), "17 Aug 2026")
  assert.equal(milestoneDate("2026-12-31T16:00:00Z"), "1 Jan 2027")
})
