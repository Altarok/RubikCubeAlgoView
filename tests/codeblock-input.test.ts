import {describe, it, expect, beforeEach} from 'vitest';
import {InvalidInput} from "../src/model/codeblock-input";
import {Flags} from "../src/model/flags";

describe('InvalidInput', () => {

  let ii: InvalidInput;

  it('constructor should be stupid', () => {
    // @ts-ignore
    ii = new InvalidInput(null, null);
    expect(ii.line).toBeNull();
    expect(ii.reason).toBeNull();
    // @ts-ignore
    ii = new InvalidInput(undefined, undefined);
    expect(ii.line).toBeUndefined();
    expect(ii.reason).toBeUndefined();
    ii = new InvalidInput('a', 'b');
    expect(ii.line).toBe('a');
    expect(ii.reason).toBe('b');
  });

  it('has some static constructors', () => {
    expect(InvalidInput.ofCubeColor('123').reason).toBe('Invalid cube color, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
    expect(InvalidInput.ofArrowColor('123').reason).toBe('Invalid arrow color, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
    expect(InvalidInput.ofAlgorithm('123').reason).toBe("Invalid algorithm format. Example: alg:R' U2 R U2 R' F R U R' U' R' F' R2 U' (spaces not optional, no comments in this line)");
    expect(InvalidInput.ofDimensions('123').reason).toBe('Invalid dimensions. Expected: "dimension:[2-10],[2-10]" (e.g. "dimension:3,3")');
    expect(InvalidInput.ofFlags('123').reason).toBe(`Invalid flag. Allowed: ${Flags.types.join(',')}`);
  });

  it('toString() just concatenates both parameters', () => {
    // @ts-ignore
    ii = new InvalidInput(null, null);
    expect(ii.toString()).toBe('InvalidInput[line=null,reason=null');
    // @ts-ignore
    ii = new InvalidInput(undefined, undefined);
    expect(ii.toString()).toBe('InvalidInput[line=undefined,reason=undefined');
    ii = new InvalidInput('a', 'b');
    expect(ii.toString()).toBe('InvalidInput[line=a,reason=b');
  });

  it('isInvalidRow() just compares with first parameter', () => {
    ii = new InvalidInput('first', 'second');

    expect(ii.isInvalidRow('first')).toBe(true);
    expect(ii.isInvalidRow('second')).toBe(false);
  });
});
