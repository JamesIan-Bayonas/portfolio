import { useId, useState } from "react"
import type { ProfessionalContent } from "../data/professionalProfile"
import { projects } from "../data/projects"
import { profileCommand } from "../lib/profileCommands"

const shortcuts = [
  "whoami",
  "ls --journey",
  "ls --skills",
  "projects",
  "./now",
  "./contact",
  "help",
]

interface ProfileExplorerProps {
  content: ProfessionalContent
  locale: "en" | "fil"
}

export default function ProfileExplorer({
  content,
  locale,
}: ProfileExplorerProps) {
  const [input, setInput] = useState("")
  const [last, setLast] = useState("help")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)
  const profile = content[locale].profile
  const command = profileCommand(last)
  const id = useId()
  const route = (path: string) => (locale === "fil" ? `/fil${path}` : path)
  function run(source: string) {
    const value = source.trim().slice(0, 100)
    if (!value) return
    setLast(value)
    setInput("")
    setHistory((previous) => [...previous.slice(-19), value])
    setHistoryIndex(0)
  }
  return (
    <div className="profile-terminal">
      <div className="profile-terminal-bar font-mono" lang="en">
        <span className="terminal-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>james@portfolio / profile</span>
        <span>EXPLORE</span>
      </div>
      <p className="profile-terminal-hint" lang="en">
        Choose a command or type below. Browse the profile, projects, skills,
        and current focus. The standard pages remain available above.
      </p>
      <div
        className="profile-command-shortcuts"
        lang="en"
        role="group"
        aria-label="Profile commands"
      >
        {shortcuts.map((value) => (
          <button type="button" key={value} onClick={() => run(value)}>
            {value}
          </button>
        ))}
      </div>
      <div
        className="profile-command-result"
        role="region"
        aria-label="Profile command result"
        aria-live="polite"
        aria-atomic="true"
        lang={locale}
      >
        <p className="profile-command-echo font-mono" lang="en">
          <span aria-hidden="true">❯</span> {last}
        </p>
        {!command ? (
          <p lang="en">
            Command not found. Choose a command above or enter <code>help</code>
            .
          </p>
        ) : command === "help" ? (
          <div lang="en">
            <h3>Your next destination</h3>
            <p>
              Explore the person, projects, skills, or current focus. Try{" "}
              <code>ls --skills</code> or <code>./now</code>. Use ↑ and ↓ to
              recall your commands, or <code>clear</code> to clear this panel.
            </p>
          </div>
        ) : command === "clear" ? (
          <p lang="en">Panel cleared. Choose a command to continue.</p>
        ) : command === "whoami" ? (
          <>
            <h3>{profile.name}</h3>
            <p>
              {profile.title} · {profile.location}
            </p>
            <p>
              {profile.education.degree} · {profile.education.institution}
            </p>
            <a href={route("/about/")}>
              {locale === "fil" ? "Aking paglalakbay" : "Read my journey"} ↗
            </a>
          </>
        ) : command === "now" ? (
          <>
            <h3>{content[locale].pages["/now/"].title}</h3>
            <p>{profile.currentFocus}</p>
            <p className="font-mono">
              <time dateTime={profile.updatedAt}>{profile.updatedAt}</time>
            </p>
            <a href={route("/now/")}>
              {locale === "fil"
                ? "Kasalukuyang gawain"
                : "Read the current update"}{" "}
              ↗
            </a>
          </>
        ) : command === "journey" ? (
          <div className="terminal-journey">
            {profile.journey.map((item) => (
              <details key={item.id}>
                <summary>
                  <span className="font-mono">{item.period}</span>
                  {item.title}
                </summary>
                <p>{item.detail}</p>
                {item.projectIds.map((projectId) => (
                  <a key={projectId} href={`/projects/${projectId}/`} lang="en">
                    {projects.find((project) => project.id === projectId)?.name}{" "}
                    case study {locale === "fil" ? "(English)" : ""} ↗
                  </a>
                ))}
              </details>
            ))}
          </div>
        ) : command === "skills" ? (
          <>
            <h3>
              {locale === "fil"
                ? "Mga teknolohiya at kaugnay na proyekto"
                : "Technologies connected to the work"}
            </h3>
            <p lang="en">
              Choose a technology to inspect where it appears in the project
              collection.
            </p>
            <div className="terminal-skill-links" lang="en">
              {[...new Set(projects.flatMap((project) => project.tech))]
                .sort()
                .map((tech) => (
                  <a
                    key={tech}
                    href={`/explore/?tech=${encodeURIComponent(tech)}`}
                  >
                    {tech}
                    <span>
                      {
                        projects.filter((project) =>
                          project.tech.includes(tech),
                        ).length
                      }{" "}
                      {projects.filter((project) => project.tech.includes(tech))
                        .length === 1
                        ? "project"
                        : "projects"}{" "}
                      ↗
                    </span>
                  </a>
                ))}
            </div>
          </>
        ) : command === "projects" ? (
          <div className="terminal-projects" lang="en">
            {projects.map((project) => (
              <a key={project.id} href={project.caseStudyPath}>
                <strong>{project.name} ↗</strong>
                <span>
                  {project.context} · {project.role}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <>
            <h3>{content[locale].pages["/work-with-me/"].title}</h3>
            <p>{content[locale].pages["/work-with-me/"].summary}</p>
            <a href={route("/work-with-me/")}>
              {locale === "fil"
                ? "Pag-usapan ang iyong proyekto"
                : "Discuss your project"}{" "}
              ↗
            </a>
          </>
        )}
      </div>
      <form
        className="profile-command-form"
        lang="en"
        onSubmit={(event) => {
          event.preventDefault()
          run(input)
        }}
      >
        <label htmlFor={id}>Profile command</label>
        <div>
          <span aria-hidden="true">❯</span>
          <input
            id={id}
            autoComplete="off"
            spellCheck={false}
            value={input}
            maxLength={100}
            placeholder="Try ls --skills"
            onChange={(event) => {
              setInput(event.target.value)
              setHistoryIndex(0)
            }}
            onKeyDown={(event) => {
              if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return
              event.preventDefault()
              const next =
                event.key === "ArrowUp"
                  ? Math.min(history.length, historyIndex + 1)
                  : Math.max(0, historyIndex - 1)
              setHistoryIndex(next)
              setInput(next ? history[history.length - next] : "")
            }}
          />
          <button type="submit" disabled={!input.trim()}>
            Run ↵
          </button>
        </div>
      </form>
    </div>
  )
}
