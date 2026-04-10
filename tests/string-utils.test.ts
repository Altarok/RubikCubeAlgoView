import {describe, it, expect} from 'vitest';
import {StringUtils} from "../src/parser/string-utils";


describe('cubeHash(string, AlgorithmType)', () => {

  it('should not fail on undefined input', () => {
    let result = StringUtils.cubeHash(undefined, 'pll');
    expect(result).toBe('');
  });

  it('should result in a hash starting with given AlgorithmType and id', () => {
    let result = StringUtils.cubeHash('foo', 'pll');
    expect(result).toSatisfy((v: string) => v.startsWith('pll-foo-'));

    result = StringUtils.cubeHash('bar', 'oll');
    expect(result).toSatisfy((v: string) => v.startsWith('oll-bar-'));
  });

});
