import {describe, it, expect} from 'vitest';
import {CubeState, CubeStateOLL, CubeStatePLL} from "../src/model/cube-state";
import {StringUtils} from "../src/parser/string-utils";

/* Default valid OLL field for 3x3 cube. Actual values make no sense. */
const validBaseOllInput: string = `.110.
00010
01110
00110
.100.
` /* ends on linebreak */
const cubeStateOll = new CubeStateOLL(StringUtils.codeBlockToStrings(validBaseOllInput + 'alg:F f'));


describe('CubeState', () => {

  it('constructor should not fail no matter the input', () => {
    new CubeStateOLL(null);
    new CubeStateOLL(undefined);
  });

  it('constructor should pre-set cube type', () => {
    let c: any = new CubeStateOLL(null);
    expect(c.algorithmType).toBe('oll');

    c = new CubeStatePLL(null);
    expect(c.algorithmType).toBe('pll');
  });
});
