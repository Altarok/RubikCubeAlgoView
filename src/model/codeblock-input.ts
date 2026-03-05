import {flags} from "./algorithms";

export const undeclared: string = 'undeclared';
export const BaseInputTypes:string[] =
  ['arrowColor', 'arrows', 'cubeColor', 'dimension', 'flags'] as const;
export const ListInputTypes:string[] = ['alg', undeclared] as const;

export type BaseInputType = (typeof BaseInputTypes)[number];
export type ListInputType = (typeof ListInputTypes)[number];
// export type AnyInputType = BaseInputType | ListInputType;

export class UserInput {
  baseInput: Map<BaseInputType, string> = new Map();
  listInput: Map<ListInputType, string[]> = new Map();
  isEmpty: boolean = true;

  constructor(public readonly completeCodeBlock: string[]) {
    for(const key of ListInputTypes) this.listInput.set(key, new Array<string>());
  }

  getArrowColor = () => this.baseInput.get('arrowColor');
  getArrows = () => this.baseInput.get('arrows');
  getCubeColor = () => this.baseInput.get('cubeColor');
  getDimensions = () => this.baseInput.get('dimension');
  getFlags = () => this.baseInput.get('flags');
  getAlgorithms = () => this.listInput.get('alg');
  getUndeclared = () => this.listInput.get('undeclared');
}

/**
 * Container for invalid user input.
 */
export class InvalidInput {

  /**
   * @param line - the row containing un-interpretable input
   * @param reason - human-readable reason for failure
   */
  constructor(public readonly line: string,
              public readonly reason: string) {
  }

  public toString = () => `InvalidInput[line=${this.line},reason=${this.reason}`;

  static ofCubeColor(line: string): InvalidInput {
    return new InvalidInput(line, 'Invalid cube color, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
  }

  static ofArrowColor(line: string): InvalidInput {
    return new InvalidInput(line, 'Invalid arrow color, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
  }

  static ofAlgorithm(line: string): InvalidInput {
    return new InvalidInput(line, "Invalid algorithm format. Example: alg:R' U2 R U2 R' F R U R' U' R' F' R2 U' (spaces not optional, no comments in this line)");
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

  isInvalidRow = (row: string) => this.line === row;

}

