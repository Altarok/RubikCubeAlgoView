import {Flags} from "../model/flags";

export const RegEx = {
  isAlgorithm, isChainedArrow, isDoubleSidedArrow, isPositiveInteger, isSpecialFlags, isColorHexValue
}

/*
 * Necessary for arrow input validation
 */
const positiveIntegerPattern = '[1-9]\\d*';
const positiveIntegerRegex = new RegExp(`^${positiveIntegerPattern}$`);

function isPositiveInteger(input: string): boolean {
  return positiveIntegerRegex.test(input);
}

const specialFlagsJoined = Flags.types.join('|');
const specialFlagsRegex = new RegExp(`${specialFlagsJoined}(,${specialFlagsJoined})*`);

function isSpecialFlags (input: string): boolean {
  return specialFlagsRegex.test(input);
}

/*
 * Rubik's Cube algorithm pattern.
 * Example: "R2 F R U R U' R' F' R U2 R' U2 R"
 */
const algorithmStepPattern = "[xyzRrLlFfBbUuDdMSE](|'|2)";
const algorithmRegex = new RegExp(`^(${algorithmStepPattern})( ${algorithmStepPattern})*$`);

function isAlgorithm(input: string): boolean {
  return algorithmRegex.test(input);
}

/**
 * User input for arrow coordinates.
 * Arrow index examples: '7', '2.1'
 */
const arrowCoordinatesPattern = `${positiveIntegerPattern}(\\.${positiveIntegerPattern})?`;
const chainedArrowRegex = new RegExp(`^${arrowCoordinatesPattern}(-${arrowCoordinatesPattern}){1,3}$`);
const doubleSidedArrowRegex = new RegExp(`^${arrowCoordinatesPattern}\\+${arrowCoordinatesPattern}$`);

/** @return true if input equals 2-4 arrow indices (\d+ or \d+\.\d+) separated by a minus-sign (-) */
function isChainedArrow(input: string): boolean {
  return chainedArrowRegex.test(input);
}

/** @return true if input equals 2 arrow indices (\d+ or \d+\.\d+) separated by a plus-sign (+) */
function isDoubleSidedArrow(input: string): boolean {
  return doubleSidedArrowRegex.test(input);
}

/** @return true if input is a valid lower-case 3 or 6 digit hex value, like e.g. 'f12' or 'bada55' */
function isColorHexValue(input: string): boolean {
  return /^([a-f0-9]{3}){1,2}$/i.test(input);
}
