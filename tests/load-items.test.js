import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import test from 'ava'
import { loadItems } from './../src/data/items.js'
import itemsData from './../src/data/items.json' with { type: 'json' }

const mappingDir = join(import.meta.dirname, '..', 'src', 'data', 'mappings')

const mappingFileNames = ['source', 'data', 'docs', 'media', 'build', 'style']

/**
 * Test 1: Output shape — loadItems() returns an object with exactly the
 * 7 expected keys.
 */

const expectedKeys = [
  'file',
  'fileExtensions',
  'fileNames',
  'languageIds',
  'folder',
  'folderExpanded',
  'iconDefinitions',
]

test('loadItems returns an object with exactly the expected keys', (t) => {
  const result = loadItems()
  const actualKeys = Object.keys(result).sort()
  const sortedExpected = [...expectedKeys].sort()

  t.deepEqual(actualKeys, sortedExpected)
})

test('loadItems returns no extra keys beyond the expected ones', (t) => {
  const result = loadItems()

  for (const key of Object.keys(result)) {
    t.true(expectedKeys.includes(key), `unexpected key: ${key}`)
  }

  t.is(Object.keys(result).length, expectedKeys.length)
})

/**
 * Test 2: Correct types — file/folder/folderExpanded are strings,
 * the rest are plain objects.
 */

test('file is a string', (t) => {
  const result = loadItems()
  t.is(typeof result.file, 'string')
})

test('folder is a string', (t) => {
  const result = loadItems()
  t.is(typeof result.folder, 'string')
})

test('folderExpanded is a string', (t) => {
  const result = loadItems()
  t.is(typeof result.folderExpanded, 'string')
})

test('fileExtensions is a plain object', (t) => {
  const result = loadItems()
  t.is(typeof result.fileExtensions, 'object')
  t.false(Array.isArray(result.fileExtensions))
  t.truthy(result.fileExtensions)
})

test('fileNames is a plain object', (t) => {
  const result = loadItems()
  t.is(typeof result.fileNames, 'object')
  t.false(Array.isArray(result.fileNames))
  t.truthy(result.fileNames)
})

test('languageIds is a plain object', (t) => {
  const result = loadItems()
  t.is(typeof result.languageIds, 'object')
  t.false(Array.isArray(result.languageIds))
  t.truthy(result.languageIds)
})

test('iconDefinitions is a plain object', (t) => {
  const result = loadItems()
  t.is(typeof result.iconDefinitions, 'object')
  t.false(Array.isArray(result.iconDefinitions))
  t.truthy(result.iconDefinitions)
})

/**
 * Test 3: Equivalence with original — the merged result matches what
 * items.json currently contains. This is the critical correctness test.
 */

test('merged result matches items.json exactly', (t) => {
  const result = loadItems()
  t.deepEqual(result, itemsData)
})

test('file value matches items.json', (t) => {
  const result = loadItems()
  t.is(result.file, itemsData.file)
})

test('folder value matches items.json', (t) => {
  const result = loadItems()
  t.is(result.folder, itemsData.folder)
})

test('folderExpanded value matches items.json', (t) => {
  const result = loadItems()
  t.is(result.folderExpanded, itemsData.folderExpanded)
})

test('fileExtensions matches items.json', (t) => {
  const result = loadItems()
  t.deepEqual(result.fileExtensions, itemsData.fileExtensions)
})

test('fileNames matches items.json', (t) => {
  const result = loadItems()
  t.deepEqual(result.fileNames, itemsData.fileNames)
})

test('languageIds matches items.json', (t) => {
  const result = loadItems()
  t.deepEqual(result.languageIds, itemsData.languageIds)
})

test('iconDefinitions matches items.json', (t) => {
  const result = loadItems()
  t.deepEqual(result.iconDefinitions, itemsData.iconDefinitions)
})

/**
 * Test 4: Fresh object per call — two calls return different references.
 * loadItems() must not cache or return the same object.
 */

test('two calls return different object references', (t) => {
  const first = loadItems()
  const second = loadItems()
  t.not(first, second)
})

test('two calls return different fileExtensions references', (t) => {
  const first = loadItems()
  const second = loadItems()
  t.not(first.fileExtensions, second.fileExtensions)
})

test('two calls return different fileNames references', (t) => {
  const first = loadItems()
  const second = loadItems()
  t.not(first.fileNames, second.fileNames)
})

test('two calls return different iconDefinitions references', (t) => {
  const first = loadItems()
  const second = loadItems()
  t.not(first.iconDefinitions, second.iconDefinitions)
})

test('two calls return different languageIds references', (t) => {
  const first = loadItems()
  const second = loadItems()
  t.not(first.languageIds, second.languageIds)
})

/**
 * Test 5: All mapping categories present — every category key from the
 * original fileExtensions and fileNames appears in the merged result.
 */

