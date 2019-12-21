const fs = require('fs');
const path = require('path');

const items = require('./src/items.json');

const samplesDir = 'samples';

function main() {
    const missingSamples = getMissingSamples().map((fileName) => {
        return path.join(samplesDir, fileName);
    });

    if (missingSamples.length > 0) {
        createSampleFiles(missingSamples);
    } else {
        console.log('No missing samples are found');
    }
}

function getMissingSamples() {
    const existingSamples = getExistingSamples();
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

function getFlattenSampleFiles() {
    const { fileNames, fileExtensions } = items;
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

function getExistingSamples() {
    return fs.readdirSync(samplesDir);
}

function createSampleFiles(fileNames) {
    for (const fileName of fileNames) {
        console.log(`Generate ${fileName}`);
        fs.closeSync(fs.openSync(fileName, 'w'));
    }
}

main();
