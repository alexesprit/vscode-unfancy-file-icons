const fs = require('fs');
const path = require('path');

const items = require('./src/items.json');

const samplesDir = 'samples';

function main() {
    const fileNames = getSampleFileNames();
    createSampleFiles(fileNames);
}

function getSampleFileNames() {
    const { fileExtensions, fileNames } = items;
    const sampleFileNames = {};

    for (const type in fileExtensions) {
        const ext = fileExtensions[type][0];
        sampleFileNames[type] = `sample.${ext}`;
    }

    for (const type in fileNames) {
        if (type in sampleFileNames) {
            continue;
        }

        sampleFileNames.push(fileNames[type][0]);
    }

    return Object.values(sampleFileNames).map((name) => {
        return path.join(samplesDir, name);
    });
}

function createSampleFiles(fileNames) {
    for (const fileName of fileNames) {
        fs.closeSync(fs.openSync(fileName, 'w'));
    }
}

main();
