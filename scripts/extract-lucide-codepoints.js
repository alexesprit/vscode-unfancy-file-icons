/**
 * Extract Lucide icon codepoints from lucide-static package.
 *
 * Usage:
 *   1. Update lucide-static to the desired version in package.json
 *   2. node scripts/extract-lucide-codepoints.js
 *   3. npm test
 *
 * This script converts lucide-static's info.json format to the project's
 * codepoints format (icon name -> integer codepoint).
 */

import fs from 'node:fs'
import path from 'node:path'

import { readJsonFile } from '../src/loader.js'

const INFO_PATH = path.join(
  import.meta.dirname,
  '../node_modules/lucide-static/font/info.json',
)
const OUTPUT_PATH = path.join(
  import.meta.dirname,
  '../src/codepoints/lucide.json',
)

function main() {
  if (!fs.existsSync(INFO_PATH)) {
    console.error('Error: lucide-static not found.')
    console.error('Run: npm install --save-dev lucide-static')
    process.exit(1)
  }

  const info = readJsonFile(INFO_PATH)
  const codepoints = {}

  for (const [name, data] of Object.entries(info)) {
    // encodedCode format: "\eXXX" where XXX is hex
    // Strip leading backslash, parse remaining hex
    const hex = data.encodedCode.slice(1)
    codepoints[name] = Number.parseInt(hex, 16)
  }

  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(codepoints, null, 2)}\n`)

  console.log(`✓ Extracted ${Object.keys(codepoints).length} codepoints`)
  console.log(`✓ Written to ${OUTPUT_PATH}`)
  console.log('\nNext step: npm test')
}

main()
