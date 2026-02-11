import { DEFAULT_SETTINGS, RubikCubeAlgosSettings } from "./RubikCubeAlgoSettings";
import { ArrowCalculations } from "./ArrowCalculations";
import { BaseCodeBlockInterpreter } from "./BaseCodeBlockInterpreter";

const DEFAULT = { 
  WIDTH: 3, /* default rubik cube width */
  HEIGHT: 3, /* default rubik cube height */
  CODE_BLOCK_TEMPLATE:
'\n```rubikCubePLL\n'+
'dimension:3,3 // width,height\n'+
'cubeColor:ff0 // yellow cube, optional parameter\n'+
'arrowColor:08f // sky blue arrows, optional parameter\n'+
'arrows:1.1-1.3,7+9 // arrow from top left (1.1 or 1) to top right (1.3 or 3), double-sided arrow from/to lower left (3.1 or 7) from/to lower right (3.3 or 9) \n'+
'```'
} as const; 

export class PLL extends ArrowCalculations {
  rectangleCoordinates;
  arrowCoordinates;
  width:number;
  height:number;
  cubeColor:string;

  constructor(rows:string[], settings:RubikCubeAlgosSettings) {
    super(rows, settings);
    this.rectangleCoordinates = new Array();
    this.width = DEFAULT.WIDTH;
    this.height = DEFAULT.HEIGHT;
    
    if (settings.cubeColor){
      this.cubeColor = settings.cubeColor;
    } else {
      this.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
    }
    this.interpretCodeBlock(rows);
  }

