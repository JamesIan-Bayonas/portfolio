import { projects } from "./projects"
import { engineeringNotes, noteReadingMinutes } from "./notes"
import { reflections, reflectionReadingMinutes } from "./reflections"
import { labDemos } from "./labDemos"
import cpatsCaptures from "./cpatsScreenshots.json"
import type { ScreenshotAsset } from "../components/ResponsiveScreenshot"
import type { FieldbookRecord } from "../lib/fieldbook"

export interface FieldbookEntry extends FieldbookRecord {
  id: string
  href: string
  detail: string
  projectId?: string
  image?: ScreenshotAsset
  imageAlt?: string
}

export const fieldbookEntries: FieldbookEntry[] = [
  ...projects.map((project) => ({
    id: `system-${project.id}`,
    kind: "Systems" as const,
    title: project.name,
    summary: project.title,
    tags: [project.category, ...project.tech],
    href: project.caseStudyPath ?? `/#project-${project.id}`,
    detail: project.context,
    projectId: project.id,
    image: project.screenshot,
    imageAlt: project.imageAlt,
  })),
  {
    id: "system-cpats",
    kind: "Systems",
    title: "CPATS",
    summary:
      "One procurement record. Seven workspaces. From department request to receiving and audit.",
    tags: [
      "Procurement",
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Prisma",
      "MariaDB",
    ],
    href: "/projects/cpats/",
    detail: "DMC school capstone",
    projectId: "cpats",
    image: cpatsCaptures[0],
    imageAlt: cpatsCaptures[0].alt,
  },
  ...engineeringNotes.map((note) => ({
    id: `note-${note.id}`,
    kind: "Notes" as const,
    title: note.title,
    summary: note.summary,
    tags: [note.topic, note.projectId],
    href: note.path,
    detail: `${noteReadingMinutes(note)} min read`,
    projectId: note.projectId,
  })),
  ...reflections.map((reflection) => ({
    id: `reflection-${reflection.id}`,
    kind: "Reflections" as const,
    title: reflection.title,
    summary: reflection.summary,
    tags: [reflection.topic],
    href: reflection.path,
    detail: `${reflectionReadingMinutes(reflection)} min read`,
  })),
  ...labDemos.map((demo) => ({
    id: `lab-${demo.id}`,
    kind: "Lab" as const,
    title: demo.title,
    summary: demo.description,
    tags: [demo.label, demo.kind],
    href: `/lab/#demo-${demo.id}`,
    detail: demo.kind,
    projectId: demo.id,
  })),
  {
    id: "tool-json",
    kind: "Tools",
    title: "JSON Workbench",
    summary:
      "Format, inspect, and validate JSON while preserving number values. Everything runs in your browser.",
    tags: ["JSON", "Developer tools", "Validation"],
    href: "/tools/",
    detail: "Browser tool",
  },
  {
    id: "tool-regex",
    kind: "Tools",
    title: "Regex Lab",
    summary:
      "Test JavaScript expressions, highlight matches, and explore capture groups in a background worker.",
    tags: ["JavaScript", "Regular expressions", "Developer tools"],
    href: "/tools/regex/",
    detail: "Browser tool",
  },
]
