import { portfolioMotionQuery } from "./motionPreference"
import { useEffect } from "react"

export function useInteractiveSurfaces() {
  useEffect(() => {
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    )
    let surface: HTMLElement | null = null
    let frame = 0
    let x = 0,
      y = 0
    function reset() {
      cancelAnimationFrame(frame)
      frame = 0
      surface?.style.removeProperty("--surface-x")
      surface?.style.removeProperty("--surface-y")
      surface?.style.removeProperty("--spot-x")
      surface?.style.removeProperty("--spot-y")
      surface = null
    }
    function move(event: PointerEvent) {
      if (!media.matches || portfolioMotionQuery().matches || event.pointerType !== "mouse") return
      const next =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>(".interactive-surface")
          : null
      if (next !== surface) {
        reset()
        surface = next
      }
      if (!surface) return
      x = event.clientX
      y = event.clientY
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        if (!surface) return
        const rect = surface.getBoundingClientRect()
        const px = Math.max(0, Math.min(1, (x - rect.left) / rect.width))
        const py = Math.max(0, Math.min(1, (y - rect.top) / rect.height))
        surface.style.setProperty("--surface-x", `${(0.5 - py) * 3}deg`)
        surface.style.setProperty("--surface-y", `${(px - 0.5) * 3}deg`)
        surface.style.setProperty("--spot-x", `${px * 100}%`)
        surface.style.setProperty("--spot-y", `${py * 100}%`)
      })
    }
    document.addEventListener("pointermove", move, { passive: true })
    document.addEventListener("pointerleave", reset)
    window.addEventListener("blur", reset)
    const preference = portfolioMotionQuery()
    preference.addEventListener("change", reset)
    media.addEventListener("change", reset)
    return () => {
      reset()
      document.removeEventListener("pointermove", move)
      document.removeEventListener("pointerleave", reset)
      window.removeEventListener("blur", reset)
      media.removeEventListener("change", reset)
      preference.removeEventListener("change", reset)
    }
  }, [])
}
