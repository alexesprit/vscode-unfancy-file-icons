import colors from './data/colors.json' with { type: 'json' }
import { loadItems } from './data/items.js'

// eslint-disable-next-line no-template-curly-in-string
const namePlaceholder = '${name}'

const themeIdPrefix = 'vscode-unfancy-file-icons'

/**
 * Add '_' prefix to string.
 *
 * @param {String} str String
 */
export function prefix(str) {
  return `_${str}`
}

/**
 * Add 'light' suffix to string.
 *
 * @param {String} str String
 */
export function light(str) {
  return `${str}_light`
}

/**
 * Get source data for building themes.
 *
 * @return {Object} Source data
 */
export function getExpandedItems() {
  const items = loadItems()

  expandItems(items.fileNames)
  expandItems(items.fileExtensions)

  return items
}

/**
 * Expand items inside of a given object.
 *
 * @param {Object} data Items to expand
 */
function expandItems(data) {
  for (const type in data) {
    const expandedFileNames = []

    for (const val of data[type]) {
      switch (typeof val) {
        case 'string': {
          expandedFileNames.push(val)
          break
        }

        case 'object': {
          const fileNames = getFileNamesFromTemplate(val)
          for (const name of fileNames) {
            expandedFileNames.push(name)
          }
          break
        }

        default: {
          throw new Error(`Invalid property: ${val}`)
        }
      }
    }

    data[type] = expandedFileNames
  }
}

/**
 * Generate an array of config names from `configs.json`.
 *
 * @param  {Object} templateObj Object contains template data
 *
 * @return {Array} List of config files
 */
function getFileNamesFromTemplate(templateObj) {
  const replacedNames = []
  const { names, templates } = templateObj

  if (!names || names.length === 0) {
    throw new Error('Invalid template object: no names are found')
  }

  if (!templates || templates.length === 0) {
    throw new Error('Invalid template object: no templates are found')
  }

  for (const name of names) {
    for (const template of templates) {
      const replacedName = template.replace(namePlaceholder, name)
      replacedNames.push(replacedName)
    }
  }

  return replacedNames
}

/**
 * Return a theme ID.
 *
 * @param  {Object} theme `contributes.iconThemes` entry from `package.json`
 * @return {String} Theme ID
 */
export function getThemeId(theme) {
  const themeId = theme.id
  if (themeId === themeIdPrefix) {
    return 'octicons'
  }
  return themeId.split('-').pop()
}

/**
 * Get color in RGB format by color name.
 *
 * @param {String} colorName Color name defined in `colors.json`
 * @return {Number} Color
 */
export function getFontColor(colorName) {
  if (colorName in colors) {
    return colors[colorName]
  }

  throw new Error(`Invalid color name: ${colorName}`)
}

/**
 * Get Octicons font character code by name.
 *
 * @param {String} iconName Icon name
 * @param {Object} codepoints Object contains font codepoints
 * @return {String} Font character code in `\\xxxx` format
 */
export function getFontCharacter(iconName, codepoints) {
  if (iconName in codepoints) {
    const iconCodeStr = codepoints[iconName].toString(16)
    return `\\${iconCodeStr}`
  }

  throw new Error(`Invalid icon name: ${iconName}`)
}
