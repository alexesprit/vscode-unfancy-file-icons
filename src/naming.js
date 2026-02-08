const themeIdMap = {
  'vscode-unfancy-file-icons': 'octicons',
  'vscode-unfancy-file-icons-codicons': 'codicons',
  'vscode-unfancy-file-icons-lucide': 'lucide',
}

/**
 * Add '_' prefix to string.
 *
 * @param {String} str String
 */
export function prefix(str) {
  return `_${str}`
}

/**
 * Add 'light' suffix to string.
 *
 * @param {String} str String
 */
export function light(str) {
  return `${str}_light`
}

/**
 * Return a theme ID.
 *
 * @param  {Object} theme `contributes.iconThemes` entry from `package.json`
 * @return {String} Theme ID
 */
export function getThemeId(theme) {
  const themeId = theme.id
  if (themeId in themeIdMap) {
    return themeIdMap[themeId]
  }
  throw new Error(`Unknown theme ID: ${themeId}`)
}
