export class BaseCodeBlockInterpreter {
  codeBlockContent:string[];
  codeBlockInterpretationSuccessful:boolean;
  lastNonInterpretableLine:string;
  reasonForFailure:string;

  constructor(cbc:string[]) {
    this.codeBlockContent = cbc;
    this.codeBlockInterpretationSuccessful = true;
  }
  /**
   * Called when the interpretation of a code block failed.
   * @param {string} lineWithError - the row containing un-interpretable input
   * @param {string} reason - human-readable reason for failure
   */
  errorInThisLine(lineWithError:string, reason:string):void {
    this.codeBlockInterpretationSuccessful = false;
    this.lastNonInterpretableLine = lineWithError;
    this.reasonForFailure=reason;
    console.log('Unexpected input: "'+lineWithError+'" ('+reason+')');
  }
  codeBlockInterpretationFailed():boolean {
    return !this.codeBlockInterpretationSuccessful;
  }
  isRowInterpretable(row:string):boolean {
    return !(row === this.lastNonInterpretableLine);
  }
}