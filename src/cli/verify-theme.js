import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

import packageFile from '../../package.json' with { type: 'json' }
import { readJsonFile } from '../loader.js'
import { getThemeId } from '../naming.js'
import { getIconTheme } from '../themes.js'

const snapshotDir = resolve(import.meta.dirname, '../..', 'snapshots')

/**
 * Entry point.
 */
function main() {
  const { iconThemes } = packageFile.contributes

  let hasChanges = false

  for (const theme of iconThemes) {
    const themeId = getThemeId(theme)
    const snapshotPath = resolve(snapshotDir, `${themeId}.json`)

    if (!existsSync(snapshotPath)) {
      console.error(`No snapshot found: snapshots/${themeId}.json`)
      console.error('Run "npm run snapshot" first.')
      process.exitCode = 1
      return
    }

    const snapshot = readJsonFile(snapshotPath)
    const current = getIconTheme(themeId)

    const changes = diffThemes(snapshot, current)
    if (changes.length > 0) {
      hasChanges = true
      console.log(`\nTheme: ${themeId}`)
      for (const line of changes) {
        console.log(line)
      }
    }
  }

  if (hasChanges) {
    console.log('')
    process.exitCode = 1
  } else {
    console.log('No changes detected.')
  }
}

/**
 * Compare two theme objects section by section (order-insensitive).
 */
function diffThemes(snapshot, current) {
  const changes = []

  const mappingSections = ['fileExtensions', 'fileNames', 'languageIds']

  for (const section of mappingSections) {
    reportMappingDiff(changes, section, snapshot[section], current[section])
  }

  for (const section of mappingSections) {
    reportMappingDiff(
      changes,
      `light.${section}`,
      snapshot.light?.[section],
      current.light?.[section],
    )
  }

  reportIconDefinitionsDiff(
    changes,
    snapshot.iconDefinitions,
    current.iconDefinitions,
  )

  for (const prop of ['file', 'folder', 'folderExpanded']) {
    if (snapshot[prop] !== current[prop]) {
      changes.push(`  ${prop}: ${snapshot[prop]} -> ${current[prop]}`)
    }
    const snapLight = snapshot.light?.[prop]
    const curLight = current.light?.[prop]
    if (snapLight !== curLight) {
      changes.push(`  light.${prop}: ${snapLight} -> ${curLight}`)
    }
  }

  return changes
}

/**
 * Compare two flat key->value mappings, report additions/deletions/changes.
 */
function reportMappingDiff(changes, label, snapshot, current) {
  snapshot = snapshot || {}
  current = current || {}

  const lines = []
  const allKeys = new Set([...Object.keys(snapshot), ...Object.keys(current)])

  for (const key of [...allKeys].sort()) {
    if (!(key in snapshot)) {
      lines.push(`    + ${key} -> ${current[key]}`)
    } else if (!(key in current)) {
      lines.push(`    - ${key} -> ${snapshot[key]}`)
    } else if (snapshot[key] !== current[key]) {
      lines.push(`    ~ ${key}: ${snapshot[key]} -> ${current[key]}`)
    }
  }

  if (lines.length > 0) {
    changes.push(`  ${label}:`)
    changes.push(...lines)
  }
}

/**
 * Compare iconDefinitions, checking fontColor and fontCharacter per entry.
 */
function reportIconDefinitionsDiff(changes, snapshot, current) {
  snapshot = snapshot || {}
  current = current || {}

  const lines = []
  const allKeys = new Set([...Object.keys(snapshot), ...Object.keys(current)])

  for (const key of [...allKeys].sort()) {
    if (!(key in snapshot)) {
      const props = formatIconDef(current[key])
      lines.push(`    + ${key} (${props})`)
    } else if (!(key in current)) {
      const props = formatIconDef(snapshot[key])
      lines.push(`    - ${key} (${props})`)
    } else {
      const diffs = diffIconDef(snapshot[key], current[key])
      if (diffs.length > 0) {
        lines.push(`    ~ ${key}: ${diffs.join(', ')}`)
      }
    }
  }

  if (lines.length > 0) {
    changes.push('  iconDefinitions:')
    changes.push(...lines)
  }
}

function formatIconDef(def) {
  const parts = []
  if (def.fontColor) {
    parts.push(def.fontColor)
  }
  if (def.fontCharacter) {
    parts.push(def.fontCharacter)
  }
  return parts.join(', ')
}

function diffIconDef(a, b) {
  const diffs = []
  if (a.fontColor !== b.fontColor) {
    diffs.push(`fontColor: ${a.fontColor} -> ${b.fontColor}`)
  }
  if (a.fontCharacter !== b.fontCharacter) {
    diffs.push(`fontCharacter: ${a.fontCharacter} -> ${b.fontCharacter}`)
  }
  return diffs
}

main()
