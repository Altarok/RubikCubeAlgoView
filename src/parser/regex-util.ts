import {Flags} from "../model/flags";

export const RegEx = {
  isAlgorithm, isChainedArrow, isDoubleSidedArrow, isPositiveInteger, isSpecialFlags
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

/*
 * User input for arrow coordinates.
 * Examples: '7', '2.1'
 */
const arrowCoordinatesPattern = `${positiveIntegerPattern}(\\.${positiveIntegerPattern})?`;
const chainedArrowRegex = new RegExp(`^${arrowCoordinatesPattern}(-${arrowCoordinatesPattern}){1,3}$`);
const doubleSidedArrowRegex = new RegExp(`^${arrowCoordinatesPattern}\\+${arrowCoordinatesPattern}$`);

function isChainedArrow(input: string): boolean {
  return chainedArrowRegex.test(input);
}

function isDoubleSidedArrow(input: string): boolean {
  return doubleSidedArrowRegex.test(input);
}

