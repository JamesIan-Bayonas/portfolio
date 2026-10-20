import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import ExplorationNav from "./ExplorationNav"
import DeveloperToolsNav from "./DeveloperToolsNav"
import SaveExplorationButton from "./SaveExplorationButton"
import {
  REGEX_TIMEOUT_MS,
  REGEX_MATCH_LIMIT,
  regexInputError,
  type RegexResult,
} from "../lib/regexWorkbench"
import "./JsonWorkbench.css"
import "./RegexWorkbench.css"

const examples = [
  {
    name: "Receipt references",
    pattern: "(?<reference>PAY-\\d{4})",
    flags: "g",
    text: "Receipt PAY-1024 is awaiting review.\nReceipt PAY-1025 was approved.\nREF-3000 is a different reference format.",
  },
  {
    name: "Project names",
    pattern: "\\b(IsdaLog|DormFix|CentraLog|PharmaLink)\\b",
    flags: "gi",
    text: "Explore DormFix and CentraLog.\nCompare ISDALOG with PharmaLink.\nA project name can appear more than once: DormFix.",
  },
  {
    name: "Dates & groups",
    pattern: "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})",
    flags: "g",
    text: "Created: 2026-10-14\nReviewed: 2026-10-19\nA pattern can match 2026-99-99 too: matching is not date validation.",
  },
]
const flagsAvailable = [
  { value: "g", label: "Global" },
  { value: "i", label: "Ignore case" },
  { value: "m", label: "Multiline" },
  { value: "s", label: "Dot all" },
  { value: "u", label: "Unicode" },
]

