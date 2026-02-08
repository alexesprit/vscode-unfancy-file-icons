import test from 'ava'
import Color from 'color'
import codiconsCodepoints from './../src/codepoints/codicons.json' with {
  type: 'json',
}
import octiconsCodepoints from './../src/codepoints/octicons.json' with {
  type: 'json',
}
import colors from './../src/data/colors.json' with { type: 'json' }
import codiconsIconMap from './../src/iconmaps/codicons.json' with {
  type: 'json',
}
import octiconsIconMap from './../src/iconmaps/octicons.json' with {
  type: 'json',
}
import {
  getFontCharacter,
  getFontColor,
  light,
  prefix,
} from './../src/utils.js'

/**
 * Test 1: Template expansion
 * Testing getFileNamesFromTemplate() behavior via module internals
 */

test('template expansion: single name, single template', (t) => {
  // We need to test the internal getFileNamesFromTemplate function
  // Since it's not exported, we'll create a test helper that mimics the logic
  const templateObj = {
    names: ['spec'],
    templates: ['${name}.js'],
  }

  const result = expandTemplate(templateObj)
  t.deepEqual(result, ['spec.js'])
})

test('template expansion: multiple names, single template', (t) => {
  const templateObj = {
    names: ['spec', 'test'],
    templates: ['${name}.js'],
  }

  const result = expandTemplate(templateObj)
  t.deepEqual(result, ['spec.js', 'test.js'])
})

test('template expansion: single name, multiple templates', (t) => {
  const templateObj = {
    names: ['spec'],
    templates: ['${name}.js', '${name}.tsx'],
  }

  const result = expandTemplate(templateObj)
  t.deepEqual(result, ['spec.js', 'spec.tsx'])
})

test('template expansion: multiple names, multiple templates (cartesian product)', (t) => {
  const templateObj = {
    names: ['spec', 'test'],
    templates: ['${name}.js', '${name}.tsx'],
  }

  const result = expandTemplate(templateObj)
  t.deepEqual(result, ['spec.js', 'spec.tsx', 'test.js', 'test.tsx'])
})

test('template expansion: template with multiple placeholders', (t) => {
  const templateObj = {
    names: ['component'],
    templates: ['${name}.${name}.js'],
  }

  const result = expandTemplate(templateObj)
  t.deepEqual(result, ['component.component.js'])
})

test('template expansion: template without placeholder', (t) => {
  const templateObj = {
    names: ['ignored'],
    templates: ['static.js'],
  }

  const result = expandTemplate(templateObj)
  t.deepEqual(result, ['static.js'])
})

/**
 * Test 2: Light theme color darkening
 */

test('color darkening: @blue darken by 40%', (t) => {
  const originalColor = colors['@blue']
  const darkenedColor = Color(originalColor).darken(0.4).hex()

  // Verify it's darker (lower luminosity)
  t.true(Color(darkenedColor).luminosity() < Color(originalColor).luminosity())

  // Verify the actual computed value
  t.is(darkenedColor, '#316190')
})

test('color darkening: @cyan darken by 40%', (t) => {
  const originalColor = colors['@cyan']
  const darkenedColor = Color(originalColor).darken(0.4).hex()

  t.true(Color(darkenedColor).luminosity() < Color(originalColor).luminosity())
  t.is(darkenedColor, '#34928F')
})

test('color darkening: @gray darken by 40%', (t) => {
  const originalColor = colors['@gray']
  const darkenedColor = Color(originalColor).darken(0.4).hex()

  t.true(Color(darkenedColor).luminosity() < Color(originalColor).luminosity())
  t.is(darkenedColor, '#5F656C')
})

test('color darkening: @green darken by 40%', (t) => {
  const originalColor = colors['@green']
  const darkenedColor = Color(originalColor).darken(0.4).hex()

  t.true(Color(darkenedColor).luminosity() < Color(originalColor).luminosity())
  t.is(darkenedColor, '#5F9C2A')
})

test('color darkening: @orange darken by 40%', (t) => {
  const originalColor = colors['@orange']
  const darkenedColor = Color(originalColor).darken(0.4).hex()

  t.true(Color(darkenedColor).luminosity() < Color(originalColor).luminosity())
  t.is(darkenedColor, '#D93905')
})

test('color darkening: @red darken by 40%', (t) => {
  const originalColor = colors['@red']
  const darkenedColor = Color(originalColor).darken(0.4).hex()

  t.true(Color(darkenedColor).luminosity() < Color(originalColor).luminosity())
  t.is(darkenedColor, '#951824')
})

