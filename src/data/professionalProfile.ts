// Background and project periods from the resume supplied on 14 October 2026.
// Current work describes the portfolio improvements requested in this chat.
export const professionalProfile = {
  name: "James Ian Bayonas",
  title: "Junior full-stack developer",
  location: "Dipolog City, Philippines",
  updatedAt: "2026-10-14",
  education: {
    degree: "Bachelor of Science in Information Technology",
    institution: "Dipolog Medical Center Incorporated",
    expectedCompletion: "August 2027",
  },
  currentFocus:
    "I'm refining this portfolio into a place where visitors can explore my systems, follow sample workflows, and inspect the code and tests behind engineering decisions.",
  learningThemes: [
    {
      title: "Dependable records",
      detail:
        "Transactions, custody changes, calculated values, and adjustment history across my projects.",
      href: "/notes/",
      label: "Read the engineering notes",
    },
    {
      title: "Clear interfaces",
      detail:
        "Responsive layouts, accessible interactions, and workflows that make important state changes visible.",
      href: "/lab/",
      label: "Explore the sample workflows",
    },
    {
      title: "Reviewable engineering",
      detail:
        "Explaining implementation choices through source references, test scenarios, and project evolution.",
      href: "/explore/",
      label: "Inspect the case studies",
    },
  ],
  journey: [
    {
      id: "2025-projects",
      period: "2025–present",
      title: "Business workflows and a collaborative capstone",
      detail:
        "My project work from 2025 includes PharmaLink and DormFix. PharmaLink is an independent school project; DormFix was proposed by my classmate, and I implemented its features as part of the capstone team.",
      projectIds: ["pharmalink", "dormfix"],
    },
    {
      id: "2026-systems",
      period: "2026–present",
      title: "Asset management and local fisheries",
      detail:
        "CentraLog is my independently built school project. I initiated IsdaLog independently after noticing a lack of transparency in the fisheries trade in my area.",
      projectIds: ["centralog", "isdalog"],
    },
    {
      id: "education",
      period: "Expected August 2027",
      title: "BS Information Technology",
      detail:
        "I'm studying at Dipolog Medical Center Incorporated in Dipolog City. August 2027 is my expected completion date.",
      projectIds: [],
    },
  ],
  workAreas: [
    {
      id: "business-applications",
      title: "Full-stack business applications",
      detail:
        "Discuss a web application that connects staff roles, records, dashboards, and a clear operational workflow.",
      projectIds: ["dormfix", "pharmalink"],
    },
    {
      id: "data-workflows",
      title: "APIs and data workflows",
      detail:
        "Discuss how related records, permissions, audit history, and calculations should work together in your system.",
      projectIds: ["centralog", "isdalog"],
    },
    {
      id: "existing-systems",
      title: "Existing-system improvements",
      detail:
        "Discuss a specific interface, workflow, or integration that needs clearer behavior, better validation, or a more useful user experience.",
      projectIds: ["pharmalink", "dormfix"],
    },
  ],
  process: [
    {
      title: "Describe the problem",
      detail:
        "Share who uses the system, the workflow they need, and the constraints that matter.",
    },
    {
      title: "Define a useful scope",
      detail:
        "Identify the records, roles, interfaces, and failure cases involved in the proposed work.",
    },
    {
      title: "Review an implementation",
      detail:
        "Use working examples, explicit trade-offs, and relevant checks to discuss the result.",
    },
  ],
} as const
