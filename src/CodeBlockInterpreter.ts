import {ArrowCoords, Arrows, Coordinates} from "./model/geometry";
import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";
import {InvalidInput} from "./model/invalid-input";
import {Algorithm, Algorithms, MappedAlgorithm, MappedAlgorithms} from "./model/algorithms";
import {CubeStatePLL, CubeStateOLL} from "./model/cube-state";
import {AlgorithmParser} from "./parser/algorithm-parser";
import {OllFieldColoring} from "./model/oll-field-coloring";

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

/**
 * Shared Utilities
 */
const parseHexColor = (input: string): string | null => {
  const hex = input.split(' ')[0]?.split(':')[1];
  return hex?.match(/^([a-f0-9]{3}){1,2}$/i) ? `#${hex}` : null;
};

const isPositiveIntegerRegex = new RegExp('\\d+');


export abstract class CodeBlockInterpreter {
  /** cube width (rectangles, not pixels) */
  protected cubeWidth: number = DEFAULT.WIDTH;
  /** cube height (rectangles, not pixels) */
  protected cubeHeight: number = DEFAULT.HEIGHT;
  protected codeBlockInterpretationSuccessful: boolean = true;
  protected invalidInput: InvalidInput;
  protected cubeletCoordinates: Coordinates[] = [];
  protected arrowColor: string;

  protected constructor(protected readonly codeBlockContent: string[], settings: RubikCubeAlgoSettingsTab) {
    if (codeBlockContent.length === 0) {
      this.setInvalidInput(new InvalidInput("[empty]", "At least 1 parameter needed: 'dimension/cubeColor/arrowColor/arrows'"));
    }
    this.arrowColor = settings.arrowColor ?? DEFAULT_SETTINGS.ARROW_COLOR;
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

  protected addCoordinates(coords: Coordinates): void {
    this.cubeletCoordinates.push(coords);
  }

  /**
   * Called when the interpretation of a code block failed.
   * @param {string} lineWithError - the row containing un-interpretable input
   * @param {string} reason - human-readable reason for failure
   */
  setError(lineWithError: string, reason: string): void {
    this.setInvalidInput(new InvalidInput(lineWithError, reason));
  }

  setInvalidInput(errData: InvalidInput): void {
    this.codeBlockInterpretationSuccessful = false;
    this.invalidInput = errData;
  }

  setupArrowCoordinates(arrowInput: string | undefined): Arrows {
    const arrows: Arrows = []; /* method's return value: */
    if (!arrowInput) return arrows;
    const completeArrowsInput: string[] = arrowInput.split(',').filter((x) => x.length > 0);

    for (const segment of completeArrowsInput) {
      const isDoubleSided = segment.includes('+');
      const parts = segment.split(/[+-]/); // Split on either + or -

      if (parts.length < 2) continue;

      const [from, to] = parts;
      const arrowStart: Coordinates = this.getCubeletCenterCoordinates(from!);
      const arrowEnd: Coordinates = this.getCubeletCenterCoordinates(to!);

      if (arrowStart === arrowEnd) {
        this.setInvalidInput(InvalidInput.ofArrows(arrowInput, `Arrow ${segment} is pointing to itself.`));
        continue;
      }

      arrows.push(new ArrowCoords(arrowStart, arrowEnd));

      if (isDoubleSided) { // add reverse copy
        arrows.push(new ArrowCoords(arrowEnd, arrowStart));
      }
    }
    return arrows;
  }


  /**
   * @param input - arrow coordinates like '3.2' where the first integer is the row, the second integer is the column or just a single integer
   * @returns coordinates of center of cubelet the input is pointing to
   */
  private getCubeletCenterCoordinates(input: string): Coordinates {
    let indexOfCubeletCenter = 0;
    if (isPositiveIntegerRegex.test(input)) {
      indexOfCubeletCenter = Number(input);
    } else if (input.includes('.')) {
      const parts = input.split('.');
      const row = parseInt(parts[0] ?? '1', 10);
      const col = parseInt(parts[1] ?? '1', 10);
      indexOfCubeletCenter = (row - 1) * this.cubeWidth + col;
    } else {
      indexOfCubeletCenter = parseInt(input, 10) || 0;
    }

    // Safety check
    const coords = this.cubeletCoordinates[indexOfCubeletCenter];

    if (!coords) {
      // Fallback to a default (like 0,0 or the first cubelet)
      // to prevent the whole SVG from failing to render
      console.warn(`Invalid cubelet index requested: ${input}`);
      return this.cubeletCoordinates[1] ?? new Coordinates(0, 0);
    }

    return this.cubeletCoordinates[indexOfCubeletCenter]!;
  }

  /**
   * @param {string} row - string starting with 'arrowColor:'
   */
  handleArrowColorInput(row: string): void {
    if (row.match('^arrowColor:([a-f0-9]{3}){1,2}( //.*)?')) {
      // @ts-ignore checked with regex
      let newAroClr = row.split(' ')[0].trim().replace('arrowColor:', '')
      // console.log("new arrow color: '"+newAroClr+"'");
      this.arrowColor = '#' + newAroClr;
    } else {
      this.setInvalidInput(InvalidInput.ofArrowColor(row));
    }
  }

  static get3by3PllTemplate = () => DEFAULT.PLL_TEMPLATE;

  static get3by3OllTemplate = () => DEFAULT.OLL_TEMPLATE;
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
      /*
       * Generic data:
       */
      cubeState.cubeWidth = this.cubeWidth;
      cubeState.cubeHeight = this.cubeHeight;
      cubeState.backgroundColor = this.cubeColor;
      cubeState.arrowColor = this.arrowColor;
      cubeState.arrowCoordinates = arrowCoordinates;
      cubeState.viewBoxDimensions = {width: this.cubeWidth * 100, height: this.cubeHeight * 100};
      /*
       * PLL-only data:
       */
      cubeState.algorithms = this.algorithms;
    } else {
      cubeState.invalidInput = this.invalidInput;
    }

