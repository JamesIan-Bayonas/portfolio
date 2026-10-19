import { useEffect } from "react"
import { explorationDestinations } from "../data/explorationDestinations"
import { labDemoFromHash } from "../data/labDemos"
import { recordRecentExploration } from "../lib/recentExploration"

export default function ExplorationTracker() {
  useEffect(() => {
    function record() {
      const path = window.location.pathname.replace(/\/+$/, "") + "/"
      const destination =
        path === "/lab/"
          ? explorationDestinations.find(
              (item) =>
                item.id === `lab:${labDemoFromHash(window.location.hash)}`,
            )
          : explorationDestinations.find((item) => item.href === path)
      if (destination)
        recordRecentExploration(destination.id, explorationDestinations)
    }
    record()
    window.addEventListener("hashchange", record)
    window.addEventListener("popstate", record)
    window.addEventListener("portfolio:experiment-selected", record)
    return () => {
      window.removeEventListener("hashchange", record)
      window.removeEventListener("popstate", record)
      window.removeEventListener("portfolio:experiment-selected", record)
    }
  }, [])
  return null
}
