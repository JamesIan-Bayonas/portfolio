import { useId } from "react"
import type { Project } from "../data/projects"
import { engineeringNotes } from "../data/notes"
import "./Exploration.css"

type Context = "projects" | "lab" | "notes" | "about"

export default function ExplorationNext({
  context,
  project,
}: {
  context: Context
  project?: Project
}) {
  const id = useId()
  const note = engineeringNotes.find((item) => item.projectId === project?.id)
  const cards = [
    {
      key: "projects",
      label: "THE SYSTEM",
      title: project
        ? `Explore ${project.name}.`
        : "Find a system that interests you.",
      description: project
        ? "See the problem, contribution, architecture, and tradeoffs behind this example."
        : "Explore the four projects by domain or technology, then follow their case studies.",
      href: project?.caseStudyPath ?? "/explore/",
    },
    {
      key: "lab",
      label: "THE EXPERIMENT",
      title: project ? "Try its logic for yourself." : "Make something happen.",
      description:
        "Change sample inputs, follow a workflow, and inspect what happens when an action succeeds or fails.",
      href: project ? `/lab/#demo-${project.id}` : "/lab/",
    },
    {
      key: "notes",
      label: "THE THINKING",
      title: note ? note.title : "Read between the features.",
      description: note
        ? note.summary
        : "Read the decisions and lessons behind the work, with links back to the implementation.",
      href: note?.path ?? "/notes/",
    },
    {
      key: "about",
      label: "THE CONVERSATION",
      title: "Have a workflow in mind?",
      description:
        "Explore how I work and the kinds of systems I can help build, then start a conversation.",
      href: "/work-with-me/",
    },
  ]
    .filter((card) => card.key !== context)
    .slice(0, 3)
  return (
    <section className="exploration-next" aria-labelledby={id}>
      <div className="exploration-next-heading">
        <div>
          <p className="exploration-eyebrow">KEEP THE CONNECTION GOING</p>
          <h2 id={id}>
            {project
              ? `There’s more to ${project.name}.`
              : "One idea leads to another."}
          </h2>
        </div>
        <a href="/#directory">
          Back to the directory <span aria-hidden="true">↗</span>
        </a>
      </div>
      <div className="exploration-next-grid">
        {cards.map((card, index) => (
          <a className="exploration-next-card" href={card.href} key={card.key}>
            <span className="exploration-eyebrow">
              0{index + 1} / {card.label}
              <span aria-hidden="true">↗</span>
            </span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <span className="exploration-next-action">
              Continue exploring <span aria-hidden="true">→</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}
