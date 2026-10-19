export interface ExplorationDestination {
  id: string
  href: string
  title: string
  description: string
  kind: "case" | "lab" | "note" | "tool"
}

export const RECENT_EXPLORATION_KEY = "portfolio-recent-exploration-v1"
export const RECENT_EXPLORATION_EVENT = "portfolio:recent-exploration"
export const RECENT_EXPLORATION_LIMIT = 6

export function parseRecentExploration(
  raw: string | null,
  catalog: readonly ExplorationDestination[],
): string[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? "[]")
    if (!Array.isArray(parsed)) return []
    const allowed = new Set(catalog.map((item) => item.id))
    return [
      ...new Set(
        parsed.filter(
          (id): id is string => typeof id === "string" && allowed.has(id),
        ),
      ),
    ].slice(0, RECENT_EXPLORATION_LIMIT)
  } catch {
    return []
  }
}

export function addRecentExploration(
  ids: readonly string[],
  id: string,
  catalog: readonly ExplorationDestination[],
): string[] {
  const clean = parseRecentExploration(JSON.stringify(ids), catalog)
  return catalog.some((item) => item.id === id)
    ? [id, ...clean.filter((item) => item !== id)].slice(
        0,
        RECENT_EXPLORATION_LIMIT,
      )
    : clean
}

export function readRecentExploration(
  catalog: readonly ExplorationDestination[],
): string[] {
  try {
    return parseRecentExploration(
      window.localStorage.getItem(RECENT_EXPLORATION_KEY),
      catalog,
    )
  } catch {
    return []
  }
}

export function recordRecentExploration(
  id: string,
  catalog: readonly ExplorationDestination[],
): void {
  try {
    const next = addRecentExploration(
      readRecentExploration(catalog),
      id,
      catalog,
    )
    window.localStorage.setItem(RECENT_EXPLORATION_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event(RECENT_EXPLORATION_EVENT))
  } catch {
    /* Browsing remains available when storage is disabled. */
  }
}

export function clearRecentExploration(): void {
  try {
    window.localStorage.removeItem(RECENT_EXPLORATION_KEY)
  } catch {
    /* Storage may be unavailable. */
  }
  window.dispatchEvent(new Event(RECENT_EXPLORATION_EVENT))
}
