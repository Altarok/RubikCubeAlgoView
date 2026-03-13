import {ArrowCoords, Arrows, Coordinates, Dimensions, StickerCoords} from "../model/geometry";
import {CubeColors} from "../RubikCubeAlgoSettings";
import {InvalidInput, UserInput} from "../model/codeblock-input";
import {Algorithms, MappedAlgorithm, MappedAlgorithms} from "../model/algorithms";
import {CubeStatePLL, CubeStateOLL} from "../model/cube-state";
import {Parse} from "./parser";
import {OllFieldColoring} from "../model/oll-field-coloring";
import {Build} from "./geometry-builder";
import {FlagType} from "../model/flags";


class CodeBlockInterpreter {
  /** cube's dimensions (stickers, not pixels) */
  cubeDimensions: Dimensions = Dimensions.default();
  codeBlockInterpretationFailed: boolean = false;
  invalidInput?: InvalidInput;
  stickerCoordinates: StickerCoords;
  arrowColor!: string;
  cubeColor!: string;
  specialFlags = new Set<FlagType>();
  initialAlgorithmSelectionHash: string;

  constructor(protected readonly userInput: UserInput, colors: CubeColors) {
    if (userInput.isEmpty) {
      this.setInvalidInput(new InvalidInput("[empty]", "At least 1 parameter needed: 'dimension/cubeColor/arrowColor/arrows'"));
    }
    this.setupArrowColor(colors.arrow);
    this.setupCubeColor(colors.cube);
    this.setupFlags();
  }

  /**
   * Called when the interpretation of a code block failed.
   * @param {InvalidInput} errData - contains invalid input and description of problem
   */
  setInvalidInput(errData: InvalidInput): void {
    console.warn(`Failed to parse code block. Error: ${errData.toString()}`);
    this.codeBlockInterpretationFailed = true;
    this.invalidInput = errData;
  }

  private setupArrowColor(backupValue: string) {
    this.arrowColor = backupValue;
    if (this.codeBlockInterpretationFailed) return;

    let arrowClrInput = this.userInput.getArrowColor();
    if (arrowClrInput) {
      const result = Parse.toArrowColor(arrowClrInput);
      if (result.success) this.arrowColor = result.data;
      else this.setInvalidInput(result.error);
    }
  }

  private setupCubeColor(backupValue: string): void {
    this.cubeColor = backupValue;
    if (this.codeBlockInterpretationFailed) return;

    let cubeClrInput = this.userInput.getCubeColor();
    if (cubeClrInput) {
      const result = Parse.toCubeColor(cubeClrInput);
      if (result.success) this.cubeColor = result.data;
      else this.setInvalidInput(result.error);
    }
  }

  private setupFlags(): void {
    this.specialFlags.add('default');
    if (this.codeBlockInterpretationFailed) return;

    let flags = this.userInput.getFlags();
    if (flags) {
      const result = Parse.toFlags(flags);
      if (result.success) this.specialFlags = result.data;
      else this.setInvalidInput(result.error);
    }
  }

  setupCubeDimensions(): void {
    let dimensions = this.userInput.getDimensions();
    if (dimensions) {
      const result = Parse.toDimensions(dimensions);
      if (result.success) {
        this.cubeDimensions = result.data;
      } else {
        this.setInvalidInput(result.error);
      }
    }
  }

