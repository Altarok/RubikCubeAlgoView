import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";
import {ArrowCalculations} from "./ArrowCalculations";
import {OllFieldInput} from "./OllFieldInput";
import {Coordinates} from "./model/Coordinates";
import {Dimensions} from "./model/Dimensions";

const DEFAULT = {
  CODE_BLOCK_TEMPLATE:
    '\n```rubikCubeOLL\n' +
    '.000.\n' +
    '01101\n' +
    '10101\n' +
    '01101\n' +
    '.000.\n' +
    '```\n\n' +
    '```rubikCubeOLL\n' +
    '.rrg.\n' +
    'bwwrw\n' +
    'wgwbw\n' +
    'owwbw\n' +
    '.goo.\n' +
    '```\n'
} as const;

export class OLL extends ArrowCalculations {
  cubeColor: string;
  ollFieldInput: OllFieldInput;

  constructor(rows: string[], settings: RubikCubeAlgoSettingsTab) {
    super(rows, settings);
    if (settings.cubeColor) {
      this.cubeColor = settings.cubeColor;
    } else {
      this.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
    }
  }

  getOllFieldInput(): OllFieldInput {
    return this.ollFieldInput;
  }

  private removeNonCubeFieldInput (rows:string[]): string[] {
    let copyOfRows:string[] = new Array<string>();
    for (let i: number = 0; i < rows.length; i++) {
      let row: string = rows[i]!;
      if (row.startsWith('arrows:')) {
        super.handleArrowsInput(row);
      } else {
        copyOfRows[copyOfRows.length] = row;
      }
    }
    return copyOfRows;
  }

  interpretCodeBlock(rows:string[]): void {
    if (rows.length < 4){
      return super.errorInThisLine("[not enough input]","Input for OLL should contain at least 4 lines!");
    } else if (null === rows[0]!.match('^\\..+?\\.$') || null === rows[rows[0]!.length-1]!.match('^\\..+?\\.$') ) {
      return super.errorInThisLine(rows[0]!,"First and last line should start and end on a dot ('.')!");
    }

    // console.log('rows: ' + rows);

    let rawOllInput: string[] = this.removeNonCubeFieldInput(rows);

    // console.log('rawOllInput: ' + rawOllInput);

    let expectedOllFieldInputWidth: number = rawOllInput[0]!.length;
    this.ollFieldInput = new OllFieldInput(expectedOllFieldInputWidth);

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
        } else if (i === 0 || rowIndex === 0 || rowIndex === rawOllInput.length-1 || i === row.length-1) {
          parsedRow[index++] = clr.toLowerCase();
        } else {
          parsedRow[index++] = clr.toUpperCase();
        }
      }
      this.ollFieldInput.addRow(parsedRow);
    }
    // this.logCellsTable();
  }

  // private logCellsTable() {
  //   let msg:string = 'logCellsTable:\n' + this.ollFieldInput.toString();
  //   console.log(msg);
  // }

  setupCubeRectangleCenterCoordinates(): void {
    this.addCoordinates(new Coordinates(-1,-1)); /* unused first entry to start arrows with 1 instead of 0 */
    /* reverse loop order to give x coordinates more priority */
    for (let h = 0; h < this.cubeHeight; h++) {
      for (let w = 0; w < this.cubeWidth; w++) {
        this.addCoordinates(new Coordinates(w * 100 + 100, h*100 + 100));
      }
    }
  }

  getDrawDimensions(): Dimensions {
    return new Dimensions(this.cubeWidth * 100 + 100, this.cubeHeight * 100 + 100);
  }

  static get3by3CodeBlockTemplate(): string {
    return DEFAULT.CODE_BLOCK_TEMPLATE;
  }

  toString(): string {
    return "pll[cubeClr'"+this.cubeColor+"',arrowColor'"+this.arrowColor+"',arrows'"+this.arrows+"']"
  }
}
