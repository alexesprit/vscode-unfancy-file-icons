import test from 'ava';

import * as icons from './../resources/icons.json';

runTests();

function runTests() {
    const { iconDefinitions } = icons;

    const themes = {
        dark: icons, light: icons.light
    };

    for (const themeName in themes) {
        const theme = themes[themeName];
        const entries = getThemeEntries(theme);

        for (const entryName in entries) {
            const fullEntryName = `${themeName} > ${entryName}`;
            const entryType = entries[entryName];

            test(`${fullEntryName} has a valid '${entryType}' type`, (t) => {
                t.true(entryType in iconDefinitions);
            });
        }
    }
}

function getThemeEntries(theme) {
    const result = {};
    const definitions = ['fileNames', 'fileExtensions'];

    for (const defName of definitions) {
        const definition = theme[defName];

        for (const entry in definition) {
            const type = definition[entry];
            const entryName = `${defName} > ${entry}`;

            result[entryName] = type;
        }
    }

    return result;
}
