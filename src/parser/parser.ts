import {Algorithm, AlgorithmStep, flags, possibleSteps, SpecialFlags} from "../model/algorithms";
import {InvalidInput} from "../model/invalid-input";
import {Dimensions} from "../model/geometry";

const stepPattern: string = "[xyzRrLlFfBbUuDdMSE](|'|2)";
const algorithmRegex: RegExp = new RegExp(`^(${stepPattern})( ${stepPattern})*$`);

type Result<T> =
  | { success: true; data: T }
  | { success: false; error: InvalidInput };

/*
 * Object Namespace
 */
export const Parse = {
  toAlgorithm,
  toArrowColor,
  toArrows,
  toCubeColor,
  toDimensions,
  toFlags
};

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
function toAlgorithm(row: string): Result<Algorithm> {
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
function toDimensions(row: string): Result<Dimensions> {
  /*
   * Cut comments, cut prefix, split width and height
   */
  const parts = row.split(' ')[0]?.replace('dimension:', '').split(',');
  const [w = 0, h = 0] = parts?.map(Number) ?? [];
  if (/*w && h &&*/ w >= 2 && w <= 10 && h >= 2 && h <= 10) {
    return {success: true, data: new Dimensions(w, h)};
  } else {
    return {success: false, error: InvalidInput.ofDimensions(row)};
  }
}

function parseHexColor(row: string, prefix: string, errorFactory: () => InvalidInput): Result<string> {
  const clean = row.split(' ')[0]?.replace(prefix, '').trim();
  if (clean?.match(/^([a-f0-9]{3}){1,2}$/i)) {
    return {success: true, data: '#' + clean};
  } else {
    return {success: false, error: errorFactory()};
  }
}

/**
 * @param {string} row - string starting with 'cubeColor:' followed by a hex value for the cube's color
 */
function toCubeColor(row: string): Result<string> {
  return parseHexColor(row, 'cubeColor:', () => InvalidInput.ofCubeColor(row));
}

/**
 * @param {string} row - string starting with 'arrowColor:' followed by a hex value for the arrows' color
 */
function toArrowColor(row: string): Result<string> {
  return parseHexColor(row, 'arrowColor:', () => InvalidInput.ofArrowColor(row));
}

function isSpecialFlag(value: string): value is SpecialFlags {
  return (flags as readonly string[]).includes(value);
}

const specialFlagsJoined: string = flags.join('|');
const specialFlagsPattern: RegExp = new RegExp(`${specialFlagsJoined}(,${specialFlagsJoined})*`);

function toFlags(row: string): Result<SpecialFlags[]> {
  let cleanRow: string = row.startsWith('flags:') ? row.slice(6).trim() : row.trim();

  if (!specialFlagsPattern.test(cleanRow)) {
    return {success: false, error: InvalidInput.ofFlags(row)};
  }

  let splitFlags: string[] = cleanRow.split(',');
  let flags: SpecialFlags[] = [];

  for (const flag of splitFlags) {
    if (isSpecialFlag(flag)) {
      flags.push(flag);
    } else {
      // This should technically be unreachable if the Regex is perfect
      return {success: false, error: new InvalidInput(row, 'Unknown flag: ' + flag)};
    }
  }
  return {success: true, data: flags};
}

/**
 * @param row - string starting with 'arrows:'
 */
function toArrows(row: string): Result<string> {
  if (row.match('^arrows:\\d+(\\.\\d+)?(-|\\+)\\d+(\\.\\d+)?(,\\d+(\\.\\d+)?((-|\\+)\\d+(\\.\\d+))*?)*( //.*)?')) {
    /* do not parse yet, as we still have to calculate the cube dimensions*/
    const arrowsOnly = row.slice(6).trim().split(' ')[0];


    // @ts-ignore checked with regex
    return {success: true, data: row.slice(6).split(' ')[0].trim()};
  } else {
    return {success: false, error: InvalidInput.ofArrows(row, 'Invalid arrow input.')};
  }
}


