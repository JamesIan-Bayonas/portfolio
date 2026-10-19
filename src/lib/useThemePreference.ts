import { useSyncExternalStore } from "react"
import {
  readThemePreference,
  resolvedTheme,
  subscribeThemePreference,
} from "./themePreference"

export function useThemePreference() {
  return useSyncExternalStore(
    subscribeThemePreference,
    readThemePreference,
    () => "auto" as const,
  )
}

export function useResolvedTheme() {
  return useSyncExternalStore(
    subscribeThemePreference,
    resolvedTheme,
    () => "dark" as const,
  )
}