test('all original fileExtensions categories are present', (t) => {
  const result = loadItems()
  const originalCategories = Object.keys(itemsData.fileExtensions)

  for (const category of originalCategories) {
    t.true(
      category in result.fileExtensions,
      `missing fileExtensions category: ${category}`,
    )
  }

  t.is(
    Object.keys(result.fileExtensions).length,
    originalCategories.length,
    'fileExtensions category count mismatch',
  )
})

test('all original fileNames categories are present', (t) => {
  const result = loadItems()
  const originalCategories = Object.keys(itemsData.fileNames)

  for (const category of originalCategories) {
    t.true(
      category in result.fileNames,
      `missing fileNames category: ${category}`,
    )
  }

  t.is(
    Object.keys(result.fileNames).length,
    originalCategories.length,
    'fileNames category count mismatch',
  )
})

test('all original iconDefinitions entries are present', (t) => {
  const result = loadItems()
  const originalKeys = Object.keys(itemsData.iconDefinitions)

  for (const key of originalKeys) {
    t.true(
      key in result.iconDefinitions,
      `missing iconDefinitions entry: ${key}`,
    )
  }

  t.is(
    Object.keys(result.iconDefinitions).length,
    originalKeys.length,
    'iconDefinitions entry count mismatch',
  )
})

test('all original languageIds entries are present', (t) => {
  const result = loadItems()
  const originalKeys = Object.keys(itemsData.languageIds)

  for (const key of originalKeys) {
    t.true(key in result.languageIds, `missing languageIds entry: ${key}`)
  }

  t.is(
    Object.keys(result.languageIds).length,
    originalKeys.length,
    'languageIds entry count mismatch',
  )
})

/**
 * Test 6: No duplicate categories across mapping files — read all mapping
 * files individually and verify no category key appears in more than one file.
 * This validates the correctness of the data split itself.
 */

test('no duplicate fileExtensions categories across mapping files', (t) => {
  const seen = new Map()

  for (const name of mappingFileNames) {
    const filePath = join(mappingDir, `${name}.json`)
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))

    if (!data.fileExtensions) {
      continue
    }

    for (const category of Object.keys(data.fileExtensions)) {
      if (seen.has(category)) {
        t.fail(
          `fileExtensions category "${category}" appears in both ${seen.get(category)} and ${name}`,
        )
      }
      seen.set(category, name)
    }
  }

  t.true(seen.size > 0, 'at least one mapping file should have fileExtensions')
  t.pass()
})

test('no duplicate fileNames categories across mapping files', (t) => {
  const seen = new Map()

  for (const name of mappingFileNames) {
    const filePath = join(mappingDir, `${name}.json`)
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))

    if (!data.fileNames) {
      continue
    }

    for (const category of Object.keys(data.fileNames)) {
      if (seen.has(category)) {
        t.fail(
          `fileNames category "${category}" appears in both ${seen.get(category)} and ${name}`,
        )
      }
      seen.set(category, name)
    }
  }

  t.true(seen.size > 0, 'at least one mapping file should have fileNames')
  t.pass()
})

test('every mapping file has at least one section', (t) => {
  for (const name of mappingFileNames) {
    const filePath = join(mappingDir, `${name}.json`)
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))

    const hasExtensions =
      data.fileExtensions && Object.keys(data.fileExtensions).length > 0
    const hasNames = data.fileNames && Object.keys(data.fileNames).length > 0

    t.true(
      hasExtensions || hasNames,
      `mapping file ${name}.json has neither fileExtensions nor fileNames`,
    )
  }
})

test('mapping files contain only fileExtensions and fileNames keys', (t) => {
  const allowedKeys = ['fileExtensions', 'fileNames']

  for (const name of mappingFileNames) {
    const filePath = join(mappingDir, `${name}.json`)
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))

    for (const key of Object.keys(data)) {
      t.true(
        allowedKeys.includes(key),
        `mapping file ${name}.json has unexpected key: ${key}`,
      )
    }
  }
})

test('union of mapping file categories equals original fileExtensions categories', (t) => {
  const mergedCategories = new Set()

  for (const name of mappingFileNames) {
    const filePath = join(mappingDir, `${name}.json`)
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))

    if (data.fileExtensions) {
      for (const category of Object.keys(data.fileExtensions)) {
        mergedCategories.add(category)
      }
    }
  }

  const originalCategories = new Set(Object.keys(itemsData.fileExtensions))
  t.deepEqual([...mergedCategories].sort(), [...originalCategories].sort())
})

test('union of mapping file categories equals original fileNames categories', (t) => {
  const mergedCategories = new Set()

  for (const name of mappingFileNames) {
    const filePath = join(mappingDir, `${name}.json`)
    const data = JSON.parse(readFileSync(filePath, 'utf-8'))

    if (data.fileNames) {
      for (const category of Object.keys(data.fileNames)) {
        mergedCategories.add(category)
      }
    }
  }

  const originalCategories = new Set(Object.keys(itemsData.fileNames))
  t.deepEqual([...mergedCategories].sort(), [...originalCategories].sort())
})
