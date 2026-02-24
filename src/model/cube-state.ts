import {InvalidInput} from "./invalid-input";
import {Algorithms} from "./algorithms";
import {Geometry, Arrows, Dimensions} from "./geometry";
import {OllFieldColors} from "./OllFieldColors";
import {MappedAlgorithms} from "./algorithms";

export abstract class CubeState {
  /** Container for invalid code block content */
  invalidInput?: InvalidInput;
  /** cube width (rectangles, not pixels) */
  cubeWidth: number;
  /** cube height (rectangles, not pixels) */
  cubeHeight: number;
  /** the arrows' color */
  arrowColor: string;
  /** the background's color */
  backgroundColor: string;
  /** SVG metadata */
  viewBoxDimensions: Dimensions;

  /**
   * @param codeBlockContent - Code block content inside triple backticks (```)
   */
  protected constructor(readonly codeBlockContent: string[]) {}

  /**
   * @return true if cube size equals 3 by 3
   */
  isDefaultCubeSize(): boolean {
    return this.cubeWidth === 3 && this.cubeHeight === 3;
  }

  codeBlockInterpretationFailed(): boolean {
    return this.invalidInput != undefined;
  }
}

/**
 * PLL algorithms have an n:1 relation to exchanged cubelets.
 * This means we need 1 set of arrows and n sets of algorithms.
 */
export class CubeStatePLL extends CubeState {
  algorithms: Algorithms;
  arrowCoordinates: Geometry[];

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
  }

  /** Clock-wise quarter rotation    */
  rotateLeft(): void {
    this.algorithms.rotate(1);
  }

  /** Anti-clock-wise quarter rotation    */
  rotateRight(): void {
    this.algorithms.rotate(3);
  }
}

/**
 * OLL algorithms have a 1:1 relation to exchanged cubelets.
 * This means we need 1 map containing
 * - key: algorithm
 * - value: set of arrows this algorithm implements
 */
export class CubeStateOLL extends CubeState {
  ollFieldColors: OllFieldColors;
  algorithmToArrows: MappedAlgorithms;
  currentAlgorithmIndex: number;

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
    this.currentAlgorithmIndex = 0;
  }

  currentArrowCoordinates(): Arrows {
    return this.algorithmToArrows?.get(this.currentAlgorithmIndex)?.arrows ?? /* null or undefined */ [];
  }

  /** Clock-wise quarter rotation */
  rotateLeft(): void {
    this.algorithmToArrows.rotate(1);
  }

  /** Anti-clock-wise quarter rotation */
  rotateRight(): void {
    this.algorithmToArrows.rotate(3);
  }

  changeAlgorithm(algorithmId: number): boolean {
    // console.log(algorithmId);
    if (this.currentAlgorithmIndex === algorithmId) {
      // console.log('no change');
      return false;
    }
    this.currentAlgorithmIndex = algorithmId;
    // console.log('changed to ' + this.currentAlgorithmIndex);
    return true;
  }
}
