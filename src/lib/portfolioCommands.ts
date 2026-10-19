export interface PortfolioCommand {
  command: string
  description: string
  href?: string
  action?: "help" | "clear"
}

interface CommandProject {
  id: string
  name: string
  caseStudyPath?: string
}

export function buildPortfolioCommands(
  projects: readonly CommandProject[],
): PortfolioCommand[] {
  return [
    { command: "help", description: "Show all commands", action: "help" },
    {
      command: "projects",
      description: "Explore all systems",
      href: "/explore/",
    },
    { command: "lab", description: "Open the engineering lab", href: "/lab/" },
    { command: "tools", description: "Open developer tools", href: "/tools/" },
    { command: "regex", description: "Open the Regex Lab", href: "/tools/regex/" },
    {
      command: "notes",
      description: "Browse engineering notes",
      href: "/notes/",
    },
    { command: "about", description: "Meet the developer", href: "/about/" },
    {
      command: "contact",
      description: "Start a conversation",
      href: "/#contact",
    },
    ...projects
      .filter((project) => project.caseStudyPath)
      .flatMap((project) => [
        {
          command: project.id.toLowerCase(),
          description: `Read the ${project.name} case study`,
          href: project.caseStudyPath,
        },
        {
          command: `lab ${project.id.toLowerCase()}`,
          description: `Try the ${project.name} experiment`,
          href: `/lab/#demo-${encodeURIComponent(project.id)}`,
        },
        {
          command: `notes ${project.id.toLowerCase()}`,
          description: `Read notes about ${project.name}`,
          href: `/notes/?project=${encodeURIComponent(project.id)}`,
        },
      ]),
    {
      command: "clear",
      description: "Clear the terminal and command history",
      action: "clear",
    },
  ]
}

export function normalizePortfolioCommand(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ")
}

export function resolvePortfolioCommand(
  input: string,
  commands: readonly PortfolioCommand[],
) {
  const normalized = normalizePortfolioCommand(input)
  return commands.find((item) => item.command === normalized)
}

export function suggestPortfolioCommands(
  input: string,
  commands: readonly PortfolioCommand[],
) {
  const normalized = normalizePortfolioCommand(input)
  if (!normalized) return []
  return commands.filter((item) => item.command.startsWith(normalized))
}