    return cubeState;
  }

  /* @formatter:off */

  interpretCodeBlock(rows: string[]): void {
    for (const row of rows) {
      const trimmed = row.trim();
      if (!trimmed || trimmed.startsWith('//')) continue;

      const [command] = trimmed.split(':');

      switch (command) {
        case 'dimension':   this.handleDimensionsInput(trimmed); break;
        case 'cubeColor':   this.handleCubeColorInput(trimmed); break;
        case 'arrowColor': super.handleArrowColorInput(trimmed); break;
        case 'arrows':      this.handleArrowsInput(trimmed); break;
        case 'alg':         this.handleAlgorithmInput(trimmed); break;
        default:
          return this.setInvalidInput(InvalidInput.ofUnknownPllParameter(trimmed));
      }
    }
  }

  /* @formatter:on */

  /**
   * @param {string} row - string starting with 'arrows:'
   */
  handleArrowsInput(row: string): void {
    this.arrowsLine = row;
    if (row.match('^arrows:\\d+(\\.\\d+)?(-|\\+)\\d+(\\.\\d+)?(,\\d+(\\.\\d+)?(-|\\+)\\d+(\\.\\d+)?)*( //.*)?')) {
      /* do not parse yet, another line may still brake the input which makes the calculation obsolete */
      // @ts-ignore checked with regex
      this.arrows = row.split(' ')[0].trim().replace('arrows:', '');
    } else {
      this.setInvalidInput(InvalidInput.ofArrowColor(row));
    }
  }

  setupCubeRectangleCenterCoordinates(): void {
    this.addCoordinates(new Coordinates(-1, -1)); /* unused first entry to start arrows with 1 instead of 0 */
    /* reverse loop order to give x coordinates priority */
    for (let h: number = 0; h < this.cubeHeight; h++) {
      for (let w: number = 0; w < this.cubeWidth; w++) {
        this.addCoordinates(new Coordinates(w * 100 + 50, h * 100 + 50));
      }
    }
  }

  /**
   * @param row string starting with 'dimension:'
   */
  private handleDimensionsInput(row: string): void {
    const dims: number[] | undefined = row.replace('dimension:', '') // cut prefix
    .split(' ')[0]?. // cut comments
    split(',') // split width and height
    .map(Number);
    if (dims?.length === 2 && dims.every(n => n >= 2 && n <= 10)) {
      [this.cubeWidth, this.cubeHeight] = [dims[0]!, dims[1]!];
    } else {
      this.setInvalidInput(InvalidInput.ofDimensions(row));
    }

    const data = row.split(' ')[0]?.replace('dimension:', '');
    const [w, h] = (data?.split(',') ?? []).map(Number);

    if (!w || !h || w < 2 || w > 10 || h < 2 || h > 10) {
      return this.setInvalidInput(InvalidInput.ofDimensions(row));
    }

    [this.cubeWidth, this.cubeHeight] = [w, h];
  }

  /**
   * @param {string} row - string starting with 'cubeColor:'
   */
  private handleCubeColorInput(row: string): void {
    const hex: string | undefined = row.split(' ')[0]?.replace('cubeColor:', '');
    if (hex?.match(/^([a-f0-9]{3}){1,2}$/)) {
      this.cubeColor = `#${hex}`;
    } else {
      this.setInvalidInput(InvalidInput.ofCubeColor(row));
    }
  }

  /**
   * @param {string} row - string starting with 'alg:'
   */
  private handleAlgorithmInput(row: string): void {
    const data: Algorithm | InvalidInput = new AlgorithmParser().parse(row);
    if (data instanceof InvalidInput) {
      this.setInvalidInput(data);
    } else /* if (data instanceof Algorithm) */ {
      this.algorithms.add(data);
    }
  }
}

