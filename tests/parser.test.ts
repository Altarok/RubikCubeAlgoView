import {describe, it, expect} from 'vitest';
import {Parse} from "../src/parser/parser";

describe('Parse.toFlags()', () => {

  // it('should handle "the invisible mess" (tabs and spaces)', () => {
  //   // GIVEN: A string with lines that are just tabs or spaces
  //   const input = "line1\n  \t  \nline2\n\n    ";
  //
  //   // WHEN: we process it
  //   const result = Parse.codeBlockToStrings(input);
  //
  //   // THEN: It should only contain the actual content
  //   expect(result).toEqual(['line1', 'line2']);
  //   expect(result).toHaveLength(2);
  // });

  it(`should not parse strings not starting with 'flags:'`, () => {
    const input = "   \n\t\n   ";
    expect(Parse.toFlags(input)).result.toE
  });

});
