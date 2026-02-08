import { closeSync, openSync, readdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

import { getExpandedItems } from './template.js'

/**
 * Return a list of missing sample files.
 *
 * @param  {String} samplesDir Path to a directory with sample files
 * @return {Array} List of missing sample files
 */
export function getMissingSamples(samplesDir) {
  const existingSamples = new Set(getExistingSamples(samplesDir))
  const sampleFiles = getSampleFilesByType()
  const missingSamples = []

  for (const allSampleFiles of Object.values(sampleFiles)) {
    const isMissing = !allSampleFiles.some((fileName) =>
      existingSamples.has(fileName),
    )

    if (isMissing) {
      missingSamples.push(allSampleFiles[0])
    }
  }

  return missingSamples
}

export function getUnusedSamples(samplesDir) {
  const existingSamples = getExistingSamples(samplesDir)
  const sampleFiles = getSampleFilesByType()
  const unusedSamples = []
  const samplesForTypes = {}

  for (const [type, samplesList] of Object.entries(sampleFiles)) {
    const samplesSet = new Set(samplesList)
    samplesForTypes[type] = existingSamples.filter((sampleFile) =>
      samplesSet.has(sampleFile),
    )
  }

  // Find duplicates
  for (const samplesList of Object.values(samplesForTypes)) {
    if (samplesList.length > 1) {
      unusedSamples.push(...samplesList.slice(1))
    }
  }

  // Find unused files
  const allKnownSamples = new Set(Object.values(sampleFiles).flat())
  for (const existingSample of existingSamples) {
    if (!allKnownSamples.has(existingSample)) {
      unusedSamples.push(existingSample)
    }
  }

  return unusedSamples
}

/**
 * Make sample files.
 *
 * @param  {String} samplesDir Path to a directory with sample files
 * @param  {String} fileName Sample file name
 */
export function createSampleFile(samplesDir, fileName) {
  const outPath = join(samplesDir, fileName)
  closeSync(openSync(outPath, 'w'))
}

export function removeSampleFile(samplesDir, fileName) {
  const outPath = join(samplesDir, fileName)
  unlinkSync(outPath)
}

/**
 * Return a list of existing samples.
 *
 * @param  {String} samplesDir Path to a directory with sample files
 */
function getExistingSamples(samplesDir) {
  return readdirSync(samplesDir)
}

/**
 * Generate an object containing lists of sample files grouped by icon type.
 *
 * @return {Object} Result data
 */
function getSampleFilesByType() {
  const { fileNames, fileExtensions } = getExpandedItems()
  const sampleFiles = {}

  for (const [type, names] of Object.entries(fileNames)) {
    if (!(type in sampleFiles)) {
      sampleFiles[type] = []
    }

    sampleFiles[type].push(...names)
  }

  for (const [type, extensions] of Object.entries(fileExtensions)) {
    if (!(type in sampleFiles)) {
      sampleFiles[type] = []
    }

    sampleFiles[type].push(
      ...extensions.map((ext) => {
        return `sample.${ext}`
      }),
    )
  }

  return sampleFiles
}
