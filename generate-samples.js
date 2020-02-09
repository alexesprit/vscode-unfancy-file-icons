const { getMissingSamples, createSampleFiles } = require('./src/samples');

const samplesDir = 'samples';

/**
 * Entry point.
 */
function main() {
    const missingSamples = getMissingSamples(samplesDir);

    if (missingSamples.length > 0) {
        createSampleFiles(missingSamples, samplesDir);
    } else {
        console.log('No missing samples are found');
    }
}

main();
