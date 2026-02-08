import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { getCodepointsPath } from './cache.js'
import { sortKeys } from './sort.js'

const srcDir = import.meta.dirname
const dataDir = join(srcDir, 'data')

const mappingFiles = ['source', 'data', 'docs', 'media', 'build', 'style']

/**
 * Read and parse a JSON file.
 *
 * @param {String} filePath Absolute path to the JSON file
 * @return {Object} Parsed JSON content
 */
export function readJsonFile(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf-8'))
}

/**
 * Load theme configuration (fonts, iconmap, codepoints) for a given theme ID.
 *
 * @param {String} themeId Theme ID (e.g. "octicons", "codicons", "lucide")
 * @return {{ fonts: Object, iconMap: Object, codepoints: Object }}
 */
export function loadThemeConfig(themeId) {
  const fonts = readJsonFile(join(srcDir, `data/fonts/${themeId}.json`))
  const iconMap = readJsonFile(join(srcDir, `data/iconmaps/${themeId}.json`))
  const codepoints = readJsonFile(getCodepointsPath(themeId))
  return { fonts, iconMap, codepoints }
}

/**
 * Load all item definitions by merging mapping files, icon definitions,
 * and language IDs from the data directory.
 *
 * @return {Object} Merged items with fileExtensions, fileNames, languageIds, iconDefinitions, etc.
 */
export function loadItems() {
  const fileExtensions = {}
  const fileNames = {}

  for (const name of mappingFiles) {
    const filePath = join(dataDir, 'mappings', `${name}.json`)
    const mapping = readJsonFile(filePath)

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

  const iconDefsPath = join(dataDir, 'icon-definitions.json')
  const iconDefs = readJsonFile(iconDefsPath)

  const langIdsPath = join(dataDir, 'language-ids.json')
  const languageIds = readJsonFile(langIdsPath)

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
