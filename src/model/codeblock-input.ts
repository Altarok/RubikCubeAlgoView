import {Flags} from "./flags";

export const undeclared: string = 'undeclared';
export const InputTypes: string[] =
  ['alg', 'arrowColor', 'arrows', 'cubeColor', 'dimension', 'flags', 'id'] as const;

export type InputType = (typeof InputTypes)[number];
type AllPossibleInputs = InputType | typeof undeclared;

/** Container for valid user input. */
export class UserInput {
  listInput: Map<AllPossibleInputs, string[]> = new Map();
  isEmpty: boolean = true;

  constructor(public readonly completeCodeBlock: string[]) {
    for (const key of InputTypes) this.listInput.set(key, []);
    this.listInput.set(undeclared, []);
  }

  add = (key: InputType, value: string): void => {
    this.listInput.get(key)!.push(value);
    this.isEmpty = false;
  }
  addUnmarkedKey = (value: string): void => {
    this.listInput.get(undeclared)!.push(value);
    this.isEmpty = false;
  }
  getAlgorithms = () => this.listInput.get('alg');
  getArrowColor = () => this.listInput.get('arrowColor')![0] ?? undefined;
  /** PLL only: User input keyed 'arrows'. E.g. '1+3,4+8' */
  getArrows = () => this.listInput.get('arrows')![0] ?? undefined;
  getCubeColor = () => this.listInput.get('cubeColor')![0] ?? undefined;
  /** PLL only: User input keyed 'dimension'. E.g. '3,3' */
  getDimensions = () => this.listInput.get('dimension')![0] ?? undefined;
  getFlags = (): string => this.listInput.get('flags')![0] ?? 'default';
  /** ID for manual identification and caching of rotation */
  getId = () => this.listInput.get('id')![0] ?? undefined;
  getUndeclared = () => this.listInput.get('undeclared');

  toString = () => {
    if (this.isEmpty) return 'empty'; else {
      let s = '';
      for (const key of InputTypes) {
        if (this.get(key).length > 1) {
          s = s + key + ' = ' + '\n' + this.listInput.get(key)?.join('\n') + '\n';
        } else if (this.get(key).length === 1) {
          s = s + key + ' = ' + this.get(key).toString() + '\n';
        }
      }
      return s.trim();
    }
  };

  private get(key: string): string[] {
    return this.listInput.get(key) ?? [];
  }
}

/** Container for invalid user input. */
export class InvalidInput {
  /** @param line - the row containing un-interpretable input
   * @param reason - human-readable reason for failure   */
  constructor(public line: string, public readonly reason: string) {
  }

  isInvalidRow = (row: string) => this.line === row;
  toString = () => `InvalidInput[line=${this.line},reason=${this.reason}`;
  static ofCubeColor = (line: string): InvalidInput => new InvalidInput(line, 'Invalid cube color, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
  static ofArrowColor = (line: string): InvalidInput => new InvalidInput(line, 'Invalid arrow color, expected: "cubeColor:[3 (or 6) lowercase hex digits (0-9/a-f)] // optional comment goes here"');
  static ofAlgorithm = (line: string): InvalidInput => new InvalidInput(line, "Invalid algorithm format. Example: alg:R' U2 R U2 R' F R U R' U' R' F' R2 U' (spaces not optional, no comments in this line)");
  static ofDimensions = (line: string): InvalidInput => new InvalidInput(line, 'Invalid dimensions. Expected: "dimension:[2-10],[2-10]" (e.g. "dimension:3,3")');
  static ofFlags = (line: string): InvalidInput => new InvalidInput(line, `Invalid flag. Allowed: ${Flags.types.join(',')}`);
}

