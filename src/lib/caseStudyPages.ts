export interface CaseStudyPageMetadata {
  projectId?: string
  path: string
  title: string
  description: string
}

export function normalizePagePath(path: string): string {
  return path.replace(/\/+$/, "") || "/"
}

export function findCaseStudyPage(
  pages: CaseStudyPageMetadata[],
  pathname: string,
): CaseStudyPageMetadata | undefined {
  return pages.find(
    (page) => normalizePagePath(page.path) === normalizePagePath(pathname),
  )
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function projectPageHtml(
  template: string,
  page: CaseStudyPageMetadata,
): string {
  return template
    .replace(
      /<title>[\s\S]*?<\/title>/,
      () => `<title>${escapeHtml(page.title)}</title>`,
    )
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*("\s*\/?>)/,
      (_match, prefix: string, suffix: string) => `${prefix}${escapeHtml(page.description)}${suffix}`,
    )
    .replace(
      "</head>",
      `<meta property="og:title" content="${escapeHtml(page.title)}" />\n<meta property="og:description" content="${escapeHtml(page.description)}" />\n<meta property="og:type" content="website" />\n</head>`,
    )
}
