import content from "./reflectionsContent.json" with { type: "json" }
import type { PortfolioLocale } from "../lib/locale"

export interface ReflectionCopy {
  title: string
  summary: string
  topic: string
  sourceContext: string
  sections: {
    id: string
    title: string
    paragraphs: string[]
  }[]
}
export interface Reflection extends ReflectionCopy {
  id: string
  path: string
  writtenAt: string
  references: {
    label: string
    path: string
  }[]
  filipino: ReflectionCopy
}
export const reflections: Reflection[] = content
export function reflectionCopy(
  reflection: Reflection,
  locale: PortfolioLocale,
): ReflectionCopy {
  return locale === "fil" ? reflection.filipino : reflection
}
export function reflectionReadingMinutes(copy: ReflectionCopy): number {
  const words = [
    copy.title,
    copy.summary,
    ...copy.sections.flatMap((section) => [
      section.title,
      ...section.paragraphs,
    ]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
