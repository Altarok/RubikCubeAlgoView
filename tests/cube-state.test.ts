import {describe, it, expect, beforeEach} from 'vitest';
import {CubeStateOLL, CubeStatePLL} from "../src/model/cube-state";
import {StringUtils} from "../src/parser/string-utils";
import {createOllCube, createPllCube} from "../src/parser/codeblock-interpreter";
import {CubeColors, DefaultSettings} from "../src/RubikCubeAlgoSettings";

const id: string = 'someID';
/* Default valid OLL field for 3x3 cube. Actual values make no sense. */
const validBaseOllInput: string = `.110.
00010
01110
00110
.100.
id:${id}
cubeColor:f0f
arrowColor:0f0
alg:R' U' R' F R F' U R U2 == 3+9,2-8-4,1+7
` /* ends on linebreak */
const validBasePllInput: string = `
id:${id}
cubeColor:123456
arrowColor:a2cd3f
dimension:3,3
arrows:1+3,6+8
alg:R' U2 R U2 R' F R U R' U' R' F' R2 U'
alg:y R2 B2 U' R' U' R U R U B2 R U' R U
` /* ends on linebreak */

function createOll(): CubeStateOLL {
  const colors: CubeColors = {arrow: "#08f", cube: "#ff0"};
  return createOllCube(StringUtils.codeBlockToStrings(validBaseOllInput), colors)
}

function createPll(): CubeStatePLL {
  const colors: CubeColors = {arrow: "#08f", cube: "#ff0"};
  return createPllCube(StringUtils.codeBlockToStrings(validBasePllInput), colors)
}

function expectRotationValues(co: CubeStateOLL, cp: CubeStatePLL, dr: number, cr: number, crn: number, locked?: boolean): void {
  expect(co.defaultRotation).toBe(dr);
  expect(co.currentRotation).toBe(cr);
  expect(co.currentRotationNormalized).toBe(crn);
  expect(co.locked).toBe(locked);

  expect(cp.defaultRotation).toBe(dr);
  expect(cp.currentRotation).toBe(cr);
  expect(cp.currentRotationNormalized).toBe(crn);
  expect(co.locked).toBe(locked);
}

describe('CubeState hash', () => {

  const ollInputWithId: string = validBaseOllInput;
  const ollInputWithoutId: string = '.10.\n0010\n0010\n.10.';
  const pllInputWithId: string = validBasePllInput;
  const pllInputWithoutId: string = 'dimension:3,3\narrows:1+3,6+8';

  it('should return undefined when not given an id', () => {
    let co: CubeStateOLL = new CubeStateOLL(StringUtils.codeBlockToStrings(ollInputWithoutId));
    let cp: CubeStatePLL = new CubeStatePLL(StringUtils.codeBlockToStrings(pllInputWithoutId));

    expect(co.getHash()).toBeUndefined();
    expect(cp.getHash()).toBeUndefined();
  });

  it('should start with cube type + id followed by id', () => {
    let co: CubeStateOLL = new CubeStateOLL(StringUtils.codeBlockToStrings(ollInputWithId));
    let cp: CubeStatePLL = new CubeStatePLL(StringUtils.codeBlockToStrings(pllInputWithId));

    expect(co.getHash()).toMatch(new RegExp(`oll-${id}-.*`));
    expect(cp.getHash()).toMatch(new RegExp(`pll-${id}-.*`));
  });
});

describe('CubeState constructor', () => {

  it('should not fail no matter the input', () => {
    // @ts-ignore
    new CubeStateOLL(null);
    // @ts-ignore
    new CubeStateOLL(undefined);
  });

  it('should pre-set cube type ', () => {
    // @ts-ignore
    expect(new CubeStateOLL(null).algorithmType).toBe('oll');
    // @ts-ignore
    expect(new CubeStatePLL(null).algorithmType).toBe('pll');
  });

  it('should pre-set rotation values', () => {
    let co: CubeStateOLL = new CubeStateOLL(StringUtils.codeBlockToStrings(validBaseOllInput));
    let cp: CubeStatePLL = new CubeStatePLL(StringUtils.codeBlockToStrings(validBasePllInput));

    expectRotationValues(co, cp, 0, 0, 0, false);
  });
});

describe('CubeState rotation', () => {

  let co: CubeStateOLL;
  let cp: CubeStatePLL;

  beforeEach(() => {
    co = createOll();
    cp = createPll();
  });

  it('left works as expected', () => {
    expectRotationValues(co, cp, 0, 0, 0, false);

    co.rotateLeft();
    cp.rotateLeft();

    expectRotationValues(co, cp, 0, 1, 1, false);

    co.rotateLeft();
    cp.rotateLeft();
    co.rotateLeft();
    cp.rotateLeft();

    expectRotationValues(co, cp, 0, 3, 3, false);

    co.rotateLeft();
    cp.rotateLeft();
    co.rotateLeft();
    cp.rotateLeft();

    expectRotationValues(co, cp, 0, 5, 1, false);
  });

  it('right works as expected', () => {
    expectRotationValues(co, cp, 0, 0, 0, false);

    co.rotateRight();
    cp.rotateRight();

    expectRotationValues(co, cp, 0, -1, 3, false);
  });

  it('reset works as expected', () => {
    expectRotationValues(co, cp, 0, 0, 0, false);

    co.rotateRight();
    cp.rotateRight();

    expectRotationValues(co, cp, 0, -1, 3, false);

    co.resetRotation();
    cp.resetRotation();

    expectRotationValues(co, cp, 0, 0, 0, false);
  });

  it('should be able to have a default', () => {
    expectRotationValues(co, cp, 0, 0, 0, false);

    /* rotate without default */
    co.rotateRight();
    cp.rotateRight();

    expectRotationValues(co, cp, 0, -1, 3, false);

    /* set default */
    co.setDefaultRotation(1);
    cp.setDefaultRotation(1);

    expectRotationValues(co, cp, 1, 1, 1, true);

    /* rotate with default */
    co.rotateRight();
    cp.rotateRight();

    expectRotationValues(co, cp, 1, 0, 0, true);

    /* reset to default */
    co.resetRotation();
    cp.resetRotation();

    expectRotationValues(co, cp, 1, 1, 1, true);

    /* delete default */
    co.setDefaultRotation(undefined);
    cp.setDefaultRotation(undefined);

    expectRotationValues(co, cp, 0, 0, 0, false);
  });

});

/**
 * PLL has static arrows while OLL has variable arrows
 */
describe('CubeState arrow coordinates', () => {

  const ollInputWithArrows: string = validBaseOllInput;
  const ollInputWithoutArrows: string = '.10.\n0010\n0010\n.10.';
  const pllInputWithArrows: string = validBasePllInput;
  const pllInputWithoutArrows: string = 'dimension:3,3';

  /*
   * TODO
   */


});

