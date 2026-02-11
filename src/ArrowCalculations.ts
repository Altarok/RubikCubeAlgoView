import { DEFAULT_SETTINGS, RubikCubeAlgosSettings } from "./RubikCubeAlgoSettings";
import { BaseCodeBlockInterpreter } from "./BaseCodeBlockInterpreter";

export class ArrowCalculations extends BaseCodeBlockInterpreter {
  arrowColor:string;
  arrows:string;

  constructor(rows:string[], settings:RubikCubeAlgosSettings) {
    super(rows);
    if (settings.arrowColor){
      this.arrowColor = settings.arrowColor;
    } else {
      this.arrowColor = DEFAULT_SETTINGS.ARROW_COLOR;
    }
    this.arrows = "";
  }

  /**
   * @param row string starting with 'arrowColor:'
   */ 
  handleArrowColorInput(row:string):void {
    if (row.match('^arrowColor:([a-f0-9]{3}){1,2}( //.*)?')) {
      let newAroClr = row.split(' ')[0].trim().replace('arrowColor:','')
      // console.log("new arrow color: '"+newAroClr+"'");
      this.arrowColor = '#' + newAroClr;
    } else {
      super.errorInThisLine(row, 'arrow color value should match "arrowColor:" + [3 (or 6) lowercase hex digits (0-9/a-f)]');
    }
  }

  /**
   * @param row string starting with 'arrows:'
   */
  public handleArrowsInput(row:string):void {
    if (row.match('^arrows:\\d+(\\.\\d+)?(-|\\+)\\d+(\\.\\d+)?(,\\d+(\\.\\d+)?(-|\\+)\\d+(\\.\\d+)?)*( //.*)?')) {
      /* do not parse yet, another line may still brake the input which makes the calculation obsolete */
      let arrowInput = row.split(' ')[0].trim().replace('arrows:','');
      // console.log("new arrows: '" + arrowInput + "'");
      this.arrows = arrowInput;
    } else {
      super.errorInThisLine(row, 'arrow color value should match "arrowColor:" + [3 (or 6) lowercase hex digits (0-9/a-f)]');
    }
  }
  
}