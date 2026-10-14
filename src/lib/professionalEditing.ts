import { professionalContent } from "../data/professionalProfile.ts"

export function professionalFieldLabel(path: string[]): string {
  const labels: Record<string, string> = {
    en: "English",
    fil: "Filipino",
    "/about/": "About",
    "/now/": "Now",
    "/work-with-me/": "How I can help",
    label: "Section label",
    title: "Title",
    summary: "Introduction",
    metadata: "Search listing",
    description: "Description",
    currentFocus: "Current focus",
    focusHeading: "Focus heading",
    focusDetail: "Focus explanation",
    learningThemes: "Learning themes",
    workAreas: "Work areas",
    journey: "Journey",
    process: "Discussion steps",
    education: "Education",
    expectedCompletion: "Expected completion",
    period: "Period",
    detail: "Explanation",
    location: "Location",
  }
  return path
    .filter((key) => key !== "profile" && key !== "pages")
    .map(
      (key) =>
        labels[key] ?? (/^\d+$/.test(key) ? `Item ${Number(key) + 1}` : key),
    )
    .join(" · ")
}

// Copy may change; routes, linked projects, record order, and shared identity stay fixed.
export function validateProfessionalContent(
  value: unknown,
  baseline: unknown = professionalContent,
  incomplete = false,
): void {
  function walk(next: unknown, original: unknown, path: string[]) {
    const label = professionalFieldLabel(path)
    if (typeof original === "string") {
      if (
        typeof next !== "string" ||
        next.length > 12000 ||
        (!incomplete && !next.trim())
      )
        throw new Error(`${label} must contain text (up to 12000 characters).`)
      if (
        ["id", "href", "name", "degree", "institution"].includes(
          path.at(-1)!,
        ) ||
        path.includes("projectIds")
      ) {
        if (next !== original)
          throw new Error(`${label} is protected in this editor.`)
      }
      return
    }
    if (Array.isArray(original)) {
      if (!Array.isArray(next) || next.length !== original.length)
        throw new Error(`${label} must retain its records.`)
      original.forEach((item, index) =>
        walk(next[index], item, [...path, String(index)]),
      )
      return
    }
    if (
      !next ||
      typeof next !== "object" ||
      Array.isArray(next) ||
      !original ||
      typeof original !== "object"
    )
      throw new Error(`${label} must be a content object.`)
    const source = original as Record<string, unknown>
    const draft = next as Record<string, unknown>
    if (
      JSON.stringify(Object.keys(draft).sort()) !==
      JSON.stringify(Object.keys(source).sort())
    )
      throw new Error(
        `${label} must retain its supported fields and page addresses.`,
      )
    Object.entries(source).forEach(([key, item]) =>
      walk(draft[key], item, [...path, key]),
    )
  }
  walk(value, baseline, [])
  if (!incomplete) {
    const data = value as typeof professionalContent
    const date = data.en.profile.updatedAt
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      !Number.isFinite(Date.parse(date)) ||
      new Date(date).toISOString().slice(0, 10) !== date
    )
      throw new Error(
        "The update date must be a real date in YYYY-MM-DD format.",
      )
    if (date !== data.fil.profile.updatedAt)
      throw new Error("Both languages must use the same update date.")
    for (const language of ["en", "fil"] as const)
      if (
        data[language].pages["/now/"].summary !==
        data[language].profile.currentFocus
      )
        throw new Error(
          "The Now summary must match the current focus in each language.",
        )
  }
}
