import {Algorithm, AlgorithmStep, possibleSteps} from "../model/algorithms";
import {InvalidInput} from "../model/codeblock-input";
import {Dimensions} from "../model/geometry";
import {RegEx} from "./regex-util";
import {Flags, FlagType} from "../model/flags";

export type Result<T> =
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
 * @param line - pre-trimmed line containing algorithm steps, no 'alg:'-prefix, no comments
 * @param completeLine - used to mark part of code block if given input is invalid
 */
function toAlgorithm(line: string, completeLine: string): Result<Algorithm> {
  if (!RegEx.isAlgorithm(line)) {
    return {success: false, error: InvalidInput.ofAlgorithm(completeLine)};
  }

  let splitSteps: string[] = line.split(' ');
  let steps: AlgorithmStep[] = [];

  for (const step of splitSteps) {
    if (isAlgorithmStep(step)) {
      steps.push(step);
    } else {
      // This should technically be unreachable if the Regex is perfect
      return {success: false, error: new InvalidInput(completeLine, 'Unknown rotation step: ' + step)};
    }
  }
  return {success: true, data: new Algorithm(steps)};
}

/**
 * @param line - pre-trimmed line containing dimensions, no 'dimension:'-prefix, no comments
 * @param completeLine - used to mark part of code block if given input is invalid
 */
function toDimensions(line: string, completeLine: string): Result<Dimensions> {
  const parts = line.split(',');
  const [w = 0, h = 0] = parts?.map(Number) ?? [];
  if (w >= 2 && w <= 10 && h >= 2 && h <= 10) {
    return {success: true, data: new Dimensions(w, h)};
  } else {
    return {success: false, error: InvalidInput.ofDimensions(completeLine)};
  }
}

/**
 * @param line - pre-trimmed row containing a color hex value, no 'dimension:'-prefix, no comments
 * @param errorFactory - use when input is not a color hex value
 */
function parseHexColor(line: string, errorFactory: () => InvalidInput): Result<string> {
  if (RegEx.isColorHexValue(line)) {
    return {success: true, data: '#' + line};
  } else {
    return {success: false, error: errorFactory()};
  }
}

/**
 * @param input - pre-trimmed row containing a color hex value, no 'cubeColor:'-prefix, no comments
 * @param completeLine - used to mark part of code block if given input is invalid
 */
function toCubeColor(input: string, completeLine: string): Result<string> {
  return parseHexColor(input, () => InvalidInput.ofCubeColor(completeLine));
}

/**
 * @param input - pre-trimmed row containing a color hex value, no 'arrowColor:'-prefix, no comments
 * @param completeLine - used to mark part of code block if given input is invalid
 */
function toArrowColor(input: string, completeLine: string): Result<string> {
  return parseHexColor(input, () => InvalidInput.ofArrowColor(completeLine));
}

/**
 * @param input - pre-trimmed row containing special flags, no 'flags:'-prefix, no comments
 * @param completeLine - used to mark part of code block if given input is invalid
 */
function toFlags(input: string, completeLine: string): Result<FlagType[]> {

  if (!RegEx.isSpecialFlags(input)) {
    return {success: false, error: InvalidInput.ofFlags(completeLine)};
  }

  let splitFlags: string[] = input.split(',');
  let flags: Set<FlagType> = new Set<FlagType>();

  for (const flag of splitFlags) {
    if (Flags.isFlag(flag)) {
      flags.add(flag);
    } else {
      // This should technically be unreachable if the Regex is perfect
      return {success: false, error: new InvalidInput(completeLine, 'Unknown flag: ' + flag)};
    }
  }
  /* add 'default' if missing, remove it if redundant */
  if (flags.size > 1 && flags.has('default')) flags.delete('default');
  else if (flags.size === 0) flags.add('default');
  return {success: true, data: Array.from(flags)};
}

/**
 * Splits joined arrow input to array of single arrow input values and check each against a regex.
 * This does not parse to Arrows (with coordinates) yet, as we still have to calculate the cube's dimensions.
 * @param input - string NOT starting with 'arrows:'
 * @param completeLine - used to mark part of code block if given input is invalid
 */
function toArrows(input: string, completeLine: string): Result<string[]> {
  const cleanedRow = input.trim().split(' ')[0] ?? '';
  const arrowInput: string[] = cleanedRow.split(',');

  if (input.length < 3 || arrowInput.length === 0) {
    return {success: false, error: new InvalidInput(completeLine, `Not enough arrow input: ${input}`)};
  }

  for (const arrow of arrowInput) {
    if (!RegEx.isChainedArrow(arrow) && !RegEx.isDoubleSidedArrow(arrow)) {
      return {success: false, error: new InvalidInput(completeLine, `Invalid arrow input: ${arrow}`)};
    }
  }

  return {success: true, data: arrowInput};
}


