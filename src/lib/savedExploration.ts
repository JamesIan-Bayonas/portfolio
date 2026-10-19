import type { ExplorationDestination } from "./recentExploration"

export const SAVED_EXPLORATION_KEY = "portfolio-saved-exploration-v1"
export const SAVED_EXPLORATION_EVENT = "portfolio:saved-exploration"

export function parseSavedExploration(
  raw: string | null,
  catalog: readonly ExplorationDestination[],
): string[] {
  try {
    const value: unknown = JSON.parse(raw ?? "[]")
    if (!Array.isArray(value)) return []
    const allowed = new Set(catalog.map((item) => item.id))
    return [
      ...new Set(
        value.filter(
          (id): id is string => typeof id === "string" && allowed.has(id),
        ),
      ),
    ]
  } catch {
    return []
  }
}

export function toggleSavedExploration(
  ids: readonly string[],
  id: string,
  catalog: readonly ExplorationDestination[],
): string[] {
  const clean = parseSavedExploration(JSON.stringify(ids), catalog)
  if (!catalog.some((item) => item.id === id)) return clean
  return clean.includes(id)
    ? clean.filter((item) => item !== id)
    : [id, ...clean]
}

export function readSavedExploration(
  catalog: readonly ExplorationDestination[],
): string[] {
  try {
    return parseSavedExploration(
      window.localStorage.getItem(SAVED_EXPLORATION_KEY),
      catalog,
    )
  } catch {
    return []
  }
}

export function writeSavedExploration(
  ids: readonly string[],
  catalog: readonly ExplorationDestination[],
): boolean {
  try {
    const clean = parseSavedExploration(JSON.stringify(ids), catalog)
    if (clean.length)
      window.localStorage.setItem(SAVED_EXPLORATION_KEY, JSON.stringify(clean))
    else window.localStorage.removeItem(SAVED_EXPLORATION_KEY)
    window.dispatchEvent(new Event(SAVED_EXPLORATION_EVENT))
    return true
  } catch {
    return false
  }
}
