import test from 'ava';

import { iconDefinitions, fileExtensions, fileNames } from './../src/items.json';
import * as colors from './../src/colors.json';
import * as codepoints from './../src/codepoints.json';

runTests();

function runTests() {
    testIconProp('iconColor', colors);
    testIconProp('iconName', codepoints);

    testFileDefinitions();
}

function testFileDefinitions() {
    const definitions = getFileDefinitions();
    for (const entryName in definitions) {
        const itemType = definitions[entryName];

        test(`${entryName} is valid item type`, (t) => {
            t.true(itemType in iconDefinitions);
        });
    }
}

function testIconProp(propName, propDefinitions) {
    const iconProps = getIconProps(propName);
    for (const entryName in iconProps) {
        const propValue = iconProps[entryName];

        test(`${entryName} has a valid '${propValue}' value`, (t) => {
            t.true(propValue in propDefinitions);
        });
    }
}

function getIconProps(propName) {
    const result = {};

    for (const iconEntry in iconDefinitions) {
        const propValue = iconDefinitions[iconEntry][propName];

        const entryName = `iconDefinitions > ${iconEntry} > ${propName}`;
        result[entryName] = propValue;
    }

    return result;
}

function getFileDefinitions() {
    const result = {};
    const definitions = { fileNames, fileExtensions };

    for (const defName in definitions) {
        const definition = definitions[defName];

        for (const itemType in definition) {
            const entryName = `${defName} > ${itemType}`;
            result[entryName] = itemType;
        }
    }

    return result;
}
