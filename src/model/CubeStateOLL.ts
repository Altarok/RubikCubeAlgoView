import {CubeState} from "./CubeState";
import {Dimensions} from "./Dimensions";

export class CubeStateOLL extends CubeState {

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
    this.backgroundColor = '#000'
  }

  getDrawDimensions(): Dimensions {
    return new Dimensions(this.cubeWidth * 100 + 100, this.cubeHeight * 100 + 100);
  }

}
