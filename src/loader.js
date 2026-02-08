import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const srcDir = import.meta.dirname

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
  const fonts = readJsonFile(join(srcDir, `fonts/${themeId}.json`))
  const iconMap = readJsonFile(join(srcDir, `iconmaps/${themeId}.json`))
  const codepoints = readJsonFile(join(srcDir, `codepoints/${themeId}.json`))
  return { fonts, iconMap, codepoints }
}
