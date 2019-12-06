import test from 'ava';

import * as items from './../src/items.json';
import * as colors from './../src/colors.json';
import * as codepoints from './../src/codepoints.json';

runTests();

function runTests() {
    const { iconDefinitions, fileExtensions, fileNames } = items;
    for (const iconEntry in iconDefinitions) {
        const { iconName, iconColor } = iconDefinitions[iconEntry];

        const fullEntryName1 = `iconDefinitions > ${iconEntry} > iconName`;
        test(`${fullEntryName1} has a valid '${iconName}' value`, (t) => {
            t.true(iconName in codepoints);
        });

        const fullEntryName2 = `iconDefinitions > ${iconEntry} > iconColor`;
        test(`${fullEntryName2} has a valid '${iconColor}' value`, (t) => {
            t.true(iconColor in colors);
        });
    }

    const definitions = { fileNames, fileExtensions };
    for (const defName in definitions) {
        const definition = definitions[defName];

        for (const itemType in definition) {
            test(`${defName}.${itemType} is valid item type`, (t) => {
                t.true(itemType in iconDefinitions);
            });
        }
    }
}
