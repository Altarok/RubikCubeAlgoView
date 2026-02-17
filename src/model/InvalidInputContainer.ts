export class InvalidInputContainer {
  lastNonInterpretableLine: string;
  reasonForFailure: string;

  constructor(lastNonInterpretableLine: string, reasonForFailure: string) {
    this.lastNonInterpretableLine = lastNonInterpretableLine;
    this.reasonForFailure = reasonForFailure;
  }

  isInvalidRow(row: string): boolean {
    return this.lastNonInterpretableLine === row;
  }

}
