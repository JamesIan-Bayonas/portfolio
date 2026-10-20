export type JsonAction = "format" | "minify" | "validate"
export const JSON_INPUT_LIMIT = 150000
interface JsonSuccess {
  ok: true
  output: string
  tokens: number
  bytes: number
}
interface JsonFailure {
  ok: false
  error: string
}
export type JsonResult = JsonSuccess | JsonFailure

// Validate syntax with the native parser, but render the original tokens rather
// than serializing parsed numbers. Large integers and precise decimals survive.
export function processJson(
  source: string,
  action: JsonAction,
  indent: 2 | 4 = 2,
): JsonResult {
  if (source.length > JSON_INPUT_LIMIT)
    return {
      ok: false,
      error: "Use 150,000 characters or fewer for this browser workbench.",
    }
  if (!source.trim())
    return { ok: false, error: "Add some JSON or load the sample to begin." }
  try {
    JSON.parse(source)
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "This input is not valid JSON.",
    }
  }
  const tokens =
    source.match(
      /"(?:\\.|[^"\\])*"|[{}\[\],:]|true|false|null|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/g,
    ) ?? []
  let output = source
  if (action === "minify") output = tokens.join("")
  if (action === "format") {
    let depth = 0
    const parts: string[] = []
    let length = 0
    const append = (...values: string[]) => {
      parts.push(...values)
      length += values.reduce((total, value) => total + value.length, 0)
    }
    const newline = () => "\n" + " ".repeat(depth * indent)
    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index]
      const previous = tokens[index - 1]
      const next = tokens[index + 1]
      if (length > 2000000)
        return {
          ok: false,
          error:
            "The formatted result is too large. Try Minify or a smaller input.",
        }
      if (token === "{" || token === "[") {
        append(token)
        depth++
        if (depth > 80)
          return {
            ok: false,
            error:
              "Formatting supports up to 80 nested levels. Use Minify or Validate for deeper input.",
          }
        if (
          !((token === "{" && next === "}") || (token === "[" && next === "]"))
        )
          append(newline())
      } else if (token === "}" || token === "]") {
        depth--
        if (
          !(
            (token === "}" && previous === "{") ||
            (token === "]" && previous === "[")
          )
        )
          append(newline())
        append(token)
      } else if (token === ",") append(",", newline())
      else if (token === ":") append(": ")
      else append(token)
    }
    output = parts.join("")
  }
  return {
    ok: true,
    output,
    tokens: tokens.length,
    bytes: new TextEncoder().encode(output).length,
  }
}
