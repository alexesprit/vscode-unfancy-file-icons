import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const mappingFiles = ['source', 'data', 'docs', 'media', 'build', 'style']

function sortKeys(obj) {
  const sorted = {}
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = obj[key]
  }
  return sorted
}

export function loadItems() {
  const dir = import.meta.dirname
  const fileExtensions = {}
  const fileNames = {}

  for (const name of mappingFiles) {
    const filePath = join(dir, 'mappings', `${name}.json`)
    const mapping = JSON.parse(readFileSync(filePath, 'utf-8'))

    if (mapping.fileExtensions) {
      for (const key of Object.keys(mapping.fileExtensions)) {
        if (key in fileExtensions) {
          throw new Error(
            `Duplicate category "${key}" in fileExtensions (found in "${name}.json" and earlier mapping file)`,
          )
        }
        fileExtensions[key] = mapping.fileExtensions[key]
      }
    }

    if (mapping.fileNames) {
      for (const key of Object.keys(mapping.fileNames)) {
        if (key in fileNames) {
          throw new Error(
            `Duplicate category "${key}" in fileNames (found in "${name}.json" and earlier mapping file)`,
          )
        }
        fileNames[key] = mapping.fileNames[key]
      }
    }
  }

  const iconDefsPath = join(dir, 'icon-definitions.json')
  const iconDefs = JSON.parse(readFileSync(iconDefsPath, 'utf-8'))

  const langIdsPath = join(dir, 'language-ids.json')
  const languageIds = JSON.parse(readFileSync(langIdsPath, 'utf-8'))

  return {
    file: iconDefs.file,
    fileExtensions: sortKeys(fileExtensions),
    fileNames: sortKeys(fileNames),
    languageIds,
    folder: iconDefs.folder,
    folderExpanded: iconDefs.folderExpanded,
    iconDefinitions: iconDefs.iconDefinitions,
  }
}
