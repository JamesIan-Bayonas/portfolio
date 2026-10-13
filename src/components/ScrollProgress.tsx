import { useEffect, useRef } from "react"

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const distance = document.documentElement.scrollHeight - window.innerHeight
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`
    }
    function schedule() {
      if (!document.hidden && !frame) frame = requestAnimationFrame(update)
    }
    function visibility() {
      document.documentElement.toggleAttribute("data-page-hidden", document.hidden)
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0 }
      else schedule()
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule, { passive: true })
    document.addEventListener("visibilitychange", visibility)
    visibility()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      document.removeEventListener("visibilitychange", visibility)
      document.documentElement.removeAttribute("data-page-hidden")
    }
  }, [])
  return <div ref={ref} className="scroll-progress" aria-hidden="true" />
}
