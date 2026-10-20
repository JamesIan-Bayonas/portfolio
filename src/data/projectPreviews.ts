import type { Project } from "./projects"
import type { ScreenshotAsset } from "../components/ResponsiveScreenshot"
import dormfix from "./dormfixLandlordScreenshots.json"
import centralog from "./centralogAdminScreenshots.json"
import pharmalink from "./pharmalinkAdminScreenshots.json"
import isdalog from "./isdalogWorkspaceScreenshots.json"

const captures: Record<string, Record<string, ScreenshotAsset>> = { dormfix, centralog, pharmalink, isdalog }

export function projectPreview<T extends Project>(project: T, mode: "light" | "dark"): T {
  const screenshot = captures[project.id]?.[`login-${mode}`]
  if (!screenshot) return project
  return {
    ...project,
    screenshot,
    image: screenshot.variants[screenshot.variants.length - 1].src,
    imageAlt: `${project.name} sign-in page in ${mode} mode`,
    imageTitle: "Sign-in page",
    imageCaption: `${project.name}'s latest captured sign-in page in ${mode} mode.`,
  }
}
