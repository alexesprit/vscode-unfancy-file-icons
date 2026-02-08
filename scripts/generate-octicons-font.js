/**
 * Generate Octicons web font from @primer/octicons SVGs.
 *
 * Usage:
 *   1. Update @primer/octicons to the desired version in package.json
 *   2. node scripts/generate-octicons-font.js
 *   3. npm test
 *
 * This script determines which octicons glyphs are used (from icon-definitions
 * and iconmap), extracts matching 16px SVGs from @primer/octicons, and generates
 * an already-subset woff font via fantasticon. Codepoints are written to
 * src/codepoints/octicons.json.
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { generateFonts } from 'fantasticon'

import { loadItems } from '../src/data/items.js'
import { readJsonFile } from '../src/loader.js'
import { resolveIconName } from '../src/lookup.js'

const ROOT = path.join(import.meta.dirname, '..')
const SVG_DIR = path.join(ROOT, 'node_modules/@primer/octicons/build/svg')
const ICONMAP_PATH = path.join(ROOT, 'src/iconmaps/octicons.json')
const FONT_OUTPUT_DIR = path.join(ROOT, 'theme/fonts')
const FONT_OUTPUT = path.join(FONT_OUTPUT_DIR, 'octicons.woff')
const CODEPOINTS_OUTPUT = path.join(ROOT, 'src/codepoints/octicons.json')

/**
 * Collect icon names actually used by the octicons theme.
 */
function collectUsedIcons() {
  const items = loadItems()
  const iconmap = readJsonFile(ICONMAP_PATH)
  const used = new Set()

  // Icons referenced by iconmap targets
  for (const iconName of Object.values(iconmap)) {
    used.add(iconName)
  }

  // Icons from iconDefinitions (with remapping applied)
  for (const def of Object.values(items.iconDefinitions)) {
    if (def.iconName) {
      const iconName = resolveIconName(def.iconName, iconmap)
      used.add(iconName)
    }
  }

  return used
}

async function main() {
  if (!fs.existsSync(SVG_DIR)) {
    console.error('Error: @primer/octicons not found.')
    console.error('Run: npm install --save-dev @primer/octicons')
    process.exit(1)
  }

  const usedIcons = collectUsedIcons()

  // Copy only the needed 16px SVGs to a temp directory
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'octicons-'))
  const missing = []

  try {
    for (const iconName of usedIcons) {
      const src = path.join(SVG_DIR, `${iconName}-16.svg`)
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(tempDir, `${iconName}.svg`))
      } else {
        missing.push(iconName)
      }
    }

    if (missing.length > 0) {
      console.error(`✗ Missing SVGs in @primer/octicons: ${missing.join(', ')}`)
      process.exit(1)
    }

    // Generate woff font directly to theme/fonts/
    fs.mkdirSync(FONT_OUTPUT_DIR, { recursive: true })

    const result = await generateFonts({
      inputDir: tempDir,
      outputDir: FONT_OUTPUT_DIR,
      name: 'octicons',
      fontTypes: ['woff'],
      assetTypes: [],
      normalize: true,
      fontHeight: 1000,
    })

    // Write sorted codepoints
    const sorted = Object.keys(result.codepoints)
      .sort()
      .reduce((acc, key) => {
        acc[key] = result.codepoints[key]
        return acc
      }, {})

    fs.writeFileSync(CODEPOINTS_OUTPUT, `${JSON.stringify(sorted, null, 2)}\n`)

    const fontSize = (fs.statSync(FONT_OUTPUT).size / 1024).toFixed(1)
    console.log(
      `✓ Generated octicons.woff (${fontSize}KB, ${usedIcons.size} glyphs)`,
    )
    console.log(`✓ Written ${Object.keys(sorted).length} codepoints`)
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true })
  }
}

main().catch((err) => {
  console.error('Error generating octicons font:', err)
  process.exit(1)
})
