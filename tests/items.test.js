import test from 'ava'
import packageFile from '#package' with { type: 'json' }
import colors from '#src/data/colors.json' with { type: 'json' }
import { loadItems, loadThemeConfig } from '#src/loader.js'
import { getThemeId } from '#src/naming.js'

const { iconDefinitions, fileExtensions, fileNames, languageIds } = loadItems()

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

    const { iconMap, codepoints } = loadThemeConfig(themeId)

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
  for (const [key, value] of Object.entries(iconMap)) {
    const fullEntryName = `[${theme.id}] iconmaps > ${key}`

    test(`${fullEntryName} has a valid ${value} value`, (t) => {
      t.true(value in codepoints)
    })
  }
}

function testFileDefinitions() {
  const definitions = getFileDefinitions()
  for (const [entryName, itemType] of Object.entries(definitions)) {
    test(`${entryName} is valid item type`, (t) => {
      t.true(itemType in iconDefinitions)
    })
  }
}

function testLanguageIds() {
  for (const [languageId, itemType] of Object.entries(languageIds)) {
    test(`${languageId} has a valid ${itemType} value`, (t) => {
      t.true(itemType in iconDefinitions)
    })
  }
}

function testIconProp(themeId, propName, condition) {
  const iconProps = getIconProps(propName)
  for (const [entryName, propValue] of Object.entries(iconProps)) {
    const fullEntryName = `[${themeId}] ${entryName}`

    test(`${fullEntryName} has a valid '${propValue}' value`, (t) => {
      t.true(condition(propValue))
    })
  }
}

function getIconProps(propName) {
  const result = {}

  for (const [iconEntry, definition] of Object.entries(iconDefinitions)) {
    const propValue = definition[propName]

    const entryName = `iconDefinitions > ${iconEntry} > ${propName}`
    result[entryName] = propValue
  }

  return result
}

function getFileDefinitions() {
  const result = {}
  const definitions = { fileNames, fileExtensions }

  for (const [defName, definition] of Object.entries(definitions)) {
    for (const itemType of Object.keys(definition)) {
      const entryName = `${defName} > ${itemType}`
      result[entryName] = itemType
    }
  }

  return result
}
