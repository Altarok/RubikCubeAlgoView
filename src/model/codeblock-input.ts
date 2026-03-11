import {flags} from "./algorithms";

export const undeclared: string = 'undeclared';
export const InputTypes: string[] =
  ['alg', 'arrowColor', 'arrows', 'cubeColor', 'dimension', 'flags'] as const;

export type InputType = (typeof InputTypes)[number];
type AllPossibleInputs = InputType | typeof undeclared;


export class UserInput {
  listInput: Map<AllPossibleInputs, string[]> = new Map();
  isEmpty: boolean = true;

  constructor(public readonly completeCodeBlock: string[]) {
    for (const key of InputTypes) this.listInput.set(key, []);
    this.listInput.set(undeclared, []);
  }

  add = (key: InputType, value: string): void => {
    this.listInput.get(key)!.push(value);
  }

  addUnmarkedKey = (value: string): void => {
    this.listInput.get(undeclared)!.push(value);
  }

  getArrowColor = () => this.listInput.get('arrowColor')![0] ?? undefined;
  getArrows = () => this.listInput.get('arrows')![0] ?? undefined;
  getCubeColor = () => this.listInput.get('cubeColor')![0] ?? undefined;
  getDimensions = () => this.listInput.get('dimension')![0] ?? undefined;
  getFlags = () => this.listInput.get('flags')![0] ?? undefined;
  getAlgorithms = () => this.listInput.get('alg');
  getUndeclared = () => this.listInput.get('undeclared');

  toString = () => {
    if (this.isEmpty) return 'empty'; else return '' + this.listInput;
  };
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

