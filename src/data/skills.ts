import { projects } from "./projects"

export const skillGroups = [
  {
    name: "Interfaces",
    description: "Role-based views and connected workflows.",
    tools: ["React", "TypeScript", "Inertia.js", "Tailwind CSS"],
  },
  {
    name: "Backend systems",
    description: "Business rules, APIs, and application services.",
    tools: ["Laravel", "ASP.NET Core", "Node.js", "Express"],
  },
  {
    name: "Data & persistence",
    description: "Inventory, custody, and transaction records.",
    tools: ["MSSQL", "MySQL", "PostgreSQL", "Redis", "EF Core", "Dapper"],
  },
  {
    name: "AI & live events",
    description: "Document analysis and real-time coordination.",
    tools: ["Gemini", "Ollama", "Tesseract.js", "Socket.io", "Laravel Reverb"],
  },
].map((group) => ({
  ...group,
  tools: group.tools
    .map((name) => ({
      name,
      projects: projects.filter((project) =>
        project.tech.some((tech) =>
          tech.toLowerCase().includes(name.toLowerCase()),
        ),
      ),
    }))
    .filter((tool) => tool.projects.length > 0),
}))
