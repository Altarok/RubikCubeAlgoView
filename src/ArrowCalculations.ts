import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";
import {BaseCodeBlockInterpreter} from "./BaseCodeBlockInterpreter";
import {ArrowCoordinates} from "./ArrowCoordinates";
import {Coordinates} from "./Coordinates";

export abstract class ArrowCalculations extends BaseCodeBlockInterpreter {
  rectangleCoordinates: Coordinates[];
  arrowColor: string;
  arrowsLine: string;
  arrows: string;
  /** Nested array of coordinates. Contains start and end coordinates of arrow in pixels. */
  arrowCoordinates: ArrowCoordinates[];

  protected constructor(rows: string[], settings: RubikCubeAlgoSettingsTab) {
    super(rows);
    this.rectangleCoordinates = new Array<Coordinates>();
    if (settings.arrowColor) {
      this.arrowColor = settings.arrowColor;
    } else {
      this.arrowColor = DEFAULT_SETTINGS.ARROW_COLOR;
    }
    this.arrows = "";
    this.arrowCoordinates = new Array<ArrowCoordinates>();
  }

  protected addCoordinates(coords: Coordinates): void {
    this.rectangleCoordinates.push(coords);
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
      super.errorInThisLine(row, 'invalid, expected: "arrowColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
    }
  }

  /**
   * @param {string} row - string starting with 'arrows:'
   */
  handleArrowsInput(row: string): void {
    this.arrowsLine = row;
    if (row.match('^arrows:\\d+(\\.\\d+)?(-|\\+)\\d+(\\.\\d+)?(,\\d+(\\.\\d+)?(-|\\+)\\d+(\\.\\d+)?)*( //.*)?')) {
      /* do not parse yet, another line may still brake the input which makes the calculation obsolete */
      // @ts-ignore checked with regex
      this.arrows = row.split(' ')[0].trim().replace('arrows:', '');
      // console.log("new arrows: " + this.arrows);
    } else {
      super.errorInThisLine(row, 'arrow color value should match "arrowColor:" + [3 (or 6) lowercase hex digits (0-9/a-f)]');
    }
  }

  getArrowCoordinates(): ArrowCoordinates[] {
    return this.arrowCoordinates;
  }


  setupArrowCoordinates(): void {
    //console.log('>> getArrowCoordinates, ' + this.rectangleCoordinates);
    this.arrowCoordinates = new Array<ArrowCoordinates>();
    let completeArrowsInput: string[] = this.arrows.split(',').filter((x) => x.length > 0);
    let index: number = 0;
    //console.log("Arrows to interpret: "+completeArrowsInput);
    let isDoubleSided: boolean = false;

    for (let i = 0; i < completeArrowsInput.length; i++) {
      isDoubleSided = false;
      let singleArrowCoords: string = completeArrowsInput[i]!;

      let singleArrowCoordsSplit: string[];

      if (singleArrowCoords.match('\\d-\\d')) {
        singleArrowCoordsSplit = singleArrowCoords.split('-');
      } else {
        isDoubleSided = true;
        singleArrowCoordsSplit = singleArrowCoords.split('+');
      }

      let singleArrowCoordsFrom: string = singleArrowCoordsSplit[0]!;
      let singleArrowCoordsTo: string = singleArrowCoordsSplit[1]!;
      //console.log("-- Arrow goes from '"+singleArrowCoordsFrom+"' to '"+singleArrowCoordsTo+"'");

      let arrowStart: Coordinates;
      let arrowEnd: Coordinates;

      let arrowStartRectIndex: number = -1;
      if (singleArrowCoordsFrom.match('^[0-9]+$')) {
        //console.log('-- d: ' + singleArrowCoordsFrom);
        arrowStartRectIndex = +singleArrowCoordsFrom;
      } else {
        let semanticVersion = singleArrowCoordsFrom.split('.');
        let major: number = +semanticVersion[0]!;
        let minor: number = +semanticVersion[1]!;
        arrowStartRectIndex = (major - 1) * this.cubeWidth + minor;
      }
      //console.log('-- arrowStartRectIndex: ' + arrowStartRectIndex);
      arrowStart = this.rectangleCoordinates[arrowStartRectIndex]!;

      let arrowEndRectIndex: number = -1;
      if (singleArrowCoordsTo.match('^[0-9]+$')) {
        arrowEndRectIndex = +singleArrowCoordsTo;
      } else {
        let semanticVersion = singleArrowCoordsTo.split('.');
        let major: number = +semanticVersion[0]!;
        let minor: number = +semanticVersion[1]!;
        arrowEndRectIndex = (major - 1) * this.cubeWidth + minor;
      }
      //console.log('-- arrowEndRectIndex: ' + arrowEndRectIndex);
      arrowEnd = this.rectangleCoordinates[arrowEndRectIndex]!;

      if (arrowStart === arrowEnd) {
        // console.log("Skip arrow pointing to itself: " + singleArrowCoordsFrom);
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

}
