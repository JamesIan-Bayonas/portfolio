import type { Project } from "./projects"
import { atlasSymbolPoints } from "../lib/atlasSymbols.ts"

// Identity owns the visual association; changing project-record order cannot swap it.
const definitions = {
  isdalog: {
    accent: "#37cbd6",
    label: "FISHERIES",
    position: { x: 23, y: 24 },
  },
  dormfix: { accent: "#b28aff", label: "HOUSING", position: { x: 77, y: 24 } },
  centralog: { accent: "#f3b453", label: "ASSETS", position: { x: 77, y: 76 } },
  pharmalink: {
    accent: "#f184ab",
    label: "PHARMACY",
    position: { x: 23, y: 76 },
  },
} as const

export type AtlasProjectId = keyof typeof definitions

interface ScenePosition {
  readonly x: number
  readonly y: number
}

export interface AtlasScene {
  readonly id: AtlasProjectId
  readonly project: Project
  readonly accent: string
  readonly label: string
  readonly position: ScenePosition
  readonly symbol: readonly ScenePosition[]
  readonly caseStudyHref: string
  readonly walkthroughHref: string
  readonly technologies: readonly string[]
  readonly workflow: readonly {
    readonly title: string
    readonly detail: string
    readonly href: string
    readonly position: ScenePosition
  }[]
}

// Provisional percentage anchors for the static-composition stage, not rendered yet.
const workflowPositions: readonly ScenePosition[] = [
  { x: 50, y: 18 },
  { x: 82, y: 65 },
  { x: 18, y: 65 },
]

export function buildAtlasScenes(records: readonly Project[]): AtlasScene[] {
  return (Object.keys(definitions) as AtlasProjectId[]).map((id) => {
    const matches = records.filter((project) => project.id === id)
    if (matches.length !== 1)
      throw new Error(`Atlas scene ${id} requires exactly one project record.`)
    const project = matches[0]
    if (!project.caseStudyPath)
      throw new Error(`Atlas scene ${id} requires a case-study destination.`)
    return {
      id,
      project,
      ...definitions[id],
      symbol: atlasSymbolPoints(id),
      caseStudyHref: project.caseStudyPath,
      walkthroughHref: `${project.caseStudyPath}#walkthrough`,
      technologies: project.tech.slice(0, 4),
      workflow: project.caseStudy.workflow.slice(0, 3).map((step, index) => ({
        ...step,
        href: `${project.caseStudyPath}#${id}-workflow`,
        position: workflowPositions[index],
      })),
    }
  })
}
