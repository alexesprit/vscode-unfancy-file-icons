/**
 * Sort object keys alphabetically, returning a new object.
 *
 * @param {Record<string, *>} obj Object to sort
 * @returns {Record<string, *>} New object with sorted keys
 */
export function sortKeys(obj) {
  const sorted = {}
  for (const key of Object.keys(obj).sort()) {
    sorted[key] = obj[key]
  }
  return sorted
}

/**
 * Recursively sort all object keys alphabetically.
 *
 * @param {*} obj Value to sort (objects get sorted keys, arrays are mapped, primitives pass through)
 * @returns {*} Deep-sorted value
 */
export function sortKeysDeep(obj) {
  if (Array.isArray(obj)) {
    return obj.map(sortKeysDeep)
  }

  if (obj !== null && typeof obj === 'object') {
    const sorted = {}
    for (const key of Object.keys(obj).sort()) {
      sorted[key] = sortKeysDeep(obj[key])
    }
    return sorted
  }

  return obj
}
