# James Ian Bayonas — Developer Portfolio & Systems Showcase

> **Executive Summary:** A developer portfolio and engineering showcase built with React 19, TypeScript, Vite 8, and Tailwind CSS v4. It presents four project case studies, interactive demonstrations, and engineering notes, with dark/light themes, keyboard navigation, and reduced-motion handling.

<p align="center">
  <a href="https://jamesian-portfolio.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Production%20Demo-Click%20To%20Launch-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

---

## Overview & Architectural Deep Dive

### Core Business Problem & Purpose

Modern technical recruiting requires immediate signal clarity: demonstrating full-stack engineering proficiency, architectural rigor, and system-level trade-offs within seconds. This application serves as an interactive systems portfolio, presenting production-grade architectural blueprints (including distributed logistics, clinical POS, and OCR validation engines) through a developer-focused user experience that mirrors high-end IDEs and terminal diff interfaces.

### Technical Challenges & Engineering Trade-offs

* **The Challenge:** Coordinating continuous viewport-driven ambient lighting, cursor-tracked radial spotlights, and scroll-linked interpolation without causing CSS transform conflicts, layout recalculation storms, or dropped frames on low-powered devices.
* **The Solution:** Implemented CSS `left: calc(50% - 450px)` layout math to isolate horizontal centering from the GPU layer, allowing Framer Motion to animate `scale` and `opacity` MotionValues independently. Integrated deep `useReducedMotion` hooks across all component lifecycles to instantly snap rendering states and bypass continuous animation loops for users with motion sensitivities.
* **The Trade-off:** Selected client-side MotionValue physics and native CSS variables over heavy Canvas/WebGL runtime renderers. This trade-off drastically reduces initial JavaScript bundle weight and memory footprint while maintaining consistent 60fps rendering across desktop and mobile viewports.

---

## Tech Stack & Architecture Matrix

| Layer | Technology | Primary Package / Driver | Architectural Role |
| --- | --- | --- | --- |
| **Frontend UI** | React 19 | `react`, `react-dom` | Component composition, reactive state trees, and hook-based viewport monitoring |
| **Language & Typing** | TypeScript 5.7 | `typescript` | End-to-end static typing, strict null checks, and path alias mapping |
| **Animation Engine** | Motion / Framer Motion | `motion`, `framer-motion` | Spring-physics scroll progress, coordinate tracking, and viewport triggers |
| **Styling & Design System** | Tailwind CSS v4 | `@tailwindcss/vite`, `@theme` | Zero-runtime CSS variable design tokens, monospace scales, and responsive grids |
| **Build & Bundling** | Vite 8 | `vite`, `@vitejs/plugin-react` | Hot Module Replacement (HMR), ESM tree-shaking, and asset compilation |
| **Code Formatting** | oxfmt | `oxfmt` | High-speed Rust-based code formatting and syntax consistency |

---

## Key Features & Engineering Capabilities

* **Measured Mobile Performance:** IBM Plex fonts are served locally with a primary font preload, homepage sections load separately, and walkthrough screenshots reserve their layout dimensions. The [mobile performance review](PERFORMANCE_REVIEW.md) records live before-and-after PageSpeed reports, validation, and remaining image-delivery work.

* **Responsive Project Screenshots:** Explore, the homepage, case-study heroes, and IsdaLog's walkthrough use compressed WebP candidates with browser-selected sizes. Originals remain available. Run `npm run images:generate` after replacing a screenshot; the build verifies source hashes and all 33 generated previews. See [image generation notes](public/screenshots/README.md).

* **Engineering Notes (`/notes/`):** An index and first article, “Why receipt parsing is not payment verification” (`/notes/dormfix-receipt-review/`). The article distinguishes OCR, local structured parsing, schema checks, deterministic business rules, and landlord decisions, while crediting the collaborative capstone accurately. It includes section navigation, a reading-time estimate derived from content, and links to DormFix's case study, sample lab, and documentation. Navigation, search, and the relevant project/demo link back to the note; both pages receive static metadata.
  The collection also includes `/notes/isdalog-delivery-settlement/`, `/notes/centralog-calculated-valuation/`, and `/notes/pharmalink-void-adjustment/`. These explain delivery versus settlement, calculation from source records, and traceable sale adjustments respectively. Shared article rendering uses each note's flow, source context, and project-specific links; related notes appear automatically on the corresponding case study and Lab experiment.

* **Engineering Lab (`/lab/`):** A shared home for four existing demonstrations: CentraLog valuation, DormFix receipt review, IsdaLog custody and settlement, and PharmaLink sale/stock accounting. The page loads one experiment at a time, restores selections from `#demo-<project>` links, and resets sample state when switching. Navigation and search link to the lab; each experiment links back to its case study. The same components and calculation/state logic are reused on the project pages.

