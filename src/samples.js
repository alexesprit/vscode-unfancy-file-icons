import { closeSync, openSync, readdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

import { getExpandedItems } from './utils.js'

/**
 * Return a list of missing sample files.
 *
 * @param  {String} samplesDir Path to a directory with sample files
 * @return {Array} List of missing sample files
 */
export function getMissingSamples(samplesDir) {
  const existingSamples = getExistingSamples(samplesDir)
  const sampleFiles = getFlattenSampleFiles()
  const missingSamples = []

  for (const type in sampleFiles) {
    const allSampleFiles = sampleFiles[type]
    let isMissing = true

    for (const fileName of allSampleFiles) {
      if (existingSamples.includes(fileName)) {
        isMissing = false
      }
    }

    if (isMissing) {
      missingSamples.push(allSampleFiles[0])
    }
  }

  return missingSamples
}

export function getUnusedSamples(samplesDir) {
  const existingSamples = getExistingSamples(samplesDir)
  const sampleFiles = getFlattenSampleFiles()
  const unusedSamples = []
  const samplesForTypes = {}

  for (const type in sampleFiles) {
    const samplesList = sampleFiles[type]
    samplesForTypes[type] = []

    for (const sampleFile of existingSamples) {
      if (samplesList.includes(sampleFile)) {
        samplesForTypes[type].push(sampleFile)
      }
    }
  }

  // Find duplicates
  for (const type in samplesForTypes) {
    const samplesList = samplesForTypes[type]

    if (samplesList.length > 1) {
      unusedSamples.push(...samplesList.slice(1))
    }
  }

  // Find unused files
  for (const existingSample of existingSamples) {
    let isSampleUnused = true

    for (const type in samplesForTypes) {
      const samplesList = sampleFiles[type]

      if (samplesList.includes(existingSample)) {
        isSampleUnused = false
      }
    }

    if (isSampleUnused) {
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
 * Generate an object contains lists of sample files for each file type.
 *
 * @return {Object} Result data
 */
function getFlattenSampleFiles() {
  const { fileNames, fileExtensions } = getExpandedItems()
  const sampleFiles = {}

  for (const type in fileNames) {
    if (!(type in sampleFiles)) {
      sampleFiles[type] = []
    }

    sampleFiles[type].push(...fileNames[type])
  }

  for (const type in fileExtensions) {
    if (!(type in sampleFiles)) {
      sampleFiles[type] = []
    }

    sampleFiles[type].push(
      ...fileExtensions[type].map((ext) => {
        return `sample.${ext}`
      }),
    )
  }

  return sampleFiles
}
