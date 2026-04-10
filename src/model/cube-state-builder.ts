import {CubeColors, RubikCubeAlgoSettingsTab} from "../settings/RubikCubeAlgoSettings";
import {CubeStateOllNew, CubeStatePllNew} from "./cube-state";
import {FlagType} from "./flags";
import {ArrowCoords, Arrows, Coordinates, Dimensions, StickerCoords} from "./geometry";
import {Parse, Result} from "../parser/parser";
import {InvalidInput} from "./codeblock-input";
import {Algorithms, AlgorithmType, MappedAlgorithm, MappedAlgorithms} from "./algorithms";
import {Build} from "../parser/geometry-builder";
import {OllFieldColoring} from "./oll-field-coloring";
import {StringUtils} from "../parser/string-utils";

const InputKeys: string[] = ['alg', 'arrowColor', 'arrows', 'cubeColor', 'dimension', 'flags', 'id'];
const presetOutlinePattern = new RegExp(/[lbrt]{3}\.[lrt]{3}\.[lfrt]{3}/);

export default class CubeStateBuilder {
  splitUserInput: string[];
  undeclaredUserInputForOllField: string[] = [];
  /**
   * Algorithms only for PLL, algorithms followed by optional arrows for OLL<br>
   * key: input of interest<br>
   * value: complete line for potential error handling
   */
  algorithmInput = new Map<string, string>();
  arrowColor: string;
  arrowsPll: string[] = [];
  cubeColor: string;
  dimensions: Dimensions = Dimensions.default();
  flags: FlagType[] = ['default'];
  id?: string = undefined;
  invalidInput: InvalidInput[] = [];

  /*
   * Set after constructor
   */
  algorithmType!: AlgorithmType;
  viewBoxDimensions!: Dimensions;
  stickerCoordinates!: StickerCoords;

  initialCubeRotation: number = 0;

  constructor(rawInput: string, private readonly colors: CubeColors) {
    // split lines, skip empty lines, empty string is falsy
    this.splitUserInput = rawInput.split('\n').filter(Boolean);
    this.arrowColor = colors.arrow;
    this.cubeColor = colors.cube;

    /* sets dimensions for pll */
    this.readRawInput();

    /* sets dimensions for oll */
  }

  private removeComments(input: string | undefined): string | undefined {
    if (input && input.includes('//'))
      return (input.split('//')[0] as string).trim()
    else
      return input;
  }

  private readRawInput() {
    for (const singleLine of this.splitUserInput) {
      let s: string = singleLine.trim();
      if (s.startsWith('//')) continue; /* skip comment lines */
      let strings = s.split(':');
      if (!strings[0]) continue;  /* skip falsy input (should not happen by now ) */
      let key: string = this.removeComments(strings[0].trim())!;
      let value: string | undefined = this.removeComments(strings[1]?.trim() ?? undefined);
      if (InputKeys.includes(key) && value) this.interpretKnownInput(key, value, singleLine);
      else this.undeclaredUserInputForOllField.push(key);
    }
  }

  private interpretKnownInput(key: string, value: string, completeLine: string): void {
    switch (key) {
      case 'alg':
        this.algorithmInput.set(value, completeLine);
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
        this.id = value;
        break;
      default: /* TODO ? */
        break;
    }
  }

  private setupCubeTypeRelatedData(cubeType: AlgorithmType): void {
    this.algorithmType = cubeType;
    /* needs dimensions */
    this.viewBoxDimensions = this.getViewBoxDimensions();
    this.stickerCoordinates = this.getStickerCoordinates();
  }

  private setupArrowCoordinates(input: string[]): Arrows {
    if (this.invalidInput.length > 0) return [];

    if (input.length == 0) return [];

    return input.filter(Boolean)
    .flatMap((segment) => {
      const isDoubleSided = segment.includes('+');
      const parts = segment.split(/[+-]/); // Split on + OR -

      // Map the string IDs to their coordinate objects immediately
      const coords = parts.map(id => this.stickerCoordinates.getStickerCenter(id));

      if (isDoubleSided && coords.length === 2) {
        const [start, end] = coords as [Coordinates, Coordinates];
        return [new ArrowCoords(start, end), new ArrowCoords(end, start)];
      }

      const arrows: ArrowCoords[] = [];
      for (let i = 0; i < coords.length - 1; i++) {
        arrows.push(new ArrowCoords(coords[i] as Coordinates, coords[i + 1] as Coordinates));
      }
      // chained arrows: connect end and start of chain
      if (coords.length > 2) {
        arrows.push(new ArrowCoords(coords[coords.length - 1] as Coordinates, coords[0] as Coordinates));
      }
      return arrows;
    }, []);
  }

  buildPll(): CubeStatePllNew {
    this.setupCubeTypeRelatedData('pll');
    let algorithms: Algorithms = new Algorithms();
    // /* README - this is value first, then key */
    // this.algorithmInput.forEach((row: string, completeLine: string) => {
    for (const [row, completeLine] of this.algorithmInput) {
      const result = Parse.toAlgorithm(row);
      if (result.success) algorithms.add(result.data); else this.pushError(result.error, completeLine);
    }
    let arrows: Arrows = this.setupArrowCoordinates(this.arrowsPll);

    return new CubeStatePllNew(this.arrowColor, this.cubeColor, this.dimensions, this.flags,
      this.id, this.viewBoxDimensions, this.invalidInput, this.splitUserInput, algorithms, arrows);
  }

