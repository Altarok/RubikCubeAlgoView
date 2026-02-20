import {Coordinates} from "./model/Coordinates";
import {ArrowCoordinates} from "./model/ArrowCoordinates";
import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";

const DEFAULT = {
  WIDTH: 3, /* default rubik cube width  */
  HEIGHT: 3 /* default rubik cube height */
} as const;

export abstract class CodeBlockInterpreterBase {
  /** cube width (rectangles, not pixels) */
  protected cubeWidth: number;
  /** cube height (rectangles, not pixels) */
  protected cubeHeight: number;
  protected codeBlockContent: string[];
  protected codeBlockInterpretationSuccessful: boolean;
  protected lastNonInterpretableLine: string;
  protected reasonForFailure: string;

  protected rectangleCoordinates: Coordinates[];
  protected arrowColor: string;
  protected arrowsLine: string;
  protected arrows: string;
  /** Nested array of coordinates. Contains start and end coordinates of arrows in pixels. */
  protected arrowCoordinates: ArrowCoordinates[];

  protected constructor(codeBlockContent: string[], settings: RubikCubeAlgoSettingsTab) {
    this.codeBlockContent = codeBlockContent;
    this.codeBlockInterpretationSuccessful = true;

    if (codeBlockContent.length === 0) {
      this.errorInThisLine("[empty]", "at least 1 parameter needed: 'dimension/cubeColor/arrowColor/arrows'");
    }

    this.cubeWidth = DEFAULT.WIDTH;
    this.cubeHeight = DEFAULT.HEIGHT;

    this.rectangleCoordinates = new Array<Coordinates>();
    if (settings.arrowColor) {
      this.arrowColor = settings.arrowColor;
    } else {
      this.arrowColor = DEFAULT_SETTINGS.ARROW_COLOR;
    }
    this.arrows = "";
    this.arrowCoordinates = new Array<ArrowCoordinates>();
  }

  setup(): void {
    /* Keep order of the following 3 functions */
    if (!this.codeBlockInterpretationSuccessful) {
      return;
    }
    this.interpretCodeBlock(this.codeBlockContent);
    this.setupCubeRectangleCenterCoordinates();
    this.setupArrowCoordinates();
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
    this.rectangleCoordinates.push(coords);
  }

  /**
   * Called when the interpretation of a code block failed.
   * @param {string} lineWithError - the row containing un-interpretable input
   * @param {string} reason - human-readable reason for failure
   */
  errorInThisLine(lineWithError: string, reason: string): void {
    this.codeBlockInterpretationSuccessful = false;
    this.lastNonInterpretableLine = lineWithError;
    this.reasonForFailure = reason;
  }

  setupArrowCoordinates(): void {

    let completeArrowsInput: string[] = this.arrows.split(',').filter((x) => x.length > 0);
    let isDoubleSided: boolean = false;

    for (let i: number = 0; i < completeArrowsInput.length; i++) {
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
        this.errorInThisLine(this.arrowsLine, "arrow '" + singleArrowCoords + "' is pointing to its starting point");
        continue;
      }

      this.arrowCoordinates.push(new ArrowCoordinates(arrowStart, arrowEnd));

      if (isDoubleSided) { // add reverse copy
        this.arrowCoordinates.push(new ArrowCoordinates(arrowEnd, arrowStart));
      }
    }
    //console.log('<< getArrowCoordinates, ' + this.arrowCoordinates);
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
      this.errorInThisLine(row, 'invalid, expected: "arrowColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
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
    } else {
      this.errorInThisLine(row, 'arrow color value should match "arrowColor:" + [3 (or 6) lowercase hex digits (0-9/a-f)]');
    }
  }


}
