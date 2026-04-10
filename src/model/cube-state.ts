import {InvalidInput, UserInput} from "./codeblock-input";
import {Algorithms, MappedAlgorithms, AlgorithmType, Rotatable} from "./algorithms";
import {Arrows, Dimensions} from "./geometry";
import {OllFieldColoring} from "./oll-field-coloring";
import {FlagType} from "./flags";

export interface CubeState {
  readonly algorithmType: AlgorithmType;
  readonly arrowColor: string;
  readonly cubeColor: string;
  /** cube dimensions in stickers (rectangles, not pixels) */
  readonly dimensions: Dimensions;
  readonly flags: FlagType[];
  readonly id?: string;
  /** SVG metadata */
  readonly viewBoxDimensions: Dimensions;
  /** Container for invalid code block content */
  readonly invalidInput: InvalidInput[];
  readonly splitCodeBlockInput: string[];

  /* Rotation variables */
  currentRotation: number; /* any integer */
  currentRotationNormalized: number; /* 0-3 */
  defaultRotation: number; /* 0-3 */
  locked: boolean;

  /** Clock-wise quarter rotation */
  rotateLeft(): void;

  /** Reset rotation to current default */
  resetRotation(): void;

  /** Anti-clock-wise quarter rotation */
  rotateRight(): void;

  /** @return true if cube size equals 3 by 3 */
  isDefaultSize(): boolean;

  codeBlockInterpretationFailed(): boolean;
}

abstract class CubeStateCommon implements CubeState {
  static index = 1;
  readonly uniqueIdForRadioButtons: string = '' + CubeStateCommon.index++;

  /** Rotation of cube, multiply by 90 to get svg rotation, use directly for algorithm rotation */
  currentRotation: number = 0;
  currentRotationNormalized: number = 0;
  defaultRotation: number = 0;
  locked: boolean = false;

  protected constructor(
    public readonly algorithmType: AlgorithmType,
    public readonly arrowColor: string,
    public readonly cubeColor: string,
    public readonly dimensions: Dimensions,
    public readonly flags: FlagType[],
    public readonly id: string | undefined,
    readonly rotatable: Rotatable,
    public readonly viewBoxDimensions: Dimensions,
    public readonly invalidInput: InvalidInput[],
    public readonly splitCodeBlockInput: string[]) {
  }

  isDefaultSize(): boolean {
    return this.dimensions.isDefaultSize();
  }

  codeBlockInterpretationFailed(): boolean {
    return this.invalidInput.length > 0;
  }

  rotateLeft(): void {
    this.rotatable.rotate(1);
    this.currentRotation += 1;
    this.currentRotationNormalized = this.currentRotation % 4;
  }

  resetRotation(): void {
    this.rotatable.rotate((4 - this.currentRotation % 4) - 4);
    this.currentRotation = this.defaultRotation ?? 0;
    this.currentRotationNormalized = ((this.currentRotation % 4) + 4) % 4;
  }

  rotateRight(): void {
    this.rotatable.rotate(3);
    this.currentRotation -= 1;
    this.currentRotationNormalized = (this.currentRotation + 4) % 4;
  }

  setDefaultRotation(defaultRotation: number | undefined): void {
    if (defaultRotation) {
      this.locked = true;
    } else {
      defaultRotation = 0;
      this.locked = false;
    }
    console.debug(`Pre-set rotation found: ${defaultRotation}`);
    this.setRotation(defaultRotation);
  }

  setRotation(rotation: number) {
    this.currentRotation = rotation;
    this.currentRotationNormalized = rotation;
    this.defaultRotation = rotation;
  }
}

export class CubeStatePllNew extends CubeStateCommon {
  constructor(
    arrowColor: string, cubeColor: string, dimensions: Dimensions,
    flags: FlagType[], id: string | undefined, viewBoxDimensions: Dimensions, invalidInput: InvalidInput[], splitCodeBlockInput: string[],
    public readonly algorithms: Algorithms,
    public readonly arrowCoordinates: Arrows) {
    super('pll', arrowColor, cubeColor, dimensions, flags, id, algorithms, viewBoxDimensions, invalidInput, splitCodeBlockInput);
  }
}

export class CubeStateOllNew extends CubeStateCommon {
  constructor(
    arrowColor: string, dimensions: Dimensions, flags: FlagType[], id: string | undefined, viewBoxDimensions: Dimensions,
    invalidInput: InvalidInput[], splitCodeBlockInput: string[],
    public readonly algorithmToArrows: MappedAlgorithms,
    public selectedAlgorithmHash: string,
    public readonly ollFieldInput: OllFieldColoring
  ) {
    super('oll', arrowColor, '#000', dimensions, flags, id, algorithmToArrows, viewBoxDimensions, invalidInput, splitCodeBlockInput);
  }

  currentArrowCoordinates(): Arrows {
    return this.algorithmToArrows?.get(this.selectedAlgorithmHash)?.arrows ?? /* null or undefined */ [];
  }

  changeAlgorithm(algorithmId: string): boolean {
    if (this.selectedAlgorithmHash === algorithmId) return false;
    this.selectedAlgorithmHash = algorithmId;
    return true;
  }
}

/**
 * PLL algorithms have an n:1 relation to exchanged cubelets.
 * This means we need 1 set of arrows and n sets of algorithms.
 */
export class CubeStatePLL extends CubeStateCommon {
  constructor(
    public readonly userInput: UserInput,
    arrowColor: string, cubeColor: string, dimensions: Dimensions,
    flags: FlagType[], invalidInput: InvalidInput[], viewBoxDimensions: Dimensions,
    public readonly algorithms: Algorithms,
    public readonly arrowCoordinates: Arrows
  ) {
    super('pll', arrowColor, cubeColor, dimensions, flags, userInput.getId(), algorithms, viewBoxDimensions, invalidInput, userInput.completeCodeBlock);
  }
}

/**
 * OLL algorithms have a 1:1 relation to exchanged cubelets.
 * This means we need 1 map containing
 * - key: algorithm
 * - value: set of arrows this algorithm implements
 */
export class CubeStateOLL extends CubeStateCommon {
  constructor(
    public readonly userInput: UserInput,
    arrowColor: string, cubeColor: string, dimensions: Dimensions,
    flags: FlagType[], invalidInput: InvalidInput[], viewBoxDimensions: Dimensions,
    public readonly algorithmToArrows: MappedAlgorithms,
    public selectedAlgorithmHash: string,
    public readonly ollFieldInput: OllFieldColoring
  ) {
    super('oll', arrowColor, cubeColor, dimensions, flags, userInput.getId(), algorithmToArrows, viewBoxDimensions, invalidInput, userInput.completeCodeBlock);
  }

  currentArrowCoordinates(): Arrows {
    return this.algorithmToArrows?.get(this.selectedAlgorithmHash)?.arrows ?? /* null or undefined */ [];
  }

  changeAlgorithm(algorithmId: string): boolean {
    if (this.selectedAlgorithmHash === algorithmId) return false;
    this.selectedAlgorithmHash = algorithmId;
    return true;
  }
}
