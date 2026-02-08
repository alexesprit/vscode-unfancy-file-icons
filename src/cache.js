import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { readJsonFile } from './loader.js'

const rootDir = join(import.meta.dirname, '..')
const cacheDir = join(rootDir, '.cache/codepoints')

/**
 * Get the path to a cached codepoints JSON file.
 *
 * @param {String} cacheId Cache identifier (e.g. "octicons", "codicons", "lucide")
 * @return {String} Absolute path to the cached codepoints file
 */
export function getCodepointsPath(cacheId) {
  return join(cacheDir, `${cacheId}.json`)
}

/**
 * Check if cached codepoints are stale for a given package.
 *
 * Returns stale=true if:
 * - The codepoints file does not exist
 * - The version file does not exist or cannot be read
 * - The cached version does not match the installed package version
 *
 * @param {String} packageName npm package name (e.g. "@primer/octicons")
 * @param {String} cacheId Cache identifier (e.g. "octicons")
 * @return {{ stale: Boolean, version: String }}
 */
export function isCacheStale(packageName, cacheId) {
  const pkgPath = join(rootDir, 'node_modules', packageName, 'package.json')
  const installedVersion = readJsonFile(pkgPath).version

  const codepointsFile = getCodepointsPath(cacheId)
  if (!existsSync(codepointsFile)) {
    return { stale: true, version: installedVersion }
  }

  const versionFile = join(cacheDir, `${cacheId}.version`)
  try {
    const cachedVersion = readFileSync(versionFile, 'utf-8').trim()
    if (cachedVersion === installedVersion) {
      return { stale: false, version: installedVersion }
    }
  } catch {}

  return { stale: true, version: installedVersion }
}

/**
 * Write codepoints to cache and record the package version.
 *
 * @param {String} cacheId Cache identifier (e.g. "octicons")
 * @param {Object} codepoints Icon name to codepoint mapping
 * @param {String} version Package version string
 */
export function writeCodepoints(cacheId, codepoints, version) {
  mkdirSync(cacheDir, { recursive: true })

  const codepointsPath = getCodepointsPath(cacheId)
  const versionPath = join(cacheDir, `${cacheId}.version`)

  writeFileSync(codepointsPath, `${JSON.stringify(codepoints, null, 2)}\n`)
  writeFileSync(versionPath, version)
}
