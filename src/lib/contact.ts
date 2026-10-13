export const contactEmail = "jamesianbayonas21@gmail.com"
export const inquiryKinds = {
  build: "Build a system",
  improve: "Improve an existing system",
  opportunity: "Discuss an opportunity",
} as const
export type InquiryKind = keyof typeof inquiryKinds

export interface InquiryProject {
  name: string
  caseStudyPath?: string
}

export function prepareInquiry(kind: InquiryKind, project: InquiryProject | undefined, description: string) {
  const message = description.trim()
  if (!message || message.length > 1000) throw new Error("Describe your inquiry in 1–1000 characters.")
  const reference = project?.name ?? "General inquiry"
  const subject = `${inquiryKinds[kind]} — ${reference}`
  const context = project
    ? `Project reference: ${project.name}${project.caseStudyPath ? `\nCase study: https://jamesian-portfolio.vercel.app${project.caseStudyPath}` : ""}`
    : "Portfolio: https://jamesian-portfolio.vercel.app/"
  const body = `Hi James,\n\nI'd like to ${inquiryKinds[kind].toLowerCase()}.\n\n${context}\n\n${message}\n\nThank you.`
  return {
    subject,
    body,
    mailto: `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    copyText: `To: ${contactEmail}\nSubject: ${subject}\n\n${body}`,
  }
}
