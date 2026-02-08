/**
 * Unified codepoint extraction orchestrator.
 *
 * Two-phase pipeline driven by the pack registry in src/data/packs.js:
 *   Phase 1 — Font generation: packs that build fonts from source (e.g. SVGs)
 *             run first; codepoints are written to cache as a byproduct.
 *   Phase 2 — Codepoint extraction: all packs check cache, extract if stale.
 *
 * Adding a new icon pack requires only a new entry in the registry.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import { isCacheStale, writeCodepoints } from '../src/cache.js'
import { packs } from '../src/data/packs.js'
import { readJsonFile } from '../src/loader.js'

const ROOT = resolve(import.meta.dirname, '..')

/**
 * Check whether a font needs regeneration, independent of codepoints cache.
 *
 * @param {string} packageName  npm package to read installed version from
 * @param {string} id           Pack identifier (e.g. "octicons")
 * @param {string} fontOutputPath  Relative path to the generated font file
 * @returns {{ stale: boolean, version: string }}
 */
function isFontStale(packageName, id, fontOutputPath) {
  const pkgPath = join(ROOT, 'node_modules', packageName, 'package.json')
  const version = readJsonFile(pkgPath).version

  const fontPath = join(ROOT, fontOutputPath)
  if (!existsSync(fontPath)) {
    return { stale: true, version }
  }

  const versionFile = join(ROOT, '.cache/fonts', `${id}.version`)
  try {
    const cached = readFileSync(versionFile, 'utf-8').trim()
    if (cached === version) {
      return { stale: false, version }
    }
  } catch {}

  return { stale: true, version }
}

/**
 * Phase 1: generate a font from source and write codepoints as byproduct.
 *
 * @param {{ id: string, packageName: string, generateFont: (version: string) => Promise<Record<string, number>>, fontOutputPath?: string }} pack
 */
async function processFont(pack) {
  const { stale, version } = isFontStale(
    pack.packageName,
    pack.id,
    pack.fontOutputPath,
  )

  if (!stale) {
    console.log(`${pack.id}: font cache hit (v${version})`)
    return
  }

  const codepoints = await pack.generateFont(version)
  writeCodepoints(pack.id, codepoints, version)
}

/**
 * Phase 2: extract codepoints from a pack's source or byproduct.
 *
 * @param {{ id: string, packageName: string, extract: (version: string) => Promise<Record<string, number>>, generateFont?: Function }} pack
 */
async function processCodepoints(pack) {
  const { stale, version } = isCacheStale(pack.packageName, pack.id)

  if (!stale) {
    // Suppress redundant log for packs whose font phase already logged
    if (!pack.generateFont) {
      console.log(`${pack.id}: cache hit (v${version}), skipping extraction`)
    }
    return
  }

  const codepoints = await pack.extract(version)
  writeCodepoints(pack.id, codepoints, version)

  const count = Object.keys(codepoints).length
  console.log(`${pack.id}: extracted ${count} codepoints (v${version})`)
}

/**
 * Collect failures from settled results and log them.
 *
 * @param {PromiseSettledResult[]} results
 * @returns {boolean} true if any failures occurred
 */
function reportFailures(results) {
  const failures = results.filter((r) => r.status === 'rejected')
  for (const failure of failures) {
    console.error(failure.reason)
  }
  return failures.length > 0
}

/**
 * Entry point: run font generation then codepoint extraction.
 */
async function main() {
  // Phase 1: font generation (packs that build fonts from source)
  const fontPacks = packs.filter((p) => p.generateFont)
  if (fontPacks.length > 0) {
    const results = await Promise.allSettled(fontPacks.map(processFont))
    if (reportFailures(results)) {
      process.exitCode = 1
      return
    }
  }

  // Phase 2: codepoint extraction (all packs)
  const results = await Promise.allSettled(packs.map(processCodepoints))
  if (reportFailures(results)) {
    process.exitCode = 1
  }
}

main()
