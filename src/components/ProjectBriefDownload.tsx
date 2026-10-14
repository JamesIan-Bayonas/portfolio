export default function ProjectBriefDownload({
  projectId,
  locale = "en",
}: {
  projectId: string
  locale?: "en" | "fil"
}) {
  const filename = `${projectId}-project-brief.pdf`
  return (
    <a
      className="case-brief-link font-mono"
      href={`/briefs/${filename}`}
      download={filename}
    >
      <span>
        {locale === "fil"
          ? "I-download ang project brief (English)"
          : "Download project brief"}{" "}
        ↓
      </span>
      <span className="case-brief-format">
        PDF · {locale === "fil" ? "1 pahina" : "1 page"}
      </span>
    </a>
  )
}