export class CodeBlockInterpreterOLL extends CodeBlockInterpreter {
  cubeColor: string;
  ollFieldInput!: OllFieldColoring;
  algorithmToArrowsInput: string[] = [];
  startingAlgorithm: number = 0;

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
        cubeWidth: this.cubeWidth,
        cubeHeight: this.cubeHeight,
        backgroundColor: '#000',
        arrowColor: this.arrowColor,
        viewBoxDimensions: {width: this.cubeWidth * 100 + 100, height: this.cubeHeight * 100 + 100},
        /*
         * OLL-only data:
         */
        algorithmToArrows: this.setupAlgorithmArrowMap(),
        currentAlgorithmIndex: 0,
        ollFieldColors: this.ollFieldInput
      });
    } else {
      cubeState.invalidInput = this.invalidInput;
    }

    return cubeState;
  }

  private removeNonCubeFieldInput(rows: string[]): string[] {
    return rows
    .filter(row => !row.startsWith('//')) // ignore comments
    .map(row => {
      if (row.startsWith('alg:')) {
        this.algorithmToArrowsInput.push(row.replace('alg:', '').trim());
        return null; // Mark for removal
      }
      return row;
    })
    .filter((row): row is string => row !== null);
  }

  private isWrappedInDots = (str: string): boolean => str.startsWith('.') && str.endsWith('.');

  interpretCodeBlock(rows: string[]): void {
    if (rows.length < 4) {
      return super.setInvalidInput(new InvalidInput("[not enough input]", "Input for OLL should contain at least 4 lines!"));
    }

    if (!this.isWrappedInDots(rows[0]!) || !this.isWrappedInDots(rows[rows.length - 1]!)) {
      return super.setInvalidInput(new InvalidInput(rows[0]!, `First '${rows[0]}' and last '${rows[rows.length - 1]}' line should start and end on a dot ('.')!`));
    }

    const rawOllInput: string[] = this.removeNonCubeFieldInput(rows);

    let expectedWidth: number = rawOllInput[0]!.length;
    this.ollFieldInput = new OllFieldColoring(expectedWidth);

    this.cubeWidth = rawOllInput[0]!.length - 2;
    this.cubeHeight = rawOllInput.length - 2;

    for (let rowIndex: number = 0; rowIndex < rawOllInput.length; rowIndex++) {
      let row: string = rawOllInput[rowIndex]!.trim();

      if (row.length !== expectedWidth) {
        return super.setInvalidInput(new InvalidInput(row, `Inconsistent row length! Expected ${expectedWidth} characters but found ${row.length}.`));
      }

      let parsedRow: string[] = new Array<string>();
      let index: number = 0;
      for (let i: number = 0; i < row.length; i++) {
        let clr: string = row[i]!;
        if (clr === '.') {
          parsedRow[index++] = '-1';
        } else if (i === 0 || rowIndex === 0 || rowIndex === rawOllInput.length - 1 || i === row.length - 1) {
          parsedRow[index++] = clr.toLowerCase(); // side stickers
        } else {
          parsedRow[index++] = clr.toUpperCase(); // top stickers
        }
      }
      this.ollFieldInput.addRow(parsedRow);
    }
  }

  setupCubeRectangleCenterCoordinates(): void {
    this.addCoordinates(new Coordinates(-1, -1)); /* unused first entry to start arrows with 1 instead of 0 */
    /* reverse loop order to give x coordinates more priority */
    for (let h: number = 0; h < this.cubeHeight; h++) {
      for (let w: number = 0; w < this.cubeWidth; w++) {
        this.addCoordinates(new Coordinates(w * 100 + 100, h * 100 + 100));
      }
    }
  }

  private setupAlgorithmArrowMap(): MappedAlgorithms {
    /* Method's return value: */
    const map: MappedAlgorithms = new MappedAlgorithms();

    // console.debug('>> setupAlgorithmArrowMap');

    for (let i: number = 0; i < this.algorithmToArrowsInput.length; i++) {
      let row: string = this.algorithmToArrowsInput[i]!;

      const splits = row.split(/ *== */);

      // console.debug('-- splits: ' + splits);

      if (splits.length < 2) {
        this.setInvalidInput(new InvalidInput(row, "Missing arrow mapping! Use 'alg:[algorithm] == [arrows]'"));
        return map;
      }

      const algInput: string = splits[0]!;
      const arrowInput: string | undefined = splits[1];

      // console.log('splits: ' + splits);
      let data: Algorithm | InvalidInput = new AlgorithmParser().parse(algInput);

      let algorithm: Algorithm;
      let matchingArrows: Arrows;

      if (data instanceof InvalidInput) {
        this.setInvalidInput(data);
      } else /* if (data instanceof Algorithm) */ {
        algorithm = data;
        matchingArrows = super.setupArrowCoordinates(arrowInput);

        console.debug('Add algorithm : ' + algorithm.toString());

        map.add(i, new MappedAlgorithm(algorithm, matchingArrows));
        this.startingAlgorithm = 0;
      }
    }

    return map;
  }
}
