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


const isPositiveIntegerRegex = new RegExp('\\d+');


export abstract class CodeBlockInterpreter {
  /** cube width (rectangles, not pixels) */
  protected cubeWidth: number = DEFAULT.WIDTH;
  /** cube height (rectangles, not pixels) */
  protected cubeHeight: number = DEFAULT.HEIGHT;
  protected codeBlockInterpretationSuccessful: boolean = true;
  protected invalidInput?: InvalidInput;
  protected cubeletCoordinates: Coordinates[] = [];
  protected arrowColor: string;

  protected constructor(protected readonly codeBlockContent: string[], settings: RubikCubeAlgoSettingsTab) {
    this.arrowColor = settings.arrowColor ?? DEFAULT_SETTINGS.ARROW_COLOR;
    if (codeBlockContent.length === 0) {
      this.setInvalidInput(new InvalidInput("[empty]", "At least 1 parameter needed: 'dimension/cubeColor/arrowColor/arrows'"));
    }
  }

  protected parseHexColor = (row: string, prefix: string): string | null => {
    const clean = row.split(' ')[0]?.replace(prefix, '').trim();
    return clean?.match(/^([a-f0-9]{3}){1,2}$/i) ? '#' + clean : null;
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

  protected addCoordinates(coords: Coordinates): void {
    this.cubeletCoordinates.push(coords);
  }

  setupArrowCoordinates(arrowInput: string | undefined): Arrows {
    if (!arrowInput) return [];

    return arrowInput.split(',').filter(Boolean).reduce((acc: Arrows, segment) => {
      const isDoubleSided = segment.includes('+');
      const [from, to] = segment.split(/[+-]/); // Split on + OR -

      if (from && to) {
        const start = this.getCubeletCenterCoordinates(from);
        const end = this.getCubeletCenterCoordinates(to);

        acc.push(new ArrowCoords(start, end));
        if (isDoubleSided) acc.push(new ArrowCoords(end, start));
      }
      return acc;
    }, []);
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
   * @param {string} row - string starting with 'arrowColor:' followed by a hex value for the arrows' color
   */
  handleArrowColorInput(row: string): void {
    const color: string | null = this.parseHexColor(row, 'arrowColor:');
    if (color) {
      this.arrowColor = color;
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
    for (const row of rows.map(r => r.trim())) {
      if (!row || row.startsWith('//')) continue;

      const [command] = row.split(':');

      switch (command) {
        case 'dimension':   this.handleDimensionsInput(row); break;
        case 'cubeColor':   this.handleCubeColorInput(row); break;
        case 'arrowColor': super.handleArrowColorInput(row); break;
        case 'arrows':      this.handleArrowsInput(row); break;
        case 'alg':         this.handleAlgorithmInput(row); break;
        default:
          return this.setInvalidInput(InvalidInput.ofPllParameter(row));
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
    const dims: number[] | undefined = row
    .split(' ')[0]?. // cut comments
    replace('dimension:', '') // cut prefix
    .split(',') // split width and height
    .map(Number);
    if (dims?.length === 2 && dims.every(n => n >= 2 && n <= 10)) {
      [this.cubeWidth, this.cubeHeight] = dims as [number, number];
    } else {
      this.setInvalidInput(InvalidInput.ofDimensions(row));
    }
  }

  /**
   * @param {string} row - string starting with 'cubeColor:'
   */
  private handleCubeColorInput(row: string): void {
    const color: string | null = this.parseHexColor(row, 'cubeColor:');
    if (color) {
      this.cubeColor = color;
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
    return rows.filter(row => !row.startsWith('//')) // ignore comments
    .map(row => {
      if (row.startsWith('alg:')) {
        this.algorithmToArrowsInput.push(row.replace('alg:', '').trim());
        return null; // Mark for removal
      }
      return row;
    })
    .filter((row): row is string => row !== null);
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

    const firstRow = rows[0]!;
    const lastRow = rows[rows.length - 1]!;

    if (!this.isWrappedInDots(firstRow) || !this.isWrappedInDots(lastRow)) {
      return super.setInvalidInput(new InvalidInput(firstRow, `First '${firstRow}' and last '${lastRow}' line should start and end on a dot ('.')!`));
    }

    const rawOllInput: string[] = this.removeNonCubeFieldInput(rows);
    let expectedWidth: number = rawOllInput[0]!.length;

    this.ollFieldInput = new OllFieldColoring(expectedWidth);
    this.cubeWidth = expectedWidth - 2;
    this.cubeHeight = rawOllInput.length - 2;

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
    this.addCoordinates(new Coordinates(-1, -1)); /* unused first entry to start arrows with 1 instead of 0 */
    /* reverse loop order to give x coordinates more priority */
    for (let h: number = 0; h < this.cubeHeight; h++) {
      for (let w: number = 0; w < this.cubeWidth; w++) {
        this.addCoordinates(new Coordinates(w * 100 + 100, h * 100 + 100));
      }
    }
  }

  private setupAlgorithmArrowMap(): MappedAlgorithms {
    const map = new MappedAlgorithms();

    this.algorithmToArrowsInput.forEach((row: string, i: number) => {
      const [algInput, arrowInput] = row.split(/ *== */);

      const data: InvalidInput | Algorithm = new AlgorithmParser().parse(algInput!);
      if (data instanceof InvalidInput) {
        this.setInvalidInput(data);
      } else {

        let matchingArrows: Arrows;
        if (!arrowInput) {
          matchingArrows = [];
        } else {
          matchingArrows = super.setupArrowCoordinates(arrowInput);
        }
        map.add(i, new MappedAlgorithm(data, matchingArrows));
      }
    });

    this.startingAlgorithm = 0;
    return map;
  }

  // // console.debug('>> setupAlgorithmArrowMap');
  //
  // for (let i: number = 0; i < this.algorithmToArrowsInput.length; i++) {
  //   let row: string = this.algorithmToArrowsInput[i]!;
  //
  //   const splits = row.split(/ *== */);
  //
  //   // console.debug('-- splits: ' + splits);
  //
  //   if (splits.length < 2) {
  //     this.setInvalidInput(new InvalidInput(row, "Missing arrow mapping! Use 'alg:[algorithm] == [arrows]'"));
  //     return map;
  //   }
  //
  //   const algInput: string = splits[0]!;
  //   const arrowInput: string | undefined = splits[1];
  //
  //   // console.log('splits: ' + splits);
  //   let data: Algorithm | InvalidInput = new AlgorithmParser().parse(algInput);
  //
  //   let algorithm: Algorithm;
  //   let matchingArrows: Arrows;
  //
  //   if (data instanceof InvalidInput) {
  //     this.setInvalidInput(data);
  //   } else /* if (data instanceof Algorithm) */ {
  //     algorithm = data;
  //     matchingArrows = super.setupArrowCoordinates(arrowInput);
  //
  //     console.debug('Add algorithm : ' + algorithm.toString());
  //
  //     map.add(i, new MappedAlgorithm(algorithm, matchingArrows));
  //     this.startingAlgorithm = 0;
  //   }
  // }
  //
  // return map;
  // }
}
