import {CubeState} from "./CubeState";
import {OllFieldColors} from "../OllFieldColors";

export class CubeStateOLL extends CubeState {
  ollFieldColors: OllFieldColors;

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
  }

}
