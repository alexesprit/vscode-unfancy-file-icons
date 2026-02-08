import { getWarnings } from '#src/warnings.js'

/**
 * Entry point.
 */
function main() {
  const warnings = getWarnings()

  if (warnings.length > 0) {
    for (const warning of warnings) {
      console.log(warning)
    }
    process.exitCode = 1
  }
}

main()
