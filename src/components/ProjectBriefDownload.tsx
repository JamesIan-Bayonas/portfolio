export default function ProjectBriefDownload({ projectId }: { projectId: string }) {
  const filename = `${projectId}-project-brief.pdf`
  return <a className="case-brief-link font-mono" href={`/briefs/${filename}`} download={filename}>
    <span>Download project brief ↓</span>
    <span className="case-brief-format">PDF · 1 page</span>
  </a>
}
