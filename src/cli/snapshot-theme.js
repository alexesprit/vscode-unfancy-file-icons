import { mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import packageFile from '#package' with { type: 'json' }
import { getThemeId } from '#src/naming.js'
import { sortKeysDeep } from '#src/sort.js'
import { getIconTheme } from '#src/themes.js'

const snapshotDir = resolve(import.meta.dirname, '../..', 'snapshots')

/**
 * Entry point.
 */
function main() {
  const { iconThemes } = packageFile.contributes

  mkdirSync(snapshotDir, { recursive: true })

  for (const theme of iconThemes) {
    const themeId = getThemeId(theme)
    const iconTheme = getIconTheme(themeId)

    const sorted = sortKeysDeep(iconTheme)
    const outPath = resolve(snapshotDir, `${themeId}.json`)
    writeFileSync(outPath, JSON.stringify(sorted, null, 2))

    console.log(`Snapshot saved: snapshots/${themeId}.json`)
  }
}

main()