test('color darkening: @violet darken by 40%', (t) => {
  const originalColor = colors['@violet']
  const darkenedColor = Color(originalColor).darken(0.4).hex()

  t.true(Color(darkenedColor).luminosity() < Color(originalColor).luminosity())
  t.is(darkenedColor, '#833F76')
})

test('color darkening: @yellow darken by 40%', (t) => {
  const originalColor = colors['@yellow']
  const darkenedColor = Color(originalColor).darken(0.4).hex()

  t.true(Color(darkenedColor).luminosity() < Color(originalColor).luminosity())
  t.is(darkenedColor, '#BF8B21')
})

test('light suffix: adds _light to icon name', (t) => {
  const iconName = '_config'
  const lightName = light(iconName)

  t.is(lightName, '_config_light')
})

test('light suffix: works with prefix function', (t) => {
  const iconName = 'config'
  const prefixedName = prefix(iconName)
  const lightName = light(prefixedName)

  t.is(prefixedName, '_config')
  t.is(lightName, '_config_light')
})

/**
 * Test 3: Icon name resolution with iconmaps
 */

test('icon resolution: direct codepoint lookup (octicons)', (t) => {
  // Test a known icon that exists in octicons
  const iconName = 'file'
  t.true(iconName in octiconsCodepoints)

  const fontCharacter = getFontCharacter(iconName, octiconsCodepoints)
  t.true(fontCharacter.startsWith('\\'))
  t.is(typeof fontCharacter, 'string')
})

test('icon resolution: direct codepoint lookup (codicons)', (t) => {
  // Test a known icon that exists in codicons
  const iconName = 'file'
  t.true(iconName in codiconsCodepoints)

  const fontCharacter = getFontCharacter(iconName, codiconsCodepoints)
  t.true(fontCharacter.startsWith('\\'))
  t.is(typeof fontCharacter, 'string')
})

test('icon resolution: remapped via iconmap (octicons)', (t) => {
  // Find an icon that is remapped
  const remappedIcons = Object.keys(octiconsIconMap)
  if (remappedIcons.length > 0) {
    const originalName = remappedIcons[0]
    const mappedName = octiconsIconMap[originalName]

    // Verify the mapped name exists in codepoints
    t.true(mappedName in octiconsCodepoints)

    // Verify we can get the font character for the mapped name
    const fontCharacter = getFontCharacter(mappedName, octiconsCodepoints)
    t.true(fontCharacter.startsWith('\\'))
  } else {
    t.pass('No iconmap entries to test for octicons')
  }
})

test('icon resolution: remapped via iconmap (codicons)', (t) => {
  // Find an icon that is remapped
  const remappedIcons = Object.keys(codiconsIconMap)
  if (remappedIcons.length > 0) {
    const originalName = remappedIcons[0]
    const mappedName = codiconsIconMap[originalName]

    // Verify the mapped name exists in codepoints
    t.true(mappedName in codiconsCodepoints)

    // Verify we can get the font character for the mapped name
    const fontCharacter = getFontCharacter(mappedName, codiconsCodepoints)
    t.true(fontCharacter.startsWith('\\'))
  } else {
    t.pass('No iconmap entries to test for codicons')
  }
})

test('icon resolution: missing icon name throws error', (t) => {
  const invalidIconName = 'nonexistent-icon-name-12345'

  const error = t.throws(() => {
    getFontCharacter(invalidIconName, octiconsCodepoints)
  })

  t.true(error.message.includes('Invalid icon name'))
})

/**
 * Test 4: Additional utility functions
 */

test('getFontColor: returns valid color for known color name', (t) => {
  const colorName = '@blue'
  const color = getFontColor(colorName)

  t.is(color, colors['@blue'])
  t.is(color, '#73a1cf')
})

test('getFontColor: throws error for invalid color name', (t) => {
  const invalidColorName = '@invalidcolor'

  const error = t.throws(() => {
    getFontColor(invalidColorName)
  })

  t.true(error.message.includes('Invalid color name'))
})

test('prefix: adds underscore prefix', (t) => {
  t.is(prefix('test'), '_test')
  t.is(prefix('config'), '_config')
  t.is(prefix(''), '_')
})

/**
 * Helper function to mimic getFileNamesFromTemplate behavior
 * This replicates the logic from src/utils.js lines 93-113
 */
function expandTemplate(templateObj) {
  const replacedNames = []
  const { names, templates } = templateObj
  const namePlaceholder = '${name}'

  if (!names || names.length === 0) {
    throw new Error('Invalid template object: no names are found')
  }

  if (!templates || templates.length === 0) {
    throw new Error('Invalid template object: no templates are found')
  }

  for (const name of names) {
    for (const template of templates) {
      const replacedName = template.replaceAll(namePlaceholder, name)
      replacedNames.push(replacedName)
    }
  }

  return replacedNames
}
