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

Modern technical recruiting requires immediate signal clarity: demonstrating full-stack engineering proficiency, architectural rigor, and system-level trade-offs within seconds. This application serves as an interactive systems portfolio, explaining documented system architectures (including distributed logistics, clinical POS, and OCR validation engines) through a developer-focused user experience that mirrors high-end IDEs and terminal diff interfaces.

### Technical Challenges & Engineering Trade-offs

* **The Challenge:** Coordinating continuous viewport-driven ambient lighting, cursor-tracked radial spotlights, and scroll-linked interpolation without causing CSS transform conflicts, layout recalculation storms, or dropped frames on low-powered devices.
* **The Solution:** Implemented CSS `left: calc(50% - 450px)` layout math to isolate horizontal centering from the GPU layer, allowing Framer Motion to animate `scale` and `opacity` MotionValues independently. Integrated deep `useReducedMotion` hooks across all component lifecycles to instantly snap rendering states and bypass continuous animation loops for users with motion sensitivities.
* **The Trade-off:** Selected client-side MotionValue physics and native CSS variables over heavy Canvas/WebGL runtime renderers. This design keeps animation separate from the core content and supports reduced-motion preferences. Performance results and limitations are recorded in PERFORMANCE_REVIEW.md.

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

* **Professional context:** About (/about/) connects education and dated project milestones; Now (/now/) records current portfolio work and learning themes; How I can help (/work-with-me/) connects supported work discussions to project examples and the existing contact panel.
* **Reviewable engineering evidence:** Case studies include nine commit-pinned source references, eight scoped test scenarios, and three evolution milestones each. Version labels explain historical and reviewed-code differences across summaries, notes, comparison, walkthroughs, and PDF briefs. External application tests are referenced as inspected evidence rather than claimed executions.
* **Connected notes discovery:** The Notes archive supports text, topic, and project filters with URL restoration and reset. Each article includes curated related notes with an explanation of the connection.

The approved core feature tracker and optional extensions are recorded in [ROADMAP.md](ROADMAP.md).

* **Measured Mobile Performance:** IBM Plex fonts are served locally with a primary font preload, homepage sections load separately, and walkthrough screenshots reserve their layout dimensions. The [mobile performance review](PERFORMANCE_REVIEW.md) records live before-and-after PageSpeed reports, validation, and remaining image-delivery work.

* **Responsive Project Screenshots:** Explore, the homepage, case-study heroes, and IsdaLog's walkthrough use compressed WebP candidates with browser-selected sizes. Originals remain available. Run `npm run images:generate` after replacing a screenshot; the build verifies source hashes and all 33 generated previews. See [image generation notes](public/screenshots/README.md).

* **Screenshot Viewer:** Screenshot buttons open a lazy-loaded native modal with the full-resolution original, workflow captions, previous/next navigation, zoom, Fit, and an original-image link. Explore's gallery follows its current filters; IsdaLog includes its overview and five workflow captures. Keyboard controls include arrows, +/−, 0, and Escape. Focus wraps within the viewer and returns to the opening button on close; the background page stays locked while open. Original images are absent from the page until requested.

* **Project-Aware Contact:** “Discuss a similar system” opens a lazy-loaded contact panel with that project preselected. Visitors choose build, improvement, or opportunity inquiries and enter a short description. The panel prepares a reviewable email containing the project name and canonical case-study link; visitors open it in their email app or copy the complete message. Manual text selection is available when clipboard copying fails. The homepage contact section supports general inquiries. Drafts stay in component memory and clear on close; no form backend or message database is used.

The [visitor journey review](VISITOR_REVIEW.md) documents the direct Explore entry, header contact action, written-case-study shortcut, screenshot captions, keyboard panning, and checks still requiring human feedback.

* **Engineering Notes (`/notes/`):** An index and first article, “Why receipt parsing is not payment verification” (`/notes/dormfix-receipt-review/`). The article distinguishes OCR, local structured parsing, the requested response shape, deterministic business rules, and landlord decisions, while crediting the collaborative capstone accurately. It includes section navigation, a reading-time estimate derived from content, and links to DormFix's case study, sample lab, and documentation. Navigation, search, and the relevant project/demo link back to the note; both pages receive static metadata.
  The collection also includes `/notes/isdalog-delivery-settlement/`, `/notes/centralog-calculated-valuation/`, and `/notes/pharmalink-void-adjustment/`. These explain delivery versus settlement, calculation from source records, and traceable sale adjustments respectively. Shared article rendering uses each note's flow, source context, and project-specific links; related notes appear automatically on the corresponding case study and Lab experiment.

* **Engineering Lab (`/lab/`):** A shared home for four existing demonstrations: CentraLog valuation, DormFix receipt review, IsdaLog custody and settlement, and PharmaLink sale/stock accounting. The page loads one experiment at a time, restores selections from `#demo-<project>` links, and resets sample state when switching. Navigation and search link to the lab; each experiment links back to its case study. The same components and calculation/state logic are reused on the project pages.

