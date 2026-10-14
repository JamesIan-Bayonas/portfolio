import { projects } from "../data/projects"
import {
  translateCentraLog,
  filipinoCentraLogSources,
  filipinoCentraLogTests,
  filipinoCentraLogMilestones,
} from "../data/filipinoCentralog"
import DedicatedCaseStudy from "./DedicatedCaseStudy"

export default function FilipinoCentraLog() {
  const project = translateCentraLog(
    projects.find((item) => item.id === "centralog")!,
  )
  return (
    <DedicatedCaseStudy
      project={project}
      path="/fil/projects/centralog/"
      locale="fil"
      sources={filipinoCentraLogSources}
      evidence={filipinoCentraLogTests}
      milestones={filipinoCentraLogMilestones}
    />
  )
}
