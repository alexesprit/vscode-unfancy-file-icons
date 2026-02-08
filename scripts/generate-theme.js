import packageFile from '../package.json' with { type: 'json' }
import { generateIconTheme } from '../src/themes.js'
import { getThemeId } from '../src/utils.js'

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