* **Project Explorer (`/explore/`):** A shared discovery page with text, domain, and technology filters, direct case-study and walkthrough links, and a valuation lab shortcut. Filter selections are encoded in the URL and restored on reload. Empty results include a clear reset action. The page is linked from desktop/mobile navigation, portfolio search, and project pages, and receives its own static HTML metadata through `src/data/sitePages.json`.

* **Interactive Git Diff Terminal Simulation (`Hero.tsx`):** Simulates an asynchronous character-by-character typewriter diff with automatic cancellation cleanup (`clearTimeout`) and Strict Mode mounting safeguards → **Impact:** Communicates core engineering philosophy through an interactive code diff without memory leaks or race conditions.
* **Viewport-Aware Intersection Navigation (`Nav.tsx`):** Employs an `IntersectionObserver` configured with tuned dual-root margins (`-40% 0px -55% 0px`) and layout-spring animations (`layoutId="nav-pill"`) → **Impact:** Guarantees sub-pixel active-state tracking across variable section heights during rapid user scrolling.
* **Hardware-Accelerated Ambient Atmosphere (`App.tsx`):** Coordinates scroll position (`scrollY`) with dynamic element opacity and scaling transformations, gracefully snapping to static layouts when reduced motion is requested → **Impact:** Delivers depth and visual continuity while adhering strictly to WCAG 2.1 accessibility criteria.
* **Cursor-Tracked Spotlight Lighting (`SpotlightCard.tsx`):** Real-time client bounding-box calculation that generates smooth, localized radial gradient highlights on hover → **Impact:** Provides tactile micro-interactions with zero third-party canvas overhead.
* **Project Showcase & Case Studies (`Projects.tsx`, `ProjectCaseStudy.tsx`):** Presents IsdaLog as the featured independent project, with direct project navigation, contribution credits, and keyboard-accessible expandable case studies. Shared content in `src/data/projects.ts` covers the problem, architecture, workflow, and engineering trade-offs; it replaces the previous fixed diff counters.
* **Skills With Project Evidence (`SkillsMatrix.tsx`):** Groups technologies by their role and links each one to the relevant projects. Counts derive from shared project content rather than the previous fixed activity strips.
* **Portfolio Search (`PortfolioSearch.tsx`):** Ctrl/Cmd+K or the navigation search button opens a native modal dialog. Search by project, technology, or section; arrow keys and Enter select a result, and project results expand their case studies.
* **CentraLog Engineering Lab (`EngineeringLab.tsx`, `AssetValuationDemo.tsx`):** Loads the interactive demo when its section approaches the viewport. It illustrates the project's straight-line and monthly double-declining formulas with a single repair window, input validation, a comparison chart, and an accessible data table. Sample data is separate from the live application.
* **Dedicated IsdaLog Case Study (`/projects/isdalog/`):** Presents contribution credits, architecture, and original project screenshots alongside an eight-stage guided simulation. Visitors explore cloud inference fallback, bidding, separate pickup and delivery codes, and buyer-confirmed settlement. The simulation runs locally with sample data and makes no live transactions.
* **Dedicated DormFix Case Study (`/projects/dormfix/`):** Credits the collaborative capstone and James's feature development contribution. A four-stage receipt walkthrough compares matching, mismatched, old, and unreadable sample receipts, demonstrating the distinction between OCR, structured parsing, deterministic checks, and a landlord's review decision. It runs no live inference or payment updates.
* **Dedicated CentraLog Case Study (`/projects/centralog/`):** Credits James as the sole developer of this school project. A six-stage sample asset lifecycle follows activation, custody transfer, maintenance, resolution, and reporting with an accumulating record history. The existing valuation lab is embedded below the walkthrough and remains independent of its sample state. No live inventory updates or database transactions are performed.
* **Dedicated PharmaLink Case Study (`/projects/pharmalink/`):** Credits the independently built school project and follows sample inventory review, checkout, stock deduction, and a reasoned void adjustment. A failure example leaves sale and stock records unchanged. Original sale history is retained after the void, with stock restored once. The simulation performs no live transactions, dispensing, payments, or refunds. The adjustment presentation is informed by the public `src/features/sales/SaleAdjustmentModal.tsx` and `src/services/saleService.ts` interfaces; database transaction details are documented in PharmaLink's README.
* **Shareable Project Pages:** A shared page manifest connects project links, search results, and build output. The production build generates a nested HTML entry with its own title, description, and Open Graph text, so direct visits work on static hosting. Search can navigate between the dedicated page and expanded home case studies.

---

## Project Structure

