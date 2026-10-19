import { useSyncExternalStore } from "react"
import {
  portfolioMotionQuery,
  subscribeMotionPreference,
  readMotionPreference,
} from "./motionPreference"

export function usePortfolioReducedMotion() {
  return useSyncExternalStore(
    subscribeMotionPreference,
    () => portfolioMotionQuery().matches,
    () => true,
  )
}

export function useMotionPreference() {
  return useSyncExternalStore(
    subscribeMotionPreference,
    readMotionPreference,
    () => "auto" as const,
  )
}
