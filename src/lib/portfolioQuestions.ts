export interface QuestionProject {
  id: string
  name: string
  role: string
  context: string
  description: string
  tech: string[]
  versionSummary: string
  demoAvailable?: boolean
  caseStudyPath?: string
  caseStudy: {
    contribution: string
    problem: string
  }
}

export interface QuestionAnswer {
  heading: string
  summary: string
  projects: QuestionProject[]
  kind: "projects" | "contribution" | "source" | "tests" | "demos" | "profile" | "contact" | "unknown"
  links: {
    label: string
    href: string
  }[]
}

export const suggestedQuestions = [
  "What did James contribute to DormFix?",
  "Which projects use .NET?",
  "Which projects explore AI workflows?",
  "Where can I inspect test evidence?",
  "Can I try the demos?",
  "What is James working on now?",
]

const words = (value: string) => {
  const aliases: Record<string, string> = {
    ambag: "contribution",
    kontribusyon: "contribution",
    tungkulin: "role",
    gumawa: "built",
    ginawa: "built",
    pagsubok: "tests",
    pagsusulit: "tests",
    ebidensya: "evidence",
    ebidensiya: "evidence",
    kodigo: "code",
    subukan: "try",
    halimbawa: "demo",
    ihambing: "compare",
    pagkakaiba: "difference",
    kasalukuyan: "now",
    ngayon: "now",
    pinagaaralan: "learning",
    edukasyon: "education",
    paaralan: "education",
    sahod: "salary",
    magkano: "rates",
    presyo: "pricing",
    bayad: "pricing",
    oportunidad: "opportunity",
    resibo: "receipt",
    pabahay: "housing",
    gamot: "medicine",
    botika: "pharmacy",
    benta: "sales",
    kagamitan: "assets",
    pangingisda: "fisheries",
    postgres: "postgresql",
    dotnet: "net",
    csharp: "net",
  }
  return value
    .toLowerCase()
    .replace(/c\s*#/g, " csharp ")
    .replace(/sql\s+server/g, " mssql ")
    .replace(/socket[.\s]+io/g, " socketio ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((term) => aliases[term] ?? term)
}

// Answers select published records and labelled destinations. There is no
// generated prose, external model, conversation storage, or inferred biography.
export function answerPortfolioQuestion(
  question: string,
  projects: readonly QuestionProject[],
): QuestionAnswer {
  const terms = words(question)
  const has = (...options: string[]) =>
    options.some((option) => terms.includes(option))
  const named = projects.filter((project) =>
    question
      .toLowerCase()
      .replace(/\s/g, "")
      .includes(project.name.toLowerCase().replace(/\s/g, "")),
  )
  const result = (
    kind: QuestionAnswer["kind"],
    heading: string,
    summary: string,
    links: QuestionAnswer["links"] = [],
    selected: readonly QuestionProject[] = [],
  ) => ({ kind, heading, summary, links, projects: [...selected] })

  if (!question.trim() || question.length > 240)
    return result(
      "unknown",
      "Ask about the published work",
      "Choose an example or ask a short question about a project, technology, contribution, demo, or engineering evidence.",
      [{ label: "Browse every project", href: "/explore/" }],
    )
  if (has("not", "without", "except", "hindi", "walang"))
    return result(
      "unknown",
      "Clarify the project criteria",
      "This guide matches positive project criteria. Use Explore to inspect exclusions, or ask which projects use a specific technology.",
      [{ label: "Browse and filter projects", href: "/explore/" }],
    )
  if (
    has("hire", "hiring", "salary", "freelance", "job", "hourly") ||
    (!named.length &&
      has(
        "rate",
        "rates",
        "pricing",
        "price",
        "available",
        "availability",
        "phone",
        "email",
      ))
  ) {
    return result(
      "contact",
      "Discuss a project or opportunity",
      "The portfolio describes supported work discussions. Rates and availability are not published here; use the contact page to describe your build, improvement, or opportunity.",
      [{ label: "How I can help and contact", href: "/work-with-me/" }],
    )
  }
  if (!named.length && has("now", "currently", "learning", "focus"))
    return result(
      "profile",
      "Current work and learning",
      "The dated Now page describes the current portfolio work and learning through project work.",
      [{ label: "Read the current update", href: "/now/" }],
    )
  if (
    !named.length &&
    has("education", "degree", "student", "journey", "resume", "background")
  )
    return result(
      "profile",
      "Education and project journey",
      "The About page connects education and dated project milestones, including the distinction between school, collaborative, and independent work.",
      [{ label: "Read the personal journey", href: "/about/" }],
    )

  const technologyTerms = new Set(
    projects
      .flatMap((project) => words(project.tech.join(" ")))
      .filter(
        (term) =>
          term.length > 2 &&
          !["core", "css", "vision", "server"].includes(term),
      ),
  )
  const requested = [
    ...new Set(
      terms.filter((term) => technologyTerms.has(term) || term === "net"),
    ),
  ]
  const selected = named.length
    ? named
    : projects.filter((project) => {
        const technology = words(project.tech.join(" "))
        if (requested.length)
          return (
            requested.every((term) => technology.includes(term)) &&
            (!has("ai", "ocr") ||
              project.tech.some((tech) => /Gemini|Ollama|Tesseract/.test(tech)))
          )
        if (has("ai", "ocr", "gemini", "ollama", "tesseract"))
          return project.tech.some((tech) =>
            /Gemini|Ollama|Tesseract/.test(tech),
          )
        const domains: Record<string, string[]> = {
          dormfix: ["housing", "dormitory", "landlord", "tenant", "receipt"],
          isdalog: [
            "fisheries",
            "fish",
            "logistics",
            "auction",
            "custody",
            "escrow",
          ],
          centralog: [
            "asset",
            "assets",
            "depreciation",
            "valuation",
            "custodian",
          ],
          pharmalink: ["pharmacy", "pos", "medicine", "sale", "sales", "void"],
        }
        return terms.some(
          (term) =>
            technology.includes(term) || domains[project.id]?.includes(term),
        )
      })
  const evidenceProjects = selected.length ? selected : projects
  if (has("test", "tests", "testing", "evidence"))
    return result(
      "tests",
      "Inspect what the tests check",
      "These case studies explain test scenarios, expected outcomes, and recorded execution scope. Results identify their exact suite and commit, including failures and unexecuted checks; portfolio simulation tests cover sample logic.",
      [],
      evidenceProjects,
    )
  if (has("source", "code", "implementation", "github"))
    return result(
      "source",
      "Follow the explanation into the code",
      "Each case study includes commit-pinned source references with explanations and reviewed version context.",
      [],
      evidenceProjects,
    )
  if (
    has(
      "demo",
      "demos",
      "walkthrough",
      "walkthroughs",
      "simulation",
      "simulations",
      "try",
    )
  )
    return result(
      "demos",
      "Try a sample workflow",
      "The Engineering Lab and case studies contain local sample demonstrations. They perform no live payment, inventory, or delivery updates.",
      [{ label: "Open the Engineering Lab", href: "/lab/" }],
      selected,
    )
  if (selected.length) {
    const contribution = has(
      "contribution",
      "contribute",
      "contributed",
      "role",
      "roles",
      "team",
      "solo",
      "independent",
      "built",
      "build",
    )
    const links =
      named.length === 2 &&
      has("compare", "comparison", "difference", "differences")
        ? [
            {
              label: "Compare these two projects",
              href: `/explore/?compare=${named[0].id}&compare=${named[1].id}`,
            },
          ]
        : []
    return result(
      contribution ? "contribution" : "projects",
      contribution
        ? "James's documented contributions"
        : "Relevant published projects",
      "The records below come from the case studies. Follow their links for the complete explanation and version context.",
      links,
      selected,
    )
  }
  return result(
    "unknown",
    "I couldn't match that to published content",
    "Try a project name, a technology such as React or .NET, or one of the example questions. Browse the portfolio or contact James for details that are not covered here.",
    [
      { label: "Browse every project", href: "/explore/" },
      { label: "Discuss your question", href: "/work-with-me/" },
    ],
  )
}

export function questionProjectDestination(
  project: QuestionProject,
  kind: QuestionAnswer["kind"],
): string {
  const path = project.caseStudyPath ?? "/explore/"
  const suffix =
    kind === "source"
      ? `#${project.id}-source-code`
      : kind === "tests"
        ? `#${project.id}-test-evidence`
        : kind === "demos"
          ? "#walkthrough"
          : kind === "contribution"
            ? `#${project.id}-contribution`
            : ""
  return project.caseStudyPath ? path + suffix : path
}
