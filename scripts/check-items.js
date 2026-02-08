import { getWarnings } from '../src/warnings.js';

/**
 * Entry point.
 */
function main() {
	const warnings = getWarnings();

	if (warnings.length > 0) {
		for (const warning of warnings) {
			console.log(warning);
		}
		return 1;
	}

	return 0;
}

process.exit(main());
