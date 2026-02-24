import {Algorithm,  AlgorithmStep, possibleSteps} from "../model/algorithms";
import {InvalidInput} from "../model/invalid-input";

const possibleStepsPattern: string = "[xyzRrLlFfBbUuDdMSE](|'|2)";
const algorithmPattern: string = possibleStepsPattern + '( ?' + possibleStepsPattern + ')*';
const stepSeparator: string = ' ';

export class AlgorithmParser {

  /**
   * @param {string} row - string starting with 'alg:'
   */
  parse(row: string): Algorithm | InvalidInput {
    if (!row.match('^' + algorithmPattern + '$')) {
      return new InvalidInput(row, "invalid, expected algorithm  like: alg:R' U2 R U2 R' F R U R' U' R' F' R2 U' (spaces not optional, no comments in this line)");
    }
    let splitSteps: string[] = row.split(stepSeparator);
    let steps: AlgorithmStep[] = new Array<AlgorithmStep>();

    for (let i: number = 0; i < splitSteps.length; i++) {
      if (isAlgorithmStep(splitSteps[i]!)) {
        let val: AlgorithmStep | null = parseAlgorithmStep(splitSteps[i]!);
        if (val != null) {
          steps.push(val);
        }
      } else {
        console.error(`Invalid AlgorithmStep: ${splitSteps[i]}`);
      }
    }

    return new Algorithm(steps);
  }

}

/**
 * Validates if a string is a valid Step
 */
function isAlgorithmStep(value: string): value is AlgorithmStep {
  return (possibleSteps as readonly string[]).includes(value);
}

function parseAlgorithmStep(input: string): AlgorithmStep | null {
  if (isAlgorithmStep(input)) {
    return input;
  }
  return null;
}
