import {
  createSampleFile,
  getMissingSamples,
  getUnusedSamples,
  removeSampleFile,
} from '#src/samples.js'

const samplesDir = 'samples'

/**
 * Entry point.
 */
function main() {
  createMissingSampleFiles()
  removeUnusedSampleFiles()
}

function createMissingSampleFiles() {
  const missingSamples = getMissingSamples(samplesDir)

  if (missingSamples.length > 0) {
    for (const sample of missingSamples) {
      createSampleFile(samplesDir, sample)

      console.log(`Generated ${sample}`)
    }
  } else {
    console.log('No missing samples are found')
  }
}

function removeUnusedSampleFiles() {
  const unusedSamples = getUnusedSamples(samplesDir)

  if (unusedSamples.length > 0) {
    for (const sample of unusedSamples) {
      removeSampleFile(samplesDir, sample)

      console.log(`Removed ${sample}`)
    }
  } else {
    console.log('No unused samples are found')
  }
}

main()
