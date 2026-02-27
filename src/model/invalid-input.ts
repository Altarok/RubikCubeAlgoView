import {flags} from "./algorithms";

export class InvalidInput {
/**
 * Container for invalid user input.
 */

  /**
   * @param line - the row containing un-interpretable input
   * @param reason - human-readable reason for failure
   */
  constructor(public readonly line: string,
              public readonly reason: string) {
  }

  static ofCubeColor(line: string): InvalidInput {
    return new InvalidInput(line, 'Invalid cube color, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
  }

  static ofArrowColor(line: string): InvalidInput {
    return new InvalidInput(line, 'Invalid arrow color, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
  }

  static ofAlgorithm(line: string): InvalidInput {
    return new InvalidInput(line,"Invalid algorithm format. Example: alg:R' U2 R U2 R' F R U R' U' R' F' R2 U' (spaces not optional, no comments in this line)");
  }

  static ofPllParameter(line: string): InvalidInput {
    return new InvalidInput(line, "Invalid parameter. Expected: 'dimension/cubeColor/arrowColor/arrows'");
  }

  static ofDimensions(line: string) {
    return new InvalidInput(line, 'Invalid dimensions. Expected: "dimension:[2-10],[2-10]" (e.g. "dimension:3,3")');
  }

  static ofFlags(line: string) {
    return new InvalidInput(line, `Invalid flag. Allowed: ${flags.join(',')}`);
  }

  static ofArrows(line: string, reason: string) {
    return new InvalidInput(line, reason);
  }
}

export const isInvalidRow = ({line}: InvalidInput, row: string): boolean => {
  return line === row;
};


