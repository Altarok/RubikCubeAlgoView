import {describe, it, expect} from 'vitest';
import {StringUtils} from "../src/parser/string-utils";
import {UserInput} from "../src/model/codeblock-input";
import {AlgorithmType} from "../src/model/algorithms";


describe('cubeHash(string, AlgorithmType)', () => {

  it('should not fail on undefined input', () => {
    let result = StringUtils.cubeHash(undefined, 'pll');
    expect(result).toBeUndefined();
  });

  it('should result in a hash starting with given AlgorithmType and id', () => {
    let result = StringUtils.cubeHash('foo', 'pll');
    expect(result).toSatisfy((v: string) => v.startsWith('pll-foo-'));

    result = StringUtils.cubeHash('bar', 'oll');
    expect(result).toSatisfy((v: string) => v.startsWith('oll-bar-'));
  });


});

describe('codeBlockToStrings()', () => {

  it('should handle "the invisible mess" (tabs and spaces)', () => {
    const input = " line1\n  \t  \n line 2\n\n  \t  ";

    const result: UserInput = StringUtils.codeBlockToStrings(input);

    expect(result.isEmpty).toBe(false);
    expect(result.getArrowColor()).toBeUndefined();
    expect(result.getUndeclared()).toMatchObject(['line1', 'line 2']);
  });

  it('should return an empty array for a completely blank string', () => {
    const input = "   \n\t\n   ";
    let result = StringUtils.codeBlockToStrings(input);
    expect(result.isEmpty).toBe(true);
    expect(result.toString()).toBe('empty');
  });

  it('should ignore comments and other nonsense', () => {
    const input =
      `
// this is a comment
   // this is a comment with leading whitespace
dimension:
dimension:3,3 // default 3 by 3 cube
cubeColor:0f0//comment without spaces
arrowColor:f00     // comment with way too much spaces, may be the case when user aligns comments 
`;
    let result = StringUtils.codeBlockToStrings(input);
    expect(result.isEmpty).toBe(false);

    expect(result.getDimensions()).toBe('3,3');
    expect(result.getCubeColor()).toBe('0f0');
    expect(result.getArrowColor()).toBe('f00');

    expect(result.toString()).toBe(`arrowColor = f00
cubeColor = 0f0
dimension = 3,3`);
  });


});
