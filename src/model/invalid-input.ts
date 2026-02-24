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
}

export const isInvalidRow = (input: InvalidInput, row: string): boolean => {
  return input.line === row;
};


