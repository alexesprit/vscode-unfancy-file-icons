import fs from 'node:fs'
import path from 'node:path'
import subsetFont from 'subset-font'

import packageFile from '../../package.json' with { type: 'json' }
import { loadItems, loadThemeConfig } from '../loader.js'
import { collectUsedIcons } from '../lookup.js'
import { getThemeId } from '../naming.js'

const items = loadItems()

/** Source font paths per theme (resolved from npm packages when available) */
const sourceFontPaths = {
  codicons: path.join(
    import.meta.dirname,
    '../../node_modules/@vscode/codicons/dist/codicon.ttf',
  ),
  lucide: path.join(
    import.meta.dirname,
    '../../node_modules/lucide-static/font/lucide.woff',
  ),
}

/**
 * Collect all used codepoints for a theme
 * @returns {{ unicodes: number[], missing: string[] }}
 */
function collectCodepoints(themeId) {
  const { iconMap, codepoints } = loadThemeConfig(themeId)
  const usedIcons = collectUsedIcons(items.iconDefinitions, iconMap)

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

  const inputPath = sourceFontPaths[themeId]
  const outputDir = path.join(import.meta.dirname, '../..', 'theme', 'fonts')
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
 * Entry point.
 */
async function main() {
  const { iconThemes } = packageFile.contributes
  const themes = iconThemes
    .map((theme) => getThemeId(theme))
    .filter((id) => id in sourceFontPaths)

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
  process.exitCode = 1
})
