import { useLayoutEffect, useRef, type ReactNode } from "react"

// Animate the surrounding space, keeping the new content at its natural size.
export default function ResizingPanel({
  revision,
  children,
}: {
  revision: string
  children: ReactNode
}) {
  const root = useRef<HTMLDivElement>(null)
  const previousHeight = useRef<number | null>(null)

  useLayoutEffect(() => {
    const element = root.current
    if (!element) return
    const height = element.getBoundingClientRect().height
    const before = previousHeight.current
    previousHeight.current = height
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    const bounds = element.getBoundingClientRect()
    let animation: Animation | undefined
    const finish = () => {
      animation?.cancel()
      element.style.removeProperty("overflow")
    }
    if (
      before !== null &&
      Math.abs(before - height) > 1 &&
      !preference.matches &&
      !document.hidden &&
      bounds.bottom > 0 &&
      bounds.top < window.innerHeight &&
      element.animate
    ) {
      element.style.overflow = "clip"
      animation = element.animate(
        [{ height: `${before}px` }, { height: `${height}px` }],
        {
          duration: 280,
          easing: "cubic-bezier(.2,.7,.2,1)",
        },
      )
      animation.onfinish = finish
    }
    const settle = () => {
      finish()
      previousHeight.current = element.getBoundingClientRect().height
    }
    const onPreference = () => {
      if (preference.matches) settle()
    }
    const onVisibility = () => {
      if (document.hidden) settle()
    }
    window.addEventListener("resize", settle)
    preference.addEventListener("change", onPreference)
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      // A rapid selection starts from the height currently on screen.
      if (animation?.playState === "running")
        previousHeight.current = element.getBoundingClientRect().height
      finish()
      window.removeEventListener("resize", settle)
      preference.removeEventListener("change", onPreference)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [revision])

  return (
    <div ref={root} className="toolbox-detail-shell">
      {children}
    </div>
  )
}
