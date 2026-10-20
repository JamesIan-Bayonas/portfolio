import test from "node:test"
import assert from "node:assert/strict"
import {
  evaluateRegex,
  REGEX_MATCH_LIMIT,
  regexInputError,
} from "../src/lib/regexWorkbench.ts"

test("matches expose exact offsets, numbered groups, and named groups without changing input", () => {
  const request = Object.freeze({
    pattern: "(?<prefix>PAY)-(\\d+)",
    flags: "g",
    text: "PAY-1024 and PAY-1025",
  })
  const result = evaluateRegex(request)
  assert.equal(result.ok, true)
  assert.deepEqual(
    result.matches.map((match) => [match.index, match.end]),
    [
      [0, 8],
      [13, 21],
    ],
  )
  assert.deepEqual(result.matches[0].groups, ["PAY", "1024"])
  assert.deepEqual(result.matches[0].named, [["prefix", "PAY"]])
  assert.equal(result.truncated, false)
  assert.equal(request.text, "PAY-1024 and PAY-1025")
})

test("zero-length matches advance correctly across Unicode code points and stop", () => {
  const unicode = evaluateRegex({ pattern: "(?:)", flags: "gu", text: "😀a" })
  assert.equal(unicode.ok, true)
  assert.deepEqual(
    unicode.matches.map((match) => match.index),
    [0, 2, 3],
  )
  assert.deepEqual(
    unicode.matches.map((match) => match.end),
    [0, 2, 3],
  )
  const single = evaluateRegex({ pattern: "", flags: "", text: "abc" })
  assert.equal(single.matches.length, 1)
})

test("flags change matching behavior and unmatched captures remain distinct from empty strings", () => {
  const insensitive = evaluateRegex({
    pattern: "^pay",
    flags: "gim",
    text: "PAY-1\npay-2",
  })
  assert.equal(insensitive.matches.length, 2)
  const single = evaluateRegex({ pattern: "pay", flags: "i", text: "PAY pay" })
  assert.equal(single.matches.length, 1)
  const optional = evaluateRegex({
    pattern: "(?<optional>a)?(b*)",
    flags: "",
    text: "",
  })
  assert.deepEqual(optional.matches[0].groups, [null, ""])
  assert.deepEqual(optional.matches[0].named, [["optional", null]])
})

test("invalid patterns, unsupported flags, and over-limit inputs return readable errors", () => {
  for (const request of [
    { pattern: "[", flags: "g", text: "test" },
    { pattern: "a", flags: "gg", text: "a" },
    { pattern: "a", flags: "v", text: "a" },
    { pattern: "a".repeat(513), flags: "", text: "a" },
    { pattern: "a", flags: "g", text: "a".repeat(20001) },
  ]) {
    const result = evaluateRegex(request)
    assert.equal(result.ok, false)
    assert.ok(result.error.length > 0)
  }
  assert.equal(regexInputError({ pattern: "", flags: "", text: "" }), null)
})

test("match and capture previews are bounded while offsets retain their actual positions", () => {
  const many = evaluateRegex({
    pattern: ".",
    flags: "g",
    text: "a".repeat(REGEX_MATCH_LIMIT + 1),
  })
  assert.equal(many.matches.length, REGEX_MATCH_LIMIT)
  assert.equal(many.truncated, true)
  const exactly = evaluateRegex({
    pattern: ".",
    flags: "g",
    text: "a".repeat(REGEX_MATCH_LIMIT),
  })
  assert.equal(exactly.truncated, false)
  const long = evaluateRegex({
    pattern: "(a+)",
    flags: "g",
    text: "a".repeat(1500),
  })
  assert.equal(long.matches[0].end, 1500)
  assert.ok(long.matches[0].preview.endsWith("[preview shortened]"))
  assert.ok(long.matches[0].groups[0].length < 1100)
})
