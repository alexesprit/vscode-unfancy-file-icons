import packageFile from '#package' with { type: 'json' }
import { getThemeId } from '#src/naming.js'
import { generateIconTheme } from '#src/themes.js'

/**
 * Entry point.
 */
function main() {
  const { iconThemes } = packageFile.contributes

  for (const theme of iconThemes) {
    generateIconTheme(theme)

    const themeId = getThemeId(theme)
    console.log(`Generated '${themeId}' icon theme`)
  }
}

main()
