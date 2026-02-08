import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import Color from 'color';

import {
	getExpandedItems,
	getFontCharacter,
	getFontColor,
	getThemeId,
	light,
	prefix,
} from './utils.js';

const darkenPercent = 0.4;

/**
 * Generate an icon theme from source data.
 *
 * @param {Object} theme `contributes.iconThemes` entry from `package.json`
 */
export function generateIconTheme(theme) {
	const themeId = getThemeId(theme);
	const iconTheme = getIconTheme(themeId);
	const contents = JSON.stringify(iconTheme, null, 4);

	const outPath = theme.path;
	const targetDir = dirname(outPath);
	mkdirSync(targetDir, { recursive: true });
	writeFileSync(outPath, contents);
}

/**
 * Get theme icon object.
 *
 * @param  {String} themeId Theme ID
 * @return {Object} Theme object
 */
export function getIconTheme(themeId) {
	const items = getExpandedItems();

	const fontsConfig = JSON.parse(
		readFileSync(
			join(import.meta.dirname, `fonts/${themeId}.json`),
			'utf-8',
		),
	);
	// Update font paths to point to stripped fonts in theme/fonts/
	const fonts = fontsConfig.map((font) => ({
		...font,
		src: font.src.map((s) => ({
			...s,
			path: s.path.replace('./../resources/', './fonts/'),
		})),
	}));
	const iconMap = JSON.parse(
		readFileSync(
			join(import.meta.dirname, `iconmaps/${themeId}.json`),
			'utf-8',
		),
	);
	const codepoints = JSON.parse(
		readFileSync(
			join(import.meta.dirname, `codepoints/${themeId}.json`),
			'utf-8',
		),
	);

	const iconTheme = {
		fonts,

		light: {
			fileNames: {
				/* empty */
			},
			fileExtensions: {
				/* empty */
			},
			languageIds: {
				/* empty */
			},
		},
		fileNames: {
			/* empty */
		},
		fileExtensions: {
			/* empty */
		},
		languageIds: {
			/* empty */
		},
		iconDefinitions: {
			/* empty */
		},
	};

	const { iconDefinitions } = items;

	for (const iconEntry in iconDefinitions) {
		let { iconColor, iconName } = iconDefinitions[iconEntry];

		if (iconName in iconMap) {
			iconName = iconMap[iconName];
		}

		const fontColor = getFontColor(iconColor);
		const fontCharacter = getFontCharacter(iconName, codepoints);
		const prefixedIconName = prefix(iconEntry);
		iconTheme.iconDefinitions[prefixedIconName] = {
			fontColor,
			fontCharacter,
		};

		const lightColor = Color(fontColor).darken(darkenPercent).hex();
		const lightIconName = light(prefixedIconName);
		iconTheme.iconDefinitions[lightIconName] = { fontColor: lightColor };
	}

	for (const propName of ['file', 'folder', 'folderExpanded']) {
		const iconName = items[propName];
		const prefixedIconName = prefix(iconName);

		iconTheme[propName] = prefixedIconName;
		iconTheme.light[propName] = light(prefixedIconName);
	}

	for (const propName of ['fileNames', 'fileExtensions']) {
		const convertedItems = convertItems(items[propName]);

		iconTheme[propName] = convertedItems;
		iconTheme.light[propName] = makeItemsForLightTheme(convertedItems);
	}

	for (const propName of ['languageIds']) {
		const prefixedItems = prefixItems(items[propName]);

		iconTheme[propName] = prefixedItems;
		iconTheme.light[propName] = makeItemsForLightTheme(prefixedItems);
	}

	return iconTheme;
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
 * Add prefix to items values.
 *
 * @param {Object} props Source properties
 */
function prefixItems(props) {
	const newProps = {};

	for (const key in props) {
		newProps[key] = prefix(props[key]);
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
