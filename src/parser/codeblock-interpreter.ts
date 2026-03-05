import {ArrowCoords, Arrows, Coordinates, Dimensions, StickerCoords} from "../model/geometry";
import {DefaultSettings, RubikCubeAlgoSettingsTab} from "../RubikCubeAlgoSettings";
import {InvalidInput, UserInput} from "../model/codeblock-input";
import {Algorithms, MappedAlgorithm, MappedAlgorithms, SpecialFlags} from "../model/algorithms";
import {CubeStatePLL, CubeStateOLL} from "../model/cube-state";
import {Parse} from "./parser";
import {OllFieldColoring} from "../model/oll-field-coloring";
import {Build} from "./geometry-builder";

const DEFAULT = {
  WIDTH: 3, /* default rubik cube width  */
  HEIGHT: 3 /* default rubik cube height */
} as const;

export abstract class CodeBlockInterpreter {
  /** cube's dimensions (stickers, not pixels) */
  protected cubeDimensions: Dimensions = new Dimensions(DEFAULT.WIDTH, DEFAULT.HEIGHT);
  protected codeBlockInterpretationSuccessful: boolean = true;
  protected invalidInput?: InvalidInput;
  protected stickerCoordinates: StickerCoords;
  protected arrowColor: string;
  protected specialFlags: Set<SpecialFlags>;

  protected constructor(protected readonly userInput: UserInput, settings: RubikCubeAlgoSettingsTab) {
    this.arrowColor = settings.arrowColor ?? DefaultSettings.ARROW_COLOR;
    if (userInput.isEmpty) {
      this.setInvalidInput(new InvalidInput("[empty]", "At least 1 parameter needed: 'dimension/cubeColor/arrowColor/arrows'"));
    }
  }

  /**
   * Called when the interpretation of a code block failed.
   * @param {InvalidInput} errData - contains invalid input and description of problem
   */
  setInvalidInput(errData: InvalidInput): void {
    console.warn(`Failed to parse code block. Error: ${errData.toString()}`);
    this.codeBlockInterpretationSuccessful = false;
    this.invalidInput = errData;
  }

  setup(): void {
    console.log('>>');
    /* Keep order of the following 3 functions */
    if (!this.codeBlockInterpretationSuccessful) {
      return;
    }
    this.interpretCodeBlock();
    this.setupCubeRectangleCenterCoordinates();
    console.log('<<');
  }

  /**
   * This must include calculating the cube dimensions
   */
  abstract interpretCodeBlock(): void;

  /**
   * Calculate coordinates of all cube rectangles.
   * Mandatory preparation for arrow coordinates calculation.
   */
  abstract setupCubeRectangleCenterCoordinates(): void;

  setupArrowCoordinates(input: string[]): Arrows {
    if (input.length === 0) return [];

    return input.filter(Boolean)
    .flatMap((segment) => {
      const isDoubleSided = segment.includes('+');
      const parts = segment.split(/[+-]/); // Split on + OR -

      // Map the string IDs to their coordinate objects immediately
      const coords = parts.map(id => this.stickerCoordinates.getStickerCenter(id));

      if (isDoubleSided && coords.length === 2) {
        const [start, end] = coords as [Coordinates, Coordinates];
        return [new ArrowCoords(start, end), new ArrowCoords(end, start)];
      }

      const arrows: ArrowCoords[] = [];
      for (let i = 0; i < coords.length - 1; i++) {
        arrows.push(new ArrowCoords(coords[i] as Coordinates, coords[i + 1] as Coordinates));
      }

      // chained arrows
      if (coords.length > 2) {
        arrows.push(new ArrowCoords(coords[coords.length - 1] as Coordinates, coords[0] as Coordinates));
      }

      return arrows;
    }, []);
  }

}

export class CodeBlockInterpreterPLL extends CodeBlockInterpreter {
  cubeColor: string;
  algorithms: Algorithms = new Algorithms();
  arrowsLine: string = '';
  arrows: string[] = [];

  constructor(userInput: UserInput, settings: RubikCubeAlgoSettingsTab) {
    super(userInput, settings);
    this.cubeColor = settings.cubeColor ?? DefaultSettings.CUBE_COLOR;
  }

  setupPll(): CubeStatePLL {
    super.setup();

    let arrowCoordinates: Arrows = super.setupArrowCoordinates(this.arrows);

    let cubeState: CubeStatePLL = new CubeStatePLL(this.userInput);

    if (this.codeBlockInterpretationSuccessful) {
      Object.assign(cubeState, {
        /*
         * Generic data:
         */
        dimensions: this.cubeDimensions,
        backgroundColor: this.cubeColor,
        arrowColor: this.arrowColor,
        arrowCoordinates: arrowCoordinates,
        viewBoxDimensions: {
          width: this.cubeDimensions.width * 100,
          height: this.cubeDimensions.height * 100
        },
        specialFlags: this.specialFlags ?? new Set<SpecialFlags>(),
        /*
         * PLL-only data:
         */
        algorithms: this.algorithms
      });
    } else {
      cubeState.invalidInput = this.invalidInput;
    }

    return cubeState;
  }


