import { useEffect, useRef, useState } from "react"
import "./ReadingProgress.css"

export default function ReadingProgress({
  locale = "en",
  contentSelector,
}: {
  locale?: "en" | "fil"
  contentSelector?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    const article = ref.current?.closest("article")
    const content = contentSelector
      ? article?.querySelector(contentSelector)
      : article
    if (!content) return
    let frame = 0
    function update() {
      frame = 0
      const rect = content!.getBoundingClientRect()
      const start = rect.top + window.scrollY
      const distance = Math.max(0, rect.height - window.innerHeight)
      const value =
        distance > 0
          ? (window.scrollY - start) / distance
          : rect.bottom <= window.innerHeight
            ? 1
            : 0
      setPercent(Math.round(Math.max(0, Math.min(1, value)) * 100))
    }
    function schedule() {
      if (!document.hidden && !frame) frame = requestAnimationFrame(update)
    }
    function visibility() {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
      } else schedule()
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(content)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    document.addEventListener("visibilitychange", visibility)
    schedule()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      document.removeEventListener("visibilitychange", visibility)
    }
  }, [contentSelector])

  const label = locale === "fil" ? "Posisyon sa artikulo" : "Article position"
  return (
    <div ref={ref} className="reading-progress font-mono">
      <span aria-hidden="true">
        {label} <strong>{percent}%</strong>
      </span>
      <progress aria-label={label} value={percent} max={100} />
    </div>
  )
}
