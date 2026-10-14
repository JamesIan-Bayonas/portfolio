import { defineConfig, type Plugin } from "vite"

import react from "@vitejs/plugin-react"

import tailwindcss from "@tailwindcss/vite"

import path from "node:path"

import { mkdir, readFile, writeFile } from "node:fs/promises"

import caseStudyPages from "./src/data/caseStudyPages.json"
import sitePages from "./src/data/sitePages.json"
import { engineeringNotes } from "./src/data/notes"
import { notesFeedXml } from "./src/lib/notesFeed"

import { projectPageHtml } from "./src/lib/caseStudyPages"

function staticCaseStudyPages(): Plugin {
  let outputDirectory = ""
  const homePreloads = new Set<string>()

  return {
    name: "static-case-study-pages",

    apply: "build",

    configResolved(config) {
      outputDirectory = path.resolve(config.root, config.build.outDir)
    },

    generateBundle(_, bundle) {
      this.emitFile({ type: "asset", fileName: "notes/feed.xml", source: notesFeedXml(engineeringNotes) })
      const home = Object.values(bundle).find(chunk => chunk.type === "chunk" && chunk.name === "HomePage")
      function visit(file: string) {
        if (homePreloads.has(file)) return
        homePreloads.add(file)
        const chunk = bundle[file]
        if (chunk?.type === "chunk") chunk.imports.forEach(visit)
      }
      if (home) visit(home.fileName)
    },

    async closeBundle() {
      const template = await readFile(
        path.join(outputDirectory, "index.html"),
        "utf8",
      )
      const homeTemplate = template.replace("</head>", `${[...homePreloads].map(file => `<link rel="modulepreload" crossorigin href="/${file}">`).join("\n")}\n</head>`)
      await writeFile(path.join(outputDirectory, "index.html"), projectPageHtml(homeTemplate, {
        path: "/",
        title: "James Ian Bayonas | Full-Stack Developer",
        description: "James Ian Bayonas builds full-stack systems for fisheries, housing, asset management, and pharmacy operations. Explore project case studies and an interactive engineering lab.",
      }))

      for (const page of [...caseStudyPages, ...sitePages]) {
        const directory = path.join(
          outputDirectory,
          ...page.path.split("/").filter(Boolean),
        )

        await mkdir(directory, { recursive: true })

        await writeFile(
          path.join(directory, "index.html"),
          projectPageHtml(template, page),
        )
      }
    },
  }
}

// Standard Vite config for React + Tailwind v4

export default defineConfig({
  build: {
    manifest: true,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "react-core", test: /[\\/]node_modules[\\/](?:react|react-dom|scheduler)[\\/]/, priority: 30 },
            { name: "motion", test: /[\\/]node_modules[\\/](?:motion|framer-motion|motion-dom|motion-utils)[\\/]/, priority: 20 },
          ],
        },
      },
    },
  },
  plugins: [
    react(),

    tailwindcss(),

    staticCaseStudyPages(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
