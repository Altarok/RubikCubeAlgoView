import {describe, it, expect} from 'vitest';
import {createPllCube, createOllCube} from "../src/parser/codeblock-interpreter";
import {CubeColors} from "../src/settings/RubikCubeAlgoSettings";
import {StringUtils} from "../src/parser/string-utils";
import {UserInput} from "../src/model/codeblock-input";
import {CubeState, CubeStateOLL, CubeStatePLL} from "../src/model/cube-state";
import {Algorithm, MappedAlgorithms} from "../src/model/algorithms";
import {Arrows} from "../src/model/geometry";

/* Default valid OLL field for 3x3 cube. Actual values make no sense. */
const validBaseOllInput: string = `.110.
00010
01110
00110
.100.
` /* ends on linebreak */


const inputEmpty = StringUtils.codeBlockToStrings('');
const inputInvalidArrowColor = StringUtils.codeBlockToStrings('arrowColor:FOO');
const inputInvalidCubeColor = StringUtils.codeBlockToStrings('cubeColor:FOO');
const inputInvalidFlag = StringUtils.codeBlockToStrings('flags:not-a-flag');
/* Contains a oll-field to show OLL ignores dimensions */
const inputInvalidDimensions = StringUtils.codeBlockToStrings(validBaseOllInput + 'dimension:42,69');
/* Contains some dimensions to show PLL ignores oll-field: 'dimension:3,3' */
const inputInvalidOllFieldMissingDots = StringUtils.codeBlockToStrings('0110\n0011\n0011\n.01.\ndimension:4,5');
/* Works only for PLL: 'dimension:3,3' */
const inputInvalidOllFieldTooSmall = StringUtils.codeBlockToStrings('.1.\n011\n.1.\ndimension:3,4');
/* Contains a oll-field to show OLL ignores arrows */
const inputInvalidArrows = StringUtils.codeBlockToStrings(validBaseOllInput + 'arrows:1+3+2');
/* PLL: Double-sided arrows 1<->3 and 4<->6 */
const inputDoubleSidedArrowsPll = StringUtils.codeBlockToStrings('arrows:1+2,4+6');
/* OLL: Double-sided arrows 1<->3 and 4<->6 */
const inputDoubleSidedArrowsOll = StringUtils.codeBlockToStrings(validBaseOllInput + 'alg:F R == 1+2,4+6');
/* PLL: Normal arrow 1->3 */
const inputSingleArrowPll = StringUtils.codeBlockToStrings('arrows:1-3');
/* OLL: Normal arrow 1->3 */
const inputSingleArrowOll = StringUtils.codeBlockToStrings(validBaseOllInput + 'alg:F R == 1-3');
/* PLL: Chained arrow 1->3->7->9->1 */
const inputChainedArrowsPll = StringUtils.codeBlockToStrings('arrows:1-3-7-9');
/* OLL: Chained arrow 1->3->7->9->1 */
const inputChainedArrowsOll = StringUtils.codeBlockToStrings(validBaseOllInput + 'alg:F R == 1-3-7-9');
/* PLL & OLL: valid algorithm */
const inputValidAlgorithm = StringUtils.codeBlockToStrings(validBaseOllInput + 'alg:F f');
/* PLL: invalid algorithm */
const inputInvalidAlgorithmPLL = StringUtils.codeBlockToStrings('alg:F f G');
/* OLL: invalid algorithm */
const inputInvalidAlgorithmOLL = StringUtils.codeBlockToStrings(validBaseOllInput + 'alg:F R T == 1-3-7-9');



const cubeColors: CubeColors = {'arrow': '123', 'cube': '456'};

function expectPass(cubeState: CubeState) {
  expect(cubeState.codeBlockInterpretationFailed()).toBe(false);
  expect(cubeState.invalidInput).toBeFalsy();
}

function expectFail(cubeState: CubeState) {
  expect(cubeState.codeBlockInterpretationFailed()).toBe(true);
  expect(cubeState.invalidInput).toBeTruthy();
}

