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
    '\n```rubikCubeOLL\n.000.\n01101\n10101\n01101\n.000.\n```\n' +
    '\n```rubikCubeOLL\n.rrg.\nbwwrw\nwgwbw\nowwbw\n.goo.\n```\n',
  PLL_TEMPLATE: '\n```rubikCubePLL\n' +
    'dimension:3,3 // width,height\n' +
    'cubeColor:ff0 // yellow cube, optional parameter\n' +
    'arrowColor:08f // sky blue arrows, optional parameter\n' +
    'arrows:1.1-1.3,7+9 // normal arrow in top row, double-sided arrow in lower row\n' +
    '```\n'
} as const;

const isPositiveIntegerRegex = new RegExp('\\d+');

export abstract class CodeBlockInterpreter {
  /** cube width (rectangles, not pixels) */
  protected cubeWidth: number = DEFAULT.WIDTH;
  /** cube height (rectangles, not pixels) */
  protected cubeHeight: number = DEFAULT.HEIGHT;
  protected codeBlockInterpretationSuccessful: boolean = true;
  protected lastNonInterpretableLine: string;
  protected reasonForFailure: string;
  protected cubeletCoordinates: Coordinates[] = [];
  protected arrowColor: string;

  protected constructor(protected readonly codeBlockContent: string[], settings: RubikCubeAlgoSettingsTab) {
    if (codeBlockContent.length === 0) {
      this.errorInThisLine("[empty]", "at least 1 parameter needed: 'dimension/cubeColor/arrowColor/arrows'");
    }
    if (settings.arrowColor) {
      this.arrowColor = settings.arrowColor;
    } else {
      this.arrowColor = DEFAULT_SETTINGS.ARROW_COLOR;
    }
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
  errorInThisLine(lineWithError: string, reason: string): void {
    this.codeBlockInterpretationSuccessful = false;
    this.lastNonInterpretableLine = lineWithError;
    this.reasonForFailure = reason;
  }

  errorWhileParsing(errorData: InvalidInput): void {
    this.errorInThisLine(errorData.line, errorData.reason);
  }

  setupArrowCoordinates(arrowInput: string | undefined): Arrows {

    /* Method's return value: */
    let arrowCoordinates: Arrows = [];

    if (!arrowInput) return arrowCoordinates;

    let completeArrowsInput: string[] = arrowInput.split(',').filter((x) => x.length > 0);
    let isDoubleSided: boolean = false;

    for (let i: number = 0; i < completeArrowsInput.length; i++) {
      isDoubleSided = false;
      let singleArrowCoords: string = completeArrowsInput[i]!;

      let singleArrowCoordsSplit: string[];

      if (singleArrowCoords.match('\\d-\\d')) {
        singleArrowCoordsSplit = singleArrowCoords.split('-');
      } else if (singleArrowCoords.match('\\d\\+\\d')) {
        isDoubleSided = true;
        singleArrowCoordsSplit = singleArrowCoords.split('+');
      } else {
        this.errorInThisLine(arrowInput, `Invalid arrow format: '${singleArrowCoords}'. Use '-' for single or '+' for double-sided.`);
        continue;
      }

      if (singleArrowCoordsSplit.length < 2) {
        continue;
      }

      let singleArrowCoordsFrom: string = singleArrowCoordsSplit[0]!;
      let singleArrowCoordsTo: string = singleArrowCoordsSplit[1]!;

      let arrowStart: Coordinates = this.getCubeletCenterCoordinates(singleArrowCoordsFrom);
      let arrowEnd: Coordinates = this.getCubeletCenterCoordinates(singleArrowCoordsTo);

      // console.log('-- arrowEndRectIndex: ' + arrowEndRectIndex);


      if (arrowStart === arrowEnd) {
        // console.log("Skip arrow pointing to itself: " + singleArrowCoordsFrom);
        this.errorInThisLine(arrowInput, "arrow '" + singleArrowCoords + "' is pointing to its starting point");
        continue;
      }

      arrowCoordinates.push(new ArrowCoords(arrowStart, arrowEnd));

      if (isDoubleSided) { // add reverse copy
        arrowCoordinates.push(new ArrowCoords(arrowEnd, arrowStart));
      }
    }
    return arrowCoordinates;
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
      this.errorInThisLine(row, 'invalid, expected: "arrowColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
    }
  }

  static get3by3PllTemplate = () => DEFAULT.PLL_TEMPLATE;

  static get3by3OllTemplate = () => DEFAULT.OLL_TEMPLATE;
}

export class CodeBlockInterpreterPLL extends CodeBlockInterpreter {
  cubeColor: string;
  algorithms: Algorithms = new Algorithms();
  /** Nested array of coordinates. Contains start and end coordinates of arrows in pixels. */
    // arrowCoordinates: Arrows[];
  arrowsLine: string;
  arrows: string;

