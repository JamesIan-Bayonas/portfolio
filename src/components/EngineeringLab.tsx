import { lazy, Suspense, useRef } from "react"
import { useInView } from "motion/react"
import caseStudyPages from "../data/caseStudyPages.json"

const AssetValuationDemo = lazy(() => import("./AssetValuationDemo"))

export default function EngineeringLab({
  embedded = false,
}: {
  embedded?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { once: true, margin: "200px" })
  return (
    <section
      ref={ref}
      id="lab"
      className={
        embedded
          ? "engineering-lab relative z-10 py-16 sm:py-20"
          : "engineering-lab relative z-10 px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-24"
      }
    >
      <div className="max-w-[1440px] mx-auto">
        <div className="project-section-heading">
          <div>
            <p className="project-eyebrow font-mono">
              {embedded ? "CENTRALOG / VALUATION LAB" : "02 — ENGINEERING LAB"}
            </p>
            <h2>
              Explore the logic.
              <br />
              Change the outcome.
            </h2>
          </div>
          <p>
            A small demonstration from CentraLog. Change an asset's useful life
            and repair time to see how its calculated value responds.
          </p>
        </div>
        {visible ? (
          <Suspense
            fallback={
              <p className="lab-loading" role="status">
                Preparing the demonstration…
              </p>
            }
          >
            <AssetValuationDemo caseStudyHref={embedded ? "#engineering" : `${caseStudyPages.find(page => page.projectId === "centralog")?.path ?? "/"}#engineering`} />
          </Suspense>
        ) : (
          <div className="lab-loading" aria-hidden="true" />
        )}
        {!embedded && <a className="asset-lab-link font-mono" href="/lab/">Explore all engineering demos ↗</a>}
      </div>
    </section>
  )
}