* **Project Explorer (`/explore/`):** A shared discovery page with text, domain, and technology filters, direct case-study and walkthrough links, and a valuation lab shortcut. Filter selections are encoded in the URL and restored on reload. Empty results include a clear reset action. The page is linked from desktop/mobile navigation, portfolio search, and project pages, and receives its own static HTML metadata through `src/data/sitePages.json`.
* **Project Comparison:** Choose two projects in Explore to compare their problems, personal contributions, technologies, approaches, and trade-offs using shared case-study data. Desktop columns stack on mobile. Each project has case-study, walkthrough, and contextual contact actions. Comparison selections survive filters and reloads through the page URL; duplicate or unknown URL selections are ignored.
* **Case-Study Section Navigation:** All four dedicated case studies include a sticky section navigator with scroll-based current-section highlighting, direct fragment links, and a copy-section action with address fallback. Compact layouts use a menu with Escape focus recovery; selecting a section closes the menu and focuses its target. CentraLog includes its valuation lab.
* **Related Project Recommendations:** Case-study footers show up to two connected projects using shared capability evidence and backend technologies, with explicit reasons, project role/context, a case-study link, and an Explore comparison preselected with both projects. Generic frontend/tooling overlaps alone do not create recommendations; the current project and projects without a case-study destination are excluded. A browse-all link remains available.
* **Walkthrough Completion Summaries:** All four guided demos show a shared lazy-loaded summary after the final sample action. Outcomes use the current sample decision, quantities, history, or settlement balances. Each summary links to the project's design decision and engineering note, opens project-specific contact, and offers replay. Completion focuses the summary heading; replay resets the demo and focuses its starting heading. The summaries also work when a walkthrough is selected in the Lab.
* **Downloadable Project Briefs:** Case-study headers provide one-page PDF downloads for all four projects, generated from shared project details with accurate contribution/context, workflow, architecture, decisions, and clickable case-study/walkthrough/source links. Build verification rejects stale or changed PDFs. See [brief generation notes](public/briefs/README.md) for regeneration and visual review.

* **Interactive Git Diff Terminal Simulation (`Hero.tsx`):** Simulates an asynchronous character-by-character typewriter diff with automatic cancellation cleanup (`clearTimeout`) and Strict Mode mounting safeguards → **Impact:** Communicates core engineering philosophy through an interactive code diff without memory leaks or race conditions.
* **Viewport-Aware Intersection Navigation (`Nav.tsx`):** An `IntersectionObserver` tracks the active section, including sections mounted after lazy loading. The cursor and mobile menu use CSS; the navigation no longer redraws on a repeating cursor timer.
* **Homepage Motion & Loading (`HomePage.tsx`):** Homepage animations live in a separate chunk, preloaded only on the home route. Decorative typing finishes when offscreen or when the page is hidden; the footer pulse pauses offscreen. Reduced-motion handling remains active. Shared loading placeholders reserve space for deferred pages and panels, and case studies load only their own walkthrough. Build checks prevent the homepage animation runtime from entering other routes' static dependency graphs.
* **Cursor-Tracked Spotlight Lighting (`SpotlightCard.tsx`):** Real-time client bounding-box calculation that generates smooth, localized radial gradient highlights on hover → **Impact:** Provides tactile micro-interactions with zero third-party canvas overhead.
* **Project Showcase & Case Studies (`Projects.tsx`, `ProjectCaseStudy.tsx`):** Presents IsdaLog as the featured independent project, with direct project navigation, contribution credits, and keyboard-accessible expandable case studies. Shared content in `src/data/projects.ts` covers the problem, architecture, workflow, and engineering trade-offs; it replaces the previous fixed diff counters.
* **Engineering Capabilities & Technology Evidence (`SkillsMatrix.tsx`):** Four capability cards connect AI workflows, transaction integrity, real-time communication, and asset lifecycle management to eight documented project examples. Each example includes the shared project role/context and links directly to a case-study section or sample walkthrough. Capabilities have homepage deep links and portfolio-search entries. Technology groups remain available below the map, with project counts derived from shared content. Curated examples live in `src/data/capabilities.ts`.
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
portfolio/
├── public/             # Static assets, local IBM Plex font subsets, and responsive WebP previews
├── scripts/            # Build verification and automated WebP screenshot generation scripts
├── src/                # Application source code
│   ├── components/     # Case studies, interactive walkthroughs, engineering labs, and UI views
│   ├── data/           # Project manifests, engineering notes, screenshot metadata, and search indexes
│   ├── lib/            # Valuation math, search ranking, route matching, and walkthrough state reducers
│   ├── App.tsx         # Root application shell, scroll progress, and ambient atmosphere engine
│   └── index.css       # Tailwind CSS v4 design tokens and theme color variables
├── tests/              # Native Node.js test suite for valuation formulas, search, and walkthrough states
├── index.html          # HTML entry point with metadata and local font preload declarations
├── vite.config.ts      # Vite 8 bundler configuration and static HTML pre-rendering plugin
└── vercel.json         # Static deployment configuration, pnpm lockfile enforcement, and build gates
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