function expectFourArrowsToBeTwoDoubleSidedArrows(arrows: Arrows) {

  expect(arrows).toBeTruthy();
  expect(arrows.length).toBe(4);

  const arrow1 = arrows[0]!;
  const arrow2 = arrows[1]!;
  const arrow3 = arrows[2]!;
  const arrow4 = arrows[3]!;

  expect(arrow1.start).toMatchObject(arrow2.end);
  expect(arrow1.end).toMatchObject(arrow2.start);

  expect(arrow3.start).toMatchObject(arrow4.end);
  expect(arrow3.end).toMatchObject(arrow4.start)
}

function expectChainedArrows(arrows: Arrows, expectedSize: number) {
  expect(expectedSize).toBeGreaterThanOrEqual(3);
  expect(expectedSize).toBeLessThanOrEqual(4);
  expect(arrows).toBeTruthy();
  expect(arrows.length).toBe(expectedSize);

  const firstArrow = arrows[0]!;
  let lastArrow = firstArrow;
  let currArrow;

  for (let i = 1; i < expectedSize; i++) { /* start with 1 */
    currArrow = arrows[i]!;
    expect(lastArrow.end).toMatchObject(currArrow.start);
    lastArrow = currArrow;
  }

  /*
   * Expect the arrows to chain from the last one back to the first one
   */
  expect(lastArrow!.end).toMatchObject(firstArrow.start);
}

describe('CodeBlockInterpreter.createPllCube()', () => {

  function create(userInput: UserInput, colors: CubeColors): CubeStatePLL {
    return createPllCube(userInput, colors);
  }

  it('should fail on empty input', () => {
    let cubeState = create(inputEmpty, cubeColors);
    expectFail(cubeState);
  });

  it('should fail on invalid arrow color', () => {
    let cubeState = create(inputInvalidArrowColor, cubeColors);
    expectFail(cubeState);
  });

  it('should fail on invalid cube color', () => {
    let cubeState = create(inputInvalidCubeColor, cubeColors);
    expectFail(cubeState);
  });

  it('should fail on invalid flag', () => {
    let cubeState = create(inputInvalidFlag, cubeColors);
    expectFail(cubeState);
  });

  it('should fail on invalid dimensions', () => {
    let cubeState = create(inputInvalidDimensions, cubeColors);
    expectFail(cubeState);
  });

  it('should ignore invalid OLL-field (missing dots)', () => {
    let cubeState = create(inputInvalidOllFieldMissingDots, cubeColors);
    expectPass(cubeState);
    expect(cubeState.dimensions).toMatchObject({width: 4, height: 5});
  });

  it('should ignore invalid OLL-field (too small)', () => {
    let cubeState = create(inputInvalidOllFieldTooSmall, cubeColors);
    expectPass(cubeState);
    expect(cubeState.dimensions).toMatchObject({width: 3, height: 4});
  });

  it('should fail on invalid arrows', () => {
    let cubeState = create(inputInvalidArrows, cubeColors);
    expectFail(cubeState);

    /* Invalid; nothing btw commas */
    cubeState = create(StringUtils.codeBlockToStrings('arrows:1+3,,2+4'), cubeColors);
    expectFail(cubeState);
  });

  it('should correctly interpret double-sided arrows', () => {
    let cubeState = create(inputDoubleSidedArrowsPll, cubeColors);
    expectPass(cubeState);

    const arrows: Arrows = cubeState.arrowCoordinates;
    expectFourArrowsToBeTwoDoubleSidedArrows(arrows);
  });

  it('should correctly interpret normal arrow', () => {
    let cubeState = create(inputSingleArrowPll, cubeColors);
    expectPass(cubeState);

    const arrows: Arrows = cubeState.arrowCoordinates;
    expect(arrows).toBeTruthy();
    expect(arrows.length).toBe(1);
  });

  it('should correctly interpret chained arrows', () => {
    let cubeState = create(inputChainedArrowsPll, cubeColors);
    expectPass(cubeState);

    const arrows: Arrows = cubeState.arrowCoordinates;
    expectChainedArrows(arrows, 4);
  });

  it('should fail on invalid algorithm', () => {
    let cubeState = create(inputInvalidAlgorithmPLL, cubeColors);
    expectFail(cubeState);
  });

  it('should correctly interpret algorithm', () => {
    let cubeState = create(inputValidAlgorithm, cubeColors);
    expectPass(cubeState);

    const algorithms: Algorithm[] = cubeState.algorithms.items;
    expect(algorithms).toBeTruthy();
    expect(algorithms.length).toBe(1);

    const algorithm = algorithms[0]!;
    expect(algorithm.toString()).toBe('F f');
  });

});

