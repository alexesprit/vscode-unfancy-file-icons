import test from 'ava';

import * as iconTheme from './../theme/unfancy-icon-theme.json';

runTests();

function runTests() {
    const { iconDefinitions } = iconTheme;

    const themes = {
        dark: iconTheme, light: iconTheme.light
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
