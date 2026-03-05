import {describe, it, expect} from 'vitest';
import {StringUtils} from "../src/parser/string-utils";

describe('codeBlockToStrings()', () => {

  it('should handle "the invisible mess" (tabs and spaces)', () => {
    // GIVEN: A string with lines that are just tabs or spaces
    const input = "line1\n  \t  \nline2\n\n    ";

    // WHEN: we process it
    const result = StringUtils.codeBlockToStrings(input);

    // THEN: It should only contain the actual content
    expect(result).toEqual(['line1', 'line2']);
    expect(result).toHaveLength(2);
  });

  it('should return an empty array for a completely blank string', () => {
    const input = "   \n\t\n   ";
    expect(StringUtils.codeBlockToStrings(input)).toEqual([]);
  });

});
