export interface ExploreProject {
  name: string
  category: string
  description: string
  tech: string[]
  searchText?: string
}
export interface ExploreFilters {
  query: string
  domain: string
  technology: string
}
export const emptyExploreFilters: ExploreFilters = { query: "", domain: "", technology: "" }

export function filterProjects<T extends ExploreProject>(projects: T[], filters: ExploreFilters): T[] {
  const terms = filters.query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return projects.filter(project => {
    const aliases = project.tech.some(tech => tech.includes("Tesseract")) ? "OCR optical character recognition" : ""
    const dotnet = project.tech.some(tech => tech.startsWith("ASP.NET")) ? "dotnet .NET C# csharp" : ""
    const text = [project.name, project.category, project.description, project.searchText ?? "", aliases, dotnet, ...project.tech].join(" ").toLowerCase()
    return (!filters.domain || project.category === filters.domain) && (!filters.technology || project.tech.includes(filters.technology)) && terms.every(term => text.includes(term))
  })
}

export function readExploreFilters(search: string, domains: string[], technologies: string[]): ExploreFilters {
  const params = new URLSearchParams(search)
  const domain = params.get("domain") ?? ""
  const technology = params.get("tech") ?? ""
  return { query: params.get("q") ?? "", domain: domains.includes(domain) ? domain : "", technology: technologies.includes(technology) ? technology : "" }
}

export function exploreFilterSearch(filters: ExploreFilters): string {
  const params = new URLSearchParams()
  if (filters.query.trim()) params.set("q", filters.query.trim())
  if (filters.domain) params.set("domain", filters.domain)
  if (filters.technology) params.set("tech", filters.technology)
  const search = params.toString()
  return search ? `?${search}` : ""
}
