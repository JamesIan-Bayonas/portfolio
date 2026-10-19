import { projects } from "./projects"
import { engineeringNotes } from "./notes"
import { labDemos } from "./labDemos"
import type { ExplorationDestination } from "../lib/recentExploration"

export const explorationDestinations: ExplorationDestination[] = [
  { id: "tool:regex-lab", href: "/tools/regex/", title: "Regex Lab", description: "Test JavaScript regular expressions, highlight matches, and inspect capture groups in a background worker.", kind: "tool" },
  { id: "tool:json-workbench", href: "/tools/", title: "JSON Workbench", description: "Format, minify, and validate JSON in your browser without changing number values.", kind: "tool" },
  ...projects
    .filter((project) => project.caseStudyPath)
    .map((project) => ({
      id: `case:${project.id}`,
      href: project.caseStudyPath!,
      title: project.name,
      description: project.title,
      kind: "case" as const,
    })),
  ...projects
    .filter((project) => ["centralog", "dormfix"].includes(project.id))
    .map((project) => ({
      id: `case:fil:${project.id}`,
      href: `/fil${project.caseStudyPath}`,
      title: `${project.name} · Filipino`,
      description: project.title,
      kind: "case" as const,
    })),
  ...labDemos.map((demo) => ({
    id: `lab:${demo.id}`,
    href: `/lab/#demo-${demo.id}`,
    title: `${demo.label} / ${demo.title}`,
    description: demo.description,
    kind: "lab" as const,
  })),
  ...engineeringNotes.map((note) => ({
    id: `note:${note.id}`,
    href: note.path,
    title: note.title,
    description: note.summary,
    kind: "note" as const,
  })),
]
