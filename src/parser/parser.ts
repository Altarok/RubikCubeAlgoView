import {Algorithm, AlgorithmStep, possibleSteps} from "../model/algorithms";
import {InvalidInput} from "../model/codeblock-input";
import {Dimensions} from "../model/geometry";
import {RegEx} from "./regex-util";
import {Flags, FlagType} from "../model/flags";

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

  if (!RegEx.isAlgorithm(cleanRow)) {
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
 * Cuts comments & prefix, split width and height
 * @param row string starting with 'dimension:'
 */
function toDimensions(row: string): Result<Dimensions> {
  const parts = row.split(' ')[0]?.replace('dimension:', '').split(',');
  const [w = 0, h = 0] = parts?.map(Number) ?? [];
  if (w >= 2 && w <= 10 && h >= 2 && h <= 10) {
    return {success: true, data: new Dimensions(w, h)};
  } else {
    return {success: false, error: InvalidInput.ofDimensions(row)};
  }
}

function parseHexColor(row: string,  errorFactory: () => InvalidInput): Result<string> {
  // const clean = row.split(' ')[0]?;
  if (row?.match(/^([a-f0-9]{3}){1,2}$/i)) {
    return {success: true, data: '#' + row};
  } else {
    return {success: false, error: errorFactory()};
  }
}

/**
 * @param {string} row - string starting with 'cubeColor:' followed by a hex value for the cube's color
 */
function toCubeColor(row: string): Result<string> {
  return parseHexColor(row,  () => InvalidInput.ofCubeColor(row));
}

/**
 * @param {string} row - string starting with 'arrowColor:' followed by a hex value for the arrows' color
 */
function toArrowColor(row: string): Result<string> {
  return parseHexColor(row, () => InvalidInput.ofArrowColor(row));
}

function toFlags(row: string): Result<Set<FlagType>> {
  let cleanRow: string = row.startsWith('flags:') ? row.slice(6).trim() : row.trim();

  if (!RegEx.isSpecialFlags(cleanRow)) {
    return {success: false, error: InvalidInput.ofFlags(row)};
  }

  let splitFlags: string[] = cleanRow.split(',');
  let flags: Set<FlagType> = new Set<FlagType>();

  for (const flag of splitFlags) {
    if (Flags.isFlag(flag)) {
      flags.add(flag);
    } else {
      // This should technically be unreachable if the Regex is perfect
      return {success: false, error: new InvalidInput(row, 'Unknown flag: ' + flag)};
    }
  }
  return {success: true, data: flags};
}

/**
 * Splits joined arrow input to array of single arrow input values and check each against a regex.
 * This does not parse to Arrows (with coordinates) yet, as we still have to calculate the cube's dimensions.
 * @param input - string NOT starting with 'arrows:'
 */
function toArrows(input: string): Result<string[]> {
  const cleanedRow = input.trim().split(' ')[0] ?? '';
  const arrowInput: string[] = cleanedRow.split(',');

  if (input.length < 3 || arrowInput.length === 0) {
    return {success: false, error: InvalidInput.ofArrows(input, `Not enough arrow input: ${input}`)};
  }

  for (const arrow of arrowInput) {
    if (!RegEx.isChainedArrow(arrow) && !RegEx.isDoubleSidedArrow(arrow)) {
      return {success: false, error: InvalidInput.ofArrows(input, `Invalid arrow input: ${arrow}`)};
    }
  }

  return {success: true, data: arrowInput};
}


