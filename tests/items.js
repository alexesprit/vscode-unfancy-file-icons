'use strict';

import test from 'ava';

import * as items from './../src/items.json';
import * as colors from './../src/colors.json';
import * as codepoints from './../src/codepoints.json';

runTests();

function runTests() {
    const { iconDefinitions, fileExtensions, fileNames } = items;
    for (const iconEntry in iconDefinitions) {
        const { iconName, iconColor } = iconDefinitions[iconEntry];

        test(`iconDefinitions.${iconEntry}.iconName is valid "${iconName}" icon name`, (t) => {
            t.true(iconName in codepoints);
        });

        test(`iconDefinitions.${iconEntry}.iconColor is valid "${iconColor}" icon color`, (t) => {
            t.true(iconColor in colors);
        });
    }

    const definitions = { iconDefinitions, fileExtensions };
    for (const defName in definitions) {
        const definition = definitions[defName];

        for (const itemType in definition) {
            test(`${defName}.${itemType} is valid item type`, (t) => {
                t.true(itemType in iconDefinitions);
            });
        }
    }
}
