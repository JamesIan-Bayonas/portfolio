import { projects } from "../data/projects"
import {
  translateDormFix,
  filipinoDormFixSources,
  filipinoDormFixTests,
  filipinoDormFixMilestones,
} from "../data/filipinoDormfix"
import DedicatedCaseStudy from "./DedicatedCaseStudy"

export default function FilipinoDormFix() {
  const project = translateDormFix(
    projects.find((item) => item.id === "dormfix")!,
  )
  return (
    <DedicatedCaseStudy
      project={project}
      path="/fil/projects/dormfix/"
      locale="fil"
      sources={filipinoDormFixSources}
      evidence={filipinoDormFixTests}
      milestones={filipinoDormFixMilestones}
    />
  )
}