  constructor(rows: string[], settings: RubikCubeAlgoSettingsTab) {
    super(rows, settings);
    if (settings.cubeColor) {
      this.cubeColor = settings.cubeColor;
    } else {
      this.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
    }
    // this.arrowCoordinates = new Array<Arrows>();
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
      cubeState.invalidInput = new InvalidInput(this.lastNonInterpretableLine, this.reasonForFailure);
    }

    return cubeState;
  }

  /* @formatter:off */

  interpretCodeBlock(rows: string[]): void {
    for (let r: number = 0; r < rows.length; r++) {
      let row: string = rows[r]!; //console.log('interpret row: ' + row);
      if (row.startsWith('dimension:')) {          this.handleDimensionsInput(row);
      } else if (row.startsWith('cubeColor:')) {   this.handleCubeColorInput (row);
      } else if (row.startsWith('arrowColor:')) { super.handleArrowColorInput(row);
      } else if (row.startsWith('arrows:')) {      this.handleArrowsInput    (row);
      } else if (row.startsWith('alg:')) {         this.handleAlgorithmInput (row);
      } else if (row.startsWith('//')) { // ignore out-commented line
      } else {                                        return super.errorInThisLine(row, "invalid, expected: 'dimension/cubeColor/arrowColor/arrows'");
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
      this.errorInThisLine(row, 'arrow color value should match "arrowColor:" + [3 (or 6) lowercase hex digits (0-9/a-f)]');
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
    if (!row.match('^dimension:\\d+,\\d+( //.*)?')) {
      super.errorInThisLine(row, 'Invalid dimension. Expected: "dimension:[2-10],[2-10] // optional comment goes here"');
      return;
    }
    // @ts-ignore checked with regex
    let cleanData = row.split(' ')[0].trim().replace('dimension:', '');
    let [wStr, hStr] = cleanData.split(',');
    let w: number = Number(wStr);
    let h: number = Number(hStr);
    if (isNaN(w) || isNaN(h)) {
      this.errorInThisLine(row, "Invalid dimension. Expected format: 'dimension:3,3  // optional comment goes here'");
      return;
    } else if (w < 2 || h < 2) {
      super.errorInThisLine(row, 'Dimension too low! Minimum is 2x2.');
      return;
    } else if (w > 10 || h > 10) {
      super.errorInThisLine(row, 'Dimension too high! Maximum is 10x10.');
      return;
    }
    this.cubeWidth = w;
    this.cubeHeight = h;
  }

  /**
   * @param {string} row - string starting with 'cubeColor:'
   */
  private handleCubeColorInput(row: string): void {
    if (!row.match('^cubeColor:([a-f0-9]{3}){1,2}( //.*)?')) {
      return super.errorInThisLine(row, 'invalid, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
    }
    // @ts-ignore checked with regex
    let newCubClr = row.split(' ')[0].trim().replace('cubeColor:', '');
    //console.log("new cube color: '"+newCubClr+"'");
    this.cubeColor = '#' + newCubClr;
  }

  /**
   * @param {string} row - string starting with 'alg:'
   */
  private handleAlgorithmInput(row: string): void {
    let data: Algorithm | InvalidInput = new AlgorithmParser().parse(row);

    if (data instanceof InvalidInput) {
      return super.errorWhileParsing(data);
    } else if (data instanceof Algorithm) {
      this.algorithms.add(data);
    }
  }
}

export class CodeBlockInterpreterOLL extends CodeBlockInterpreter {
  cubeColor: string;
  ollFieldInput: OllFieldColoring;
  algorithmToArrowsInput: Array<string> = [];
  startingAlgorithm: number;

  constructor(rows: string[], settings: RubikCubeAlgoSettingsTab) {
    super(rows, settings);
    if (settings.cubeColor) {
      this.cubeColor = settings.cubeColor;
    } else {
      this.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
    }
  }

  setupOll(): CubeStateOLL {
    super.setup();

    // console.debug('Create CubeStateOLL');

    let cubeState: CubeStateOLL = new CubeStateOLL(this.codeBlockContent);

    if (this.codeBlockInterpretationSuccessful) {
      /*
       * Generic data:
       */
      cubeState.cubeWidth = this.cubeWidth;
      cubeState.cubeHeight = this.cubeHeight;
      cubeState.backgroundColor = '#000';
      cubeState.arrowColor = this.arrowColor;

      // console.debug(`Width ${this.cubeWidth}, height ${this.cubeHeight}, arrow color: ${this.arrowColor}`);

      cubeState.viewBoxDimensions = {width: this.cubeWidth * 100 + 100, height: this.cubeHeight * 100 + 100};

      // console.debug(`Viewbox dimensions: ${cubeState.viewBoxDimensions.width}, ${cubeState.viewBoxDimensions.height}`);

      /*
       * OLL-only data:
       */
      cubeState.algorithmToArrows = this.setupAlgorithmArrowMap();

      console.debug(`Algorithms and arrows: ${cubeState.algorithmToArrows.toString()}`);

      cubeState.currentAlgorithmIndex = 0;
      cubeState.ollFieldColors = this.ollFieldInput;
    } else {
      cubeState.invalidInput = new InvalidInput(this.lastNonInterpretableLine, this.reasonForFailure);
    }

    return cubeState;
  }

  private removeNonCubeFieldInput(rows: string[]): string[] {
    let redactedCopyOfRows: string[] = new Array<string>();
    for (let i: number = 0; i < rows.length; i++) {
      let row: string = rows[i]!;
      if (row.startsWith('alg:')) {
        this.algorithmToArrowsInput.push(row.replace('alg:', ''));
      } else if (row.startsWith('//')) {
        // ignore line starting with '//'
      } else {
        /*
         * TODO add regex
         */
        redactedCopyOfRows[redactedCopyOfRows.length] = row;
      }
    }
    return redactedCopyOfRows;
  }

  interpretCodeBlock(rows: string[]): void {
    if (rows.length < 4) {
      return super.errorInThisLine("[not enough input]", "Input for OLL should contain at least 4 lines!");
    } else if (null === rows[0]!.match('^\\..+?\\.$') || null === rows[rows[0]!.length - 1]!.match('^\\..+?\\.$')) {
      return super.errorInThisLine(rows[0]!, "First and last line should start and end on a dot ('.')!");
    }

    let rawOllInput: string[] = this.removeNonCubeFieldInput(rows);

    let expectedWidth: number = rawOllInput[0]!.length;
    this.ollFieldInput = new OllFieldColoring(expectedWidth);

    this.cubeWidth = rawOllInput[0]!.length - 2;
    this.cubeHeight = rawOllInput.length - 2;

    for (let rowIndex: number = 0; rowIndex < rawOllInput.length; rowIndex++) {
      let row: string = rawOllInput[rowIndex]!.trim();

      if (row.length !== expectedWidth) {
        return super.errorInThisLine(row, `Inconsistent row length! Expected ${expectedWidth} characters but found ${row.length}.`);
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
    let map: MappedAlgorithms = new MappedAlgorithms();

    // console.debug('>> setupAlgorithmArrowMap');

    for (let i: number = 0; i < this.algorithmToArrowsInput.length; i++) {
      let row: string = this.algorithmToArrowsInput[i]!;

      const splits = row.split(/ *== */);

      // console.debug('-- splits: ' + splits);

      if (splits.length < 2) {
        this.errorInThisLine(row, "Missing arrow mapping! Use 'alg:[algorithm] == [arrows]'");
        return map;
      }

      const algInput: string = splits[0]!;
      const arrowInput: string | undefined = splits[1];

      // console.log('splits: ' + splits);
      let data: Algorithm | InvalidInput = new AlgorithmParser().parse(algInput);

      let algorithm: Algorithm;
      let matchingArrows: Arrows;

      if (data instanceof InvalidInput) {
        super.errorWhileParsing(data);
        return map;
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
