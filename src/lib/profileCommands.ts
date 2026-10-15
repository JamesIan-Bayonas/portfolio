export type ProfileCommand = "help" | "whoami" | "journey" | "skills" | "projects" | "now" | "contact" | "clear"
const aliases: Record<string, ProfileCommand> = {
  help: "help",
  whoami: "whoami",
  journey: "journey",
  "ls --journey": "journey",
  skills: "skills",
  "ls --skills": "skills",
  projects: "projects",
  "ls --projects": "projects",
  now: "now",
  "./now": "now",
  contact: "contact",
  "./contact": "contact",
  clear: "clear",
}
export function profileCommand(source: string): ProfileCommand | undefined {
  const key = source.trim().toLowerCase().replace(/\s+/g, " ")
  return Object.prototype.hasOwnProperty.call(aliases, key)
    ? aliases[key]
    : undefined
}
