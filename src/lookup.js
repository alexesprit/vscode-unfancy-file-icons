import colors from './data/colors.json' with { type: 'json' }

/**
 * Get color in RGB format by color name.
 *
 * @param {String} colorName Color name defined in `colors.json`
 * @return {Number} Color
 */
export function getFontColor(colorName) {
  if (colorName in colors) {
    return colors[colorName]
  }

  throw new Error(`Invalid color name: ${colorName}`)
}

/**
 * Resolve an icon name through an icon map, returning the remapped name
 * if a mapping exists, or the original name otherwise.
 *
 * @param {String} iconName Icon name
 * @param {Object} iconMap  Icon name remapping table
 * @return {String} Resolved icon name
 */
export function resolveIconName(iconName, iconMap) {
  if (iconName in iconMap) {
    return iconMap[iconName]
  }

  return iconName
}

/**
 * Get font character code by name.
 *
 * @param {String} iconName Icon name
 * @param {Object} codepoints Object contains font codepoints
 * @return {String} Font character code in `\\xxxx` format
 */
export function getFontCharacter(iconName, codepoints) {
  if (iconName in codepoints) {
    const iconCodeStr = codepoints[iconName].toString(16)
    return `\\${iconCodeStr}`
  }

  throw new Error(`Invalid icon name: ${iconName}`)
}
