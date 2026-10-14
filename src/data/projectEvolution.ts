import evolutionContent from "./projectEvolutionContent.json" with { type: "json" }

export interface ProjectMilestone {
  id: string
  title: string
  committedAt: string
  commit: string
  change: string
  reason: string
  outcome: string
  evidencePaths: string[]
}

// Reviewed implementation milestones. Dates are commit timestamps, not release dates.
export const projectEvolution: Record<string, ProjectMilestone[]> =
  evolutionContent