describe('CodeBlockInterpreter.createOllCube()', () => {

  function create(userInput: UserInput, colors: CubeColors): CubeStateOLL {
    return createOllCube(userInput, colors);
  }

  it('should fail on empty input', () => {
    let cubeState = create(inputEmpty, cubeColors);
    expectFail(cubeState);
  });

  it('should fail on invalid arrow color', () => {
    let cubeState = create(inputInvalidArrowColor, cubeColors);
    expectFail(cubeState);
  });

  it('should fail on invalid cube color', () => {
    let cubeState = create(inputInvalidCubeColor, cubeColors);
    expectFail(cubeState);
  });

  it('should fail on invalid flag', () => {
    let cubeState = create(inputInvalidFlag, cubeColors);
    expectFail(cubeState);
  });

  it('should ignore invalid dimensions (PLL only)', () => {
    let cubeState = create(inputInvalidDimensions, cubeColors);
    expectPass(cubeState);
  });

  it('should fail on invalid OLL-field', () => {
    let cubeState = create(inputInvalidOllFieldMissingDots, cubeColors);
    expectFail(cubeState);

    /*
     * middle row too long
     */
    cubeState = create(StringUtils.codeBlockToStrings('.11.\n0011\n01011\n.01.\ndimension:4,5'), cubeColors);
    expectFail(cubeState);
  });

  it('should ignore invalid OLL-field (too small)', () => {
    let cubeState = create(inputInvalidOllFieldTooSmall, cubeColors);
    expectFail(cubeState);
  });

  it('should ignore invalid arrows', () => {
    let cubeState = create(inputInvalidArrows, cubeColors);
    expectPass(cubeState);
  });

  it('should correctly interpret double-sided arrows', () => {
    let cubeState = create(inputDoubleSidedArrowsOll, cubeColors);
    expectPass(cubeState);
    const mappedAlgorithms: MappedAlgorithms = cubeState.algorithmToArrows;
    expect(mappedAlgorithms).toBeTruthy();
    expect(mappedAlgorithms.size()).toBe(1);

    let arrows: Arrows = mappedAlgorithms.map.entries().next().value[1].arrows;
    expectFourArrowsToBeTwoDoubleSidedArrows(arrows);
  });

  it('should correctly interpret normal arrow', () => {
    let cubeState = create(inputSingleArrowOll, cubeColors);
    expectPass(cubeState);
    const mappedAlgorithms: MappedAlgorithms = cubeState.algorithmToArrows;
    expect(mappedAlgorithms).toBeTruthy();
    expect(mappedAlgorithms.size()).toBe(1);

    let arrows: Arrows = mappedAlgorithms.map.entries().next().value[1].arrows;
    expect(arrows).toBeTruthy();
    expect(arrows.length).toBe(1);
  });

  it('should correctly interpret chained arrows', () => {
    let cubeState = create(inputChainedArrowsOll, cubeColors);
    expectPass(cubeState);

    const mappedAlgorithms: MappedAlgorithms = cubeState.algorithmToArrows;
    expect(mappedAlgorithms).toBeTruthy();
    expect(mappedAlgorithms.size()).toBe(1);

    let arrows: Arrows = mappedAlgorithms.map.entries().next().value[1].arrows;
    expectChainedArrows(arrows, 4);
  });

  it('should fail on invalid algorithm', () => {
    let cubeState = create(inputInvalidAlgorithmOLL, cubeColors);
    expectFail(cubeState);
  });

  it('should correctly interpret algorithm', () => {
    let cubeState = create(inputValidAlgorithm, cubeColors);
    expectPass(cubeState);

    const algorithms = cubeState.algorithmToArrows;
    expect(algorithms).toBeTruthy();
    expect(algorithms.size()).toBe(1);

    const algorithm = algorithms.map.entries().next().value[1].algorithm;
    expect(algorithm.toString()).toBe('F f');
  });

});
