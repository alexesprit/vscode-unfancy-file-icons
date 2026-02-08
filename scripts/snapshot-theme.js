const { mkdirSync, writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

const { getIconTheme } = require('../src/themes');
const { getThemeId } = require('../src/utils');

const packageFile = require('../package.json');

const snapshotDir = resolve(__dirname, '..', 'snapshots');
const { iconThemes } = packageFile.contributes;

mkdirSync(snapshotDir, { recursive: true });

for (const theme of iconThemes) {
	const themeId = getThemeId(theme);
	const iconTheme = getIconTheme(themeId);

	const sorted = sortKeys(iconTheme);
	const outPath = resolve(snapshotDir, `${themeId}.json`);
	writeFileSync(outPath, JSON.stringify(sorted, null, 2));

	console.log(`Snapshot saved: snapshots/${themeId}.json`);
}

function sortKeys(obj) {
	if (Array.isArray(obj)) {
		return obj.map(sortKeys);
	}

	if (obj !== null && typeof obj === 'object') {
		const sorted = {};
		for (const key of Object.keys(obj).sort()) {
			sorted[key] = sortKeys(obj[key]);
		}
		return sorted;
	}

	return obj;
}
