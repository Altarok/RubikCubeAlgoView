import { DEFAULT_SETTINGS, RubikCubeAlgosSettings } from "./RubikCubeAlgoSettings";
import { ArrowCalculations } from "./ArrowCalculations";
import { BaseCodeBlockInterpreter } from "./BaseCodeBlockInterpreter";

const DEFAULT = {
  WIDTH: 3, /* default rubik cube width */
  HEIGHT: 3, /* default rubik cube height */
  CODE_BLOCK_TEMPLATE:
'\n```rubikCubeOLL\n'+
'.000.\n'+
'01101\n'+
'10101\n'+
'01101\n'+
'.000.\n'+
'```'
} as const; 

const light:number = 1;
const dark:number = 0;

export class OLL extends ArrowCalculations {
  cells:number[];
  width:number;
  height:number;
  cubeColor:string;

  constructor(rows:string[], settings:RubikCubeAlgosSettings) {
    super(rows, settings);
    this.cells = new Array();
    this.width = DEFAULT.WIDTH;
    this.height = DEFAULT.HEIGHT;
    
    if (settings.cubeColor){
      this.cubeColor = settings.cubeColor;
    } else {
      this.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
    }
  }
  private setDimension(w:number,h:number):void {
    this.width=w;
    this.height=h;
    //console.log("new dimensions: "+w+","+h);
  }
  private setCubeColor(s:string):void {
    this.cubeColor = '#'+s;
    //console.log("new cube color: '"+s+"'");
  }
  private setArrowColor(s:string):void {
    this.arrowColor = '#'+s;
    //console.log("new arrow color: '"+s+"'");
  }
  private setArrows(s:string):void {
    this.arrows = s;
    //console.log("new arrows: '"+s+"'");
  }
  toString():string {
    return "pll[cubeClr'"+this.cubeColor+"',arrowColor'"+this.arrowColor+"',arrows'"+this.arrows+"']"
  }
  interpretCodeBlock(rows:string[]):Array {
    if (rows.length < 4){
      return super.errorInThisLine("[no input]","Input for OLL should contain at least 4 lines!");
    } else if (false === rows[0].match('^\\..+?\\.$') || false === rows[rows.length-1].match('^\\..+?\\.$') ) {
      return super.errorInThisLine(rows[0],"First and last line should start and end on a dot ('.')!");
    }
    let expectedRowLength:number = rows[0].length;
    this.width = rows[0].length - 2;
    this.height = rows.length - 2;
    for (let r = 0; r < rows.length; r++) {
      let row = rows[r];
      if (row.length != expectedRowLength) {
        return super.errorInThisLine(row,'Inconsistent row length. Expected: '+expectedRowLength);
      }
      let parsedRow:number[] = new Array();
      for (let i = 0; i < row.length; i++) { 
        
        let c:string = row[i];
        if (c==='.') {
          parsedRow[parsedRow.length] = -1;
        } else if (i === 0 || r === 0 || r === rows.length-1 || i === row.length-1) {
          parsedRow[parsedRow.length] = c.toLowerCase();
        } else {
          parsedRow[parsedRow.length] = c.toUpperCase();
        }
      }
      this.cells[this.cells.length] = parsedRow;
    }  
    //this.calculateCoordinates();
    this.logCellsTable();
    return this.cells;
  }
  private logCellsTable() {
    let log:string = 'logCellsTable:\n'
    for (let i = 0; i < this.cells.length; i++) {
      log = log + this.cells[i] + '\n';
    }
    console.log(log);
  }
  //private calculateCoordinates(){
  //  this.COORDINATES[0] = [];
  //  let index:number=1;
  //  /* reverse loop order to give x coordinates more priority */
  //  for (let h = 0; h < this.height; h++) {
  //    for (let w = 0; w < this.width; w++) {
  //      this.COORDINATES[index++] = [w*100 + 50, h*100 + 50];
  //    }
  //  }
  //}
  getDimensions(){
    let wXh = [this.width*100 + 100, this.height*100 + 100];
    return wXh;
  }
  static get3by3CodeBlockTemplate():string {
    return DEFAULT.CODE_BLOCK_TEMPLATE;
  }
}