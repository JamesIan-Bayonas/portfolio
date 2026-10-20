export const REGEX_TEXT_LIMIT = 20000
export const REGEX_PATTERN_LIMIT = 512
export const REGEX_MATCH_LIMIT = 100
export const REGEX_TIMEOUT_MS = 1200

export interface RegexRequest {
  pattern: string
  flags: string
  text: string
}
export interface RegexMatch {
  index: number
  end: number
  preview: string
  groups: (string | null)[]
  named: [string, string | null][]
  omittedGroups: number
}
interface RegexSuccess {
  ok: true
  matches: RegexMatch[]
  truncated: boolean
  elapsedMs: number
}
interface RegexFailure {
  ok: false
  error: string
}
export type RegexResult = RegexSuccess | RegexFailure

export function regexInputError(request: RegexRequest): string | null {
  if (request.pattern.length > REGEX_PATTERN_LIMIT)
    return "Use a pattern of 512 characters or fewer."
  if (request.text.length > REGEX_TEXT_LIMIT)
    return "Use test text of 20,000 characters or fewer."
  if (
    !/^[gimsu]*$/.test(request.flags) ||
    new Set(request.flags).size !== request.flags.length
  )
    return "Use each supported flag once: g, i, m, s, u."
  return null
}

// Called in a disposable worker, never on the page's main thread.
export function evaluateRegex(request: RegexRequest): RegexResult {
  const invalid = regexInputError(request)
  if (invalid) return { ok: false, error: invalid }
  const start = performance.now()
  try {
    const expression = new RegExp(request.pattern, request.flags)
    const matches: RegexMatch[] = []
    let match: RegExpExecArray | null
    let truncated = false
    while ((match = expression.exec(request.text))) {
      if (matches.length === REGEX_MATCH_LIMIT) {
        truncated = true
        break
      }
      const clip = (value: string | undefined) =>
        value === undefined
          ? null
          : value.length > 1000
            ? value.slice(0, 1000) + "… [preview shortened]"
            : value
      matches.push({
        index: match.index,
        end: match.index + match[0].length,
        preview: clip(match[0])!,
        groups: match.slice(1, 21).map(clip),
        named: Object.entries(match.groups ?? {})
          .slice(0, 20)
          .map(([name, value]) => [name, clip(value)]),
        omittedGroups: Math.max(0, match.length - 21),
      })
      if (!expression.global) break
      if (match[0] === "") {
        const code = request.text.codePointAt(expression.lastIndex)
        expression.lastIndex +=
          expression.unicode && code !== undefined && code > 0xffff ? 2 : 1
      }
    }
    return {
      ok: true,
      matches,
      truncated,
      elapsedMs: performance.now() - start,
    }
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "This expression could not be evaluated.",
    }
  }
}