  /**
   * @param row string starting with 'dimension:'
   */ 
  private handleDimensionsInput(row:string):void {
    if (!row.match('^dimension:\\d+,\\d+ *?(//.*)?')) {
      return super.errorInThisLine(row, 'invalid, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    }
    let widthCommaHeight = row.split(' ')[0].trim().replace('dimension:','');
    let widthCommaHeightSplit = widthCommaHeight.split(',');
    let w = widthCommaHeightSplit[0];
    let h = widthCommaHeightSplit[1];
    if (w<2||h<2){
      return super.errorInThisLine(row, 'too low, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    } else if (w>10||h>10){
      return super.errorInThisLine(row, 'too high, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    } 
    //console.log("new dimensions: "+w+","+h);
    this.width  = w;
    this.height = h;
  }

  /**
   * @param row string starting with 'cubeColor:'
   */
  private handleCubeColorInput(row:string):void {
    if (!row.match('^cubeColor:([a-f0-9]{3}){1,2} *?(//.*)?')) {
      return super.errorInThisLine(row, 'invalid, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
    }
    let newCubClr = row.split(' ')[0].trim().replace('cubeColor:','');
    //console.log("new cube color: '"+newCubClr+"'");
    this.cubeColor = '#' + newCubClr;
  }

  private interpretCodeBlock(rows:string[]):void {
    if (rows.length === 0){
      return super.errorInThisLine("[empty]","at least 1 parameter needed: 'dimension/cubeColor/arrowColor/arrows'");
    }
    for (let r = 0; r < rows.length; r++) { 
      let row = rows[r];
             if (row.startsWith('dimension:')) {   this.handleDimensionsInput(row);
      } else if (row.startsWith('cubeColor:')) {   this.handleCubeColorInput(row);
      } else if (row.startsWith('arrowColor:')) { super.handleArrowColorInput(row);
      } else if (row.startsWith('arrows:')) {     super.handleArrowsInput(row);
      } else {                             return super.errorInThisLine(row, "invalid, expected: 'dimension/cubeColor/arrowColor/arrows'");
      }
    }
    this.setupCubeRectangleCenterCoordinates();
    this.setupArrowCoordinates();
  }

  private setupCubeRectangleCenterCoordinates(){
    this.rectangleCoordinates[0] = []; /* unused first entry to start arrows with 1 instead of 0 */
    let index:number=1;
    /* reverse loop order to give x coordinates more priority */
    for (let h = 0; h < this.height; h++) {
      for (let w = 0; w < this.width; w++) {
        this.rectangleCoordinates[index++] = [w*100 + 50, h*100 + 50];
      }
    }
  }

  getCubeSize(){
    let wXh = [this.width*100, this.height*100];
    return wXh;
  }

  getArrowCoordinates() {
    return this.arrowCoordinates;
  }

  setupArrowCoordinates() {
    //console.log('>> getArrowCoordinates, ' + this.rectangleCoordinates);
    this.arrowCoordinates = new Array();
    let allArrowCoords = this.arrows.split(',').filter((x) => x.length > 0);
    let index:number = 0;
    //console.log("Arrows to interpret: "+allArrowCoords);
    let isDoubleSided:boolean = false;
    for (let i = 0; i < allArrowCoords.length; i++) {
      isDoubleSided = false;
      let singleArrowCoords:string = allArrowCoords[i];
      
      let singleArrowCoordsSplit;
      if (singleArrowCoords.match('\\d-\\d')) {
        singleArrowCoordsSplit = singleArrowCoords.split('-');
      } else {
        isDoubleSided = true;
        singleArrowCoordsSplit = singleArrowCoords.split('+');
      }

      let singleArrowCoordsFrom:string = singleArrowCoordsSplit[0];
      let singleArrowCoordsTo:string   = singleArrowCoordsSplit[1];

      //if (singleArrowCoordsFrom===singleArrowCoordsTo){
      //  // console.log("Skip arrow pointing to itself: "+singleArrowCoordsFrom);
      //  /**
      //   * TODO this one does not work
      //   */
      //  super.errorInThisLine(this.arrowsLine, "arrow '" + singleArrowCoords + "' is pointing to itself");
      //  continue;
      //}

      //console.log("-- Arrow goes from '"+singleArrowCoordsFrom+"' to '"+singleArrowCoordsTo+"'");
      
      let arrowStart;
      let arrowEnd;
      
      if (singleArrowCoordsFrom.match('^[0-9]+$')){
        //console.log('-- d: ' + singleArrowCoordsFrom);
        arrowStart = this.rectangleCoordinates[singleArrowCoordsFrom];
      } else {
        let semanticVersion = singleArrowCoordsFrom.split('.');
        let major:number = +semanticVersion[0];
        let minor:number = +semanticVersion[1];
        let c:number = (major-1)*this.width + minor;
        //console.log('-- c: ' + c);
        arrowStart = this.rectangleCoordinates[c];
      }
      
      if (singleArrowCoordsTo.match('^[0-9]+$')){
        //console.log('-- d: ' + singleArrowCoordsTo);
        arrowEnd = this.rectangleCoordinates[singleArrowCoordsTo];
      } else {
        let semanticVersion = singleArrowCoordsTo.split('.');
        let major:number = +semanticVersion[0];
        let minor:number = +semanticVersion[1];
        let c:number = (major-1)*this.width + minor;
        //console.log('-- c: ' + c);
        arrowEnd = this.rectangleCoordinates[c];
      }
      
      if (arrowStart===arrowEnd){
        // console.log("Skip arrow pointing to itself: "+singleArrowCoordsFrom);
        /**
         * TODO this one does not work
         */
        super.errorInThisLine(this.arrowsLine, "arrow '" + singleArrowCoords + "' is pointing to its starting point");
        continue;
      }
      
      this.arrowCoordinates[index++] = [ arrowStart, arrowEnd ];
      
      if (isDoubleSided) { // add reverse copy
        this.arrowCoordinates[index++] = [ arrowEnd, arrowStart ];
      }
    }
    //console.log('<< getArrowCoordinates, ' + this.arrowCoordinates);
    return this.arrowCoordinates;
  }

  static get3by3CodeBlockTemplate():string {
    return DEFAULT.CODE_BLOCK_TEMPLATE;
  }

  toString():string {
    return "pll[cubeClr'"+this.cubeColor+"',arrowColor'"+this.arrowColor+"',arrows'"+this.arrows+"']"
  }

}