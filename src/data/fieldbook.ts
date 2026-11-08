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
  preview?: { heading: string; body: string }[]
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
    preview: [
      { heading: "The problem", body: project.caseStudy.problem },
      { heading: "My contribution", body: project.caseStudy.contribution },
      { heading: "Who it serves", body: project.caseStudy.audience },
    ],
  })),
  {
    id: "system-cpats",
    kind: "Systems",
    title: "CPATS",
    summary:
      "From a department’s purchase request to delivery and audit. The Requesting Office prepares item details, explains the need, and tracks the record across offices.",
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
    image: cpatsCaptures.find(capture => capture.id === "02-request-new")!,
    imageAlt: "CPATS Requesting Office workspace for preparing a purchase request",
    preview: [
      { heading: "Who uses it", body: "Built as a school capstone for DMC College Foundation, Inc. CPATS connects the Requesting Office, Business Office, Admin Office, Purchasing Office, Receiving Custodian, Global Auditor, and System Administrator." },
      { heading: "Requesting Office · prepare a request", body: "For example, a department needing laboratory supplies enters the requested items, quantities, and justification, then checks the request summary. The captured interface offers saving a draft or submitting the request." },
      { heading: "Requesting Office · follow the record", body: "The office can search its requests and filter by status to distinguish records needing action, in progress, approved, declined, or received. A role-specific help screen explains the workspace’s common tasks." },
      { heading: "What happens next", body: "A submitted request enters Business Office fiscal review and Admin Office authorization. Purchasing prepares the purchase order; financial clearance precedes receiving inspection. The auditor can inspect the procurement ledger and asset register through read-only views." },
    ],
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
    preview: note.sections.slice(0, 1).map(section => ({ heading: section.title, body: section.paragraphs[0] })),
  })),
  ...reflections.map((reflection) => ({
    id: `reflection-${reflection.id}`,
    kind: "Reflections" as const,
    title: reflection.title,
    summary: reflection.summary,
    tags: [reflection.topic],
    href: reflection.path,
    detail: `${reflectionReadingMinutes(reflection)} min read`,
    preview: reflection.sections.slice(0, 1).map(section => ({ heading: section.title, body: section.paragraphs[0] })),
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
    preview: [{ heading: "What you can try", body: demo.detail }],
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
