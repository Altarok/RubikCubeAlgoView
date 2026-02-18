import {CubeState} from "./CubeState";
import {Algorithms} from "./Algorithm";

export class CubeStatePLL extends CubeState {
  algorithms: Algorithms;

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
  }
}
