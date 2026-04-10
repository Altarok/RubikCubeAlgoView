import {Flags} from "./flags";

/** Container for invalid user input. */
export class InvalidInput {
  /** @param line - the row containing un-interpretable input TODO replace
   * @param reason - human-readable reason for failure   */
  constructor(public line: string, public readonly reason: string) {
    // debugger;
  }

  public isInvalidRow(row: string): boolean {
    return this.line === row
  }

  public toString(): string {
    return `InvalidInput[line=${this.line},reason=${this.reason}`
  }

  static ofCubeColor(line: string): InvalidInput {
    return new InvalidInput(line, 'Invalid cube color, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"')
  }

  static ofArrowColor(line: string): InvalidInput {
    return new InvalidInput(line, 'Invalid arrow color, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"')
  }

  static ofAlgorithm(line: string): InvalidInput {
    return new InvalidInput(line, "Invalid algorithm format. Example: alg:R' U2 R U2 R' F R U R' U' R' F' R2 U' (spaces not optional, no comments in this line)")
  }

  static ofDimensions(line: string): InvalidInput {
    return new InvalidInput(line, 'Invalid dimensions. Expected: "dimension:[2-10],[2-10]" (e.g. "dimension:3,3")')
  }

  static ofFlags(line: string): InvalidInput {
    return new InvalidInput(line, `Invalid flag. Allowed: ${Flags.types.join(',')}`)
  }
}

