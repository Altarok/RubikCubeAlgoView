


export class BaseCodeBlockInterpreter {
  codeBlockContent:string[];

  constructor(cbc:string[]) {
    this.codeBlockContent = cbc;
  }
  private errorInThisLine(mandatoryLastLineNotInterpretable:string, optionalReasonForFailure:string):void {
    this.codeBlockInterpretationSuccessful=false;
    this.lastNonInterpretableLine=mandatoryLastLineNotInterpretable;
    if (optionalReasonForFailure) {
      this.reasonForFailure=optionalReasonForFailure;
    }
    console.log('Unexpected PLL input: "'+mandatoryLastLineNotInterpretable+'"');
  }
}