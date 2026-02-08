/**
 * Extract Lucide icon codepoints from lucide-static package.
 *
 * Usage:
 *   1. npm install --save-dev lucide-static@<version>
 *   2. node scripts/extract-lucide-codepoints.js
 *   3. Copy node_modules/lucide-static/font/lucide.woff to resources/lucide.woff
 *   4. npm uninstall lucide-static
 *   5. npm test
 *
 * This script converts lucide-static's info.json format to the project's
 * codepoints format (icon name -> integer codepoint).
 */

const fs = require('node:fs');
const path = require('node:path');

const INFO_PATH = path.join(
	__dirname,
	'../node_modules/lucide-static/font/info.json',
);
const OUTPUT_PATH = path.join(__dirname, '../src/codepoints/lucide.json');

function main() {
	if (!fs.existsSync(INFO_PATH)) {
		console.error('Error: lucide-static not found.');
		console.error('Run: npm install --save-dev lucide-static');
		process.exit(1);
	}

	const info = JSON.parse(fs.readFileSync(INFO_PATH, 'utf8'));
	const codepoints = {};

	for (const [name, data] of Object.entries(info)) {
		// encodedCode format: "\eXXX" where XXX is hex
		// Strip leading backslash, parse remaining hex
		const hex = data.encodedCode.slice(1);
		codepoints[name] = Number.parseInt(hex, 16);
	}

	fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(codepoints, null, 2)}\n`);

	console.log(`✓ Extracted ${Object.keys(codepoints).length} codepoints`);
	console.log(`✓ Written to ${OUTPUT_PATH}`);
	console.log('\nNext steps:');
	console.log(
		'  1. cp node_modules/lucide-static/font/lucide.woff resources/lucide.woff',
	);
	console.log('  2. npm uninstall lucide-static');
	console.log('  3. npm test');
}

main();