  setupArrowCoordinates(input: string[]): Arrows {
    if (this.codeBlockInterpretationFailed) return [];

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

  /**
   * @param str - gets checked
   * @returns true if given string starts and ends with '.'
   */
  private isWrappedInDots = (str: string): boolean => str.startsWith('.') && str.endsWith('.');

  setupRawOllInput(ollFieldInput: OllFieldColoring): void {
    if (this.codeBlockInterpretationFailed) return;

    let rawOllInput = this.userInput.getUndeclared();

    if (!rawOllInput || rawOllInput.length < 4) {
      return this.setInvalidInput(new InvalidInput("[not enough input]", "Input for OLL should contain at least 4 lines!"));
    }

    const firstRow = rawOllInput[0]!;
    const lastRow = rawOllInput[rawOllInput.length - 1]!;

    if (!this.isWrappedInDots(firstRow) || !this.isWrappedInDots(lastRow)) {
      return this.setInvalidInput(new InvalidInput(firstRow, `First '${firstRow}' and last '${lastRow}' line should start and end on a dot ('.')!`));
    }

    let expectedWidth: number = rawOllInput[0]!.length;

    this.cubeDimensions = new Dimensions(expectedWidth - 2, rawOllInput.length - 2);

    for (let i: number = 0; i < rawOllInput.length; i++) {
      const row: string = rawOllInput[i]!.trim();

      if (row.length !== expectedWidth) {
        return this.setInvalidInput(new InvalidInput(row, `Invalid row length! Expected ${expectedWidth} characters but found ${row.length}.`));
      }

      const parsedRow = row.split('').map((char: string, x: number): string => {
        if (char === '.') return '-1';
        const isEdge = (x === 0 || x === row.length - 1 || i === 0 || i === rawOllInput.length - 1);
        // Side stickers are lowercase, Top stickers are uppercase
        return isEdge ? char.toLowerCase() : char.toUpperCase();
      });

      ollFieldInput.addRow(parsedRow);
    }
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
            if (toArrows.success) matchingArrows = this.setupArrowCoordinates(toArrows.data);
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

export function createPllCube(userInput: UserInput, colors: CubeColors): CubeStatePLL {

  const interpreter = new CodeBlockInterpreter(userInput, colors);

  let algorithms: Algorithms = new Algorithms();
  let arrows: string[] = [];

  interpreter.setupCubeDimensions();

  let arrowsInput = userInput.getArrows();
  if (arrowsInput) {
    const result = Parse.toArrows(arrowsInput);
    if (result.success) {
      arrows = result.data;
    } else {
      interpreter.setInvalidInput(result.error);
    }
  }

  let algorithmsInput = userInput.getAlgorithms();
  if (algorithmsInput) {
    algorithmsInput.forEach(algorithm => {
        const result = Parse.toAlgorithm(algorithm);
        if (result.success) {
          algorithms.add(result.data);
        } else {
          interpreter.setInvalidInput(result.error);
        }
      }
    )
  }

  interpreter.stickerCoordinates = Build.stickerCoordinates(interpreter.cubeDimensions, 50);

  let arrowCoordinates: Arrows = interpreter.setupArrowCoordinates(arrows);

  let cubeState: CubeStatePLL = new CubeStatePLL(userInput);

  if (!interpreter.codeBlockInterpretationFailed) {
    Object.assign(cubeState, {
      /*
       * Generic data:
       */
      dimensions: interpreter.cubeDimensions,
      backgroundColor: interpreter.cubeColor,
      arrowColor: interpreter.arrowColor,
      arrowCoordinates: arrowCoordinates,
      viewBoxDimensions: {
        width: interpreter.cubeDimensions.width * 100,
        height: interpreter.cubeDimensions.height * 100
      },
      specialFlags: interpreter.specialFlags,
      /*
       * PLL-only data:
       */
      algorithms: algorithms
    });
  } else {
    cubeState.invalidInput = interpreter.invalidInput;
  }

  return cubeState;

}

export function createOllCube(userInput: UserInput, colors: CubeColors): CubeStateOLL {

  const interpreter = new CodeBlockInterpreter(userInput, colors);
  const ollFieldInput = new OllFieldColoring(interpreter.cubeColor);

  /*
   * this.cubeDimensions gets set up in here
   */
  interpreter.setupRawOllInput(ollFieldInput);

  interpreter.stickerCoordinates = Build.stickerCoordinates(interpreter.cubeDimensions, 100);

  let cubeState: CubeStateOLL = new CubeStateOLL(userInput/*, ollFieldInput*/);

  let mappedAlgorithms: MappedAlgorithms = interpreter.setupAlgorithmArrowMap();

  if (!interpreter.codeBlockInterpretationFailed) {
    Object.assign(cubeState, {
      /*
       * Generic data:
       */
      dimensions: interpreter.cubeDimensions,
      backgroundColor: '#000',
      arrowColor: interpreter.arrowColor,
      viewBoxDimensions: {
        width: interpreter.cubeDimensions.width * 100 + 100,
        height: interpreter.cubeDimensions.height * 100 + 100
      },
      specialFlags: interpreter.specialFlags,
      /*
       * OLL-only data:
       */
      algorithmToArrows: mappedAlgorithms,
      selectedAlgorithmHash: interpreter.initialAlgorithmSelectionHash,
      ollFieldInput: ollFieldInput
    });
  } else {
    cubeState.invalidInput = interpreter.invalidInput;
  }

  return cubeState;
}
