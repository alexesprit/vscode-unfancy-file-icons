import { loadItems } from './data/items.js'

const skipUnusedIcons = ['file', 'folder', 'folder-opened']

export function getWarnings() {
  const items = loadItems()
  const duplicates = getDuplicates(items)
  const unusedIcons = getUnusedIcons(items)

  const warnings = []

  for (const [ext, type] of duplicates) {
    warnings.push(`Duplicate "${ext}" in "${type}" section`)
  }

  for (const iconName of unusedIcons) {
    warnings.push(`Unused icon: ${iconName}`)
  }

  return warnings
}

function getUnusedIcons(items) {
  const { iconDefinitions, fileExtensions, fileNames } = items
  const unusedIcons = []

  const usedIcons = [...Object.keys(fileNames), ...Object.keys(fileExtensions)]

  for (const iconName in iconDefinitions) {
    if (skipUnusedIcons.includes(iconName)) {
      continue
    }

    if (!usedIcons.includes(iconName)) {
      unusedIcons.push(iconName)
    }
  }

  return unusedIcons
}

function getDuplicates(items) {
  const { fileExtensions, fileNames } = items

  const duplicates = [
    ...getDuplicatesInProps(fileNames),
    ...getDuplicatesInProps(fileExtensions),
  ]

  return duplicates
}

function getDuplicatesInProps(props) {
  const checkedItems = []
  const duplicates = []

  for (const type in props) {
    const extensions = props[type]

    for (const ext of extensions) {
      if (checkedItems.includes(ext)) {
        duplicates.push([ext, type])
      } else {
        checkedItems.push(ext)
      }
    }
  }

  return duplicates
}
