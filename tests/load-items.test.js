import { join } from 'node:path'
import test from 'ava'
import { loadItems } from './../src/data/items.js'
import { readJsonFile } from './../src/loader.js'

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
 * Test 6: No duplicate categories across mapping files — read all mapping
 * files individually and verify no category key appears in more than one file.
 * This validates the correctness of the data split itself.
 */

test('no duplicate fileExtensions categories across mapping files', (t) => {
  const seen = new Map()

  for (const name of mappingFileNames) {
    const filePath = join(mappingDir, `${name}.json`)
    const data = readJsonFile(filePath)

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
    const data = readJsonFile(filePath)

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
    const data = readJsonFile(filePath)

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
    const data = readJsonFile(filePath)

    for (const key of Object.keys(data)) {
      t.true(
        allowedKeys.includes(key),
        `mapping file ${name}.json has unexpected key: ${key}`,
      )
    }
  }
})

test('union of mapping file categories equals loadItems fileExtensions categories', (t) => {
  const mergedCategories = new Set()

  for (const name of mappingFileNames) {
    const filePath = join(mappingDir, `${name}.json`)
    const data = readJsonFile(filePath)

    if (data.fileExtensions) {
      for (const category of Object.keys(data.fileExtensions)) {
        mergedCategories.add(category)
      }
    }
  }

  const items = loadItems()
  const loadedCategories = new Set(Object.keys(items.fileExtensions))
  t.deepEqual([...mergedCategories].sort(), [...loadedCategories].sort())
})

test('union of mapping file categories equals loadItems fileNames categories', (t) => {
  const mergedCategories = new Set()

  for (const name of mappingFileNames) {
    const filePath = join(mappingDir, `${name}.json`)
    const data = readJsonFile(filePath)

    if (data.fileNames) {
      for (const category of Object.keys(data.fileNames)) {
        mergedCategories.add(category)
      }
    }
  }

  const items = loadItems()
  const loadedCategories = new Set(Object.keys(items.fileNames))
  t.deepEqual([...mergedCategories].sort(), [...loadedCategories].sort())
})
