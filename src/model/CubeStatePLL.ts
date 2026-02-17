import {CubeState} from "./CubeState";
import {Dimensions} from "./Dimensions";

export class CubeStatePLL extends CubeState {

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
  }

  getDrawDimensions(): Dimensions {
    return new Dimensions(this.cubeWidth * 100, this.cubeHeight * 100);
  }

}
