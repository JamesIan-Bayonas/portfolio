import test from "node:test"
import assert from "node:assert/strict"
import { contactEmail, prepareInquiry } from "../src/lib/contact.ts"

test("email handoff preserves Unicode, ampersands, and multiline message content", () => {
  const message = "Tenant approvals & receipts?\nBudget: ₱20,000 + review."
  const draft = prepareInquiry("improve", { name: "DormFix", caseStudyPath: "/projects/dormfix/" }, message)
  const url = new URL(draft.mailto)
  assert.equal(url.pathname, contactEmail)
  assert.equal(url.searchParams.get("subject"), "Improve an existing system — DormFix")
  assert.equal(url.searchParams.get("body"), draft.body)
  assert.ok(draft.body.includes(message))
  assert.ok(draft.body.includes("https://jamesian-portfolio.vercel.app/projects/dormfix/"))
  assert.ok(draft.copyText.startsWith(`To: ${contactEmail}\nSubject: ${draft.subject}\n`))
})

test("changing reference or choosing a general opportunity leaves no stale project context", () => {
  const project = prepareInquiry("build", { name: "CentraLog", caseStudyPath: "/projects/centralog/" }, " Asset transfers ")
  assert.ok(project.body.includes("\n\nAsset transfers\n\n"))
  const general = prepareInquiry("opportunity", undefined, "Discuss a developer role.")
  assert.equal(general.subject, "Discuss an opportunity — General inquiry")
  assert.ok(!general.body.includes("CentraLog"))
  assert.ok(general.body.includes("Portfolio: https://jamesian-portfolio.vercel.app/"))
})

test("empty and overlong descriptions cannot create an email draft", () => {
  assert.throws(() => prepareInquiry("build", undefined, " \n "))
  assert.throws(() => prepareInquiry("build", undefined, "a".repeat(1001)))
  assert.ok(prepareInquiry("build", undefined, "a".repeat(1000)).mailto)
})
