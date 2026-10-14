export type PortfolioLocale = "en" | "fil"
export const translatedCorePaths = [
  "/",
  "/about/",
  "/now/",
  "/work-with-me/",
  "/reflections/",
  "/reflections/credit-and-context/",
  "/reflections/visible-decisions/",
]
const corePaths = translatedCorePaths
function normalizedPath(value: string): string {
  if (!value.startsWith("/") || value.startsWith("//")) return "/"
  return value.split(/[?#]/)[0].replace(/\/+$/, "") + "/"
}
export function localeFromPath(path: string): PortfolioLocale {
  const normalized = normalizedPath(path)
  return corePaths.some((core) => normalized === `/fil${core}`) ? "fil" : "en"
}
export function canonicalContentPath(path: string): string {
  const normalized = normalizedPath(path)
  return localeFromPath(normalized) === "fil" ? normalized.slice(4) : normalized
}
export function localizeCoreHref(
  path: string,
  locale: PortfolioLocale,
): string {
  const base = canonicalContentPath(path)
  const hash = path.includes("#")
    ? `#${path.split("#").slice(1).join("#")}`
    : ""
  if (locale === "fil" && base === "/explore/") return "/fil/#projects"
  return (
    (locale === "fil" && corePaths.includes(base) ? `/fil${base}` : base) + hash
  )
}
export function languageDestination(
  path: string,
  locale: PortfolioLocale,
): string {
  const base = canonicalContentPath(path)
  if (locale === "en") return localizeCoreHref(path, "en")
  if (corePaths.includes(base)) return localizeCoreHref(path, "fil")
  const project = /^\/projects\/([a-z0-9-]+)\/$/.exec(base)?.[1]
  return project
    ? `/fil/#project-${project}`
    : base.startsWith("/notes/")
      ? "/fil/#english-resources"
      : "/fil/#projects"
}
export function currentLocale(): PortfolioLocale {
  return localeFromPath(window.location.pathname)
}
