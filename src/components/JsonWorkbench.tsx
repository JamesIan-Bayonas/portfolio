import { useState, type KeyboardEvent } from "react"
import ExplorationNav from "./ExplorationNav"
import DeveloperToolsNav from "./DeveloperToolsNav"
import SaveExplorationButton from "./SaveExplorationButton"
import {
  JSON_INPUT_LIMIT,
  processJson,
  type JsonAction,
} from "../lib/jsonWorkbench"
import "./JsonWorkbench.css"

const sample =
  '{"project":"DormFix","workflow":"receipt-review","sample":true,"checks":{"amountMatches":true,"dateWithinWindow":true},"decision":"awaiting-landlord-review","items":[{"label":"Example rent","amount":4500}],"note":"Illustrative payload; not an API contract."}'

export default function JsonWorkbench() {
  const [source, setSource] = useState(sample)
  const [output, setOutput] = useState("")
  const [indent, setIndent] = useState<2 | 4>(2)
  const [message, setMessage] = useState(
    "Choose Format, Minify, or Validate to begin.",
  )
  const [error, setError] = useState(false)
  const [stats, setStats] = useState("")
  function edit(value: string) {
    setSource(value)
    setOutput("")
    setStats("")
    setError(false)
    setMessage("Input changed. Run an action to refresh the output.")
  }
  function run(action: JsonAction) {
    const result = processJson(source, action, indent)
    setError(!result.ok)
    if (!result.ok) {
      setOutput("")
      setStats("")
      setMessage(result.error)
      return
    }
    setOutput(result.output)
    setStats(
      `${result.output.split("\n").length} lines · ${result.bytes.toLocaleString()} bytes · ${result.tokens} tokens`,
    )
    setMessage(
      action === "validate"
        ? "Valid JSON. The output preserves your input exactly."
        : action === "format"
          ? "JSON formatted. Original number values and string escapes are preserved."
          : "JSON minified. Whitespace inside strings is preserved.",
    )
  }
  function keyboard(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault()
      run("format")
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(output)
      setMessage("Output copied.")
    } catch {
      setMessage(
        "Copy is unavailable in this browser. Select the output text or use Download JSON.",
      )
    }
  }
  function download() {
    const url = URL.createObjectURL(
      new Blob([output], { type: "application/json;charset=utf-8" }),
    )
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = "formatted-data.json"
    anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setMessage("JSON download prepared.")
  }
  return (
    <div className="explore-page json-workbench-page px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1440px] mx-auto">
        <header className="explore-header">
          <ExplorationNav active="tools" />
          <a className="case-study-breadcrumb font-mono" href="/lab/">
            ← Engineering Lab
          </a>
          <p className="project-eyebrow font-mono">
            DEVELOPER TOOLS / JSON WORKBENCH
          </p>
          <h1>
            Small tools.
            <br />
            Clearer data.
          </h1>
          <p>
            A practical tool for working with structured data. Format, minify,
            or validate JSON, then copy the result or download it.
          </p>
          <SaveExplorationButton id="tool:json-workbench" />
        </header>
        <DeveloperToolsNav active="json" />
        <section
          className="json-workbench"
          aria-labelledby="json-workbench-title"
        >
          <div className="json-workbench-titlebar">
            <span>
              <i aria-hidden="true" /> TOOL / 01
            </span>
            <span>RUNS IN YOUR BROWSER</span>
          </div>
          <div className="json-workbench-intro">
            <span className="json-workbench-symbol" aria-hidden="true">
              {"{ }"}
            </span>
            <div>
              <h2 id="json-workbench-title">JSON Workbench</h2>
              <p>
                Your input stays on this page. It is not uploaded, saved to
                browser storage, or included in page links.
              </p>
            </div>
          </div>
          <div className="json-workbench-toolbar">
            <div className="json-workbench-primary">
              <button type="button" onClick={() => run("format")}>
                Format JSON <kbd>⌘ / Ctrl ↵</kbd>
              </button>
              <button type="button" onClick={() => run("minify")}>
                Minify
              </button>
              <button type="button" onClick={() => run("validate")}>
                Validate
              </button>
            </div>
            <label>
              Indentation
              <select
                value={indent}
                onChange={(event) => {
                  setIndent(Number(event.target.value) as 2 | 4)
                  setOutput("")
                  setStats("")
                  setMessage(
                    "Indentation changed. Run Format JSON to refresh the output.",
                  )
                }}
              >
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
              </select>
            </label>
          </div>
          <div className="json-workbench-editors">
            <div className="json-workbench-editor">
              <div className="json-editor-bar">
                <label htmlFor="json-input">01 / INPUT</label>
                <span>
                  {source.length.toLocaleString()} /{" "}
                  {JSON_INPUT_LIMIT.toLocaleString()} characters
                </span>
              </div>
              <textarea
                id="json-input"
                value={source}
                onChange={(event) => edit(event.target.value)}
                onKeyDown={keyboard}
                spellCheck={false}
                autoCapitalize="none"
                autoComplete="off"
                aria-describedby="json-workbench-status"
                aria-invalid={error}
                placeholder='{"hello":"world"}'
              />
              <div className="json-editor-actions">
                <button
                  type="button"
                  onClick={() => {
                    edit(sample)
                    setMessage("Illustrative workflow sample loaded.")
                  }}
                >
                  Load sample
                </button>
                <button
                  type="button"
                  onClick={() => {
                    edit("")
                    setMessage("Input and output cleared.")
                  }}
                  disabled={!source && !output}
                >
                  Clear
                </button>
              </div>
            </div>
            <div className="json-workbench-editor">
              <div className="json-editor-bar">
                <label htmlFor="json-output">02 / OUTPUT</label>
                <span>{stats || "AWAITING AN ACTION"}</span>
              </div>
              <textarea
                id="json-output"
                value={output}
                readOnly
                spellCheck={false}
                aria-describedby="json-workbench-status"
                placeholder="Your result will appear here."
              />
              <div className="json-editor-actions">
                <button type="button" onClick={copy} disabled={!output}>
                  Copy output
                </button>
                <button type="button" onClick={download} disabled={!output}>
                  Download JSON
                </button>
              </div>
            </div>
          </div>
          <p
            id="json-workbench-status"
            className="json-workbench-status"
            data-error={error}
            role="status"
            aria-atomic="true"
          >
            {message}
          </p>
        </section>
        <details className="json-workbench-guide">
          <summary>How the workbench handles your data</summary>
          <p>
            Formatting changes whitespace, while minifying removes whitespace
            outside strings. Validation checks JSON syntax and leaves your input
            unchanged. The formatter retains number tokens, key order, duplicate
            keys, and string escapes; it does not parse and reserialize your
            values.
          </p>
          <p>
            Use up to 150,000 characters per input. Formatting supports up to 80 nested levels and limits expanded output size. This tool checks syntax, not
            application schemas or business rules. Closing or reloading the page
            discards the entered data.
          </p>
        </details>
        <aside className="json-workbench-context">
          <p className="project-eyebrow font-mono">
            FROM VALID DATA TO A VALID DECISION
          </p>
          <h2>A valid response is only the beginning.</h2>
          <p>
            DormFix’s receipt-review note explains why structured JSON and
            successful parsing still need business checks and a human decision.
          </p>
          <a href="/notes/dormfix-receipt-review/">
            Read the receipt-review note ↗
          </a>
          <a href="/lab/#demo-dormfix">Try the sample workflow ↗</a>
        </aside>
      </div>
    </div>
  )
}
