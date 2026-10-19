import { useEffect, useState } from "react"
import { explorationDestinations } from "../data/explorationDestinations"
import {
  readSavedExploration,
  SAVED_EXPLORATION_EVENT,
  SAVED_EXPLORATION_KEY,
} from "./savedExploration"

export function useSavedExploration() {
  const [ids, setIds] = useState(() =>
    readSavedExploration(explorationDestinations),
  )
  useEffect(() => {
    const update = () => setIds(readSavedExploration(explorationDestinations))
    const storage = (event: StorageEvent) => {
      if (event.key === SAVED_EXPLORATION_KEY || event.key === null) update()
    }
    update()
    window.addEventListener(SAVED_EXPLORATION_EVENT, update)
    window.addEventListener("storage", storage)
    return () => {
      window.removeEventListener(SAVED_EXPLORATION_EVENT, update)
      window.removeEventListener("storage", storage)
    }
  }, [])
  return ids
}
