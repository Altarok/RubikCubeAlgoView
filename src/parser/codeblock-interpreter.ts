import {ArrowCoords, Arrows, Coordinates, Dimensions} from "../model/geometry";
import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "../RubikCubeAlgoSettings";
import {InvalidInput} from "../model/invalid-input";
import {Algorithms, MappedAlgorithm, MappedAlgorithms, SpecialFlags} from "../model/algorithms";
import {CubeStatePLL, CubeStateOLL} from "../model/cube-state";
import {Parse} from "./parser";
import {OllFieldColoring} from "../model/oll-field-coloring";

const DEFAULT = {
  WIDTH: 3, /* default rubik cube width  */
  HEIGHT: 3, /* default rubik cube height */
  OLL_TEMPLATE:
    `
\`\`\`rubikCubeOLL
.000.
01101
10101
01101
.000.
\`\`\`
    
\`\`\`rubikCubeOLL
.rrg.
bwwrw
wgwbw
owwbw
.goo.
\`\`\`
`,
  PLL_TEMPLATE:
    `
\`\`\`rubikCubePLL
dimension:3,3 // width,height
cubeColor:ff0 // yellow cube, optional parameter
arrowColor:08f // sky blue arrows, optional parameter
arrows:1.1-1.3,7+9 // normal arrow in top row, double-sided arrow in lower row
\`\`\`
`
} as const;

const isPositiveIntegerRegex = new RegExp('\\d+');

export abstract class CodeBlockInterpreter {
  /** cube's dimensions (stickers, not pixels) */
  protected cubeDimensions: Dimensions = new Dimensions(DEFAULT.WIDTH, DEFAULT.HEIGHT);
  protected codeBlockInterpretationSuccessful: boolean = true;
  protected invalidInput?: InvalidInput;
  protected stickerCoordinates: Coordinates[] = [];
  protected arrowColor: string;
  protected specialFlags: SpecialFlags[] = [];

  protected constructor(protected readonly codeBlockContent: string[], settings: RubikCubeAlgoSettingsTab) {
    this.arrowColor = settings.arrowColor ?? DEFAULT_SETTINGS.ARROW_COLOR;
    if (codeBlockContent.length === 0) {
      this.setInvalidInput(new InvalidInput("[empty]", "At least 1 parameter needed: 'dimension/cubeColor/arrowColor/arrows'"));
    }
  }

  /**
   * Called when the interpretation of a code block failed.
   * @param {InvalidInput} errData - contains invalid input and description of problem
   */
  setInvalidInput(errData: InvalidInput): void {
    this.codeBlockInterpretationSuccessful = false;
    this.invalidInput = errData;
  }

  setup(): void {
    /* Keep order of the following 3 functions */
    if (!this.codeBlockInterpretationSuccessful) {
      return;
    }
    this.interpretCodeBlock(this.codeBlockContent);
    this.setupCubeRectangleCenterCoordinates();
  }

  /**
   * This must include calculating the cube dimensions
   *
   * @param {string[]} rows - code block content
   */
  abstract interpretCodeBlock(rows: string[]): void;

  /**
   * Calculate coordinates of all cube rectangles.
   * Mandatory preparation for arrow coordinates calculation.
   */
  abstract setupCubeRectangleCenterCoordinates(): void;

  setupArrowCoordinates(arrowInput?: string): Arrows {
    if (!arrowInput) return [];

    return arrowInput.split(',')
    .filter(Boolean)
    .flatMap((segment) => {
      const isDoubleSided = segment.includes('+');
      const parts = segment.split(/[+-]/); // Split on + OR -

      // Map the string IDs to their coordinate objects immediately
      const coords = parts.map(id => this.getStickerCenterCoordinates(id));

      if (isDoubleSided && coords.length === 2) {
        const [start, end] = coords;
        return [new ArrowCoords(start, end), new ArrowCoords(end, start)];
      }

      const arrows: ArrowCoords[] = [];
      for (let i = 0; i < coords.length - 1; i++) {
        arrows.push(new ArrowCoords(coords[i], coords[i + 1]));
      }

      // chained arrows
      if (coords.length > 2) {
        arrows.push(new ArrowCoords(coords[coords.length - 1], coords[0]));
      }

      return arrows;
    }, []);
  }

