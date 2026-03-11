import {describe, it, expect} from 'vitest';
import {StringUtils} from "../src/parser/string-utils";
import {UserInput} from "../src/model/codeblock-input";

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

  });


});
