export function milestoneDate(
  committedAt: string,
  locale: "en" | "fil" = "en",
): string {
  return new Intl.DateTimeFormat(locale === "fil" ? "fil-PH" : "en-SG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Singapore",
  }).format(new Date(committedAt))
}
