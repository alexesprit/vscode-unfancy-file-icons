const { readdirSync, openSync, closeSync } = require('fs');
const { join } = require('path');

/**
 * Exported functions.
 */
module.exports = { getMissingSamples, createSampleFile };

/**
 * Return a list of missing sample files.
 *
 * @param  {String} samplesDir Path to a directory with sample files
 * @return {Array} List of missing sample files
 */
function getMissingSamples(samplesDir) {
    const existingSamples = getExistingSamples(samplesDir);
    const sampleFiles = getFlattenSampleFiles();
    const missingSamples = [];

    for (const type in sampleFiles) {
        const allSampleFiles = sampleFiles[type];
        let isMissing = true;

        for (const fileName of allSampleFiles) {
            if (existingSamples.includes(fileName)) {
                isMissing = false;
            }
        }

        if (isMissing) {
            missingSamples.push(allSampleFiles[0]);
        }
    }

    return missingSamples;
}

/**
 * Make sample files.
 *
 * @param  {String} samplesDir Path to a directory with sample files
 * @param  {String} fileName Sample file name
 */
function createSampleFile(samplesDir, fileName) {
    const outPath = join(samplesDir, fileName);
    closeSync(openSync(outPath, 'w'));
}

/**
 * Return a list of existing samples.
 *
 * @param  {String} samplesDir Path to a directory with sample files
 */
function getExistingSamples(samplesDir) {
    return readdirSync(samplesDir);
}

/**
 * Generate an object contains lists of sample files for each file type.
 *
 * @return {Object} Result data
 */
function getFlattenSampleFiles() {
    const { fileNames, fileExtensions } = require('./data/items.json');
    const sampleFiles = {};

    for (const type in fileNames) {
        if (!(type in sampleFiles)) {
            sampleFiles[type] = [];
        }

        sampleFiles[type].push(...fileNames[type]);
    }

    for (const type in fileExtensions) {
        if (!(type in sampleFiles)) {
            sampleFiles[type] = [];
        }

        sampleFiles[type].push(...fileExtensions[type].map((ext) => {
            return `sample.${ext}`;
        }));
    }

    return sampleFiles;
}
