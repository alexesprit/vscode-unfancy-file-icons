import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import packageFile from '../package.json' with { type: 'json' }
import { getThemeId } from '../src/naming.js'
import { getIconTheme } from '../src/themes.js'

const snapshotDir = resolve(import.meta.dirname, '..', 'snapshots')
const { iconThemes } = packageFile.contributes

mkdirSync(snapshotDir, { recursive: true })

for (const theme of iconThemes) {
  const themeId = getThemeId(theme)
  const iconTheme = getIconTheme(themeId)

  const sorted = sortKeys(iconTheme)
  const outPath = resolve(snapshotDir, `${themeId}.json`)
  writeFileSync(outPath, JSON.stringify(sorted, null, 2))

  console.log(`Snapshot saved: snapshots/${themeId}.json`)
}

function sortKeys(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortKeys)
  }

  if (obj !== null && typeof obj === 'object') {
    const sorted = {}
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = sortKeys(obj[key])
    }
    return sorted
  }

  return obj
}
