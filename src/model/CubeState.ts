import {InvalidInputContainer} from "./InvalidInputContainer";
import {Dimensions} from "./Dimensions";


export abstract class CubeState {
  /** Code block content */
  codeBlockContent!: string[];
  /** Container for invalid code block content */
  invalidInputContainer?: InvalidInputContainer;
  /** cube width (rectangles, not pixels) */
  cubeWidth: number;
  /** cube height (rectangles, not pixels) */
  cubeHeight: number;
  /** the arrows' color */
  arrowColor: string;
  /** the background's color */
  backgroundColor: string;
  /** SVG metadata */
  viewBoxDimensions: Dimensions;

  protected constructor(codeBlockContent: string[]) {
    this.codeBlockContent = codeBlockContent;
  }

  /**
   * @return true if cube size equals 3 by 3
   */
  isDefaultCubeSize(): boolean {
    return this.cubeWidth === 3 && this.cubeHeight === 3;
  }

  codeBlockInterpretationFailed(): boolean {
    return this.invalidInputContainer != undefined;
  }

}
