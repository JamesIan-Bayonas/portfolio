import { useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import { projects } from "../data/projects"
import {
  buildPortfolioCommands,
  normalizePortfolioCommand,
  resolvePortfolioCommand,
  suggestPortfolioCommands,
} from "../lib/portfolioCommands"

const commands = buildPortfolioCommands(projects)
const welcome = "Choose a destination below, or type help to see every command."

export default function PortfolioTerminal() {
  const input = useRef<HTMLInputElement>(null)
  const draft = useRef("")
  const [command, setCommand] = useState("")
  const [message, setMessage] = useState(welcome)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showHelp, setShowHelp] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const suggestions = dismissed
    ? []
    : suggestPortfolioCommands(command, commands).slice(0, 6)

  function execute(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const value = normalizePortfolioCommand(command)
    if (!value) return
    const destination = resolvePortfolioCommand(value, commands)
    setHistoryIndex(-1)
    draft.current = ""
    setCommand("")
    setDismissed(false)
    if (destination?.action === "clear") {
      setHistory([])
      setShowHelp(false)
      setMessage("Terminal and command history cleared. Ready when you are.")
      return
    }
    setHistory((previous) => [
      ...previous.filter((_, index) => index >= previous.length - 19),
      value,
    ])
    if (destination?.action === "help") {
      setShowHelp(true)
      setMessage(
        "Commands are listed below. Choose one to fill the prompt, then press Enter to run it.",
      )
    } else if (destination?.href) {
      window.location.assign(destination.href)
    } else {
      setMessage(
        `Unknown command: ${value.slice(0, 50)}. Try a project name, lab followed by a project name, or help.`,
      )
    }
  }

  function choose(value: string) {
    setCommand(value)
    setHistoryIndex(-1)
    setDismissed(false)
    input.current?.focus()
  }

  function keyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (
      event.nativeEvent.isComposing ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return
    if (event.key === "Escape") {
      setDismissed(true)
      setShowHelp(false)
    } else if (
      event.key === "Tab" &&
      suggestions.length === 1 &&
      suggestions[0].command !== normalizePortfolioCommand(command)
    ) {
      event.preventDefault()
      choose(suggestions[0].command)
    } else if (event.key === "ArrowUp" && history.length) {
      event.preventDefault()
      if (historyIndex === -1) draft.current = command
      const next = Math.min(historyIndex + 1, history.length - 1)
      setHistoryIndex(next)
      setCommand(history[history.length - 1 - next])
      setDismissed(false)
    } else if (event.key === "ArrowDown" && historyIndex >= 0) {
      event.preventDefault()
      const next = historyIndex - 1
      setHistoryIndex(next)
      setCommand(
        next === -1 ? draft.current : history[history.length - 1 - next],
      )
      setDismissed(false)
    }
  }

  return (
    <div className="directory-terminal" id="portfolio-terminal">
      <div className="directory-terminal-bar">
        <span>
          <i aria-hidden="true" /> PORTFOLIO / TERMINAL
        </span>
        <span>EXPLORE AT YOUR OWN PACE</span>
      </div>
      <div className="terminal-introduction">
        <span className="terminal-introduction-mark" aria-hidden="true">
          &gt;_
        </span>
        <div>
          <h3>A shortcut for the curious.</h3>
          <p>
            Type a project name to read its story. Add <code>lab</code> or{" "}
            <code>notes</code> to go deeper.
          </p>
        </div>
        <span className="terminal-local-label">{commands.length} COMMANDS</span>
      </div>
      <form onSubmit={execute}>
        <label htmlFor="portfolio-command">
          <span>visitor</span>@jamesian <span>~ $</span>
        </label>
        <input
          ref={input}
          id="portfolio-command"
          value={command}
          onChange={(event) => {
            setCommand(event.target.value)
            setHistoryIndex(-1)
            setDismissed(false)
          }}
          onKeyDown={keyDown}
          placeholder="Try lab dormfix"
          maxLength={80}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          aria-label="Portfolio command"
          aria-describedby="portfolio-command-status portfolio-command-hint"
          aria-controls="portfolio-command-suggestions"
        />
        <button type="submit" aria-label="Run portfolio command">
          Enter ↵
        </button>
      </form>
      <p
        id="portfolio-command-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </p>
      <div
        className="terminal-suggestions"
        id="portfolio-command-suggestions"
        role="group"
        aria-label="Suggested commands"
      >
        {suggestions.map((item) => (
          <button
            key={item.command}
            type="button"
            onClick={() => choose(item.command)}
          >
            <code>{item.command}</code>
            <span>{item.description}</span>
            <span aria-hidden="true">↵</span>
          </button>
        ))}
      </div>
      {showHelp && (
        <div
          className="terminal-help"
          role="group"
          aria-label="Available portfolio commands"
        >
          {commands.map((item) => (
            <button
              key={item.command}
              type="button"
              onClick={() => choose(item.command)}
            >
              <code>{item.command}</code>
              <span>{item.description}</span>
            </button>
          ))}
        </div>
      )}
      <div
        className="terminal-project-shortcuts"
        role="group"
        aria-label="Project command shortcuts"
      >
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => choose(project.id)}
          >
            <span aria-hidden="true">↗</span>
            {project.name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setShowHelp((value) => !value)
          }}
          aria-expanded={showHelp}
        >
          All commands {showHelp ? "−" : "+"}
        </button>
      </div>
      <p className="terminal-keyboard-hint" id="portfolio-command-hint">
        <span>
          <kbd>↑</kbd> <kbd>↓</kbd> History
        </span>
        <span>
          <kbd>Tab</kbd> Complete a unique match
        </span>
        <span>
          <kbd>Esc</kbd> Dismiss suggestions
        </span>
      </p>
      <nav aria-label="Terminal shortcuts">
        <a href="/explore/">/projects</a>
        <a href="/lab/">/lab</a>
        <a href="/notes/">/notes</a>
        <a href="/about/">/about</a>
        <a href="/#contact">/contact</a>
      </nav>
    </div>
  )
}
