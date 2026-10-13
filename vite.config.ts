import { defineConfig, type Plugin } from "vite"

import react from "@vitejs/plugin-react"

import tailwindcss from "@tailwindcss/vite"

import path from "node:path"

import { mkdir, readFile, writeFile } from "node:fs/promises"

import caseStudyPages from "./src/data/caseStudyPages.json"
import sitePages from "./src/data/sitePages.json"

import { projectPageHtml } from "./src/lib/caseStudyPages"

function staticCaseStudyPages(): Plugin {
  let outputDirectory = ""

  return {
    name: "static-case-study-pages",

    apply: "build",

    configResolved(config) {
      outputDirectory = path.resolve(config.root, config.build.outDir)
    },

    async closeBundle() {
      const template = await readFile(
        path.join(outputDirectory, "index.html"),
        "utf8",
      )
      await writeFile(path.join(outputDirectory, "index.html"), projectPageHtml(template, {
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
