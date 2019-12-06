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

            for (const entry in definition) {
                const type = definition[entry];
                const fullEntryName = `${themeName} > ${defName} > ${entry}`;
                test(`${fullEntryName} has a valid '${type}' type`, (t) => {
                    t.true(type in iconDefinitions);
                })
            }
        }
    }
}
