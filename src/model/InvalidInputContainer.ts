/**
 * Container for invalid user input.
 */
export class InvalidInputContainer {
  nonInterpretableLine: string;
  reasonForFailure: string;

  constructor(lastNonInterpretableLine: string, reasonForFailure: string) {
    this.nonInterpretableLine = lastNonInterpretableLine;
    this.reasonForFailure = reasonForFailure;
  }

  isInvalidRow(row: string): boolean {
    return this.nonInterpretableLine === row;
  }

}
