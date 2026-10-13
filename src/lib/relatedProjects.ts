import type { EngineeringCapability } from "../data/capabilities"

interface RelatedProject {
  id: string
  tech: string[]
  caseStudyPath?: string
}

// Common interface and tooling choices alone don't establish a useful connection.
const commonTools = new Set(["React 18", "React 19", "TypeScript", "Tailwind CSS", "DaisyUI", "JWT", "Vitest", "xUnit"])

export function relatedProjects<T extends RelatedProject>(current: T, projects: T[], capabilities: EngineeringCapability[]) {
  return projects.filter(project => project.id !== current.id && project.caseStudyPath).map((project, index) => {
    const sharedCapabilities = capabilities.filter(capability =>
      capability.evidence.some(evidence => evidence.projectId === current.id) &&
      capability.evidence.some(evidence => evidence.projectId === project.id),
    ).map(capability => capability.name)
    const sharedTechnologies = [...new Set(current.tech.filter(tech => !commonTools.has(tech) && project.tech.includes(tech)))]
    return { project, sharedCapabilities, sharedTechnologies, score: sharedCapabilities.length * 10 + sharedTechnologies.length * 4, index }
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 2)
}
