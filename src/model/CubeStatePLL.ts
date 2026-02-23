import {CubeState} from "./CubeState";
import {Algorithms} from "./Algorithm";
import {ArrowCoordinates} from "model/ArrowCoordinates";

/**
 * PLL algorithms have a n:1 relation to exchanged cubelets.
 * This means we need 1 set of arrows and n sets of algorithms.
 */
export class CubeStatePLL extends CubeState {
  algorithms: Algorithms;
  arrowCoordinates: ArrowCoordinates[];

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
  }

  /**
   * Clock-wise quarter rotation
   */
  rotateLeft(): void {
    this.algorithms.rotate(1);
  }

  /**
   * Anti-clock-wise quarter rotation
   */
  rotateRight(): void {
    this.algorithms.rotate(3);
  }
}
