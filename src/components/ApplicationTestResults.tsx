import runs from "../data/applicationTestRuns.json"

export default function ApplicationTestResults({
  projectId,
  repository,
  locale = "en",
  headingLevel = 3,
}: {
  projectId: string
  repository: string
  locale?: "en" | "fil"
  headingLevel?: 3 | 5
}) {
  const Heading = headingLevel === 3 ? "h3" : "h5"
  const SuiteHeading = headingLevel === 3 ? "h4" : "h6"
  const t = (en: string, fil: string) => (locale === "fil" ? fil : en)
  return (
    <aside
      className="project-note-link"
      aria-label={t(
        "Recorded application test execution",
        "Naitalang execution ng application test",
      )}
    >
      <Heading>
        {t(
          "Recorded execution · 14 October 2026",
          "Naitalang execution · 14 Oktubre 2026",
        )}
      </Heading>
      {runs
        .filter((run) => run.projectId === projectId)
        .map((run) => (
          <section key={`${run.commit}-${run.path}`}>
            <SuiteHeading>
              {locale === "fil" ? run.suiteFil : run.suite}
            </SuiteHeading>
            <p>
              <strong>
                {run.status === "not-run"
                  ? t("Not executed", "Hindi pinatakbo")
                  : run.status === "failed"
                    ? t("Suite failed", "Nabigo ang suite")
                    : t("Passed", "Pumasa")}
              </strong>
              {run.status !== "not-run" &&
                ` · ${run.passed}/${run.total} ${t("passed", "pumasa")} · ${run.failed} ${t("failed", "nabigo")}`}
            </p>
            <p>{locale === "fil" ? run.detailFil : run.detail}</p>
            <p className="font-mono">
              {run.runtime} · commit {run.commit.slice(0, 7)}
            </p>
            <a
              href={`${repository}/blob/${run.commit}/${run.path}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t(
                "Inspect the executed or reviewed suite (opens in a new tab)",
                "Suriin ang pinatakbo o nireview na suite (English, bagong tab)",
              )}{" "}
              ↗
            </a>
            <details>
              <summary>
                {t("Reproduce this check", "Ulitin ang pagsusuri")}
              </summary>
              <p>
                <code>{run.command}</code>
              </p>
              <p>
                {t(
                  "Use the stated commit and an isolated test environment. The MySQL fixture resets its configured database; substitute a verified disposable schema before running it.",
                  "Gamitin ang nakasaad na commit at hiwalay na test environment. Nire-reset ng MySQL fixture ang naka-configure na database; gumamit muna ng sinuring disposable schema bago ito patakbuhin.",
                )}
              </p>
            </details>
          </section>
        ))}
      <a href="/verification/application-tests-2026-10-14.json" download>
        {t(
          "Download the scoped execution record",
          "I-download ang tala ng execution at saklaw",
        )}{" "}
        ↓
      </a>
    </aside>
  )
}