export default function RegexWorkbench() {
  const [pattern, setPattern] = useState(examples[0].pattern)
  const [flags, setFlags] = useState("g")
  const [text, setText] = useState(examples[0].text)
  const [result, setResult] = useState<RegexResult | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(
    "Choose an example or write a pattern, then run the test.",
  )
  const worker = useRef<Worker | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  function dispose() {
    worker.current?.terminate()
    worker.current = null
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }
  useEffect(() => () => dispose(), [])
  function reset() {
    dispose()
    setBusy(false)
    setResult(null)
    setMessage("Input changed. Run the test to refresh the matches.")
  }
  function fail(error: string) {
    dispose()
    setBusy(false)
    setResult({ ok: false, error })
    setMessage(error)
  }
  function run() {
    dispose()
    setResult(null)
    const request = { pattern, flags, text }
    const invalid = regexInputError(request)
    if (invalid) {
      fail(invalid)
      return
    }
    try {
      const task = new Worker(
        new URL("../workers/regexWorker.ts", import.meta.url),
        { type: "module" },
      )
      worker.current = task
      setBusy(true)
      setMessage("Testing the expression in a background worker…")
      task.onmessage = (event: MessageEvent<RegexResult>) => {
        if (worker.current !== task) return
        const response = event.data
        dispose()
        setBusy(false)
        setResult(response)
        setMessage(
          response.ok
            ? `${response.matches.length}${response.truncated ? "+" : ""} ${
                response.matches.length === 1 ? "match" : "matches"
              } found. ${
                response.truncated
                  ? `Showing the first ${REGEX_MATCH_LIMIT}.`
                  : "Offsets use JavaScript UTF-16 positions."
              }`
            : response.error,
        )
      }
      task.onerror = (event) => {
        event.preventDefault()
        if (worker.current === task)
          fail(
            "The background test could not run. Try again or use a browser with Web Worker support.",
          )
      }
      timer.current = setTimeout(() => {
        if (worker.current === task)
          fail(
            "This pattern took too long and was stopped. Simplify the expression or shorten the test text, then try again.",
          )
      }, REGEX_TIMEOUT_MS)
      task.postMessage(request)
    } catch {
      fail("The background test could not start in this browser.")
    }
  }
  function keyboard(event: KeyboardEvent<HTMLElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault()
      run()
    }
  }
  function load(index: number) {
    reset()
    const example = examples[index]
    setPattern(example.pattern)
    setText(example.text)
    setFlags(example.flags)
    setMessage(
      `${example.name} example loaded. Run the test to inspect its matches.`,
    )
  }
  const matches = result?.ok ? result.matches : []
  let cursor = 0
  const highlighted = matches.map((match, index) => {
    const before = text.slice(cursor, match.index)
    cursor = match.end
    return (
      <Fragment key={`${match.index}-${index}`}>
        {before}
        {match.end === match.index ? (
          <span
            className="regex-empty-match"
            aria-label={`Empty match at position ${match.index}`}
          >
            │
          </span>
        ) : (
          <mark>{text.slice(match.index, match.end)}</mark>
        )}
      </Fragment>
    )
  })
  const tail = text.slice(cursor)
  return (
    <div className="explore-page json-workbench-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <ExplorationNav active="tools" />
          <a href="/tools/" className="case-study-breadcrumb font-mono">
            ← Developer tools
          </a>
          <p className="project-eyebrow font-mono">
            DEVELOPER TOOLS / REGEX LAB
          </p>
          <h1>
            Find the pattern.
            <br />
            Understand the match.
          </h1>
          <p>
            Test JavaScript regular expressions, highlight the results, and
            inspect numbered and named capture groups.
          </p>
          <SaveExplorationButton id="tool:regex-lab" />
        </header>
        <DeveloperToolsNav active="regex" />
        <section
          className="json-workbench regex-workbench"
          aria-labelledby="regex-lab-title"
          onKeyDown={keyboard}
        >
          <div className="json-workbench-titlebar">
            <span>
              <i aria-hidden="true" /> TOOL / 02
            </span>
            <span>JAVASCRIPT ENGINE / LOCAL WORKER</span>
          </div>
          <div className="json-workbench-intro">
            <span className="json-workbench-symbol" aria-hidden="true">
              .*
            </span>
            <div>
              <h2 id="regex-lab-title">Regex Lab</h2>
              <p>
                Patterns and test text stay on this page. Nothing you type is
                uploaded or stored.
              </p>
            </div>
          </div>
          <div className="regex-pattern-editor">
            <label htmlFor="regex-pattern">REGULAR EXPRESSION</label>
            <div>
              <span aria-hidden="true">/</span>
              <input
                id="regex-pattern"
                value={pattern}
                onChange={(event) => {
                  reset()
                  setPattern(event.target.value)
                }}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="none"
                aria-describedby="regex-status"
              />
              <span aria-hidden="true">/{flags}</span>
            </div>
            <fieldset>
              <legend>Pattern flags</legend>
              {flagsAvailable.map((flag) => (
                <label key={flag.value}>
                  <input
                    type="checkbox"
                    checked={flags.includes(flag.value)}
                    onChange={() => {
                      reset()
                      setFlags((previous) =>
                        flagsAvailable
                          .filter((item) =>
                            item.value === flag.value
                              ? !previous.includes(item.value)
                              : previous.includes(item.value),
                          )
                          .map((item) => item.value)
                          .join(""),
                      )
                    }}
                  />
                  <code>{flag.value}</code>
                  {flag.label}
                </label>
              ))}
            </fieldset>
          </div>
          <div className="json-workbench-toolbar">
            <div className="json-workbench-primary">
              <button type="button" onClick={run}>
                {busy ? "Restart test" : "Run test"}
                <kbd>⌘ / Ctrl ↵</kbd>
              </button>
              {busy && (
                <button
                  type="button"
                  onClick={() => {
                    dispose()
                    setBusy(false)
                    setMessage("Test stopped. Edit the pattern or run again.")
                  }}
                >
                  Stop test
                </button>
              )}
            </div>
            <label>
              Example
              <select
                aria-label="Regex example"
                defaultValue=""
                onChange={(event) => {
                  load(Number(event.target.value))
                  event.currentTarget.value = ""
                }}
              >
                <option value="" disabled>
                  Choose an example
                </option>
                {examples.map((example, index) => (
                  <option key={example.name} value={index}>
                    {example.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="json-workbench-editors">
            <div className="json-workbench-editor">
              <div className="json-editor-bar">
                <label htmlFor="regex-text">01 / TEST TEXT</label>
                <span>{text.length.toLocaleString()} / 20,000 characters</span>
              </div>
              <textarea
                id="regex-text"
                value={text}
                onChange={(event) => {
                  reset()
                  setText(event.target.value)
                }}
                spellCheck={false}
                aria-describedby="regex-status"
              />
              <div className="json-editor-actions">
                <button type="button" onClick={() => load(0)}>
                  Load sample
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset()
                    setText("")
                  }}
                >
                  Clear text
                </button>
              </div>
            </div>
            <div className="json-workbench-editor">
              <div className="json-editor-bar">
                <span>02 / HIGHLIGHTED MATCHES</span>
                <span>
                  {result?.ok
                    ? `${matches.length}${
                        result.truncated ? "+" : ""
                      } matches · ${result.elapsedMs.toFixed(1)} ms`
                    : "AWAITING A TEST"}
                </span>
              </div>
              <pre
                className="regex-highlighted"
                aria-label="Highlighted matches"
              >
                {result?.ok ? (
                  <>
                    {highlighted}
                    {tail}
                  </>
                ) : (
                  "Run the test to see matches highlighted here."
                )}
              </pre>
              <div className="json-editor-actions">
                <span>
                  {matches.filter((match) => match.index === match.end).length >
                  0
                    ? "│ marks a zero-length match."
                    : "Matched text is highlighted; other text stays visible."}
                </span>
              </div>
            </div>
          </div>
          <p
            id="regex-status"
            className="json-workbench-status"
            data-error={result?.ok === false}
            role="status"
            aria-atomic="true"
          >
            {message}
          </p>
        </section>
        {result?.ok && matches.length > 0 && (
          <section
            className="regex-match-list"
            aria-labelledby="regex-match-title"
          >
            <h2 id="regex-match-title">Inspect each match.</h2>
            {matches.map((match, index) => (
              <details
                key={`${match.index}-${index}`}
                open={matches.length < 4}
              >
                <summary>
                  Match {index + 1}{" "}
                  <span>
                    Start {match.index} · End {match.end}
                    {match.index === match.end ? " · Empty match" : ""}
                  </span>
                </summary>
                <pre>{match.preview || "(empty string)"}</pre>
                {match.groups.length > 0 && (
                  <dl>
                    {match.groups.map((value, group) => (
                      <div key={group}>
                        <dt>Group {group + 1}</dt>
                        <dd>
                          <code>
                            {value === null
                              ? "(not matched)"
                              : value === ""
                                ? "(empty string)"
                                : value}
                          </code>
                        </dd>
                      </div>
                    ))}
                    {match.named.map(([name, value]) => (
                      <div key={name}>
                        <dt>{name}</dt>
                        <dd>
                          <code>
                            {value === null
                              ? "(not matched)"
                              : value === ""
                                ? "(empty string)"
                                : value}
                          </code>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
                {match.omittedGroups > 0 && (
                  <p>
                    {match.omittedGroups} additional groups omitted from this
                    preview.
                  </p>
                )}
              </details>
            ))}
          </section>
        )}
        <details className="json-workbench-guide">
          <summary>Pattern guide & limits</summary>
          <p>
            <code>\d</code> matches a digit. <code>+</code> repeats one or more
            times. Parentheses capture a group; <code>{"(?<name>...)"}</code>{" "}
            names it. <code>^</code> and <code>$</code> anchor a match. The g
            flag finds multiple matches; i ignores case; m changes line anchors;
            s lets a dot match newlines; u enables Unicode-aware matching.
          </p>
          <p>
            Enter the pattern without surrounding slashes. An empty pattern
            matches empty positions. Tests run in a disposable worker and stop
            after about 1.2 seconds. Input is limited to 20,000 characters,
            patterns to 512 characters, and results to 100 matches with up to 20
            groups per match. Group previews longer than 1,000 characters are
            shortened. Matching a format does not validate its meaning or
            business rules.
          </p>
        </details>
      </div>
    </div>
  )
}
