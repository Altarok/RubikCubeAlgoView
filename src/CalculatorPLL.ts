import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";
import {ArrowCalculations} from "./ArrowCalculations";
import {Coordinates} from "./Coordinates";
import {Dimensions} from "./Dimensions";

const CODE_BLOCK_TEMPLATE =
'\n```rubikCubePLL\n'+
'dimension:3,3 // width,height\n'+
'cubeColor:ff0 // yellow cube, optional parameter\n'+
'arrowColor:08f // sky blue arrows, optional parameter\n'+
'arrows:1.1-1.3,7+9 // normal arrow in top row, double-sided arrow in lower row\n'+
'```\n';

export class PLL extends ArrowCalculations {
  cubeColor:string;

  constructor(rows:string[], settings:RubikCubeAlgoSettingsTab) {
    super(rows, settings);
    if (settings.cubeColor){
      this.cubeColor = settings.cubeColor;
    } else { 
      this.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
    }
  }

  interpretCodeBlock(rows:string[]):void {
    for (let r: number = 0; r < rows.length; r++) {
      let row: string = rows[r]!; //console.log('interpret row: ' + row);
             if (row.startsWith('dimension:' )) {  this.handleDimensionsInput(row);
      } else if (row.startsWith('cubeColor:' )) {  this.handleCubeColorInput(row);
      } else if (row.startsWith('arrowColor:')) { super.handleArrowColorInput(row);
      } else if (row.startsWith('arrows:'    )) { super.handleArrowsInput(row);
      } else { return super.errorInThisLine(row, "invalid, expected: 'dimension/cubeColor/arrowColor/arrows'");
      }
    }
  }

  setupCubeRectangleCenterCoordinates(): void {
    this.addCoordinates(new Coordinates(-1,-1)); /* unused first entry to start arrows with 1 instead of 0 */
    /* reverse loop order to give x coordinates priority */
    for (let h = 0; h < this.cubeHeight; h++) {
      for (let w = 0; w < this.cubeWidth; w++) {
        this.addCoordinates(new Coordinates(w * 100 + 50, h * 100 + 50));
      }
    }
  }

  getDrawDimensions(): Dimensions {
    return new Dimensions(this.cubeWidth * 100, this.cubeHeight * 100);
  }

  /**
   * @param row string starting with 'dimension:'
   */ 
  private handleDimensionsInput(row:string):void {
    if (!row.match('^dimension:\\d+,\\d+ *?(//.*)?')) {
      return super.errorInThisLine(row, 'invalid, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    }
    // @ts-ignore checked with regex
    let widthCommaHeight = row.split(' ')[0].trim().replace('dimension:','');
    let widthCommaHeightSplit = widthCommaHeight.split(',');
    let w:number = +widthCommaHeightSplit[0]!;
    let h:number = +widthCommaHeightSplit[1]!;
    if (w<2||h<2){
      return super.errorInThisLine(row, 'too low, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    } else if (w>10||h>10){
      return super.errorInThisLine(row, 'too high, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    } 
    //console.log("new dimensions: "+w+","+h);
    this.cubeWidth  = w;
    this.cubeHeight = h;
  }

  /**
   * @param row string starting with 'cubeColor:'
   */
  private handleCubeColorInput(row:string):void {
    if (!row.match('^cubeColor:([a-f0-9]{3}){1,2} *?(//.*)?')) {
      return super.errorInThisLine(row, 'invalid, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
    }
    // @ts-ignore checked with regex
    let newCubClr = row.split(' ')[0].trim().replace('cubeColor:','');
    //console.log("new cube color: '"+newCubClr+"'");
    this.cubeColor = '#' + newCubClr;
  }

  toString():string {
    return "pll[cubeClr'"+this.cubeColor+"',arrowColor'"+this.arrowColor+"',arrows'"+this.arrows+"']"
  }

  static get3by3CodeBlockTemplate():string {
    return CODE_BLOCK_TEMPLATE;
  }


}
