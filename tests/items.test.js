import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'ava'
import packageFile from './../package.json' with { type: 'json' }
import colors from './../src/data/colors.json' with { type: 'json' }
import itemsData from './../src/data/items.json' with { type: 'json' }
import { getThemeId } from './../src/utils.js'

const { iconDefinitions, fileExtensions, fileNames, languageIds } = itemsData

runTests()

function runTests() {
  testIconColors()
  testThemeItems()

  testFileDefinitions()
  testLanguageIds()
}

function testIconColors() {
  testIconProp('generic', 'iconColor', (value) => value in colors)
}

function testThemeItems() {
  const { iconThemes } = packageFile.contributes

  for (const theme of iconThemes) {
    const themeId = getThemeId(theme)

    const codepoints = JSON.parse(
      readFileSync(
        join(import.meta.dirname, `../src/codepoints/${themeId}.json`),
        'utf-8',
      ),
    )
    const iconMap = JSON.parse(
      readFileSync(
        join(import.meta.dirname, `../src/iconmaps/${themeId}.json`),
        'utf-8',
      ),
    )

    testIconNames(theme, codepoints, iconMap)
    testIconMaps(theme, codepoints, iconMap)
  }
}

function testIconNames(theme, codepoints, iconMap) {
  testIconProp(theme.id, 'iconName', (value) => {
    return value in codepoints || value in iconMap
  })
}

function testIconMaps(theme, codepoints, iconMap) {
  for (const key in iconMap) {
    const value = iconMap[key]
    const fullEntryName = `[${theme.id}] iconmaps > ${key}`

    test(`${fullEntryName} has a valid ${value} value`, (t) => {
      t.true(value in codepoints)
    })
  }
}

function testFileDefinitions() {
  const definitions = getFileDefinitions()
  for (const entryName in definitions) {
    const itemType = definitions[entryName]

    test(`${entryName} is valid item type`, (t) => {
      t.true(itemType in iconDefinitions)
    })
  }
}

function testLanguageIds() {
  for (const languageId in languageIds) {
    const itemType = languageIds[languageId]

    test(`${languageId} has a valid ${itemType} value`, (t) => {
      t.true(itemType in iconDefinitions)
    })
  }
}

function testIconProp(themeId, propName, condition) {
  const iconProps = getIconProps(propName)
  for (const entryName in iconProps) {
    const propValue = iconProps[entryName]
    const fullEntryName = `[${themeId}] ${entryName}`

    test(`${fullEntryName} has a valid '${propValue}' value`, (t) => {
      t.true(condition(propValue))
    })
  }
}

function getIconProps(propName) {
  const result = {}

  for (const iconEntry in iconDefinitions) {
    const propValue = iconDefinitions[iconEntry][propName]

    const entryName = `iconDefinitions > ${iconEntry} > ${propName}`
    result[entryName] = propValue
  }

  return result
}

function getFileDefinitions() {
  const result = {}
  const definitions = { fileNames, fileExtensions }

  for (const defName in definitions) {
    const definition = definitions[defName]

    for (const itemType in definition) {
      const entryName = `${defName} > ${itemType}`
      result[entryName] = itemType
    }
  }

  return result
}
