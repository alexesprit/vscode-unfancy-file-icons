import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'

import Color from 'color'

import { loadThemeConfig } from './loader.js'
import { getFontCharacter, getFontColor, resolveIconName } from './lookup.js'
import { addThemePrefix, getThemeId, toLightVariant } from './naming.js'
import { getExpandedItems } from './template.js'

export const darkenPercent = 0.4

/**
 * Generate an icon theme from source data.
 *
 * @param {Object} theme `contributes.iconThemes` entry from `package.json`
 */
export function generateIconTheme(theme) {
  const themeId = getThemeId(theme)
  const iconTheme = getIconTheme(themeId)
  const contents = JSON.stringify(iconTheme, null, 4)

  const outPath = theme.path
  const targetDir = dirname(outPath)
  mkdirSync(targetDir, { recursive: true })
  writeFileSync(outPath, contents)
}

/**
 * Get theme icon object.
 *
 * @param  {String} themeId Theme ID
 * @return {Object} Theme object
 */
export function getIconTheme(themeId) {
  const items = getExpandedItems()
  const config = loadThemeConfig(themeId)

  const fonts = rewriteFontPaths(config.fonts)
  const iconDefinitions = buildIconDefinitions(
    items.iconDefinitions,
    config.iconMap,
    config.codepoints,
  )
  const mappings = buildMappings(items)

  return assembleTheme(fonts, iconDefinitions, mappings)
}

/**
 * Rewrite font source paths to point to stripped fonts in theme/fonts/.
 *
 * @param {Array} fonts Font face configuration array
 * @return {Array} Fonts with updated paths
 */
function rewriteFontPaths(fonts) {
  return fonts.map((font) => ({
    ...font,
    src: font.src.map((s) => ({
      ...s,
      path: s.path.replace('./../resources/', './fonts/'),
    })),
  }))
}

/**
 * Build icon definition entries for both dark and light themes.
 *
 * @param {Object} definitions Icon definitions from items.json
 * @param {Object} iconMap     Icon name remapping table
 * @param {Object} codepoints  Font codepoints
 * @return {Object} Combined dark and light icon definitions
 */
function buildIconDefinitions(definitions, iconMap, codepoints) {
  const result = {}

  for (const [iconEntry, definition] of Object.entries(definitions)) {
    const { iconColor } = definition
    const iconName = resolveIconName(definition.iconName, iconMap)

    const fontColor = getFontColor(iconColor)
    const fontCharacter = getFontCharacter(iconName, codepoints)
    const prefixedIconName = addThemePrefix(iconEntry)
    result[prefixedIconName] = { fontColor, fontCharacter }

    const lightColor = Color(fontColor).darken(darkenPercent).hex()
    const lightIconName = toLightVariant(prefixedIconName)
    result[lightIconName] = { fontColor: lightColor }
  }

  return result
}

/**
 * Build fileNames, fileExtensions, and languageIds mappings for dark and light themes,
 * along with root icon assignments (file, folder, folderExpanded).
 *
 * @param {Object} items Expanded source data
 * @return {Object} Mappings for dark theme, light theme, and root icons
 */
function buildMappings(items) {
  const dark = { fileNames: {}, fileExtensions: {}, languageIds: {} }
  const lightMappings = { fileNames: {}, fileExtensions: {}, languageIds: {} }
  const rootIcons = { dark: {}, light: {} }

  for (const propName of ['fileNames', 'fileExtensions']) {
    const convertedItems = invertItemMapping(items[propName])
    dark[propName] = convertedItems
    lightMappings[propName] = makeItemsForLightTheme(convertedItems)
  }

  for (const propName of ['languageIds']) {
    const prefixedItems = prefixItems(items[propName])
    dark[propName] = prefixedItems
    lightMappings[propName] = makeItemsForLightTheme(prefixedItems)
  }

  for (const propName of ['file', 'folder', 'folderExpanded']) {
    const iconName = items[propName]
    const prefixedIconName = addThemePrefix(iconName)
    rootIcons.dark[propName] = prefixedIconName
    rootIcons.light[propName] = toLightVariant(prefixedIconName)
  }

  return { dark, light: lightMappings, rootIcons }
}

/**
 * Assemble the final theme object from its component parts.
 *
 * @param {Array}  fonts           Font face configurations
 * @param {Object} iconDefinitions Dark and light icon definitions
 * @param {Object} mappings        File/folder mappings from buildMappings()
 * @return {Object} Complete theme object
 */
function assembleTheme(fonts, iconDefinitions, mappings) {
  const iconTheme = {
    fonts,

    light: {
      fileNames: mappings.light.fileNames,
      fileExtensions: mappings.light.fileExtensions,
      languageIds: mappings.light.languageIds,
    },

    fileNames: mappings.dark.fileNames,
    fileExtensions: mappings.dark.fileExtensions,
    languageIds: mappings.dark.languageIds,

    iconDefinitions,
  }

  for (const propName of ['file', 'folder', 'folderExpanded']) {
    iconTheme[propName] = mappings.rootIcons.dark[propName]
    iconTheme.light[propName] = mappings.rootIcons.light[propName]
  }

  return iconTheme
}

/**
 * Convert items (fileName, fileExtensions) of source data to VS Code format.
 *
 * @param {Object} props Source properties
 */
function invertItemMapping(props) {
  const newProps = {}

  for (const [key, values] of Object.entries(props)) {
    for (const val of values) {
      newProps[val] = addThemePrefix(key)
    }
  }

  return newProps
}

/**
 * Add prefix to items values.
 *
 * @param {Object} props Source properties
 */
function prefixItems(props) {
  const newProps = {}

  for (const [key, value] of Object.entries(props)) {
    newProps[key] = addThemePrefix(value)
  }

  return newProps
}

/**
 * Make items (fileName, fileExtensions) for light theme.
 *
 * @param {Object} items Source items
 */
function makeItemsForLightTheme(items) {
  const newProps = {}

  for (const [key, value] of Object.entries(items)) {
    newProps[key] = toLightVariant(value)
  }

  return newProps
}
