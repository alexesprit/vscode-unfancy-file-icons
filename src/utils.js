const themeIdPrefix = 'vscode-unfancy-file-icons';

const colors = require('./data/colors.json');

// eslint-disable-next-line no-template-curly-in-string
const namePlaceholder = '${name}';

/**
 * Exported functions.
 */
module.exports = {
    prefix, light,
    getExpandedItems, getThemeId, getFontColor, getFontCharacter
};

/**
 * Add '_' prefix to string.
 *
 * @param {String} str String
 */
function prefix(str) {
    return `_${str}`;
}

/**
 * Add 'light' suffix to string.
 *
 * @param {String} str String
 */
function light(str) {
    return `${str}_light`;
}

/**
 * Get source data for building themes.
 *
 * @return {Object} Source data
 */
function getExpandedItems() {
    const items = require('./data/items.json');

    for (const type in items.fileNames) {
        const expandedFileNames = [];

        for (const val of items.fileNames[type]) {
            switch (typeof val) {
                case 'string': {
                    expandedFileNames.push(val);
                    break;
                }

                case 'object': {
                    const fileNames = getFileNamesFromTemplate(val);
                    for (const name of fileNames) {
                        expandedFileNames.push(name);
                    }
                    break;
                }

                default: {
                    throw new Error(`Invalid property: ${val}`);
                }
            }
        }

        // console.log(expandedFileNames);

        items.fileNames[type] = expandedFileNames;
    }

    return items;
}

/**
 * Generate an array of config names from `configs.json`.
 *
 * @param  {Object} templateObj Object contains template data
 *
 * @return {Array} List of config files
 */
function getFileNamesFromTemplate(templateObj) {
    const replacedNames = [];
    const { names, templates } = templateObj;

    if (!names || names.len === 0) {
        throw new Error('Invalid template object: no names are found');
    }

    if (!templates || templates.len === 0) {
        throw new Error('Invalid template object: no templates are found');
    }

    for (const name of names) {
        for (const template of templates) {
            const replacedName = template.replace(namePlaceholder, name);
            replacedNames.push(replacedName);
        }
    }

    return replacedNames;
}

/**
 * Return a theme ID.
 *
 * @param  {Object} theme `contributes.iconThemes` entry from `package.json`
 * @return {String} Theme ID
 */
function getThemeId(theme) {
    const themeId = theme.id;
    if (themeId === themeIdPrefix) {
        return 'octicons';
    }
    return themeId.split('-').pop();
}

/**
 * Get color in RGB format by color name.
 *
 * @param {String} colorName Color name defined in `colors.json`
 * @return {Number} Color
 */
function getFontColor(colorName) {
    if (colorName in colors) {
        return colors[colorName];
    }

    throw new Error(`Invalid color name: ${colorName}`);
}

/**
 * Get Octicons font character code by name.
 *
 * @param {String} iconName Icon name
 * @param {Object} codepoints Object contains font codepoints
 * @return {String} Font character code in `\\xxxx` format
 */
function getFontCharacter(iconName, codepoints) {
    if (iconName in codepoints) {
        const iconCodeStr = codepoints[iconName].toString(16);
        return `\\${iconCodeStr}`;
    }

    throw new Error(`Invalid icon name: ${iconName}`);
}
