import {CubeState} from "./CubeState";
import {OllFieldColors} from "../OllFieldColors";

export class CubeStateOLL extends CubeState {
  ollFieldColors: OllFieldColors;

  /*
   * TODO add DTO with map <algorithm, arrows>
   */


  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
  }

}
