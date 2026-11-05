import {describe, expect, it} from 'vitest'
import {Parse, Result} from '../src/parser/parser'
import {Algorithm} from '../src/model/algorithms'


describe('Parse.toAlgorithm()', () => {

  const toAlgorithm = (value: string): Result<Algorithm> => {
    return Parse.toAlgorithm(value, {value, completeLine: value})
  }


  it(`should not parse strings not starting with 'alg:'`, () => {
    expect(toAlgorithm('',).success).toBe(false)
    expect(toAlgorithm('  ').success).toBe(false)
    expect(toAlgorithm('foo').success).toBe(false)
  })

  it('should not parse invalid algorithms', () => {
    expect(toAlgorithm(`#ff2233`).success).toBe(false)
    expect(toAlgorithm(`fRUR'U'f`).success).toBe(false)
    expect(toAlgorithm(`3,3`).success).toBe(false)
    expect(toAlgorithm(`x,y,z`).success).toBe(false)
    expect(toAlgorithm(`X y Z`).success).toBe(false)
    expect(toAlgorithm(`y0 f r u`).success).toBe(false)
  })

  it('should parse valid algorithms', () => {
    let result = toAlgorithm(`F R U R' U' F'`)
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.toString()).toBe(`F R U R' U' F'`); else expect.fail()
  })

})

describe('Parse.toArrowColor()', () => {

  it(`should not parse strings not starting with 'arrowColor:'`, () => {
    expect(Parse.toArrowColor('', 'foo').success).toBe(false)
    expect(Parse.toArrowColor('  ', 'foo').success).toBe(false)
    expect(Parse.toArrowColor('foo', 'foo').success).toBe(false)
  })

  it('should not parse invalid arrow colors', () => {
    expect(Parse.toArrowColor('#12345', 'foo').success).toBe(false)
    expect(Parse.toArrowColor('#1234', 'foo').success).toBe(false)
    expect(Parse.toArrowColor('FOO', 'foo').success).toBe(false)
    expect(Parse.toArrowColor('foo', 'foo').success).toBe(false)
    expect(Parse.toArrowColor('f000', 'foo').success).toBe(false)
    expect(Parse.toArrowColor('ff', 'foo').success).toBe(false)
  })

  it('should parse valid arrow colors', () => {
    let result = Parse.toArrowColor('f00', 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toBe('#f00'); else expect.fail()

    result = Parse.toArrowColor('ff0000', 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toBe('#ff0000'); else expect.fail()
  })


})

describe('Parse.toArrows()', () => {

  it(`should not parse invalid input`, () => {
    expect(Parse.toArrows('', 'foo').success).toBe(false)
    expect(Parse.toArrows('  ', 'foo').success).toBe(false)
    expect(Parse.toArrows('foo', 'foo').success).toBe(false)
    expect(Parse.toArrows('1+2+3', 'foo').success).toBe(false)
    expect(Parse.toArrows('1--2', 'foo').success).toBe(false)
    expect(Parse.toArrows('1-2-3-4-5', 'foo').success).toBe(false)
  })

  it(`should parse valid input`, () => {
    let result = Parse.toArrows('1-2', 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toMatchObject(['1-2']); else expect.fail()

    result = Parse.toArrows('6+8', 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toMatchObject(['6+8']); else expect.fail()

    result = Parse.toArrows('9-7-3', 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toMatchObject(['9-7-3']); else expect.fail()
  })


})

describe('Parse.toCubeColor()', () => {

  it(`should not parse strings not starting with 'cubeColor:'`, () => {
    expect(Parse.toCubeColor('', 'foo').success).toBe(false)
    expect(Parse.toCubeColor('  ', 'foo').success).toBe(false)
    expect(Parse.toCubeColor('foo', 'foo').success).toBe(false)
  })

  it('should not parse invalid cube colors', () => {
    expect(Parse.toCubeColor('#12345', 'foo').success).toBe(false)
    expect(Parse.toCubeColor('#1234', 'foo').success).toBe(false)
    expect(Parse.toCubeColor('FOO', 'foo').success).toBe(false)
    expect(Parse.toCubeColor('foo', 'foo').success).toBe(false)
    expect(Parse.toCubeColor('f000', 'foo').success).toBe(false)
    expect(Parse.toCubeColor('ff', 'foo').success).toBe(false)
  })

  it('should parse valid cube colors', () => {
    let result = Parse.toCubeColor('f00', 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toBe('#f00'); else expect.fail()

    result = Parse.toCubeColor('ff0000', 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toBe('#ff0000'); else expect.fail()
  })

})

describe('Parse.toDimensions()', () => {

  it(`should not parse strings not starting with 'dimension:'`, () => {
    expect(Parse.toDimensions('', 'foo').success).toBe(false)
    expect(Parse.toDimensions('  ', 'foo').success).toBe(false)
    expect(Parse.toDimensions('foo', 'foo').success).toBe(false)
  })

  it('should not parse invalid dimensions', () => {
    expect(Parse.toDimensions('', 'foo').success).toBe(false)
    expect(Parse.toDimensions('2', 'foo').success).toBe(false)
    expect(Parse.toDimensions('2,33', 'foo').success).toBe(false)
    expect(Parse.toDimensions('1,2', 'foo').success).toBe(false)
    expect(Parse.toDimensions('-3,3', 'foo').success).toBe(false)
  })

  it('should parse valid dimensions', () => {
    let result = Parse.toDimensions('2,3', 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toMatchObject({width: 2, height: 3}); else expect.fail()

    result = Parse.toDimensions('3,4', 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data).toMatchObject({width: 3, height: 4}); else expect.fail()
  })

})

describe('Parse.toFlags()', () => {

  it(`should not parse strings not starting with 'flags:'`, () => {
    expect(Parse.toFlags('', '').success).toBe(false)
    expect(Parse.toFlags('  ', '  ').success).toBe(false)
    expect(Parse.toFlags('foo', 'foo').success).toBe(false)
  })

  it('should not parse unknown flags', () => {
    expect(Parse.toFlags('i do not exist', 'i do not exist').success).toBe(false)
    const existingFlag = 'no-buttons'
    expect(Parse.toFlags(`${existingFlag},i do not exist`, 'foo').success).toBe(false)
  })

  it('should parse known flags', () => {
    const existingFlag = 'no-buttons'
    let result = Parse.toFlags(`${existingFlag}`, 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.length).toBe(1); else expect.fail('should not reach')
  })

  it('should ignore duplicates', () => {
    const existingFlag = 'no-buttons'
    let result = Parse.toFlags(`${existingFlag},${existingFlag}`, 'foo')
    expect(result.success).toBe(true)
    if (result.success) expect(result.data.length).toBe(1); else expect.fail('should not reach')
  })

})