  buildOll(settings: RubikCubeAlgoSettingsTab): CubeStateOllNew {

    let presetRotation: number | undefined = undefined;
    let presetOutline: string | undefined = undefined;

    if (this.id) {
      let hash: string = StringUtils.cubeHash(this.id, 'oll');
      presetRotation = settings.cubeRotations.get(hash);
      presetOutline = settings.knownIds.get(this.id);
    }

    let ollFieldInput = new OllFieldColoring(this.cubeColor);

    /*
     * this.cubeDimensions gets set up in here
     */
    if (presetOutline && presetOutlinePattern.test(presetOutline)) {
      ollFieldInput.setupFixedOllInput(presetOutline);
    } else {
      this.setupRawOllInput(ollFieldInput);
    }

    this.setupCubeTypeRelatedData('oll');

    let algorithmToArrows = new MappedAlgorithms();
    let selectedAlgorithmHash = this.setupAlgorithmArrowMap(algorithmToArrows);

    const cubeState = new CubeStateOllNew(this.arrowColor, this.dimensions, this.flags, this.id, this.viewBoxDimensions,
      this.invalidInput, this.splitUserInput, algorithmToArrows, selectedAlgorithmHash, ollFieldInput);
    if (presetRotation) {
      cubeState.setRotation(presetRotation);
    }

    return cubeState;
  }

  private setupAlgorithmArrowMap(map: MappedAlgorithms): string {

    let initialAlgorithmSelectionHash: string = '';

    if (this.algorithmInput.size > 0) {
      // /* README - this is value first, then key */
      // this.algorithmInput.forEach((row: string, completeLine: string) => {
      for (const [row, completeLine] of this.algorithmInput) {

        const [algInput, arrowInput] = row.split(/ *== */);

        const result = Parse.toAlgorithm(algInput!);
        if (result.success) {
          let matchingArrows: Arrows = [];
          if (arrowInput) {
            let result = Parse.toArrows(arrowInput);
            if (result.success) matchingArrows = this.setupArrowCoordinates(result.data);
            else this.pushError(result.error, completeLine);
          }
          let algorithm = result.data;
          if (initialAlgorithmSelectionHash === '') {
            initialAlgorithmSelectionHash = algorithm.initialHash;
          }
          map.add(new MappedAlgorithm(algorithm, matchingArrows));
        } else {
          this.pushError(result.error, completeLine);
        }
      }
    }
    return initialAlgorithmSelectionHash;
  }

  /**
   * @param str - gets checked
   * @returns true if given string starts and ends with '.'
   */
  private isWrappedInDots(str: string): boolean {
    return str.startsWith('.') && str.endsWith('.')
  }

  private setupRawOllInput(ollFieldInput: OllFieldColoring): void {

    let rawOllInput: string[] = this.undeclaredUserInputForOllField;

    if (!rawOllInput || rawOllInput.length < 4) {
      return this.pushError(new InvalidInput("[not enough input]", "Input for OLL should contain at least 4 lines!"), 'OLL FIELD');
    }

    const firstRow = rawOllInput[0]!;
    const lastRow = rawOllInput[rawOllInput.length - 1]!;

    if (!this.isWrappedInDots(firstRow) || !this.isWrappedInDots(lastRow)) {
      return this.pushError(new InvalidInput(firstRow, `First '${firstRow}' and last '${lastRow}' line should start and end on a dot ('.')!`), 'OLL FIELD');
    }

    let expectedWidth: number = rawOllInput[0]!.length;

    this.dimensions = new Dimensions(expectedWidth - 2, rawOllInput.length - 2);

    for (let i: number = 0; i < rawOllInput.length; i++) {
      const row: string = rawOllInput[i]!.trim();

      if (row.length !== expectedWidth) {
        return this.pushError(new InvalidInput(row, `Invalid row length! Expected ${expectedWidth} characters but found ${row.length}.`), 'OLL FIELD');
      }

      const parsedRow = row.split('').map((char: string, x: number): string => {
        if (char === '.') return '-1';
        const isEdge = (x === 0 || x === row.length - 1 || i === 0 || i === rawOllInput.length - 1);
        // Side stickers are lowercase, Top stickers are uppercase
        return isEdge ? char.toLowerCase() : char.toUpperCase();
      });

      ollFieldInput.addRow(parsedRow);
    }
  }

  private setArrowColor(result: Result<string>, completeLine: string): void {
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

  private setFlags(result: Result<FlagType[]>, completeLine: string) {
    if (result.success) this.flags = result.data; else this.pushError(result.error, completeLine);
  }

  private pushError(error: InvalidInput, completeLine: string): void {
    error.line = completeLine;
    this.invalidInput.push(error);
  }

  private getStickerCoordinates(): StickerCoords {
    return Build.stickerCoordinates(this.dimensions, this.algorithmType === 'oll' ? 100 /* oll -> 50 */ : 50 /* pll -> 50 */);
  }

  private getViewBoxDimensions(): Dimensions {
    return (this.algorithmType === 'oll' ? Dimensions.ofOllCubeDimensions(this.dimensions) : Dimensions.ofPllCubeDimensions(this.dimensions));
  }
}
