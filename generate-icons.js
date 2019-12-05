'use strict';

const Color = require('color');
const fs = require('fs');

const items = require('./src/items.json');
const colors = require('./src/colors.json');
const codepoints = require('./src/codepoints.json');

const targetFileName = './resources/icons.json';

const darkenPercent = 0.4;

/**
 * Entry point.
 */
function main() {
    const iconTheme = getIconTheme();
    const contents = JSON.stringify(iconTheme, null, 4);

    fs.writeFileSync(targetFileName, contents);
}

function getIconTheme() {
    const { iconDefinitions, fonts } = items;

    const iconTheme = {
        fonts,

        light: {
            fileNames: { /* empty */ },
            fileExtensions: { /* empty */ },
        },
        fileNames: { /* empty */ },
        fileExtensions: { /* empty */ },
        iconDefinitions: { /* empty */ },
    };

    for (const iconEntry in iconDefinitions) {
        const { colorName, iconName } = iconDefinitions[iconEntry];

        const fontColor = getColor(colorName);
        const fontCharacter = getCharacter(iconName);
        const prefixedIconName = prefix(iconEntry);
        iconTheme.iconDefinitions[prefixedIconName] = {
            fontColor, fontCharacter
        };

        const lightColor = Color(fontColor).darken(darkenPercent).hex();
        const lightIconName = light(prefixedIconName);
        iconTheme.iconDefinitions[lightIconName] = { fontColor: lightColor };
    }

    for (const propName of ['file', 'folder']) {
        const iconName = items[propName];
        const prefixedIconName = prefix(iconName);

        iconTheme[propName] = prefixedIconName;
        iconTheme.light[propName] = light(prefixedIconName);
    }

    for (const propName of ['fileNames', 'fileExtensions']) {
        iconTheme[propName] = convertItems(items[propName]);

        iconTheme.light[propName] = makeItemsForLightTheme(
            iconTheme[propName], iconTheme.iconDefinitions
        );
    }

    return iconTheme;
}

/**
 * Get color in RGB format by color name.
 *
 * @param {String} colorName
 * @return {Number} Color
 */
function getColor(colorName) {
    if (colorName in colors) {
        return colors[colorName];
    }

    throw new Error(`Invalid color name: ${colorName}`);
}

/**
 * Get Octicons font character code by name.
 *
 * @param {String} iconName Icon name
 * @return {String} Font character code in `\\xxxx` format
 */
function getCharacter(iconName) {
    if (iconName in codepoints) {
        const iconCodeStr = codepoints[iconName].toString(16);
        return `\\${iconCodeStr}`;
    }

    throw new Error(`Invalid icon name: ${iconName}`);
}

/**
 * Convert items (fileName, fileExtensions) of source data to VS Code format.
 *
 * @param {Object} props Source properties
 */
function convertItems(props) {
    const newProps = {};

    for (const key in props) {
        for (const val of props[key]) {
            newProps[val] = prefix(key);
        }
    }

    return newProps;
}

/**
 * Make items (fileName, fileExtensions) for light theme.
 *
 * @param {Object} items Source items
 */
function makeItemsForLightTheme(items) {
    const newProps = {};

    for (const key in items) {
        newProps[key] = light(items[key]);
    }

    return newProps;
}

/**
 * Add '_' prefix to string.
 *
 * @param {String} str String
 */
function prefix(str) {
    return `_${str}`;
}

/**
 * Add 'light' prefix to string.
 *
 * @param {String} str String
 */
function light(str) {
    return `${str}_light`;
}

main();
