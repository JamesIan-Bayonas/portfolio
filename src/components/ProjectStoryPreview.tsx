import type { Project } from "../data/projects"
import ProjectSignal from "./ProjectSignal"
import { projectStories } from "../data/projectStories"
import "./Exploration.css"

export default function ProjectStoryPreview({ project }: { project: Project }) {
  const story = projectStories[project.id]
  if (!story) return null
  return (
    <dl
      className="project-story-preview"
      aria-label={`${project.name} at a glance`}
    >
      <div>
        <dt>
          <span aria-hidden="true">01</span> The problem
        </dt>
        <dd>{story.problem}</dd>
      </div>
      <div>
        <dt>
          <span aria-hidden="true">02</span> The workflow
        </dt>
        <dd className="project-story-flow">
          <ProjectSignal projectId={project.id} projectName={project.name} stages={story.workflow.split(" → ")} compact />
        </dd>
      </div>
      <div>
        <dt>
          <span aria-hidden="true">03</span> The result
        </dt>
        <dd>{story.result}</dd>
      </div>
    </dl>
  )
}
