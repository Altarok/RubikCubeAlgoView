import {InvalidInputContainer} from "./InvalidInputContainer";
import {Dimensions} from "./Dimensions";
import { ArrowCoordinates } from "model/ArrowCoordinates";

export abstract class CubeState {
  /** Code block content */
  codeBlockContent: string[];
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
  arrowCoordinates: ArrowCoordinates[];

  protected constructor(codeBlockContent: string[]) {
    this.codeBlockContent = codeBlockContent;
  }

  abstract getDrawDimensions(): Dimensions;

  isDefaultCubeSize(): boolean {
    return this.cubeWidth === this.cubeHeight && this.cubeWidth === 3;
  }

  codeBlockInterpretationFailed(): boolean {
    return this.invalidInputContainer != undefined;
  }

  getInvalidInputContainer(): InvalidInputContainer | undefined {
    return this.invalidInputContainer;
  }

}
