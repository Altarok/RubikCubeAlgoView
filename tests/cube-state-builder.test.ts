import {describe, expect, it} from "vitest";
import {CubeStateOLL, CubeStatePLL} from "../src/model/cube-state";
import {CubeColors, DefaultSettings} from "../src/settings/RubikCubeAlgoSettings";
import CubeStateBuilder from "../src/model/cube-state-builder";
import {AlgorithmType} from "../src/model/algorithms";
import {Dimensions, StickerCoords} from "../src/model/geometry";
import {InvalidInput} from "../src/model/codeblock-input";

const id: string = 'someID';
/* Default valid OLL field for 3x3 cube. Actual values make no sense. */
const validBaseOllInput: string = `.110.
00010
01110
00110
.100.
id:${id}
cubeColor:abc
arrowColor:def
alg:R' U' R' F R F' U R U2 == 3+9
alg:F' U R U2 R' U' R' F R == 1-7
` /* ends on linebreak */
const validBasePllInput: string = `
id:${id}
cubeColor:123456
arrowColor:a1b2c3
dimension:3,3
arrows:1+3,6+8
alg:R' U2 R U2 R' F R U R' U' R' F' R2 U'
alg:y R2 B2 U' R' U' R U R U B2 R U' R U
` /* ends on linebreak */

const defaultTestColors: CubeColors = {arrow: '#ff0', cube: '#08f'};
const defaultTestDimensions: Dimensions = new Dimensions(3, 3);

function expectIsEmptyArray(arr: any[]): void {
  expect(arr).toBeTruthy();
  expect(arr.length).toBe(0);
}

function expectDefaultValues(csb: CubeStateBuilder): void {

  // expect(csb.colors).toBe(defaultTestColors);
  expect(csb.arrowColor).toBe(defaultTestColors.arrow);
  expect(csb.cubeColor).toBe(defaultTestColors.cube);
  expectIsEmptyArray(csb.alg);
  expectIsEmptyArray(csb.arrowsPll);
  expect(csb.flags.length).toBe(1);
  expect(csb.flags).toContain('default');
  expectIsEmptyArray(csb.invalidInput);
  expect(csb.id).toBeUndefined();
  expectIsEmptyArray(csb.arrowsPll);
  expect(csb.dimensions.isDefaultSize()).toBe(true);
  expectIsEmptyArray(csb.undeclaredUserInputForOllField);

  expect(csb.algorithmType).toBeUndefined();
  expect(csb.viewBoxDimensions).toBeUndefined();
  expect(csb.stickerCoordinates).toBeUndefined();
  expect(csb.initialCubeRotation).toBe(0);
}

describe('CubeStateBuilder constructor', () => {



  it('should ignore empty input', () => {

    const csb = new CubeStateBuilder('', defaultTestColors);
    expectIsEmptyArray(csb.splitUserInput);

    expectDefaultValues(csb);
  });

  it('should ignore whitespace, tabs and comments', () => {

    const csb = new CubeStateBuilder('//comment\n \n\t\n\n       ', defaultTestColors);
    expect(csb.splitUserInput.length).toBe(1);

    expectDefaultValues(csb);
  });

  it('should overwrite default colors', () => {

    const csb = new CubeStateBuilder('cubeColor:123456\narrowColor:654321', defaultTestColors);
    expect(csb.splitUserInput.length).toBe(2);

    expect(csb.arrowColor).not.toBe(defaultTestColors.arrow);
    expect(csb.cubeColor).not.toBe(defaultTestColors.cube);

    expect(csb.arrowColor).toBe('#654321');
    expect(csb.cubeColor).toBe('#123456');
  });

  it('should overwrite default dimensions', () => {

    const csb = new CubeStateBuilder('dimension:4,2', defaultTestColors);
    expect(csb.splitUserInput.length).toBe(1);

    expect(csb.dimensions.isDefaultSize()).toBe(false);

    expect(csb.dimensions.width).toBe(4);
    expect(csb.dimensions.height).toBe(2);
  });

  it('should overwrite default flags', () => {

    const csb = new CubeStateBuilder('flags:no-buttons', defaultTestColors);
    expect(csb.splitUserInput.length).toBe(1);

    expect(csb.flags).not.toContain('default');

    expect(csb.flags).toContain('no-buttons');
  });

  it('should overwrite default flags', () => {

    const csb = new CubeStateBuilder('flags:no-buttons', defaultTestColors);
    expect(csb.splitUserInput.length).toBe(1);

    expect(csb.flags).not.toContain('default');

    expect(csb.flags).toContain('no-buttons');
  });

  it('should read id', () => {

    const csb = new CubeStateBuilder('id:oll-12', defaultTestColors);
    expect(csb.splitUserInput.length).toBe(1);

    expect(csb.id).toContain('oll-12');
  });

  it('should not make a distinction between OLL and PLL', () => {

    const csb = new CubeStateBuilder(`.10. // OLL only
0010 // OLL only
0010 // OLL only
.10. // OLL only
alg:F' U R U2 R' == 1-7 // OLL only
arrows:1+3,6-8-4  // PLL only
alg:R' U2 R U2 R' F // PLL only
`,
      defaultTestColors);
    expect(csb.splitUserInput.length).toBe(7);

    expect(csb.alg.length).toBe(2);
    expect(csb.alg).toContain("F' U R U2 R' == 1-7"); // OLL only
    expect(csb.alg).toContain("R' U2 R U2 R' F"); // PLL only

    expect(csb.arrowsPll.length).toBe(2); // PLL only
    expect(csb.arrowsPll).toContain('1+3'); // PLL only
    expect(csb.arrowsPll).toContain('6-8-4'); // PLL only

    expect(csb.undeclaredUserInputForOllField.length).toBe(4); // OLL only
    expect(csb.undeclaredUserInputForOllField).toContain('.10.'); // OLL only
    expect(csb.undeclaredUserInputForOllField).toContain('0010'); // OLL only
    expect(csb.undeclaredUserInputForOllField).toContain('0010'); // OLL only
    expect(csb.undeclaredUserInputForOllField).toContain('.10.'); // OLL only

  });

});

describe('CubeStateBuilder error handling', () => {

  it('should show no errors on empty input', () => {

    const csb = new CubeStateBuilder('', defaultTestColors);

    expectIsEmptyArray(csb.invalidInput);
  });

  it('should collect multiple errors without throwing exceptions', () => {

    const csb = new CubeStateBuilder('cubeColor:klm//airline, not a color\ndimension:1,10 // 1 is too low', defaultTestColors);

    expect(csb.cubeColor).toBe(defaultTestColors.cube);
    expect(csb.dimensions.isDefaultSize()).toBe(true);

    expect(csb.invalidInput.length).toBe(2);


    expect(csb.invalidInput[0]).toEqual(InvalidInput.ofCubeColor('cubeColor:klm//airline, not a color'));
    expect(csb.invalidInput[1]).toEqual(InvalidInput.ofDimensions('dimension:1,10 // 1 is too low'));
  });

});
