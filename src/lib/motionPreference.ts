export type MotionPreference = "auto" | "reduced"
export const MOTION_PREFERENCE_KEY = "portfolio-motion-preference"
const changeEvent = "portfolio:motion-preference"
let fallback: MotionPreference | null = null

export function normalizeMotionPreference(value: unknown): MotionPreference {
  return value === "reduced" ? "reduced" : "auto"
}

export function shouldReduceMotion(
  preference: MotionPreference,
  deviceReduced: boolean,
): boolean {
  return preference === "reduced" || deviceReduced
}

export function readMotionPreference(): MotionPreference {
  if (fallback) return fallback
  try {
    return normalizeMotionPreference(
      window.localStorage.getItem(MOTION_PREFERENCE_KEY),
    )
  } catch {
    return "auto"
  }
}

export function portfolioMotionQuery() {
  const device = window.matchMedia("(prefers-reduced-motion: reduce)")
  return {
    get matches() {
      return shouldReduceMotion(readMotionPreference(), device.matches)
    },
    addEventListener(_type: "change", listener: () => void) {
      device.addEventListener("change", listener)
      window.addEventListener(changeEvent, listener)
      window.addEventListener("storage", listener)
    },
    removeEventListener(_type: "change", listener: () => void) {
      device.removeEventListener("change", listener)
      window.removeEventListener(changeEvent, listener)
      window.removeEventListener("storage", listener)
    },
  }
}

export function applyMotionPreference() {
  document.documentElement.dataset.motion = portfolioMotionQuery().matches
    ? "reduced"
    : "auto"
}

export function setMotionPreference(preference: MotionPreference) {
  fallback = preference
  try {
    window.localStorage.setItem(MOTION_PREFERENCE_KEY, preference)
    fallback = null
  } catch {
    /* Keep this choice for the current page when storage is unavailable. */
  }
  applyMotionPreference()
  window.dispatchEvent(new Event(changeEvent))
}

export function subscribeMotionPreference(listener: () => void) {
  const query = portfolioMotionQuery()
  query.addEventListener("change", listener)
  return () => query.removeEventListener("change", listener)
}
