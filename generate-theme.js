const { generateIconTheme } = require('./src/themes');
const { getThemeId } = require('./src/utils');

/**
 * Entry point.
 */
function main() {
    const packageFile = require('./package.json');
    const { iconThemes } = packageFile.contributes;

    for (const theme of iconThemes) {
        generateIconTheme(theme);

        const themeId = getThemeId(theme);
        console.log(`Generated '${themeId}' icon theme`);
    }
}

main();
