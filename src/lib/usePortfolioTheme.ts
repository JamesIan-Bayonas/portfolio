import { useEffect, useState } from "react"

export function usePortfolioTheme() {
  const [mode, setMode] = useState<"dark" | "light">(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  )
  useEffect(() => {
    const observer = new MutationObserver(() => setMode(
      document.documentElement.dataset.theme === "light" ? "light" : "dark",
    ))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] })
    return () => observer.disconnect()
  }, [])
  return mode
}
