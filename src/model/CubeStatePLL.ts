import {CubeState} from "./CubeState";
import {Algorithm} from "./Algorithm";

export class CubeStatePLL extends CubeState {
  algorithms: Algorithm[];

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
  }

}
