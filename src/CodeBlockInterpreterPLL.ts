import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";
import {Coordinates} from "./model/Coordinates";
import {Dimensions} from "./model/Dimensions";
import {CubeStatePLL} from "./model/CubeStatePLL";
import {InvalidInputContainer} from "./model/InvalidInputContainer";
import {CodeBlockInterpreterBase} from "./CodeBlockInterpreterBase";
import {Algorithm, Algorithms, AlgorithmStep, possibleSteps} from "./model/Algorithm";

const CODE_BLOCK_TEMPLATE =
  '\n```rubikCubePLL\n' +
  'dimension:3,3 // width,height\n' +
  'cubeColor:ff0 // yellow cube, optional parameter\n' +
  'arrowColor:08f // sky blue arrows, optional parameter\n' +
  'arrows:1.1-1.3,7+9 // normal arrow in top row, double-sided arrow in lower row\n' +
  '```\n';

const possibleStepsPattern: string = "[xyzRrLlFfBbUuDdMSE](|'|2)";
const algorithmPattern: string =  possibleStepsPattern + '( ?' + possibleStepsPattern + ')*';


export class CodeBlockInterpreterPLL extends CodeBlockInterpreterBase {
  cubeColor: string;
  algorithms: Algorithms;

  constructor(rows: string[], settings: RubikCubeAlgoSettingsTab) {
    super(rows, settings);
    if (settings.cubeColor) {
      this.cubeColor = settings.cubeColor;
    } else {
      this.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
    }
    this.algorithms = new Algorithms();
  }

  setupPll(): CubeStatePLL {
    super.setup();

    let cubeState: CubeStatePLL = new CubeStatePLL(this.codeBlockContent);

    if (this.codeBlockInterpretationSuccessful) {
      cubeState.cubeWidth = this.cubeWidth;
      cubeState.cubeHeight = this.cubeHeight;
      cubeState.backgroundColor = this.cubeColor;
      cubeState.arrowColor = this.arrowColor;
      cubeState.arrowCoordinates = this.arrowCoordinates;
      cubeState.viewBoxDimensions = new Dimensions(this.cubeWidth * 100, this.cubeHeight * 100);
      cubeState.algorithms = this.algorithms;
    } else {
      cubeState.invalidInputContainer = new InvalidInputContainer(this.lastNonInterpretableLine, this.reasonForFailure);
    }

    return cubeState;
  }

  /* @formatter:off */

  interpretCodeBlock(rows: string[]): void {
    for (let r: number = 0; r < rows.length; r++) {
      let row: string = rows[r]!; //console.log('interpret row: ' + row);
      if (row.startsWith('dimension:')) {          this.handleDimensionsInput(row);
      } else if (row.startsWith('cubeColor:')) {   this.handleCubeColorInput(row);
      } else if (row.startsWith('arrowColor:')) { super.handleArrowColorInput(row);
      } else if (row.startsWith('arrows:')) {     super.handleArrowsInput(row);
      } else if (row.startsWith('alg:')) {         this.handleAlgorithmInput(row);
      } else if (row.startsWith('//')) { // ignore line
      } else {                                        return super.errorInThisLine(row, "invalid, expected: 'dimension/cubeColor/arrowColor/arrows'");
      }
    }
  }

  /* @formatter:on */

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
      return super.errorInThisLine(row, 'invalid, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    }
    // @ts-ignore checked with regex
    let widthCommaHeight = row.split(' ')[0].trim().replace('dimension:', '');
    let widthCommaHeightSplit = widthCommaHeight.split(',');
    let w: number = +widthCommaHeightSplit[0]!;
    let h: number = +widthCommaHeightSplit[1]!;
    if (w < 2 || h < 2) {
      return super.errorInThisLine(row, 'too low, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    } else if (w > 10 || h > 10) {
      return super.errorInThisLine(row, 'too high, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    }
    //console.log("new dimensions: "+w+","+h);
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
    let rowCleaned: string = row.trim().replace('alg:', '');



    if (!rowCleaned.match('^' + algorithmPattern + '$')) {
      return super.errorInThisLine(row, "invalid, expected algorithm  like: alg:R' U2 R U2 R' F R U R' U' R' F' R2 U' (spaces not optional, no comments in this line)");
    }

    // console.log('step input: ' + rowCleaned);

    let separator: string = ' ';
    let splitSteps: string[] = rowCleaned.split(separator);
    let steps: AlgorithmStep[] = new Array<AlgorithmStep>();

    for (let i: number = 0; i < splitSteps.length; i++) {
      if (isAlgorithmStep(splitSteps[i]!)) {
        let val: AlgorithmStep | null = parseAlgorithmStep(splitSteps[i]!);
        if (val != null) {
          steps.push(val);
        }
      } else {
        console.error(`Invalid AlgorithmStep: ${splitSteps[i]}`);
      }
    }

    this.algorithms.push(new Algorithm(steps));
  }

  static get3by3CodeBlockTemplate(): string {
    return CODE_BLOCK_TEMPLATE;
  }

}

/**
 * Validates if a string is a member of the Step union
 */
function isAlgorithmStep(value: string): value is AlgorithmStep {
  return (possibleSteps as readonly string[]).includes(value);
}

function parseAlgorithmStep(input: string): AlgorithmStep | null {
  if (isAlgorithmStep(input)) {
    return input;
  }
  return null;
}