  /**
   * @param input - arrow coordinates like '3.2' where the first integer is the row, the second integer is the column or just a single integer
   * @returns coordinates of center of sticker the input is pointing to
   */
  private getStickerCenterCoordinates(input: string): Coordinates {
    let indexOfCubeletCenter: number;
    if (isPositiveIntegerRegex.test(input)) {
      indexOfCubeletCenter = Number(input);
    } else if (input.includes('.')) {
      const parts = input.split('.');
      const row = parseInt(parts[0] ?? '1', 10);
      const col = parseInt(parts[1] ?? '1', 10);
      indexOfCubeletCenter = (row - 1) * this.cubeDimensions.width + col;
    } else {
      indexOfCubeletCenter = (parseInt(input, 10) || 1);
    }

    // Safety check
    const coords = this.stickerCoordinates[indexOfCubeletCenter - 1];

    if (!coords) {
      // Fallback to a default (like 0,0 or the first cubelet)
      // to prevent the whole SVG from failing to render
      console.warn(`Invalid cubelet index requested: ${input}`);
      return this.stickerCoordinates[1] ?? new Coordinates(0, 0);
    }

    return this.stickerCoordinates[indexOfCubeletCenter - 1]!;
  }

  static get3by3PllTemplate = (): string => DEFAULT.PLL_TEMPLATE;

  static get3by3OllTemplate = (): string => DEFAULT.OLL_TEMPLATE;
}

export class CodeBlockInterpreterPLL extends CodeBlockInterpreter {
  cubeColor: string;
  algorithms: Algorithms = new Algorithms();
  arrowsLine: string = '';
  arrows: string = '';

  constructor(codeBlockContent: string[], settings: RubikCubeAlgoSettingsTab) {
    super(codeBlockContent, settings);
    this.cubeColor = settings.cubeColor ?? DEFAULT_SETTINGS.CUBE_COLOR;
  }

  setupPll(): CubeStatePLL {
    super.setup();

    let arrowCoordinates: Arrows = super.setupArrowCoordinates(this.arrows);

    let cubeState: CubeStatePLL = new CubeStatePLL(this.codeBlockContent);

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
        specialFlags: this.specialFlags,
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

  /* @formatter:off */

  interpretCodeBlock(rows: string[]): void {
    for (const row of rows.map(r => r.trim())) {
      if (!row || row.startsWith('//')) continue;

      const [command] = row.split(':');

      switch (command) {
        case 'dimension': {
          const result = Parse.toDimensions(row);
          if (result.success) {
            this.cubeDimensions = result.data;
          } else {
            this.setInvalidInput(result.error);
          }
        }
          break;
        case 'cubeColor': {
          const result = Parse.toCubeColor(row);
          if (result.success) {
            this.cubeColor = result.data;
          } else {
            this.setInvalidInput(result.error);
          }
        }
          break;
        case 'arrowColor': {
          const result = Parse.toArrowColor(row);
          if (result.success) {
            this.arrowColor = result.data;
          } else {
            this.setInvalidInput(result.error);
          }
        }
          break;
        case 'arrows': {
          this.arrowsLine = row;
          const result = Parse.toArrows(row);
          if (result.success) {
            this.arrows = result.data;
          } else {
            this.setInvalidInput(result.error);
          }
        }
          break;
        case 'alg': {
          const result = Parse.toAlgorithm(row);
          if (result.success) {
            this.algorithms.add(result.data);
          } else {
            this.setInvalidInput(result.error);
          }
        }
          break;
        case 'flags': {
          const result = Parse.toFlags(row);
          if (result.success) {
            this.specialFlags = result.data;
          } else {
            this.setInvalidInput(result.error);
          }
        }
          break;
        default:
          return this.setInvalidInput(InvalidInput.ofPllParameter(row));
      }
    }
  }


  /* @formatter:on */


  setupCubeRectangleCenterCoordinates(): void {
    // this.addCoordinates(new Coordinates(-1, -1)); /* unused first entry to start arrows with 1 instead of 0 */
    /* reverse loop order to give x coordinates priority */
    for (let h: number = 0; h < this.cubeDimensions.height; h++) {
      for (let w: number = 0; w < this.cubeDimensions.width; w++) {
        this.stickerCoordinates.push(new Coordinates(w * 100 + 50, h * 100 + 50));
      }
    }
  }
}

export class CodeBlockInterpreterOLL extends CodeBlockInterpreter {
  cubeColor: string;
  ollFieldInput!: OllFieldColoring;
  algorithmToArrowsInput: string[] = [];
  initialAlgorithmSelectionHash: string;

