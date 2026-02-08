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

  const usedIcons = new Set([
    ...Object.keys(fileNames),
    ...Object.keys(fileExtensions),
  ])
  const skipSet = new Set(skipUnusedIcons)

  for (const iconName of Object.keys(iconDefinitions)) {
    if (skipSet.has(iconName)) {
      continue
    }

    if (!usedIcons.has(iconName)) {
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
  const checkedItems = new Set()
  const duplicates = []

  for (const [type, extensions] of Object.entries(props)) {
    for (const ext of extensions) {
      if (checkedItems.has(ext)) {
        duplicates.push([ext, type])
      } else {
        checkedItems.add(ext)
      }
    }
  }

  return duplicates
}
