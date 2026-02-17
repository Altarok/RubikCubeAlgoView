import {CubeState} from "./CubeState";
import {OllFieldInput} from "../OllFieldInput";

export class CubeStateOLL extends CubeState {
  ollFieldInput: OllFieldInput;

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
  }

}