  interpretCodeBlock(): void {

    let dimensions = this.userInput.getDimensions();
    if (dimensions) {
      const result = Parse.toDimensions(dimensions);
      if (result.success) {
        this.cubeDimensions = result.data;
      } else {
        this.setInvalidInput(result.error);
      }
    }

    let cubeColor = this.userInput.getCubeColor();

    if (cubeColor) {
      const result = Parse.toCubeColor(cubeColor);
      if (result.success) {
        this.cubeColor = result.data;
      } else {
        this.setInvalidInput(result.error);
      }
    }

    let arrowColor = this.userInput.getArrowColor();

    if (arrowColor) {
      const result = Parse.toArrowColor(arrowColor);
      if (result.success) {
        this.arrowColor = result.data;
      } else {
        this.setInvalidInput(result.error);
      }
    }

    let arrows = this.userInput.getArrows();

    if (arrows) {
      const result = Parse.toArrows(arrows);
      if (result.success) {
        this.arrows = result.data;
      } else {
        this.setInvalidInput(result.error);
      }
    }

    let algorithms = this.userInput.getAlgorithms();

    if (algorithms) {
      algorithms.forEach(algorithm => {
          const result = Parse.toAlgorithm(algorithm);
          if (result.success) {
            this.algorithms.add(result.data);
          } else {
            this.setInvalidInput(result.error);
          }
        }
      )
    }

    let flags = this.userInput.getFlags();

    if (flags) {
      const result = Parse.toFlags(flags);
      if (result.success) {
        this.specialFlags = result.data;
      } else {
        this.setInvalidInput(result.error);
      }
    }
  }

  setupCubeRectangleCenterCoordinates()
    :
    void {
    this.stickerCoordinates = Build.stickerCoordinates(this.cubeDimensions, 50);
  }
}

export class CodeBlockInterpreterOLL extends CodeBlockInterpreter {
  cubeColor: string;
  ollFieldInput!: OllFieldColoring;
  // algorithmToArrowsInput: string[] = [];
  initialAlgorithmSelectionHash: string;

  constructor(userInput: UserInput, settings: RubikCubeAlgoSettingsTab) {
    super(userInput, settings);
    this.cubeColor = settings.cubeColor ?? DefaultSettings.CUBE_COLOR;
  }

  setupOll(): CubeStateOLL {
    super.setup();

    let cubeState: CubeStateOLL = new CubeStateOLL(this.userInput);

    if (this.codeBlockInterpretationSuccessful) {
      Object.assign(cubeState, {
        /*
         * Generic data:
         */
        dimensions: this.cubeDimensions,
        backgroundColor: '#000',
        arrowColor: this.arrowColor,
        viewBoxDimensions: {
          width: this.cubeDimensions.width * 100 + 100,
          height: this.cubeDimensions.height * 100 + 100
        },
        specialFlags: this.specialFlags ?? new Set<SpecialFlags>(),
        /*
         * OLL-only data:
         */
        algorithmToArrows: this.setupAlgorithmArrowMap(),
        selectedAlgorithmHash: this.initialAlgorithmSelectionHash,
        ollFieldColors: this.ollFieldInput
      });
    } else {
      cubeState.invalidInput = this.invalidInput;
    }

    return cubeState;
  }


  /**
   * @param str - gets checked
   * @returns true if given string starts and ends with '.'
   */
  private isWrappedInDots = (str: string): boolean => str.startsWith('.') && str.endsWith('.');

  interpretCodeBlock(): void {

    let rawOllInput = this.userInput.getUndeclared();

    if (!rawOllInput || rawOllInput.length < 4) {
      return super.setInvalidInput(new InvalidInput("[not enough input]", "Input for OLL should contain at least 4 lines!"));
    }

    let flags = this.userInput.getFlags();

    if (flags) {
      const result = Parse.toFlags(flags);
      if (result.success) {
        this.specialFlags = result.data;
      } else {
        this.setInvalidInput(result.error);
      }
    }


    const firstRow = rawOllInput[0]!;
    const lastRow = rawOllInput[rawOllInput.length - 1]!;

    if (!this.isWrappedInDots(firstRow) || !this.isWrappedInDots(lastRow)) {
      return super.setInvalidInput(new InvalidInput(firstRow, `First '${firstRow}' and last '${lastRow}' line should start and end on a dot ('.')!`));
    }

    let expectedWidth: number = rawOllInput[0]!.length;

    this.ollFieldInput = new OllFieldColoring();
    this.cubeDimensions = new Dimensions(expectedWidth - 2, rawOllInput.length - 2);

    for (let i: number = 0; i < rawOllInput.length; i++) {
      const row: string = rawOllInput[i]!.trim();

      if (row.length !== expectedWidth) {
        return super.setInvalidInput(new InvalidInput(row, `Invalid row length! Expected ${expectedWidth} characters but found ${row.length}.`));
      }

      const parsedRow = row.split('').map((char: string, x: number): string => {
        if (char === '.') return '-1';
        const isEdge = (x === 0 || x === row.length - 1 || i === 0 || i === rawOllInput.length - 1);
        // Side stickers are lowercase, Top stickers are uppercase
        return isEdge ? char.toLowerCase() : char.toUpperCase();
      });

      this.ollFieldInput.addRow(parsedRow);
    }
  }

  setupCubeRectangleCenterCoordinates(): void {
    this.stickerCoordinates = Build.stickerCoordinates(this.cubeDimensions, 100);
  }

  setupAlgorithmArrowMap(): MappedAlgorithms {

    let algorithms = this.userInput.getAlgorithms();

    const map = new MappedAlgorithms();

    if (algorithms) {
      algorithms.forEach((row: string) => {
        const [algInput, arrowInput] = row.split(/ *== */);

        const result = Parse.toAlgorithm(algInput!);
        if (result.success) {
          let matchingArrows: Arrows = [];
          if (arrowInput) {
            let toArrows = Parse.toArrows(arrowInput);
            if (toArrows.success) matchingArrows = super.setupArrowCoordinates(toArrows.data);
          }
          let algorithm = result.data;
          if (!this.initialAlgorithmSelectionHash) {
            this.initialAlgorithmSelectionHash = algorithm.initialHash;
          }
          map.add(new MappedAlgorithm(algorithm, matchingArrows));
        } else {
          this.setInvalidInput(result.error);
        }
      });
    }


    return map;
  }
}
