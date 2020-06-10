const { getMissingSamples, createSampleFile } = require('./src/samples');

const samplesDir = 'samples';

/**
 * Entry point.
 */
function main() {
	const missingSamples = getMissingSamples(samplesDir);

	if (missingSamples.length > 0) {
		for (const sample of missingSamples) {
			createSampleFile(samplesDir, sample);

			console.log(`Generated ${sample}`);
		}
	} else {
		console.log('No missing samples are found');
	}
}

main();
