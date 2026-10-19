export type ThemePreference = "auto" | "dark" | "light"
export type ThemeMode = "dark" | "light"
export const THEME_PREFERENCE_KEY = "portfolio-theme"
const changeEvent = "portfolio:theme-preference"
let fallback: ThemePreference | null = null

export function normalizeThemePreference(value: unknown): ThemePreference {
  return value === "light" || value === "dark" ? value : "auto"
}

export function resolveThemePreference(
  preference: ThemePreference,
  deviceDark: boolean,
): ThemeMode {
  return preference === "auto" ? (deviceDark ? "dark" : "light") : preference
}

export function readThemePreference(): ThemePreference {
  if (fallback) return fallback
  try {
    return normalizeThemePreference(
      window.localStorage.getItem(THEME_PREFERENCE_KEY),
    )
  } catch {
    return "auto"
  }
}

export function resolvedTheme(): ThemeMode {
  return resolveThemePreference(
    readThemePreference(),
    window.matchMedia("(prefers-color-scheme: dark)").matches,
  )
}

export function applyThemePreference() {
  const theme = resolvedTheme()
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#0D1117" : "#F6F8FA")
}

export function setThemePreference(preference: ThemePreference) {
  fallback = preference
  try {
    window.localStorage.setItem(THEME_PREFERENCE_KEY, preference)
    fallback = null
  } catch {
    /* Keep the preference on this page when storage is unavailable. */
  }
  applyThemePreference()
  window.dispatchEvent(new Event(changeEvent))
}

export function subscribeThemePreference(listener: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)")
  const update = () => {
    applyThemePreference()
    listener()
  }
  const storage = (event: StorageEvent) => {
    if (event.key === THEME_PREFERENCE_KEY || event.key === null) update()
  }
  media.addEventListener("change", update)
  window.addEventListener(changeEvent, update)
  window.addEventListener("storage", storage)
  return () => {
    media.removeEventListener("change", update)
    window.removeEventListener(changeEvent, update)
    window.removeEventListener("storage", storage)
  }
}
