import {InvalidInput} from "./invalid-input";
import {Algorithms} from "./algorithms";
import {Arrows, Dimensions} from "./geometry";
import {OllFieldColoring} from "./oll-field-coloring";
import {MappedAlgorithms} from "./algorithms";

export abstract class CubeState {
  /** Container for invalid code block content */
  invalidInput?: InvalidInput;
  /** cube dimensions in stickers (rectangles, not pixels) */
  dimensions: Dimensions;
  /** the arrows' color */
  arrowColor: string;
  /** the background's color */
  backgroundColor: string;
  /** SVG metadata */
  viewBoxDimensions: Dimensions;
  /** Rotation of cube, multiply by 90 to get svg rotation, use directly for algorithm rotation */
  cubeRotation: number = 0;

  /**
   * @param codeBlockContent - Code block content inside triple backticks (```)
   */
  protected constructor(readonly codeBlockContent: string[]) {
  }

  /**
   * @return true if cube size equals 3 by 3
   */
  isDefaultSize = () => this.dimensions.isDefaultSize();

  codeBlockInterpretationFailed = () => this.invalidInput !== undefined;

}

/**
 * PLL algorithms have an n:1 relation to exchanged cubelets.
 * This means we need 1 set of arrows and n sets of algorithms.
 */
export class CubeStatePLL extends CubeState {
  algorithms: Algorithms;
  arrowCoordinates: Arrows;

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
  }

  /** Clock-wise quarter rotation    */
  rotateLeft(): void {
    this.algorithms.rotate(1);
    this.cubeRotation += 1
  }

  resetRotation(): void {
    this.algorithms.rotate((4 - this.cubeRotation % 4) - 4);
    this.cubeRotation = 0;
  }

  /** Anti-clock-wise quarter rotation    */
  rotateRight(): void {
    this.algorithms.rotate(3);
    this.cubeRotation -= 1;
  }
}

/**
 * OLL algorithms have a 1:1 relation to exchanged cubelets.
 * This means we need 1 map containing
 * - key: algorithm
 * - value: set of arrows this algorithm implements
 */
export class CubeStateOLL extends CubeState {
  ollFieldColors: OllFieldColoring;
  algorithmToArrows: MappedAlgorithms;
  currentAlgorithmIndex: number = 0;

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
  }

  currentArrowCoordinates(): Arrows {
    return this.algorithmToArrows?.get(this.currentAlgorithmIndex)?.arrows ?? /* null or undefined */ [];
  }

  /** Clock-wise quarter rotation */
  rotateLeft(): void {
    this.algorithmToArrows.rotate(1);
    this.cubeRotation += 1
  }

  resetRotation(): void {
    this.algorithmToArrows.rotate((4 - this.cubeRotation % 4) - 4);
    this.cubeRotation = 0;
  }

  /** Anti-clock-wise quarter rotation */
  rotateRight(): void {
    this.algorithmToArrows.rotate(3);
    this.cubeRotation -= 1;
  }

  changeAlgorithm(algorithmId: number): boolean {
    if (this.currentAlgorithmIndex === algorithmId) return false;
    this.currentAlgorithmIndex = algorithmId;
    return true;
  }
}
