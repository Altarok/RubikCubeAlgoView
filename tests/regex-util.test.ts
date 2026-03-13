import {describe, expect, it} from "vitest";
import {RegEx} from "../src/parser/regex-util";
import {Flags} from "../src/model/flags";

describe('RegEx.isPositiveInteger()', () => {

  it('should identify strings containing positive integers (>0) correctly', () => {
    expect(RegEx.isPositiveInteger('')).toBe(false);
    expect(RegEx.isPositiveInteger(' ')).toBe(false);
    expect(RegEx.isPositiveInteger('-1')).toBe(false);
    expect(RegEx.isPositiveInteger('0')).toBe(false);
    expect(RegEx.isPositiveInteger('foo')).toBe(false);
    expect(RegEx.isPositiveInteger('2.3')).toBe(false);
    expect(RegEx.isPositiveInteger('2e3')).toBe(false);
    expect(RegEx.isPositiveInteger('2e-1')).toBe(false);

    expect(RegEx.isPositiveInteger('1000')).toBe(true);
    expect(RegEx.isPositiveInteger('3')).toBe(true);
  });

});

describe('RegEx.isSpecialFlags()', () => {

  let flagsStrings = Flags.types as readonly string[];

  it('should identify crap correctly', () => {
    expect(RegEx.isSpecialFlags('')).toBe(false);
    expect(RegEx.isSpecialFlags(' ')).toBe(false);
    expect(RegEx.isSpecialFlags('-1')).toBe(false);
  });

  it('should identify crap correctly', () => {
    for (const flag of flagsStrings) {
      expect(RegEx.isSpecialFlags(flag)).toBe(true);
    }
  });

});

describe('RegEx.isChainedArrow()', () => {

  it('should identify crap correctly', () => {
    expect(RegEx.isChainedArrow('')).toBe(false);
    expect(RegEx.isChainedArrow(' ')).toBe(false);
    expect(RegEx.isChainedArrow('-1')).toBe(false);
    expect(RegEx.isChainedArrow('2-3-')).toBe(false);
    expect(RegEx.isChainedArrow('2+3')).toBe(false);
    expect(RegEx.isChainedArrow('1-2-3-4-5')).toBe(false);
  });

  it('should identify chained arrows correctly', () => {
    expect(RegEx.isChainedArrow('1-2')).toBe(true);
    expect(RegEx.isChainedArrow('1-2-3')).toBe(true);
    expect(RegEx.isChainedArrow('1-2-3-4')).toBe(true);

    expect(RegEx.isChainedArrow('1.1-2.2')).toBe(true);
    expect(RegEx.isChainedArrow('3-2.2')).toBe(true);
    expect(RegEx.isChainedArrow('1.1-4')).toBe(true);
    expect(RegEx.isChainedArrow('1.1-2.2-7-22')).toBe(true);
  });

});

describe('RegEx.isDoubleSidedArrow()', () => {

  it('should identify crap correctly', () => {
    expect(RegEx.isDoubleSidedArrow('')).toBe(false);
    expect(RegEx.isDoubleSidedArrow(' ')).toBe(false);
    expect(RegEx.isDoubleSidedArrow('-1')).toBe(false);
    expect(RegEx.isDoubleSidedArrow('2-3-')).toBe(false);
    expect(RegEx.isDoubleSidedArrow('1-2')).toBe(false);
    expect(RegEx.isDoubleSidedArrow('1-2-3-4-5')).toBe(false);
  });
  it('should identify crap correctly', () => {
    expect(RegEx.isDoubleSidedArrow('1+3')).toBe(true);
    expect(RegEx.isDoubleSidedArrow('2.2+3.1')).toBe(true);
    expect(RegEx.isDoubleSidedArrow('2.2+9')).toBe(true);
    expect(RegEx.isDoubleSidedArrow('8+3.1')).toBe(true);
  });

});

describe('RegEx.isAlgorithm()', () => {

  it(`should identify crap correctly`, () => {
    expect(RegEx.isAlgorithm('')).toBe(false);
    expect(RegEx.isAlgorithm('  ')).toBe(false);
    expect(RegEx.isAlgorithm('foo')).toBe(false);
  });

  it('should identify crap correctly', () => {
    expect(RegEx.isAlgorithm(`#ff2233`)).toBe(false);
    expect(RegEx.isAlgorithm(`fRUR'U'f`)).toBe(false);
    expect(RegEx.isAlgorithm(`3,3`)).toBe(false);
    expect(RegEx.isAlgorithm(`x,y,z`)).toBe(false);
    expect(RegEx.isAlgorithm(`X y Z`)).toBe(false);
    expect(RegEx.isAlgorithm(`y0 f r u`)).toBe(false);
  });


});
