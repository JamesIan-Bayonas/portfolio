import { projectAccents } from "../data/projectAccents.ts"
import { canonicalContentPath } from "./locale.ts"

export function projectThemeForPath(path: string) {
  const id = /^\/projects\/([^/]+)\/$/.exec(canonicalContentPath(path))?.[1]
  if (!id || !Object.prototype.hasOwnProperty.call(projectAccents, id)) return undefined
  const projectId = id as keyof typeof projectAccents
  return { id: projectId, ...projectAccents[projectId] }
}

export function applyProjectTheme(root: HTMLElement, path: string) {
  const theme = projectThemeForPath(path)
  if (theme) {
    root.dataset.project = theme.id
    root.style.setProperty("--project-accent-dark", theme.accent)
    root.style.setProperty("--project-accent-light", theme.lightAccent)
  } else {
    delete root.dataset.project
    root.style.removeProperty("--project-accent-dark")
    root.style.removeProperty("--project-accent-light")
  }
}
