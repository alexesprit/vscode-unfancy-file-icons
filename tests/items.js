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

        test(`iconDefinitions.${iconEntry}.iconName is valid icon name`, (t) => {
            t.true(iconName in codepoints);
        });

        test(`iconDefinitions.${iconEntry}.iconColor is valid icon color`, (t) => {
            t.true(iconColor in colors);
        });
    }

    for (const itemType in fileExtensions) {
        test(`fileExtensions.${itemType} is valid item type`, (t) => {
            t.true(itemType in iconDefinitions);
        });
    }

    for (const itemType in fileNames) {
        test(`fileNames.${itemType} is valid item type`, (t) => {
            t.true(itemType in iconDefinitions);
        });
    }
}