```text
├── .gitattributes              # Git LFS tracking rules for media and assets
├── .gitignore                  # Git exclusion definitions (build artifacts, dependencies)
├── .mise.toml                  # Tool version manager lock (Node 22, pnpm 10.34.3)
├── index.html                  # HTML entry point with metadata and root mount target
├── package.json                # Project dependencies, scripts, and runtime engine specs
├── public/
│   └── RESUME.pdf              # Direct static downloadable resume asset
├── src/
│   ├── App.tsx                 # Root application wrapper, scroll progress & ambient engine
│   ├── index.css               # Tailwind v4 @theme tokens, IBM Plex imports & grid masks
│   ├── main.tsx                # StrictMode React DOM root initialization
│   ├── vite-env.d.ts           # Ambient type declarations for Vite clients and PDF imports
│   ├── components/
│   │   ├── About.tsx           # Systems thinking philosophy & discipline capabilities
│   │   ├── ContactFooter.tsx   # Direct contact endpoints, external links & footer bar
│   │   ├── Hero.tsx            # Project-led introduction & illustrative IsdaLog workflow diff
│   │   ├── Nav.tsx             # Responsive header with scroll tracking & mobile drawer
│   │   ├── Process.tsx         # Engineering workflow: Schema -> Component -> Deployment
│   │   ├── Projects.tsx        # Project index, featured work, and contribution summaries
│   │   ├── ProjectCaseStudy.tsx # Expandable problem, architecture, and decision narratives
│   │   ├── DedicatedCaseStudy.tsx # Shareable project page using the shared narratives
│   │   ├── IsdaLogWalkthrough.tsx # Guided role perspectives, handoffs, and sample ledger
│   │   ├── PortfolioSearch.tsx # Native modal search with keyboard selection
│   │   ├── EngineeringLab.tsx  # Section wrapper and deferred demo loading
│   │   ├── AssetValuationDemo.tsx # Sample valuation controls, chart, and data table
│   │   ├── SkillsMatrix.tsx    # Categorized tooling matrix with contribution heatmaps
│   │   ├── docs/demo/          # Showcase project image assets
│   │   │   ├── centralog-demo.png
│   │   │   ├── dorm-fix-demo.png
│   │   │   ├── isdalog-demo.png
│   │   │   └── pharmalink-demo.png
│   │   └── ui/
│   │       └── SpotlightCard.tsx # Reusable cursor-driven radial glow container
│   ├── data/
│       ├── projects.ts        # Shared project content and case-study contracts
│       ├── caseStudyPages.json # Dedicated project routes and static metadata
│       ├── isdalogWalkthrough.ts # Step narratives and original interface screenshots
│       ├── skills.ts          # Technology-to-project evidence derived from project content
│       └── searchEntries.ts   # Project and section search entries
│   └── lib/
│       ├── depreciation.ts    # Browser illustration of CentraLog's calculation strategies
│       ├── caseStudyPages.ts   # Route matching and escaped static-page metadata
│       ├── isdalogWalkthrough.ts # Pure sample order transitions and fund accounting
│       └── search.ts          # Query normalization, matching, and ranking
├── tests/                    # Native Node tests for calculations, search, routes, and walkthrough
├── tsconfig.json               # TypeScript compiler config with bundler module resolution
└── vite.config.ts              # Vite bundler configuration with Tailwind v4 & path aliases

```

---

## Getting Started & Local Setup

### Prerequisites

* **Runtime:** Node.js 22.12 or later within the 22.x release line
* **Package Manager:** pnpm >= 10.34.3 (or npm / yarn / bun)

### Installation & Execution

1. **Clone the Repository:**
```bash
git clone https://github.com/JamesIan-Bayonas/portfolio.git
cd portfolio

```


2. **Install Dependencies:**
```bash
pnpm install --frozen-lockfile

```


3. **Start the Development Server:**
```bash
pnpm dev

```


The application will be accessible at `http://localhost:5173`.
4. **Build for Production:**
```bash
pnpm build

```


5. **Preview Production Build:**
```bash
pnpm preview

```



---

## Verification & Testing

```bash
# Run source code formatting via oxfmt
pnpm format

# Run TypeScript validation (Vite build does not type-check)
pnpm check

# Run calculation and search tests (Node 22.6+ or 24)
pnpm test

# Build the production application
pnpm build

# Verify all generated routes, page metadata, and entry assets
pnpm verify:build

```

---

## Security & Operational Readiness

The local quality review is recorded in `QUALITY_REVIEW.md`. IsdaLog's former Railway demo URL returned “Application not found” during review on 13 October 2026, and the author confirmed that its hosting is inactive. The portfolio marks that live demo unavailable while retaining the case study, source link, and browser simulation. Update `demoAvailable` and the demo URL in `src/data/projects.ts` when hosting resumes.

* **Reverse Tabnabbing Protection:** All external anchor tags (`GitHub`, `LinkedIn`, live demo links) enforce `rel="noopener noreferrer"` with `target="_blank"` to eliminate window opener vulnerabilities.
* **XSS Mitigation:** Static JSX compilation with zero reliance on `dangerouslySetInnerHTML` or unrestricted string evaluation.
* **Built Asset Verification:** `verify:build` checks the generated static routes, page metadata, entry assets, favicon, and résumé file. Dependency versions are tracked in the package-manager lockfile.
