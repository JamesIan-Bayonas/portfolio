import content from "./professionalContent.json" with { type: "json" }
export const professionalContent = content
export type ProfessionalContent = typeof content
export type ProfessionalPath = keyof typeof content.en.pages
export const professionalProfile = content.en.profile
export const professionalPages = content.en.pages
