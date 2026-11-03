import { useEffect, useRef } from "react"
import PortfolioFieldbook from "./PortfolioFieldbook"
import PortfolioTerminal from "./PortfolioTerminal"
import "./PortfolioDirectory.css"

export default function PortfolioDirectory() {
  const terminalRef = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    function revealTerminal() {
      if (window.location.hash !== "#portfolio-terminal") return
      if (terminalRef.current) terminalRef.current.open = true
      document
        .getElementById("portfolio-terminal")
        ?.scrollIntoView({ behavior: "auto" })
    }
    revealTerminal()
    window.addEventListener("hashchange", revealTerminal)
    return () => window.removeEventListener("hashchange", revealTerminal)
  }, [])
  return (
    <section
      className="portfolio-directory"
      aria-labelledby="directory-title"
      id="directory"
    >
      <PortfolioFieldbook />
      <details ref={terminalRef} className="fieldbook-command-access">
        <summary>
          Prefer a command line?{" "}
          <span className="font-mono">Open the portfolio terminal ↗</span>
        </summary>
        <PortfolioTerminal />
      </details>
    </section>
  )
}
