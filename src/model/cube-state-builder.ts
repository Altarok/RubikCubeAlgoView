import {CubeColors} from "../settings/RubikCubeAlgoSettings";
import {CubeStateOLL} from "./cube-state";
import {FlagType} from "./flags";
import {Dimensions, StickerCoords} from "./geometry";
import {Parse, Result} from "../parser/parser";
import {InvalidInput} from "./codeblock-input";
import {AlgorithmType} from "./algorithms";
import {Build} from "../parser/geometry-builder";

const undeclaredInput: string = 'no-key';

const InputKeys: string[] = ['alg', 'arrowColor', 'arrows', 'cubeColor', 'dimension', 'flags', 'id'];

type InputKeyType = (typeof InputKeys)[number];
// type InputType = InputKeyType | undeclaredInput;




export class CubeStateBuilder {
  cleanedUserInput: string[];
  undeclaredUserInputForOllField: string[] = [];
  alg: string[] = [];
  arrowColor: string;
  arrowsPll: string[] = [];
  cubeColor: string;
  dimensions: Dimensions = Dimensions.default();
  viewBoxDimensions: Dimensions;
  flags: FlagType[] = [];
  id?: string;
  invalidInput: InvalidInput[] = [];
  stickerCoordinates: StickerCoords;
  /*
   * Common data
   */
  initialCubeRotation: number = 0;

  constructor(rawInput: string, readonly colors: CubeColors, readonly algorithmType: AlgorithmType) {
    // split lines, skip empty lines, empty string is falsy
    this.cleanedUserInput = rawInput.split('\n').map(line => line.trimStart()).filter(Boolean);
    this.arrowColor = colors.arrow;
    this.cubeColor = colors.cube;

    /* sets dimensions for pll */
    this.readRawInput();

    /* sets dimensions for oll */

    /* needs dimensions */
    this.viewBoxDimensions = this.getViewBoxDimensions();
    this.stickerCoordinates = this.getStickerCoordinates();
  }



  readRawInput() {
    for (const s of this.cleanedUserInput) {
      if (s.startsWith('//')) continue; /* skip comment lines */

      let strings = s.split(':');
      let key: string = strings[0] as string;
      let value: string = strings[1] as string;
      if (key) key = key.trim();
      if (value) value = value.trim();
      if (!key) continue;  /* skip falsy input (should not happen by now ) */
      if (value && value.includes('//')) value = (value.split('//')[0] as string).trim(); /* remove comments */

      if (InputKeys.includes(key) && value) this.interpretKnownInput(key, value, s);
      else this.undeclaredUserInputForOllField.push(key);

    }
  }

  private interpretKnownInput(key: string, value: string, completeLine: string): void {
    switch (key) {
      case 'alg':
        break;
      case 'arrowColor':
        return this.setArrowColor(Parse.toArrowColor(value), completeLine);
      case 'arrows': /* PLL only! */
        return this.setArrowsPll(Parse.toArrows(value), completeLine);
      case 'cubeColor':
        return this.setCubeColor(Parse.toCubeColor(value), completeLine);
      case 'dimension': /* PLL only! */
        return this.setDimensions(Parse.toDimensions(value), completeLine);
      case 'flags':
        return this.setFlags(Parse.toFlags(value), completeLine);
      case 'id':
        return this.setId(value);
      default:
        break;
    }
  }

  buildOll(): CubeStateOLL {

    return null;
  }

  private setArrowColor(result: Result<string>, completeLine: string) {
    if (result.success) this.arrowColor = result.data; else this.pushError(result.error, completeLine);
  }

  private setArrowsPll(result: Result<string[]>, completeLine: string) {
    if (result.success) this.arrowsPll = result.data; else this.pushError(result.error, completeLine);
  }

  private setCubeColor(result: Result<string>, completeLine: string) {
    if (result.success) this.cubeColor = result.data; else this.pushError(result.error, completeLine);
  }

  private setDimensions(result: Result<Dimensions>, completeLine: string) {
    if (result.success) this.dimensions = result.data; else this.pushError(result.error, completeLine);
  }

  private setFlags(result: Result<Set<FlagType>>, completeLine: string) {
    if (result.success) this.flags = Array.from(result.data); else this.pushError(result.error, completeLine);
  }

  private setId(id: string) {
    this.id = id;
  }

  private pushError(error: InvalidInput, completeLine: string): void {
    error.line = completeLine;
    this.invalidInput.push(error);
  }


  private getStickerCoordinates(): StickerCoords {
    return Build.stickerCoordinates(this.dimensions, this.algorithmType === 'oll' ? 100 : 50 /* pll -> 50 */);
  }
  private getViewBoxDimensions(): Dimensions {
    return ( this.algorithmType === 'oll' ? Dimensions.ofOllCubeDimensions(this.dimensions) : Dimensions.ofPllCubeDimensions(this.dimensions));
  }
}

