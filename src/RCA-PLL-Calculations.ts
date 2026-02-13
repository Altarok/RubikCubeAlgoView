import { DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab } from "./RubikCubeAlgoSettings";
import { ArrowCalculations } from "./ArrowCalculations";
import {ArrowCoordinates} from "./ArrowCoordinates";
import {Coordinates} from "./Coordinates";

const CODE_BLOCK_TEMPLATE =
'\n```rubikCubePLL\n'+
'dimension:3,3 // width,height\n'+
'cubeColor:ff0 // yellow cube, optional parameter\n'+
'arrowColor:08f // sky blue arrows, optional parameter\n'+
'arrows:1.1-1.3,7+9 // normal arrow in top row, double-sided arrow in lower row\n'+
'```\n';

export class PLL extends ArrowCalculations {
  rectangleCoordinates: Coordinates[];
  cubeColor:string;

  constructor(rows:string[], settings:RubikCubeAlgoSettingsTab) {
    super(rows, settings);
    this.rectangleCoordinates = new Array<Coordinates>();

    
    if (settings.cubeColor){
      this.cubeColor = settings.cubeColor;
    } else { 
      this.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
    }
  }

  interpretCodeBlock(rows:string[]):void {
    for (let r = 0; r < rows.length; r++) { 
      let row = rows[r]; //console.log('interpret row: ' + row);
             if (row.startsWith('dimension:' )) {  this.handleDimensionsInput(row);
      } else if (row.startsWith('cubeColor:' )) {  this.handleCubeColorInput(row);
      } else if (row.startsWith('arrowColor:')) { super.handleArrowColorInput(row);
      } else if (row.startsWith('arrows:'    )) { super.handleArrowsInput(row);
      } else { return super.errorInThisLine(row, "invalid, expected: 'dimension/cubeColor/arrowColor/arrows'");
      }
    }
  }

  setupCubeRectangleCenterCoordinates() : void {
    this.rectangleCoordinates[0] = new Coordinates(-1,-1); /* unused first entry to start arrows with 1 instead of 0 */
    let index:number = 1;
    /* reverse loop order to give x coordinates priority */
    for (let h = 0; h < this.cubeHeight; h++) {
      for (let w = 0; w < this.cubeWidth; w++) {
        this.rectangleCoordinates[index++] = new Coordinates(w*100 + 50, h*100 + 50);
      }
    }
  }

  getCubeSize(){
    let wXh = [this.cubeWidth*100, this.cubeHeight*100];
    return wXh;
  }

  setupArrowCoordinates() : void {
    //console.log('>> getArrowCoordinates, ' + this.rectangleCoordinates);
    this.arrowCoordinates = new Array<ArrowCoordinates>();
    let completeArrowsInput: string[] = this.arrows.split(',').filter((x) => x.length > 0);
    let index: number = 0;
    //console.log("Arrows to interpret: "+completeArrowsInput);
    let isDoubleSided:boolean = false;

    for (let i = 0; i < completeArrowsInput.length; i++) {
      isDoubleSided = false;
      let singleArrowCoords: string = completeArrowsInput[i];
      
      let singleArrowCoordsSplit: string[];

      if (singleArrowCoords.match('\\d-\\d')) {
        singleArrowCoordsSplit = singleArrowCoords.split('-');
      } else {
        isDoubleSided = true;
        singleArrowCoordsSplit = singleArrowCoords.split('+');
      }

      let singleArrowCoordsFrom:string = singleArrowCoordsSplit[0];
      let singleArrowCoordsTo  :string = singleArrowCoordsSplit[1];
      //console.log("-- Arrow goes from '"+singleArrowCoordsFrom+"' to '"+singleArrowCoordsTo+"'");

      let arrowStart: Coordinates;
      let arrowEnd: Coordinates;
      
      if (singleArrowCoordsFrom.match('^[0-9]+$')){
        //console.log('-- d: ' + singleArrowCoordsFrom);
        arrowStart = this.rectangleCoordinates[singleArrowCoordsFrom];
      } else {
        let semanticVersion = singleArrowCoordsFrom.split('.');
        let major:number = +semanticVersion[0];
        let minor:number = +semanticVersion[1];
        let c:number = (major-1)*this.cubeWidth + minor;
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
        let c:number = (major-1)*this.cubeWidth + minor;
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

      this.arrowCoordinates[index++] = new ArrowCoordinates(arrowStart, arrowEnd);

      if (isDoubleSided) { // add reverse copy
        this.arrowCoordinates[index++] = new ArrowCoordinates(arrowEnd, arrowStart);
      }
    }
    //console.log('<< getArrowCoordinates, ' + this.arrowCoordinates);
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
    let w:number = +widthCommaHeightSplit[0];
    let h:number = +widthCommaHeightSplit[1];
    if (w<2||h<2){
      return super.errorInThisLine(row, 'too low, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    } else if (w>10||h>10){
      return super.errorInThisLine(row, 'too high, expected: "dimension:[2-10],[2-10] // optional comment goes here"');
    } 
    //console.log("new dimensions: "+w+","+h);
    super.cubeWidth  = w;
    super.cubeHeight = h;
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
