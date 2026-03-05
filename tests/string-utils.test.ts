import {describe, it, expect} from 'vitest';
import {StringUtils} from "../src/parser/string-utils";
import {UserInput} from "../src/model/codeblock-input";

describe('codeBlockToStrings()', () => {

  it('should handle "the invisible mess" (tabs and spaces)', () => {
    const input = " line1\n  \t  \n line 2\n\n  \t  ";

    const result: UserInput = StringUtils.codeBlockToStrings(input);

    expect(result.isEmpty).toBe(false);
    expect(result.getArrowColor()).toBeFalsy();
    expect(result.getUndeclared()).toMatchObject(['line1', 'line 2']);
  });

  it('should return an empty array for a completely blank string', () => {
    const input = "   \n\t\n   ";
    let result = StringUtils.codeBlockToStrings(input);
    expect(result.isEmpty).toBe(true);
  });

});
