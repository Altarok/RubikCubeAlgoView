import {Algorithm, AlgorithmStep, possibleSteps} from "../model/algorithms";
import {InvalidInput} from "../model/invalid-input";
import {CubeDimensions} from "../model/geometry";

const stepPattern: string = "[xyzRrLlFfBbUuDdMSE](|'|2)";
const algorithmRegex: RegExp = new RegExp(`^(${stepPattern})( ${stepPattern})*$`);

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: InvalidInput };

/**
 * Type Guard: Tells TS that 'value' is specifically an AlgorithmStep.
 * Validates if a string is a valid Step.
 */
function isAlgorithmStep(value: string): value is AlgorithmStep {
  return (possibleSteps as readonly string[]).includes(value);
}

/**
 * @param row - row containing algorithm steps, may start with 'alg:'
 */
export function parseAlgorithm(row: string): Result<Algorithm> {
  let cleanRow: string = row.startsWith('alg:') ? row.slice(4).trim() : row.trim();

  if (!algorithmRegex.test(cleanRow)) {
    return {success: false, error: InvalidInput.ofAlgorithm(row)};
  }

  let splitSteps: string[] = cleanRow.split(' ');
  let steps: AlgorithmStep[] = [];

  for (const step of splitSteps) {
    if (isAlgorithmStep(step)) {
      steps.push(step);
    } else {
      // This should technically be unreachable if the Regex is perfect
      return {success: false, error: new InvalidInput(row, 'Unknown rotation step: ' + step)};
    }
  }
  return {success: true, data: new Algorithm(steps)};
}

/**
 * @param row string starting with 'dimension:'
 */
export function parseDimensions(row: string): Result<CubeDimensions> {
  /*
   * Cut comments, cut prefix, split width and height
   */
  const dims: number[] | undefined = row.split(' ')[0]?.replace('dimension:', '').split(',').map(Number) as [number, number];
  if (dims?.length === 2 && dims.every(n => n >= 2 && n <= 10)) {
    return {success: true, data: {width: dims[0]!, height: dims[1]!}};
  } else {
    return {success: false, error: InvalidInput.ofDimensions(row)};
  }
}

function parseHexColor(row: string, prefix: string, error: InvalidInput): Result<string> {
  const clean = row.split(' ')[0]?.replace(prefix, '').trim();
  if (clean?.match(/^([a-f0-9]{3}){1,2}$/i)) {
    return { success: true, data: '#' + clean };
  } else {
    return { success: false, error: error };
  }
}

/**
 * @param {string} row - string starting with 'cubeColor:' followed by a hex value for the cube's color
 */
export function parseCubeColor(row: string): Result<string> {
  return parseHexColor(row, 'cubeColor:', InvalidInput.ofCubeColor(row));
}

/**
 * @param {string} row - string starting with 'arrowColor:' followed by a hex value for the arrows' color
 */
export function parseArrowColor(row: string): Result<string> {
  return parseHexColor(row, 'arrowColor:', InvalidInput.ofArrowColor(row));
}


