const themeIdPrefix = 'vscode-unfancy-file-icons';

const colors = require('./colors.json');

/**
 * Exported functions.
 */
module.exports = {
    prefix, light,
    getConfigNames, getThemeId, getFontColor, getFontCharacter
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
 * Return an array of config names for a given app.
 *
 * @param {String} app App name
 */
function getConfigNames(app) {
    return [
        `.${app}rc`,
        `.${app}rc.js`,
        `.${app}rc.yml`,
        `.${app}rc.yaml`,
        `.${app}rc.json`,
        `${app}.config.js`,
        `.${app}ignore`
    ];
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
