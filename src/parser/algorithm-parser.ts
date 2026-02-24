import {Algorithm,  AlgorithmStep, possibleSteps} from "../model/algorithms";
import {InvalidInput} from "../model/invalid-input";

const stepPattern: string = "[xyzRrLlFfBbUuDdMSE](|'|2)";
const algorithmRegex: RegExp = new RegExp(`^(${stepPattern})( ${stepPattern})*$`);

export class AlgorithmParser {

  /**
   * @param row - row containing algorithm steps, may start with 'alg:'
   */
  parse(row: string): Algorithm | InvalidInput {
    let cleanRow: string = row.startsWith('alg:') ? row.slice(4).trim() : row.trim();

    if (!algorithmRegex.test(cleanRow)) {
      return InvalidInput.ofAlgorithm(row);
    }

    let splitSteps: string[] = cleanRow.split(' ');
    let steps: AlgorithmStep[] = [];

    for (const step of splitSteps) {
      if (isAlgorithmStep(step)) {
        steps.push(step);
      } else {
        // This should technically be unreachable if the Regex is perfect
        return new InvalidInput(row, `Unknown rotation step: ${step}`);
      }
    }
    return new Algorithm(steps);
  }

}

/**
 * Type Guard: Tells TS that 'value' is specifically an AlgorithmStep.
 * Validates if a string is a valid Step.
 */
function isAlgorithmStep(value: string): value is AlgorithmStep {
  return (possibleSteps as readonly string[]).includes(value);
}

// function parseAlgorithmStep(input: string): AlgorithmStep | null {
//   if (isAlgorithmStep(input)) {
//     return input;
//   }
//   return null;
// }
