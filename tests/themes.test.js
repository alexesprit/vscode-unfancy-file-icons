import { join } from 'node:path'
import test from 'ava'

import packageFile from '#package' with { type: 'json' }
import { readJsonFile } from '#src/loader.js'

const { iconThemes } = packageFile.contributes

runTests()

function runTests() {
  for (const theme of iconThemes) {
    testTheme(theme)
  }
}

function testTheme(theme) {
  const themeId = theme.id
  const iconTheme = readJsonFile(join(import.meta.dirname, '..', theme.path))

  const { iconDefinitions } = iconTheme

  const themes = {
    dark: iconTheme,
    light: iconTheme.light,
  }

  for (const [themeName, theme] of Object.entries(themes)) {
    const entries = getThemeEntries(theme)

    for (const [entryName, entryType] of Object.entries(entries)) {
      const fullEntryName = `${themeName} > ${entryName}`

      test(`[${themeId}] ${fullEntryName} has a valid '${entryType}' type`, (t) => {
        t.true(entryType in iconDefinitions)
      })
    }
  }
}

function getThemeEntries(theme) {
  const result = {}
  const definitions = ['fileNames', 'fileExtensions']

  for (const defName of definitions) {
    const definition = theme[defName]

    for (const [entry, type] of Object.entries(definition)) {
      const entryName = `${defName} > ${entry}`

      result[entryName] = type
    }
  }

  return result
}
