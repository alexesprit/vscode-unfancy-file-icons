import fs from 'node:fs'
import path from 'node:path'
import subsetFont from 'subset-font'

import { loadItems } from '../src/data/items.js'

const items = loadItems()

/**
 * Collect all used codepoints for a theme
 * @returns {{ unicodes: number[], missing: string[] }}
 */
function collectCodepoints(themeId) {
  const iconmap = JSON.parse(
    fs.readFileSync(
      path.join(import.meta.dirname, `../src/iconmaps/${themeId}.json`),
      'utf-8',
    ),
  )
  const codepoints = JSON.parse(
    fs.readFileSync(
      path.join(import.meta.dirname, `../src/codepoints/${themeId}.json`),
      'utf-8',
    ),
  )

  const usedIcons = new Set()

  // Add icons from iconmap (remapped names)
  for (const iconName of Object.values(iconmap)) {
    usedIcons.add(iconName)
  }

  // Add icons from items.json iconDefinitions (with remapping applied)
  for (const def of Object.values(items.iconDefinitions)) {
    if (def.iconName) {
      // Apply iconmap remapping, same as in themes.js
      const iconName =
        def.iconName in iconmap ? iconmap[def.iconName] : def.iconName
      usedIcons.add(iconName)
    }
  }

  // Map icon names to Unicode codepoints
  const unicodes = []
  const missing = []

  for (const iconName of usedIcons) {
    if (codepoints[iconName]) {
      unicodes.push(codepoints[iconName])
    } else {
      missing.push(iconName)
      console.warn(
        `Warning: No codepoint found for icon "${iconName}" in ${themeId}`,
      )
    }
  }

  return { unicodes, missing }
}

/**
 * Subset a font file to include only used glyphs
 * @returns {Promise<string[]>} Missing codepoints for this theme
 */
async function subsetFontFile(themeId) {
  const { unicodes, missing } = collectCodepoints(themeId)
  const unicodeList = unicodes.map((u) => String.fromCodePoint(u)).join('')

  const inputPath = path.join(
    import.meta.dirname,
    '..',
    'resources',
    `${themeId}.woff`,
  )
  const outputDir = path.join(import.meta.dirname, '..', 'theme', 'fonts')
  const outputPath = path.join(outputDir, `${themeId}.woff`)

  // Ensure output directory exists
  fs.mkdirSync(outputDir, { recursive: true })

  // Read source font
  const sourceFont = fs.readFileSync(inputPath)

  // Subset the font
  const subsetted = await subsetFont(sourceFont, unicodeList, {
    targetFormat: 'woff',
  })

  // Write stripped font
  fs.writeFileSync(outputPath, subsetted)

  const originalSize = (sourceFont.length / 1024).toFixed(2)
  const subsetSize = (subsetted.length / 1024).toFixed(2)
  const savings = (
    ((sourceFont.length - subsetted.length) / sourceFont.length) *
    100
  ).toFixed(1)

  console.log(
    `✓ ${themeId}.woff: ${originalSize}KB → ${subsetSize}KB (${savings}% reduction, ${unicodes.length} glyphs)`,
  )

  return missing
}

/**
 * Subset all theme fonts
 */
async function main() {
  const themes = ['octicons', 'codicons', 'lucide']

  console.log('Subsetting fonts...\n')

  const allMissing = []
  for (const theme of themes) {
    const missing = await subsetFontFile(theme)
    if (missing.length > 0) {
      allMissing.push({ theme, missing })
    }
  }

  if (allMissing.length > 0) {
    console.error('\n✗ Font subsetting failed: missing required codepoints')
    for (const { theme, missing } of allMissing) {
      console.error(`  ${theme}: ${missing.join(', ')}`)
    }
    process.exitCode = 1
  } else {
    console.log('\n✓ All fonts subsetted successfully')
  }
}

main().catch((err) => {
  console.error('Error subsetting fonts:', err)
  process.exit(1)
})
