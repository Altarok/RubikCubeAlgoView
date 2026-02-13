import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";
import {BaseCodeBlockInterpreter} from "./BaseCodeBlockInterpreter";
import {ArrowCoordinates} from "./ArrowCoordinates";

export abstract class ArrowCalculations extends BaseCodeBlockInterpreter {
  arrowColor: string;
  arrowsLine: string;
  arrows: string;
  /** Nested array of coordinates. Contains start and end coordinates of arrow in pixels. */
  arrowCoordinates: ArrowCoordinates[];

  protected constructor(rows: string[], settings: RubikCubeAlgoSettingsTab) {
    super(rows);
    if (settings.arrowColor) {
      this.arrowColor = settings.arrowColor;
    } else {
      this.arrowColor = DEFAULT_SETTINGS.ARROW_COLOR;
    }
    this.arrows = "";
    this.arrowCoordinates = new Array<ArrowCoordinates>();
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
      // console.log("new arrows: '" + this.arrows + "'");
    } else {
      super.errorInThisLine(row, 'arrow color value should match "arrowColor:" + [3 (or 6) lowercase hex digits (0-9/a-f)]');
    }
  }

  getArrowCoordinates() : ArrowCoordinates[]  {
    return this.arrowCoordinates;
  }
}
