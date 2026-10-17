import type { CSSProperties } from "react"
import { projectAccents } from "../data/projectAccents"

export const cardAccentStyles: Record<string, CSSProperties> = Object.fromEntries(
  Object.entries(projectAccents).map(([id, colors]) => [id, {
    "--card-accent-dark": colors.accent,
    "--card-accent-light": colors.lightAccent,
  } as CSSProperties]),
)
