import { projects } from "./projects"
import type { SearchEntry } from "../lib/search"
import { engineeringNotes } from "./notes"
import { engineeringCapabilities } from "./capabilities"
import filipinoPages from "./filipinoPages.json"

export const portfolioSearchEntries: SearchEntry[] = [
  { id: "portfolio-questions", label: "Ask about the portfolio", description: "Questions about projects, contributions, technologies, demos, and engineering evidence.", category: "Portfolio questions", path: "/ask/", target: "case-study", keywords: ["ask", "questions", "assistant", "answers", "help", "guide"] },
  { id: "professional-about", label: "About & my development journey", description: "Education, project periods, and the context behind my work.", category: "Professional profile", path: "/about/", target: "case-study", keywords: ["education", "student", "resume", "career", "journey", "BSIT", "Dipolog"] },
  { id: "current-work", label: "Current work", description: "A dated update on this portfolio and learning through project work.", category: "Professional profile", path: "/now/", target: "case-study", keywords: ["now", "current", "focus", "learning", "update"] },
  { id: "work-with-me", label: "How I can help", description: "Discuss a build, an existing-system improvement, or an opportunity.", category: "Professional profile", path: "/work-with-me/", target: "case-study", keywords: ["services", "work", "build", "improve", "opportunity", "contact", "hire"] },
  ...engineeringCapabilities.map(capability => ({
    id: `capability-${capability.id}`,
    label: capability.name,
    description: capability.description,
    category: "Engineering capability",
    target: `capability-${capability.id}`,
    keywords: ["skills", "capabilities", "evidence", ...capability.evidence.flatMap(evidence => [evidence.projectId, evidence.summary])],
  })),
  { id: "notes", label: "Engineering Notes", description: "Search and filter the reasoning behind project decisions by topic or project.", category: "Writing", path: "/notes/", target: "case-study", keywords: ["articles", "publications", "decisions", "writing", "explanations", "archive", "topics", "filters"] },
  ...engineeringNotes.map(note => ({ id: note.id, label: note.title, description: note.summary, category: "Engineering note", path: note.path, target: "case-study", keywords: [note.projectId, note.topic, ...note.sections.flatMap(section => [section.title, ...section.paragraphs])] })),
  { id: "explore", label: "Explore all projects", description: "Filter systems by domain and technology, then try a walkthrough.", category: "Project explorer", path: "/explore/", target: "case-study", keywords: ["browse", "filter", "discover", "portfolio", "projects", "technologies"] },
  { id: "engineering-lab", label: "Engineering Lab", description: "Try valuation, receipt review, settlement, and sale-and-stock demos.", category: "Interactive demos", path: "/lab/", target: "case-study", keywords: ["tools", "experiments", "playground", "simulations", "interactive"] },
  ...projects.map((project) => ({
    id: project.id,
    label: project.name,
    description: project.title,
    category: "Case study",
    target: project.caseStudyPath ? "case-study" : `project-${project.id}`,
    path: project.caseStudyPath,
    keywords: [
      project.category,
      project.context,
      project.role,
      project.description,
      project.caseStudy.problem,
      ...project.tech,
      ...(project.tech.some((tech) => tech.startsWith("ASP.NET"))
        ? ["dotnet", "csharp", ".NET"]
        : []),
      ...(project.tech.includes("MSSQL")
        ? ["SQL Server", "Microsoft SQL Server"]
        : []),
    ],
    expandCaseStudy: !project.caseStudyPath,
  })),
  { id: "isdalog-walkthrough", label: "IsdaLog guided walkthrough", description: "Follow the harvester, buyer, and rider through a sample order.", category: "Interactive walkthrough", path: projects.find(project => project.id === "isdalog")?.caseStudyPath, target: "walkthrough", keywords: ["fisheries", "auction", "pickup", "delivery", "otp", "escrow", "roles", "simulation", "handoff"] },
  { id: "dormfix-walkthrough", label: "DormFix receipt-review walkthrough", description: "Explore text extraction, amount and date checks, and landlord review.", category: "Interactive walkthrough", path: projects.find(project => project.id === "dormfix")?.caseStudyPath, target: "walkthrough", keywords: ["receipt", "ocr", "payment", "Tesseract", "Ollama", "Zod", "simulation", "landlord", "tenant"] },
  {
    id: "lab",
    label: "CentraLog valuation lab",
    description: "Explore repair time and asset depreciation.",
    category: "Interactive demo",
    path: "/lab/",
    target: "demo-centralog",
    keywords: [
      "calculator",
      "engineering",
      "depreciation",
      "straight line",
      "double declining",
      "maintenance",
      "chart",
      "asset",
    ],
  },
  { id: "centralog-walkthrough", label: "CentraLog asset lifecycle", description: "Follow custody, maintenance, and reporting for a sample asset.", category: "Interactive walkthrough", path: projects.find(project => project.id === "centralog")?.caseStudyPath, target: "walkthrough", keywords: ["asset", "custody", "transfer", "maintenance", "audit", "lifecycle", "simulation"] },
  { id: "pharmalink-walkthrough", label: "PharmaLink sale and stock walkthrough", description: "Explore a sample checkout and a recorded void adjustment.", category: "Interactive walkthrough", path: projects.find(project => project.id === "pharmalink")?.caseStudyPath, target: "walkthrough", keywords: ["sale", "stock", "inventory", "POS", "void", "adjustment", "transaction", "rollback", "simulation"] },
  {
    id: "skills",
    label: "Skills & project evidence",
    description: "Explore engineering capabilities and the projects behind each technology.",
    category: "Section",
    target: "skills",
    keywords: ["stack", "technologies", "experience", "dotnet", "net", "c#"],
  },
  {
    id: "about",
    label: "About James",
    description: "Full-stack developer based in the Philippines.",
    category: "Section",
    target: "about-section",
    keywords: ["biography", "profile", "background", "james ian bayonas"],
  },
  {
    id: "process",
    label: "How I work",
    description: "From requirements and data models to implementation.",
    category: "Section",
    target: "process",
    keywords: ["process", "architecture", "design", "deployment"],
  },
  {
    id: "contact",
    label: "Contact & resume",
    description: "Email, profiles, and a downloadable resume.",
    category: "Section",
    target: "contact",
    keywords: [
      "hire",
      "email",
      "github",
      "linkedin",
      "cv",
      "resume",
      "opportunities",
    ],
  },
  ...filipinoPages.map(page => ({id:`filipino-${page.path.split("/").filter(Boolean).join("-")}`,label:page.title.split(" | ")[0],description:page.description,category:"Filipino",path:page.path,target:"case-study",keywords:["Filipino","Tagalog","wika"],language:"fil"})),
]
