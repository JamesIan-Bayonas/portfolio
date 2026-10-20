import { useEffect, useRef } from "react"
import { portfolioMotionQuery } from "../lib/motionPreference"
import "./BackToTop.css"

export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const topLink = useRef<HTMLAnchorElement>(null)
  const home = window.location.pathname === "/"
  useEffect(() => {
    let frame = 0
    function update() {
      frame = 0
      const distance = document.documentElement.scrollHeight - window.innerHeight
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`
      if (topLink.current) topLink.current.hidden = window.scrollY < window.innerHeight * 1.5
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
  return <>
    <div ref={ref} className="scroll-progress" aria-hidden="true" />
    {home && <a ref={topLink} hidden href="#main-content" className="home-back-to-top" aria-label="Back to top" title="Back to top"
      onClick={(event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
        event.preventDefault()
        document.getElementById("main-content")?.focus({ preventScroll: true })
        window.scrollTo({ top: 0, behavior: portfolioMotionQuery().matches ? "instant" : "smooth" })
      }}><span aria-hidden="true">↑</span></a>}
  </>
}