  constructor(rows: string[], settings: RubikCubeAlgoSettingsTab) {
    super(rows, settings);
    this.cubeColor = settings.cubeColor ?? DEFAULT_SETTINGS.CUBE_COLOR;
  }

  setupOll(): CubeStateOLL {
    super.setup();

    let cubeState: CubeStateOLL = new CubeStateOLL(this.codeBlockContent);

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
        specialFlags: this.specialFlags,
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

  private removeNonCubeFieldInput(rows: string[]): string[] {
    return rows.map(row => row.trim())
    .filter(row => row && !row.trim().startsWith('//')) // ignore comments
    .map(row => {
      if (row.startsWith('alg:')) {
        this.algorithmToArrowsInput.push(row.replace('alg:', '').trim());
        return null; // Mark for removal
      } else if (row.startsWith('flags:')) {
        const result = Parse.toFlags(row);
        if (result.success) {
          this.specialFlags = result.data;
        } else {
          this.setInvalidInput(result.error);
        }
        return null; // Mark for removal
      } else if (row.startsWith('//')) {
        return null; // Mark for removal
      }
      return row;
    }).filter((row): row is string => row !== null);
  }

  /**
   * @param str - gets checked
   * @returns true if given string starts and ends with '.'
   */
  private isWrappedInDots = (str: string): boolean => str.startsWith('.') && str.endsWith('.');

  interpretCodeBlock(rows: string[]): void {
    if (rows.length < 4) {
      return super.setInvalidInput(new InvalidInput("[not enough input]", "Input for OLL should contain at least 4 lines!"));
    }

    const rawOllInput: string[] = this.removeNonCubeFieldInput(rows);

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
    /* reverse loop order to give x coordinates more priority */
    for (let h: number = 0; h < this.cubeDimensions.height; h++) {
      for (let w: number = 0; w < this.cubeDimensions.width; w++) {
        this.stickerCoordinates.push(new Coordinates(w * 100 + 100, h * 100 + 100));
      }
    }
  }

  private setupAlgorithmArrowMap(): MappedAlgorithms {
    const map = new MappedAlgorithms();

    this.algorithmToArrowsInput.forEach((row: string) => {
        const [algInput, arrowInput] = row.split(/ *== */);

        const result = Parse.toAlgorithm(algInput!);
        if (result.success) {
          let matchingArrows: Arrows = [];
          if (arrowInput) {
            matchingArrows = super.setupArrowCoordinates(arrowInput);
          }
          let algorithm = result.data;
          if (!this.initialAlgorithmSelectionHash) {
            this.initialAlgorithmSelectionHash = algorithm.initialHash;
          }
          map.add(new MappedAlgorithm(algorithm, matchingArrows));
        } else {
          this.setInvalidInput(result.error);
        }
      }
    );
    return map;
  }
}
