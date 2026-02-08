import { loadItems } from './data/items.js'

// eslint-disable-next-line no-template-curly-in-string
const namePlaceholder = '${name}'

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
 * Generate an array of file names from a template object.
 *
 * @param  {Object} templateObj Object contains template data
 * @return {Array} List of file names
 */
export function getFileNamesFromTemplate(templateObj) {
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
      const replacedName = template.replaceAll(namePlaceholder, name)
      replacedNames.push(replacedName)
    }
  }

  return replacedNames
}
