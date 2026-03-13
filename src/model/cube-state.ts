import {InvalidInput, UserInput} from "./codeblock-input";
import {Algorithms, MappedAlgorithms, AlgorithmType} from "./algorithms";
import {Arrows, Dimensions} from "./geometry";
import {OllFieldColoring} from "./oll-field-coloring";
import {FlagType} from "./flags";
import {StringUtils} from "../parser/string-utils";


abstract class CubeState {
  static index = 1;

  uniqueIdForRadioButtons = '' + CubeState.index++;

  /** ID for manual identification and caching of rotation */
  id?: string;
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
  currentRotation: number = 0;
  currentRotationNormalized: number = 0;
  defaultRotation: number = 0;

  specialFlags: Set<FlagType>;
  locked: boolean = false;

  protected constructor(public readonly userInput: UserInput, public readonly algorithmType: AlgorithmType) {
    this.id = userInput.getId();
  }

  /**
   * Create hash for persisting of metadata.
   */
  getHash(): string | undefined {
    if (this.id)
    switch (this.algorithmType){
      case'pll': return `pll-${this.id}-${StringUtils.hash(this.id)}`;
      case'oll': return `oll-${this.id}-${StringUtils.hash(this.id)}`;
    }
    return undefined;
  }

  /** @return true if cube size equals 3 by 3 */
  isDefaultSize = () => this.dimensions.isDefaultSize();

  codeBlockInterpretationFailed = () => this.invalidInput !== undefined;

  /** Clock-wise quarter rotation */
  abstract rotateLeft(): void ;
  abstract resetRotation(): void;
  /** Anti-clock-wise quarter rotation */
  abstract rotateRight(): void;

  protected raiseCurrentRotation(): void {
    this.currentRotation += 1;
    this.currentRotationNormalized = this.currentRotation % 4;
  }
  protected resetCurrentRotation(): void {
    this.currentRotation = this.defaultRotation ?? 0;
    this.currentRotationNormalized = ((this.currentRotation % 4) + 4) % 4;
  }
  protected lowerCurrentRotation(): void {
    this.currentRotation -= 1;
    this.currentRotationNormalized = (this.currentRotation + 4) % 4;
  }
  setDefaultRotation(defaultRotation: number | undefined) {
    if (defaultRotation) {
      console.debug(`Pre-set rotation found: ${defaultRotation}`);
      this.currentRotation = defaultRotation;
      this.currentRotationNormalized = defaultRotation;
    } else {

      /*
       * TODO set boolean 'locked' or similar
       *
       * if param = undef -> set said boolean to opposite value
       *
       * call this method after saving and after loading
       */
    }
  }
}

export default CubeState

/**
 * PLL algorithms have an n:1 relation to exchanged cubelets.
 * This means we need 1 set of arrows and n sets of algorithms.
 */
export class CubeStatePLL extends CubeState {
  algorithms: Algorithms;
  arrowCoordinates: Arrows;

  constructor(userInput: UserInput) {
    super(userInput, 'pll');
  }

  /** Clock-wise quarter rotation    */
  rotateLeft(): void {
    this.algorithms.rotate(1);
    this.raiseCurrentRotation();
  }

  resetRotation(): void {
    this.algorithms.rotate((4 - this.currentRotation % 4) - 4);
    this.resetCurrentRotation();
  }

  /** Anti-clock-wise quarter rotation    */
  rotateRight(): void {
    this.algorithms.rotate(3);
    this.lowerCurrentRotation();
  }

}

/**
 * OLL algorithms have a 1:1 relation to exchanged cubelets.
 * This means we need 1 map containing
 * - key: algorithm
 * - value: set of arrows this algorithm implements
 */
export class CubeStateOLL extends CubeState {
  ollFieldInput: OllFieldColoring;
  algorithmToArrows: MappedAlgorithms;
  selectedAlgorithmHash: string = '';

  constructor(userInput: UserInput
              // , public readonly ollFieldInput: OllFieldColoring
  ) {
    super(userInput, 'oll');
  }

  currentArrowCoordinates(): Arrows {
    return this.algorithmToArrows?.get(this.selectedAlgorithmHash)?.arrows ?? /* null or undefined */ [];
  }

  /** Clock-wise quarter rotation */
  rotateLeft(): void {
    this.algorithmToArrows.rotate(1);
    this.raiseCurrentRotation();
  }

  resetRotation(): void {
    this.algorithmToArrows.rotate((4 - this.currentRotation % 4) - 4);
    this.resetCurrentRotation();
  }

  /** Anti-clock-wise quarter rotation */
  rotateRight(): void {
    this.algorithmToArrows.rotate(3);
    this.lowerCurrentRotation();
  }

  changeAlgorithm(algorithmId: string): boolean {
    if (this.selectedAlgorithmHash === algorithmId) return false;
    this.selectedAlgorithmHash = algorithmId;
    return true;
  }
}
