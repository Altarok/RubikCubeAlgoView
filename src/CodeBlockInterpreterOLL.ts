import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";
import {OllFieldColors} from "./OllFieldColors";
import {Coordinates} from "./model/Coordinates";
import {Dimensions} from "./model/Dimensions";
import {InvalidInputContainer} from "./model/InvalidInputContainer";
import {CubeStateOLL} from "./model/CubeStateOLL";
import {CodeBlockInterpreterBase} from "./CodeBlockInterpreterBase";

const DEFAULT = {
  CODE_BLOCK_TEMPLATE:
    '\n```rubikCubeOLL\n' +
    '.000.\n' +
    '01101\n' +
    '10101\n' +
    '01101\n' +
    '.000.\n' +
    '```\n' +
    '\n' +
    '```rubikCubeOLL\n' +
    '.rrg.\n' +
    'bwwrw\n' +
    'wgwbw\n' +
    'owwbw\n' +
    '.goo.\n' +
    '```\n'
} as const;

export class CodeBlockInterpreterOLL extends CodeBlockInterpreterBase {
  cubeColor: string;
  ollFieldInput: OllFieldColors;

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

    let cubeState: CubeStateOLL = new CubeStateOLL(this.codeBlockContent);

    if (this.codeBlockInterpretationSuccessful) {
      cubeState.cubeWidth = this.cubeWidth;
      cubeState.cubeHeight = this.cubeHeight;
      cubeState.backgroundColor = '#000';
      cubeState.arrowColor = this.arrowColor;
      cubeState.arrowCoordinates = this.arrowCoordinates;
      cubeState.ollFieldColors = this.ollFieldInput;
      cubeState.viewBoxDimensions = new Dimensions(this.cubeWidth * 100 + 100, this.cubeHeight * 100 + 100);
    } else {
      cubeState.invalidInputContainer = new InvalidInputContainer(this.lastNonInterpretableLine, this.reasonForFailure);
    }

    return cubeState;
  }


  private removeNonCubeFieldInput(rows: string[]): string[] {
    let redactedCopyOfRows: string[] = new Array<string>();
    for (let i: number = 0; i < rows.length; i++) {
      let row: string = rows[i]!;
      if (row.startsWith('arrows:')) {
        super.handleArrowsInput(row);
      } else if (row.startsWith('//')) {
        // ignore line starting with '//'
      } else {
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

}
