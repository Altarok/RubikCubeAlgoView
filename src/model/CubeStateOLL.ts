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
  currentAlgorithm: Algorithm;
  id: number;

  // /*
  //  * Used to find the selected algorithm even after rotation.
  //  */
  // algBackupForReference: Map<Algorithm, Algorithm>;

  constructor(codeBlockContent: string[]) {
    super(codeBlockContent);
    this.id = staticId++;
    console.log(this.id);
  }

  currentArrowCoordinates(): ArrowCoordinates[] {
    if (this.currentAlgorithm === undefined || this.currentAlgorithm === null) {
      return new Array<ArrowCoordinates>()
    }
    return this.algorithmToArrows.get(this.currentAlgorithm);
  }

  /**
   * Clock-wise quarter rotation
   */
  rotateLeft(): void {
    this.algorithmToArrows.rotate(1);
    this.currentAlgorithm.rotate(1);
  }

  /**
   * Anti-clock-wise quarter rotation
   */
  rotateRight(): void {
    this.algorithmToArrows.rotate(3);
    this.currentAlgorithm.rotate(3);
  }

  changeAlgorithm(algorithmId: string): boolean {
    if (this.currentAlgorithm.toString() === algorithmId) return false;
    for (const algorithm of this.algorithmToArrows.keys()) {
      if (algorithm.toString() === algorithmId) {
        this.currentAlgorithm = algorithm; // this.algBackupForReference.get(algorithm);
        return true;
      }
    }
    return false;
  }
}
