import {Coordinates} from "./model/Coordinates";
import {ArrowCoordinates} from "./model/ArrowCoordinates";
import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";
import {InvalidInputContainer} from "./model/InvalidInputContainer";

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
    // this.arrows = "";
  }

  setup(): void {
    /* Keep order of the following 3 functions */
    if (!this.codeBlockInterpretationSuccessful) {
      return;
    }
    this.interpretCodeBlock(this.codeBlockContent);
    this.setupCubeRectangleCenterCoordinates();
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

  errorWhileParsing(errorData: InvalidInputContainer): void {
    this.errorInThisLine(errorData.nonInterpretableLine, errorData.reasonForFailure);
  }

  setupArrowCoordinates(arrowInput: string): ArrowCoordinates[] {

    /* Method's return value: */
    let arrowCoordinates: ArrowCoordinates[] = new Array<ArrowCoordinates>();

    let completeArrowsInput: string[] = arrowInput.split(',').filter((x) => x.length > 0);
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
      // console.log("-- Arrow goes from '"+singleArrowCoordsFrom+"' to '"+singleArrowCoordsTo+"'");

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
      // console.log('-- arrowStartRectIndex: ' + arrowStartRectIndex);
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
      // console.log('-- arrowEndRectIndex: ' + arrowEndRectIndex);
      arrowEnd = this.rectangleCoordinates[arrowEndRectIndex]!;

      if (arrowStart === arrowEnd) {
        // console.log("Skip arrow pointing to itself: " + singleArrowCoordsFrom);
        this.errorInThisLine(arrowInput, "arrow '" + singleArrowCoords + "' is pointing to its starting point");
        continue;
      }


      let newArrow: ArrowCoordinates = new ArrowCoordinates(arrowStart, arrowEnd);
      // console.log('new arrow: ' + newArrow.toString());
      arrowCoordinates.push(newArrow);

      if (isDoubleSided) { // add reverse copy
        let newArrowReversed: ArrowCoordinates = new ArrowCoordinates(arrowEnd, arrowStart);
        // console.log('new arrow: ' + newArrowReversed.toString());
        arrowCoordinates.push(newArrowReversed);
      }
    }
    // console.log('<< getArrowCoordinates, ' + arrowCoordinates);
    return arrowCoordinates;
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




}
