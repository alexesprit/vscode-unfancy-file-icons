import test from 'ava';

const packageFile = require('./../package.json');
const { iconThemes } = packageFile.contributes;

runTests();

function runTests() {
	for (const theme of iconThemes) {
		testTheme(theme);
	}
}

function testTheme(theme) {
	const themeId = theme.id;
	const iconTheme = require(`./../${theme.path}`);

	const { iconDefinitions } = iconTheme;

	const themes = {
		dark: iconTheme,
		light: iconTheme.light,
	};

	for (const themeName in themes) {
		const entries = getThemeEntries(themes[themeName]);

		for (const entryName in entries) {
			const fullEntryName = `${themeName} > ${entryName}`;
			const entryType = entries[entryName];

			test(`[${themeId}] ${fullEntryName} has a valid '${entryType}' type`, (t) => {
				t.true(entryType in iconDefinitions);
			});
		}
	}
}

function getThemeEntries(theme) {
	const result = {};
	const definitions = ['fileNames', 'fileExtensions'];

	for (const defName of definitions) {
		const definition = theme[defName];

		for (const entry in definition) {
			const type = definition[entry];
			const entryName = `${defName} > ${entry}`;

			result[entryName] = type;
		}
	}

	return result;
}
