import { DEFAULT_SETTINGS, RubikCubeAlgosSettings } from "./RubikCubeAlgoSettings";
import { BaseCodeBlockInterpreter } from "./BaseCodeBlockInterpreter";

export class ArrowCalculations extends BaseCodeBlockInterpreter {

  constructor(rows:string[], settings:RubikCubeAlgosSettings) {
    super(rows);
  }
}