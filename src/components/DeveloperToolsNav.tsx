import "./RegexWorkbench.css"

export default function DeveloperToolsNav({
  active,
}: {
  active: "json" | "regex"
}) {
  return (
    <nav className="developer-tools-nav" aria-label="Developer tools">
      <a href="/tools/" aria-current={active === "json" ? "page" : undefined}>
        <span aria-hidden="true">01 /</span>
        <strong>JSON Workbench</strong>
        <span>Format · Minify · Validate</span>
      </a>
      <a
        href="/tools/regex/"
        aria-current={active === "regex" ? "page" : undefined}
      >
        <span aria-hidden="true">02 /</span>
        <strong>Regex Lab</strong>
        <span>Test · Match · Inspect groups</span>
      </a>
    </nav>
  )
}
