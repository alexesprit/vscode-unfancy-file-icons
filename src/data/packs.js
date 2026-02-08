/**
 * Declarative registry of icon packs.
 *
 * Each entry describes how to extract codepoints from an installed npm package.
 * Adding a new icon pack = adding a new entry to the `packs` array.
 *
 * Fields:
 *   - id:             Cache identifier, used for codepoints file naming
 *   - packageName:    npm package to check version against
 *   - extract:        async (version) => codepoints object (icon name -> integer)
 *   - generateFont:   optional async (version) => codepoints; generates a font
 *                     from source (e.g. SVGs) and returns codepoints as byproduct
 *   - fontOutputPath: optional path (relative to project root) to the generated
 *                     font file; used by the orchestrator for staleness checks
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { loadItems } from './items.js'

const ROOT = path.join(import.meta.dirname, '../..')

/**
 * Sort object keys alphabetically, returning a new object.
 *
 * @param {Record<string, number>} obj Codepoints object
 * @returns {Record<string, number>} Sorted codepoints object
 */
function sortKeys(obj) {
  const sorted = {}
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = obj[key]
  }
  return sorted
}

/**
 * Read and parse a JSON file.
 *
 * @param {string} filePath Absolute path to the JSON file
 * @returns {object} Parsed JSON content
 */
function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

/** @type {Array<{ id: string, packageName: string, extract: (version: string) => Promise<Record<string, number>>, generateFont?: (version: string) => Promise<Record<string, number>>, fontOutputPath?: string }>} */
export const packs = [
  {
    id: 'codicons',
    packageName: '@vscode/codicons',

    async extract() {
      const cssPath = path.join(
        ROOT,
        'node_modules/@vscode/codicons/dist/codicon.css',
      )
      if (!fs.existsSync(cssPath)) {
        throw new Error('@vscode/codicons not found. Run: npm install')
      }

      const css = fs.readFileSync(cssPath, 'utf-8')
      const pattern =
        /\.codicon-([^:]+):before\s*\{\s*content:\s*"\\([0-9a-f]+)"/g
      const codepoints = {}

      for (const match of css.matchAll(pattern)) {
        const [, name, hex] = match
        codepoints[name] = Number.parseInt(hex, 16)
      }

      return codepoints
    },
  },

  {
    id: 'lucide',
    packageName: 'lucide-static',

    async extract() {
      const infoPath = path.join(
        ROOT,
        'node_modules/lucide-static/font/info.json',
      )
      if (!fs.existsSync(infoPath)) {
        throw new Error('lucide-static not found. Run: npm install')
      }

      const info = readJson(infoPath)
      const codepoints = {}

      for (const [name, data] of Object.entries(info)) {
        const hex = data.encodedCode.slice(1)
        codepoints[name] = Number.parseInt(hex, 16)
      }

      return codepoints
    },
  },

  {
    id: 'octicons',
    packageName: '@primer/octicons',
    fontOutputPath: 'theme/fonts/octicons.woff',

    async generateFont(version) {
      const svgDir = path.join(ROOT, 'node_modules/@primer/octicons/build/svg')
      if (!fs.existsSync(svgDir)) {
        throw new Error('@primer/octicons not found. Run: npm install')
      }

      const iconmapPath = path.join(ROOT, 'src/iconmaps/octicons.json')
      const fontOutputDir = path.join(ROOT, 'theme/fonts')
      const fontOutput = path.join(fontOutputDir, 'octicons.woff')

      // Collect icons used by the octicons theme
      const items = loadItems()
      const iconmap = readJson(iconmapPath)
      const used = new Set()

      for (const iconName of Object.values(iconmap)) {
        used.add(iconName)
      }
      for (const def of Object.values(items.iconDefinitions)) {
        if (def.iconName) {
          const resolved = iconmap[def.iconName] ?? def.iconName
          used.add(resolved)
        }
      }

      // Copy needed 16px SVGs to a temp directory
      const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'octicons-'))
      const missing = []

      try {
        for (const iconName of used) {
          const src = path.join(svgDir, `${iconName}-16.svg`)
          if (fs.existsSync(src)) {
            fs.copyFileSync(src, path.join(tempDir, `${iconName}.svg`))
          } else {
            missing.push(iconName)
          }
        }

        if (missing.length > 0) {
          throw new Error(
            `Missing SVGs in @primer/octicons: ${missing.join(', ')}`,
          )
        }

        // Generate woff font
        fs.mkdirSync(fontOutputDir, { recursive: true })

        const { generateFonts } = await import('fantasticon')
        const result = await generateFonts({
          inputDir: tempDir,
          outputDir: fontOutputDir,
          name: 'octicons',
          fontTypes: ['woff'],
          assetTypes: [],
          normalize: true,
          fontHeight: 1000,
        })

        const codepoints = sortKeys(result.codepoints)

        // Write codepoints byproduct and version for independent cache
        const byproductDir = path.join(ROOT, '.cache/fonts')
        fs.mkdirSync(byproductDir, { recursive: true })
        fs.writeFileSync(
          path.join(byproductDir, 'octicons-codepoints.json'),
          `${JSON.stringify(codepoints, null, 2)}\n`,
        )
        fs.writeFileSync(path.join(byproductDir, 'octicons.version'), version)

        const fontSize = (fs.statSync(fontOutput).size / 1024).toFixed(1)
        console.log(
          `octicons: generated octicons.woff ` +
            `(${fontSize}KB, ${used.size} glyphs, v${version})`,
        )

        return codepoints
      } finally {
        fs.rmSync(tempDir, { recursive: true, force: true })
      }
    },

    async extract() {
      return readJson(path.join(ROOT, '.cache/fonts/octicons-codepoints.json'))
    },
  },
]
