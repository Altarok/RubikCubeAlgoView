import {describe, it, expect} from 'vitest';
import {Parse} from "../src/parser/parser";

describe('Parse.toAlgorithm()', () => {

  it(`should not parse strings not starting with 'alg:'`, () => {
    expect(Parse.toAlgorithm('').success).toBe(false);
    expect(Parse.toAlgorithm('  ').success).toBe(false);
    expect(Parse.toAlgorithm('foo').success).toBe(false);
  });

  it('should not parse invalid algorithms', () => {
    expect(Parse.toAlgorithm(`alg:#ff2233`).success).toBe(false);
    expect(Parse.toAlgorithm(`alg:fRUR'U'f`).success).toBe(false);
    expect(Parse.toAlgorithm(`alg:3,3`).success).toBe(false);
    expect(Parse.toAlgorithm(`alg:x,y,z`).success).toBe(false);
    expect(Parse.toAlgorithm(`alg:X y Z`).success).toBe(false);
    expect(Parse.toAlgorithm(`alg:y0 f r u`).success).toBe(false);
  });

  it('should parse valid algorithms', () => {
    let result = Parse.toAlgorithm(`alg:F R U R' U' F'`);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.toString()).toBe(`F R U R' U' F'`); else expect.fail();
  });

});

describe('Parse.toArrowColor()', () => {

  it(`should not parse strings not starting with 'arrowColor:'`, () => {
    expect(Parse.toArrowColor('').success).toBe(false);
    expect(Parse.toArrowColor('  ').success).toBe(false);
    expect(Parse.toArrowColor('foo').success).toBe(false);
  });

  it('should not parse invalid arrow colors', () => {
    expect(Parse.toArrowColor('arrowColor:#ff2233').success).toBe(false);
    expect(Parse.toArrowColor('arrowColor:#f23').success).toBe(false);
    expect(Parse.toArrowColor('arrowColor:FOO').success).toBe(false);
    expect(Parse.toArrowColor('arrowColor:foo').success).toBe(false);
    expect(Parse.toArrowColor('arrowColor:f000').success).toBe(false);
    expect(Parse.toArrowColor('arrowColor:ff').success).toBe(false);
  });

  it('should parse valid arrow colors', () => {
    let result = Parse.toArrowColor('arrowColor:f00');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('#f00'); else expect.fail();

    result = Parse.toArrowColor('arrowColor:ff0000');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('#ff0000'); else expect.fail();
  });

  it('should accept comments', () => {
    let result = Parse.toArrowColor('arrowColor:f00 // comment goes here');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('#f00'); else expect.fail();
  });
});

describe('Parse.toArrows()', () => {

  it(`should not parse invalid input`, () => {
    expect(Parse.toArrows('').success).toBe(false);
    expect(Parse.toArrows('  ').success).toBe(false);
    expect(Parse.toArrows('foo').success).toBe(false);
    expect(Parse.toArrows('1+2+3').success).toBe(false);
    expect(Parse.toArrows('1--2').success).toBe(false);
    expect(Parse.toArrows('1-2-3-4-5').success).toBe(false);
  });

  it(`should parse valid input`, () => {
    let result = Parse.toArrows('1-2');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toMatchObject(['1-2']); else expect.fail();

    result = Parse.toArrows('6+8');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toMatchObject(['6+8']); else expect.fail();

    result = Parse.toArrows('9-7-3');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toMatchObject(['9-7-3']); else expect.fail();
  });


});

describe('Parse.toCubeColor()', () => {

  it(`should not parse strings not starting with 'cubeColor:'`, () => {
    expect(Parse.toCubeColor('').success).toBe(false);
    expect(Parse.toCubeColor('  ').success).toBe(false);
    expect(Parse.toCubeColor('foo').success).toBe(false);
  });

  it('should not parse invalid cube colors', () => {
    expect(Parse.toCubeColor('cubeColor:#ff2233').success).toBe(false);
    expect(Parse.toCubeColor('cubeColor:#f23').success).toBe(false);
    expect(Parse.toCubeColor('cubeColor:FOO').success).toBe(false);
    expect(Parse.toCubeColor('cubeColor:foo').success).toBe(false);
    expect(Parse.toCubeColor('cubeColor:f000').success).toBe(false);
    expect(Parse.toCubeColor('cubeColor:ff').success).toBe(false);
  });

  it('should parse valid cube colors', () => {
    let result = Parse.toCubeColor('cubeColor:f00');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('#f00'); else expect.fail();

    result = Parse.toCubeColor('cubeColor:ff0000');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('#ff0000'); else expect.fail();
  });

  it('should accept comments', () => {
    let result = Parse.toCubeColor('cubeColor:f00 // comment goes here');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe('#f00'); else expect.fail();
  });
});

describe('Parse.toDimensions()', () => {

  it(`should not parse strings not starting with 'dimension:'`, () => {
    expect(Parse.toDimensions('').success).toBe(false);
    expect(Parse.toDimensions('  ').success).toBe(false);
    expect(Parse.toDimensions('foo').success).toBe(false);
  });

  it('should not parse invalid dimensions', () => {
    expect(Parse.toDimensions('dimension:').success).toBe(false);
    expect(Parse.toDimensions('dimension:2').success).toBe(false);
    expect(Parse.toDimensions('dimension:2,33').success).toBe(false);
    expect(Parse.toDimensions('dimension:1,2').success).toBe(false);
    expect(Parse.toDimensions('dimension:-3,3').success).toBe(false);
  });

  it('should parse valid dimensions', () => {
    let result = Parse.toDimensions('dimension:2,3');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toMatchObject({width: 2, height: 3}); else expect.fail();

    result = Parse.toDimensions('dimension:3,4');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toMatchObject({width: 3, height: 4}); else expect.fail();
  });

  it('should accept comments', () => {
    let result = Parse.toDimensions('dimension:3,3 // comment goes here');
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toMatchObject({width: 3, height: 3}); else expect.fail();
  });

});

describe('Parse.toFlags()', () => {

  it(`should not parse strings not starting with 'flags:'`, () => {
    expect(Parse.toFlags('').success).toBe(false);
    expect(Parse.toFlags('  ').success).toBe(false);
    expect(Parse.toFlags('foo').success).toBe(false);
  });

  it('should not parse unknown flags', () => {
    expect(Parse.toFlags('flags:i do not exist').success).toBe(false);
    const existingFlag = 'no-rotation';
    expect(Parse.toFlags(`flags:${existingFlag},i do not exist`).success).toBe(false);
  });

  it('should parse known flags', () => {
    const existingFlag = 'no-rotation';
    let result = Parse.toFlags(`flags:${existingFlag}`);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.size).toBe(1); else expect.fail('should not reach');
  });

  it('should ignore duplicates', () => {
    const existingFlag = 'no-rotation';
    let result = Parse.toFlags(`flags:${existingFlag},${existingFlag}`);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.size).toBe(1); else expect.fail('should not reach');
  });

});
