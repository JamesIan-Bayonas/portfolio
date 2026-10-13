import dormFixImg from "../components/docs/demo/dorm-fix-demo.png"
import isdaLogImg from "../components/docs/demo/isdalog-demo.png"
import pharmaLinkImg from "../components/docs/demo/pharmalink-demo.png"
import centraLogImg from "../components/docs/demo/centralog-demo.png"
import caseStudyPages from "./caseStudyPages.json"

export interface Project {
  id: string
  name: string
  title: string
  category: string
  context: string
  role: string
  description: string
  tech: string[]
  demo: string
  demoAvailable?: boolean
  source: string
  image: string
  imageAlt: string
  caseStudyPath?: string
  caseStudy: {
    problem: string
    contribution: string
    audience: string
    architecture: {
      name: string
      detail: string
    }[]
    workflow: {
      title: string
      detail: string
    }[]
    challenge: string
    approach: string
    tradeoff: string
  }
}

// Based on the supplied project documentation and the author's contribution notes.
// No performance benchmarks or production adoption figures have been supplied.
export const projects: Project[] = [
  {
    id: "isdalog",
    caseStudyPath: caseStudyPages.find(page => page.projectId === "isdalog")?.path,
    name: "IsdaLog",
    title: "From the landing port to a verified delivery.",
    category: "Fisheries & logistics",
    context: "Independent project",
    role: "Sole developer",
    description:
      "I noticed a lack of transparency in my local fisheries trade and built a system connecting catch registration, live auctions, delivery tracking, and wallet settlement.",
    tech: [
      "Laravel 11",
      "React 18",
      "Inertia.js",
      "Laravel Reverb",
      "Node.js",
      "Gemini",
      "Ollama",
      "MySQL / SQLite",
      "Redis",
      "Leaflet",
      "Tailwind CSS",
    ],
    demo: "https://isdalog-production.up.railway.app",
    demoAvailable: false,
    source: "https://github.com/JamesIan-Bayonas/isdalog",
    image: isdaLogImg,
    imageAlt: "IsdaLog maritime marketplace and logistics interface",
    caseStudy: {
      problem:
        "Catch registration, price discovery, and cargo handoffs can be difficult to follow at local landing ports. IsdaLog connects those steps in a shared workflow for harvesters, buyers, and riders, with an administrative view for monitoring.",
      contribution:
        "I initiated and built this system independently in response to the lack of transparency I observed in my area. The project brings together the Telegram gateway, marketplace, delivery workflow, and settlement logic.",
      audience: "Harvesters · buyers · logistics riders · administrators",
      architecture: [
        { name: "Capture", detail: "Node.js Telegram gateway" },
        { name: "Classify", detail: "Gemini → Ollama fallback" },
        { name: "Coordinate", detail: "Laravel / Inertia / Reverb" },
        { name: "Persist", detail: "MySQL or SQLite + Redis" },
      ],
      workflow: [
        {
          title: "Register the catch",
          detail:
            "Link a Telegram account, submit a photo, and provide weight, price, and landing hub.",
        },
        {
          title: "Publish and bid",
          detail:
            "Publish the listing and distribute bid updates through Laravel Reverb.",
        },
        {
          title: "Hold funds and dispatch",
          detail:
            "Accept a bid, hold buyer wallet funds, and stage a delivery run.",
        },
        {
          title: "Verify custody",
          detail:
            "Use separate pickup and delivery codes, with GPS updates during transit.",
        },
        {
          title: "Inspect and settle",
          detail:
            "Buyer confirmation releases the settlement: 97% of catch price to the harvester, 3% to the platform, and the delivery fee to the rider.",
        },
      ],
      challenge:
        "Cloud vision requests can fail when connectivity or credentials are unavailable.",
      approach:
        "Attempt Gemini inference with a timeout, then fall back to a reachable Ollama instance running llama3.2-vision. Keep wallet changes inside database transactions with row locks.",
      tradeoff:
        "Local vision inference needs additional compute and a reachable gateway. The fallback reduces dependence on cloud inference, while Telegram and marketplace operations still need connectivity.",
    },
  },
  {
    id: "dormfix",
    caseStudyPath: caseStudyPages.find(page => page.projectId === "dormfix")?.path,
    name: "DormFix",
    title: "A shared workflow for landlords and tenants.",
    category: "Property management",
    context: "Collaborative capstone",
    role: "Feature developer",
    description:
      "A dormitory management platform bringing tenant approvals, room assignments, receipt checks, maintenance requests, and messaging into one place.",
    tech: [
      "React 19",
      "TypeScript",
      "Node.js",
      "Express 5",
      "MSSQL",
      "Tesseract.js",
      "Ollama LLaVA",
      "Zod",
      "Socket.io",
      "Tailwind CSS",
      "DaisyUI",
    ],
    demo: "https://dormfix-jamesian-bayonas-projects.vercel.app",
    source: "https://github.com/JamesIan-Bayonas/dormfix",
    image: dormFixImg,
    imageAlt: "DormFix landlord dashboard with property management tools",
    caseStudy: {
      problem:
        "Manual logbooks and scattered messages make it difficult to track tenant approval, room capacity, submitted payments, and unresolved repairs. Landlords and tenants need a consistent view of those operations.",
      contribution:
        "My classmate proposed DormFix as our capstone project. I implemented its features as part of the capstone team. This case study describes the shared system and my feature development contribution.",
      audience: "Landlords · tenants",
      architecture: [
        { name: "Interface", detail: "React / role-based views" },
        { name: "API", detail: "Express / TypeScript" },
        { name: "Receipt analysis", detail: "Tesseract → Ollama → Zod" },
        { name: "Data & events", detail: "MSSQL / Socket.io" },
      ],
      workflow: [
        {
          title: "Pair and approve",
          detail:
            "Tenants register using a landlord identifier and wait for approval.",
        },
        {
          title: "Assign a room",
          detail:
            "Room assignment checks capacity within a database transaction.",
        },
        {
          title: "Review a payment",
          detail:
            "OCR extracts receipt text; local model parsing produces structured fields for amount and date checks.",
        },
        {
          title: "Resolve issues",
          detail:
            "Maintenance descriptions are categorized and assessed for urgency, while messaging connects the tenant and landlord.",
        },
      ],
      challenge:
        "Payment screenshots vary in format and can contain incorrect amounts or old dates.",
      approach:
        "Separate text extraction and model parsing from deterministic business checks. Validate structured output with Zod and compare extracted fields against expected payment records.",
      tradeoff:
        "Local inference avoids a hosted model API fee but still needs server compute. Schema validation checks output structure; business checks and review are needed to assess the extracted receipt details.",
    },
  },
  {
    id: "centralog",
    caseStudyPath: caseStudyPages.find(page => page.projectId === "centralog")?.path,
    name: "CentraLog",
    title: "Connecting asset custody with maintenance and valuation.",
    category: "Institutional asset management",
    context: "School project",
    role: "Sole developer",
    description:
      "An asset management system combining lifecycle controls, bulk transfers, maintenance records, calculated depreciation, and printable property tags.",
    tech: [
      "ASP.NET Core 8",
      "C#",
      "React 19",
      "TypeScript",
      "EF Core 8",
      "MySQL / MariaDB",
      "JWT",
      "Vitest",
      "xUnit",
    ],
    demo: "https://centralog.vercel.app/",
    source: "https://github.com/JamesIan-Bayonas/centralog",
    image: centraLogImg,
    imageAlt: "CentraLog asset management and valuation dashboard",
    caseStudy: {
      problem:
        "Institutions need to know where equipment is, who holds it, and whether it is in use or under repair. CentraLog connects physical tracking with a valuation calculation that uses maintenance history.",
      contribution:
        "I built CentraLog independently as a school project, implementing the asset lifecycle, backend services, frontend workflows, and valuation strategies.",
      audience: "Inventory staff · managers · accountants · administrators",
      architecture: [
        { name: "Interface", detail: "React / TypeScript" },
        { name: "API", detail: "ASP.NET Core / JWT" },
        { name: "Domain", detail: "Depreciation strategies / worker" },
        { name: "Persistence", detail: "EF Core / MySQL or MariaDB" },
      ],
      workflow: [
        {
          title: "Register and activate",
          detail:
            "Create an asset record and move it from procurement into the active fleet.",
        },
        {
          title: "Move with a record",
          detail:
            "Bulk transfers update locations and custodians while adding audit entries in a transaction.",
        },
        {
          title: "Track maintenance",
          detail:
            "Record repair windows and use a periodic worker to flag service thresholds.",
        },
        {
          title: "Calculate and report",
          detail:
            "Evaluate straight-line or double-declining valuation using the application's maintenance-adjustment policy, then print reports or property tags.",
        },
      ],
      challenge:
        "A stored valuation can drift from the asset's maintenance history as records change.",
      approach:
        "Use interchangeable depreciation strategies to calculate values from asset and maintenance records on read. Group multi-asset mutations and audit entries inside EF Core transactions.",
      tradeoff:
        "Calculating on read adds computation but avoids maintaining a separate cached valuation. Repair windows are handled through the application's explicitly defined downtime-adjustment policy.",
    },
  },
  {
    id: "pharmalink",
    caseStudyPath: caseStudyPages.find(page => page.projectId === "pharmalink")?.path,
    name: "PharmaLink",
    title: "Keeping pharmacy sales and inventory in step.",
    category: "Pharmacy inventory & POS",
    context: "School project",
    role: "Sole developer",
    description:
      "A pharmacy inventory and point-of-sale system with stock deduction, sale reversal, expiration checks, and separate administrator and pharmacist access.",
    tech: [
      "ASP.NET Core 8",
      "C#",
      "React 19",
      "TypeScript",
      "PostgreSQL",
      "Dapper",
      "JWT",
      "Tailwind CSS",
    ],
    demo: "https://pharmalink-web-wine.vercel.app/dashboard",
    source: "https://github.com/JamesIan-Bayonas/pharmalink",
    image: pharmaLinkImg,
    imageAlt: "PharmaLink pharmacy inventory and point-of-sale dashboard",
    caseStudy: {
      problem:
        "Sales and inventory need to remain consistent when stock is deducted or a transaction is reversed. Staff also need visibility into product expiration and permissions appropriate to their role.",
      contribution:
        "I built PharmaLink independently as a school project. Its focus is the connection between pharmacy inventory, point-of-sale workflows, and role-based access.",
      audience: "Administrators · pharmacists",
      architecture: [
        { name: "Interface", detail: "React / TypeScript" },
        { name: "API", detail: "ASP.NET Core / JWT" },
        { name: "Data access", detail: "Dapper" },
        { name: "Persistence", detail: "PostgreSQL" },
      ],
      workflow: [
        {
          title: "Review inventory",
          detail: "Check available stock and product expiration information.",
        },
        {
          title: "Record a sale",
          detail: "Commit the sale and its stock deductions together.",
        },
        {
          title: "Reverse when needed",
          detail: "Record a separate void adjustment with a reason, restore the current recorded quantities once, and retain the original sale. This does not process a refund.",
        },
      ],
      challenge:
        "Updating a sale separately from its stock deductions can leave inconsistent records.",
      approach:
        "Group related sale updates in database transactions and control operations through administrator and pharmacist roles.",
      tradeoff:
        "Coordinating sales and stock in one transaction makes failure handling explicit and requires carefully defined stock and reversal rules.",
    },
  },
]
