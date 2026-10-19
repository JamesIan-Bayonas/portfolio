import { portfolioMotionQuery } from "../lib/motionPreference"
import { useEffect, useRef } from "react"
import "./WorkflowMotion.css"
import { motionTiming } from "../lib/motionTiming"

const targets = [
  ".walkthrough-step-content",
  ".receipt-paper",
  ".receipt-fields dd",
  ".receipt-audit",
  ".walkthrough-ledger strong",
  ".walkthrough-feedback",
  ".asset-history li",
  ".valuation-total strong",
  ".valuation-comparison strong",
  ".valuation-errors",
].join(",")

// Animate changed output only; controls, current values, and reducer timing stay intact.
export function useWorkflowMotion<T extends HTMLElement = HTMLElement>(
  revision: unknown,
  view = "",
) {
  const root = useRef<T>(null)
  const previous = useRef(new Map<HTMLElement, string>())

  useEffect(() => {
    const host = root.current
    if (!host) return
    const elements = [...host.querySelectorAll<HTMLElement>(targets)]
    const values = new Map(
      elements.map((element) => [element, element.textContent?.trim() ?? ""]),
    )
    const baseline = previous.current
    previous.current = values
    const media = portfolioMotionQuery()
    if (!baseline.size || media.matches || document.hidden) return
    const accent =
      getComputedStyle(host).getPropertyValue("--color-accent").trim() ||
      "#58a6ff"
    const animations: Animation[] = []
    for (const element of elements) {
      if (baseline.get(element) === values.get(element) || !element.animate)
        continue
      const rect = element.getBoundingClientRect()
      if (
        rect.bottom <= 0 ||
        rect.top >= window.innerHeight ||
        rect.width === 0
      )
        continue
      animations.push(
        element.animate(
          [
            {
              backgroundColor: `color-mix(in srgb, ${accent} 14%, transparent)`,
              boxShadow: `0 0 0 1px ${accent}`,
            },
            {
              backgroundColor: "transparent",
              boxShadow: "0 0 0 1px transparent",
            },
          ],
          { duration: motionTiming.signal * 1000, easing: motionTiming.cssEase },
        ),
      )
    }
    const cancel = () => animations.forEach((animation) => animation.cancel())
    const preference = () => {
      if (media.matches) cancel()
    }
    const visibility = () => {
      if (document.hidden) cancel()
    }
    media.addEventListener("change", preference)
    document.addEventListener("visibilitychange", visibility)
    return () => {
      cancel()
      media.removeEventListener("change", preference)
      document.removeEventListener("visibilitychange", visibility)
    }
  }, [revision, view])

  return root
}
