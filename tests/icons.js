'use strict';

import test from 'ava';

import * as icons from './../resources/icons.json';
import { existsSync } from 'path';

runTests();

function runTests() {
    const { iconDefinitions } = icons;

    const themes = {
        dark: icons, light: icons.light
    };
    const definitions = ['fileNames', 'fileExtensions'];

    for (const themeName in themes) {
        const theme = themes[themeName];

        for (const defName of definitions) {
            const definition = theme[defName];

            for (const entryName in definition) {
                const entryType = definition[entryName];
                const fullEntryName = `${themeName}.${defName}.${entryName}`

                test(`${fullEntryName} is valid type`, (t) => {
                    t.true(entryType in iconDefinitions);
                })
            }
        }
    }
}
