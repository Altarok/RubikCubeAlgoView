import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";
import {OllFieldColors} from "./model/OllFieldColors";
import {InvalidInput} from "./model/invalid-input";
import {CubeStateOLL} from "./model/cube-state";
import {CodeBlockInterpreterBase} from "./CodeBlockInterpreterBase";
import {Algorithms, MappedAlgorithm, MappedAlgorithms} from "./model/algorithms";
import {Geometry, Coordinates} from "./model/geometry";
import {AlgorithmParser} from "./parser/AlgorithmParser";

const DEFAULT = {
  CODE_BLOCK_TEMPLATE:
    '\n```rubikCubeOLL\n.000.\n01101\n10101\n01101\n.000.\n```\n' +
    '\n```rubikCubeOLL\n.rrg.\nbwwrw\nwgwbw\nowwbw\n.goo.\n```\n'
} as const;

export class CodeBlockInterpreterOLL extends CodeBlockInterpreterBase {
  cubeColor: string;
  ollFieldInput: OllFieldColors;
  algorithmToArrowsInput: Array<string>;
  startingAlgorithm: number;

  constructor(rows: string[], settings: RubikCubeAlgoSettingsTab) {
    super(rows, settings);
    if (settings.cubeColor) {
      this.cubeColor = settings.cubeColor;
    } else {
      this.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
    }

    this.algorithmToArrowsInput = new Array<string>();
  }

  setupOll(): CubeStateOLL {
    super.setup();

    let algorithmToArrows: MappedAlgorithms = this.setupAlgorithmArrowMap();

    let cubeState: CubeStateOLL = new CubeStateOLL(this.codeBlockContent);

    if (this.codeBlockInterpretationSuccessful) {
      /*
       * Generic data:
       */
      cubeState.cubeWidth = this.cubeWidth;
      cubeState.cubeHeight = this.cubeHeight;
      cubeState.backgroundColor = '#000';
      cubeState.arrowColor = this.arrowColor;
      cubeState.viewBoxDimensions = {width: this.cubeWidth * 100 + 100, height: this.cubeHeight * 100 + 100 };
      /*
       * OLL-only data:
       */
      cubeState.algorithmToArrows = algorithmToArrows;
      cubeState.currentAlgorithmIndex = 0;
      cubeState.ollFieldColors = this.ollFieldInput;
    } else {
      cubeState.invalidInput = { line: this.lastNonInterpretableLine, reason: this.reasonForFailure };
    }

    return cubeState;
  }


  private removeNonCubeFieldInput(rows: string[]): string[] {
    let redactedCopyOfRows: string[] = new Array<string>();
    for (let i: number = 0; i < rows.length; i++) {
      let row: string = rows[i]!;
      // if (row.startsWith('arrows:')) {
      //   super.handleArrowsInput(row);
      // } else
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

    let expectedOllFieldInputWidth: number = rawOllInput[0]!.length;
    this.ollFieldInput = new OllFieldColors(expectedOllFieldInputWidth);

    this.cubeWidth = rawOllInput[0]!.length - 2;
    this.cubeHeight = rawOllInput.length - 2;

    for (let rowIndex: number = 0; rowIndex < rawOllInput.length; rowIndex++) {
      let row: string = rawOllInput[rowIndex]!;

      // console.log('parse row: ' + row);

      let parsedRow: string[] = new Array<string>();
      let index: number = 0;
      for (let i: number = 0; i < row.length; i++) {
        let clr: string = row[i]!;
        if (clr === '.') {
          parsedRow[index++] = '-1';
        } else if (i === 0 || rowIndex === 0 || rowIndex === rawOllInput.length - 1 || i === row.length - 1) {
          parsedRow[index++] = clr.toLowerCase();
        } else {
          parsedRow[index++] = clr.toUpperCase();
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

  static get3by3CodeBlockTemplate(): string {
    return DEFAULT.CODE_BLOCK_TEMPLATE;
  }

  private setupAlgorithmArrowMap(): MappedAlgorithms {
    /* Method's return value: */
    let map: MappedAlgorithms = new MappedAlgorithms();

    for (let i: number = 0; i < this.algorithmToArrowsInput.length; i++) {
      let row: string = this.algorithmToArrowsInput[i]!;

      let splits: string[] = row.split(' == ');

      // console.log('row: ' + row);

      // console.log('splits: ' + splits);
      let data: Algorithms | InvalidInput = new AlgorithmParser().parse(splits[0]!);

      let algorithm: Algorithms;
      let matchingArrows: Geometry[];

      if (data instanceof InvalidInput) {
        super.errorWhileParsing(data);
        return map;
      } else if (data instanceof Algorithms) {
        algorithm = data;
        matchingArrows = super.setupArrowCoordinates(splits[1]!);

        map.set(i, new MappedAlgorithm(algorithm, matchingArrows));
          this.startingAlgorithm = 0;

      } else {
        // TODO df
      }
    }


    return map;
  }
}
