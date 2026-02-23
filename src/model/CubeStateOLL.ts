import {CubeState} from "./CubeState";
import {OllFieldColors} from "../OllFieldColors";
import {Algorithm, MappedAlgorithms} from "./Algorithm";
import {ArrowCoordinates} from "./ArrowCoordinates";

let staticId: number = 1;

/**
 * OLL algorithms have a 1:1 relation to exchanged cubelets.
 * This means we need 1 map containing
 * - key: algorithm
 * - value: set of arrows this algorithm implements
 */
export class CubeStateOLL extends CubeState {
  ollFieldColors: OllFieldColors;
  algorithmToArrows: MappedAlgorithms;
  currentAlgorithmIndex: number;
  id: number;

  // /*
  //  * Used to find the selected algorithm even after rotation.
  //  */
  // algBackupForReference: Map<Algorithm, Algorithm>;

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
    this.id = staticId++;
    // console.log(this.id);
    this.currentAlgorithmIndex = 0;
  }

  currentArrowCoordinates(): ArrowCoordinates[] {
    if (this.algorithmToArrows === undefined || this.algorithmToArrows.size === 0) {
      return new Array<ArrowCoordinates>()
    }
    return this.algorithmToArrows.get(this.currentAlgorithmIndex)!.arrows;
  }

  /**
   * Clock-wise quarter rotation
   */
  rotateLeft(): void {
    this.algorithmToArrows.rotate(1);
  }

  /**
   * Anti-clock-wise quarter rotation
   */
  rotateRight(): void {
    this.algorithmToArrows.rotate(3);
  }

  changeAlgorithm(algorithmId: number): boolean {
    // console.log(algorithmId);
    if (this.currentAlgorithmIndex === algorithmId) {
      // console.log('no change');
      return false;
    }
    this.currentAlgorithmIndex = algorithmId;
    // console.log('changed to ' + this.currentAlgorithmIndex);
    return true;
    // for (const algorithm of this.algorithmToArrows.keys()) {
    //   if (algorithm.toString() === algorithmId) {
    //     this.currentAlgorithmIndex = +algorithm; // this.algBackupForReference.get(algorithm);
    //     return true;
    //   }
    // }
    // return false;
  }
}
