const DEFAULT = {
  WIDTH: 3, /* default rubik cube width  */
  HEIGHT: 3 /* default rubik cube height */
} as const;

export abstract class BaseCodeBlockInterpreter {
  /** cube width (rectangles, not pixels) */
  cubeWidth: number;
  /** cube height (rectangles, not pixels) */
  cubeHeight: number;
  codeBlockContent: string[];
  codeBlockInterpretationSuccessful: boolean;
  lastNonInterpretableLine: string;
  reasonForFailure: string;


  constructor(codeBlockContent: string[]) {
    this.cubeWidth = DEFAULT.WIDTH;
    this.cubeHeight = DEFAULT.HEIGHT;
    this.codeBlockContent = codeBlockContent;
    this.codeBlockInterpretationSuccessful = true;

    if (codeBlockContent.length === 0) {
      this.errorInThisLine("[empty]", "at least 1 parameter needed: 'dimension/cubeColor/arrowColor/arrows'");
    }
  }

  setup(): void {
    /* Keep order of the following 3 functions */
    if (!this.codeBlockInterpretationSuccessful) {
      return;
    }
    this.interpretCodeBlock(this.codeBlockContent);
    this.setupCubeRectangleCenterCoordinates();
    this.setupArrowCoordinates();
  }


  /**
   * This must include calculating the cube dimensions
   *
   * @param {string[]} rows - code block content
   */
  abstract interpretCodeBlock(rows: string[]): void;

  abstract setupCubeRectangleCenterCoordinates(): void;

  abstract setupArrowCoordinates(): void;

  /**
   * Called when the interpretation of a code block failed.
   * @param {string} lineWithError - the row containing un-interpretable input
   * @param {string} reason - human-readable reason for failure
   */
  errorInThisLine(lineWithError: string, reason: string): void {
    this.codeBlockInterpretationSuccessful = false;
    this.lastNonInterpretableLine = lineWithError;
    this.reasonForFailure = reason;
    console.log('Unexpected input: "' + lineWithError + '" (' + reason + ')');
  }

  codeBlockInterpretationFailed(): boolean {
    return !this.codeBlockInterpretationSuccessful;
  }

  isRowInterpretable(row: string): boolean {
    return !(row === this.lastNonInterpretableLine);
  }

}
