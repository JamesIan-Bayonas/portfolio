import { useLayoutEffect, type ReactNode } from "react"
import {
  useMotionPreference,
  usePortfolioReducedMotion,
} from "../lib/usePortfolioReducedMotion"
import { setMotionPreference } from "../lib/motionPreference"
import { currentLocale } from "../lib/locale"
import "./MotionPreferences.css"

export function PortfolioMotionProvider({ children }: { children: ReactNode }) {
  const reduced = usePortfolioReducedMotion()
  useLayoutEffect(() => {
    document.documentElement.dataset.motion = reduced ? "reduced" : "auto"
  }, [reduced])
  return <>{children}</>
}

export default function MotionPreferences() {
  const preference = useMotionPreference()
  const reduced = usePortfolioReducedMotion()
  const fil = currentLocale() === "fil"
  const t = (en: string, translated: string) => (fil ? translated : en)
  return (
    <fieldset className="motion-preferences">
      <legend>
        {t("Make yourself comfortable", "Piliin ang komportableng pagtingin")}
      </legend>
      <div className="motion-preference-options">
        <label>
          <input
            type="radio"
            name="portfolio-motion"
            value="auto"
            checked={preference === "auto"}
            onChange={() => setMotionPreference("auto")}
          />
          <span>{t("Follow my device", "Sundin ang device")}</span>
        </label>
        <label>
          <input
            type="radio"
            name="portfolio-motion"
            value="reduced"
            checked={preference === "reduced"}
            onChange={() => setMotionPreference("reduced")}
          />
          <span>{t("Reduce motion", "Bawasan ang galaw")}</span>
        </label>
      </div>
      <p role="status" aria-atomic="true">
        {reduced
          ? t(
              "Reduced motion is active. All project links and demos remain available.",
              "Aktibo ang binawasang galaw. Magagamit pa rin ang mga link at demo.",
            )
          : t(
              "Motion follows your device preference. Your choice is saved in this browser.",
              "Sinusunod ng galaw ang setting ng device. Naka-save ang pinili mo sa browser na ito.",
            )}
      </p>
    </fieldset>
  )
}
