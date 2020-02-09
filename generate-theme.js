const { generateIconTheme } = require('./src/themes');

/**
 * Entry point.
 */
function main() {
    const packageFile = require('./package.json');
    const { iconThemes } = packageFile.contributes;

    for (const theme of iconThemes) {
        generateIconTheme(theme);
    }
}

main();
