import { portfolioMotionQuery } from "../lib/motionPreference"
import { useLayoutEffect, useRef } from "react"
import { motionTiming } from "../lib/motionTiming"

type Position = {
  x: number
  y: number
}

export function useResultTransitions(revision: string) {
  const root = useRef<HTMLDivElement>(null)
  const positions = useRef(new Map<string, Position>())
  const animations = useRef<Animation[]>([])
  const captured = useRef(false)
  const cancel = () => {
    animations.current.forEach((animation) => animation.cancel())
    animations.current = []
  }
  const capture = () => {
    positions.current.clear()
    root.current
      ?.querySelectorAll<HTMLElement>("[data-result-id]")
      .forEach((element) => {
        const rect = element.getBoundingClientRect()
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) return
        positions.current.set(element.dataset.resultId!, {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
        })
      })
    captured.current = true
    cancel()
  }

  useLayoutEffect(() => {
    const preference = portfolioMotionQuery()
    if (captured.current && !preference.matches && !document.hidden) {
      root.current
        ?.querySelectorAll<HTMLElement>("[data-result-id]")
        .forEach((element) => {
          const rect = element.getBoundingClientRect()
          if (
            !element.animate ||
            rect.bottom <= 0 ||
            rect.top >= window.innerHeight
          )
            return
          const before = positions.current.get(element.dataset.resultId!)
          const x = before ? before.x - rect.left - window.scrollX : 0
          const y = before ? before.y - rect.top - window.scrollY : 0
          if (before && Math.abs(x) < 1 && Math.abs(y) < 1) return
          animations.current.push(
            element.animate(
              before
                ? [
                    { transform: `translate(${x}px, ${y}px)` },
                    { transform: "translate(0, 0)" },
                  ]
                : [{ opacity: 0 }, { opacity: 1 }],
              { duration: motionTiming.panel * 1000, easing: motionTiming.cssEase },
            ),
          )
        })
    }
    captured.current = false
    const onPreference = () => {
      if (preference.matches) cancel()
    }
    const onVisibility = () => {
      if (document.hidden) cancel()
    }
    preference.addEventListener("change", onPreference)
    document.addEventListener("visibilitychange", onVisibility)
    window.addEventListener("resize", cancel)
    return () => {
      cancel()
      preference.removeEventListener("change", onPreference)
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("resize", cancel)
    }
  }, [revision])

  return { root, capture }
}
