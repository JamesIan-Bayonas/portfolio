import test from "node:test"
import assert from "node:assert/strict"
import { processJson, JSON_INPUT_LIMIT } from "../src/lib/jsonWorkbench.ts"

test("formatting and minifying preserve strings, nested structures, and empty collections", () => {
  // Use a serialized sample so both escaped quotes and literal backslashes are exercised.
  const value = {
    message: 'a  b " { } \\ path',
    items: [true, null, {}, []],
    unicode: "₱4500 · 日本語",
  }
  const input = JSON.stringify(value)
  const formatted = processJson(input, "format", 4)
  assert.equal(formatted.ok, true)
  assert.deepEqual(JSON.parse(formatted.output), value)
  assert.ok(formatted.output.includes('\n    "message"'))
  assert.ok(formatted.output.includes("{}"))
  assert.ok(formatted.output.includes("[]"))
  const minified = processJson(formatted.output, "minify")
  assert.equal(minified.output, input)
  assert.equal(minified.bytes, new TextEncoder().encode(input).length)
})

test("number tokens, duplicate keys, negative zero, and Unicode escapes are never reserialized", () => {
  const source =
    '{ "id": 900719925474099312345, "value": 0.12345678901234567890, "huge": 1e400, "zero": -0, "id": 1, "text": "\\u0041" }'
  const expected =
    '{"id":900719925474099312345,"value":0.12345678901234567890,"huge":1e400,"zero":-0,"id":1,"text":"\\u0041"}'
  assert.equal(processJson(source, "minify").output, expected)
  const formatted = processJson(source, "format")
  assert.equal(formatted.ok, true)
  assert.equal(processJson(formatted.output, "minify").output, expected)
  assert.equal(processJson(source, "validate").output, source)
})

test("top-level primitives are supported and malformed or oversized input never produces output", () => {
  for (const value of [
    '"hello  world"',
    "null",
    "false",
    "42",
    "-0",
    "[]",
    "{}",
  ]) {
    assert.equal(processJson(value, "format").output, value)
  }
  for (const value of [
    "",
    " ",
    '{"x":}',
    '{"x":1,}',
    "undefined",
    "{x:1}",
    '{"x": NaN}',
    "alert(1)",
    "[1 2]",
  ]) {
    const result = processJson(value, "format")
    assert.equal(result.ok, false)
    assert.equal("output" in result, false)
  }
  assert.equal(
    processJson('"' + "a".repeat(JSON_INPUT_LIMIT) + '"', "validate").ok,
    false,
  )
})

test("deep input cannot expand into an unbounded formatted result", () => {
  const deep = "[".repeat(81) + "0" + "]".repeat(81)
  assert.equal(processJson(deep, "format").ok, false)
  assert.equal(processJson(deep, "minify").output, deep)
  assert.equal(processJson(deep, "validate").ok, true)
})
