import {RegEx} from "../parser/regex-util";

/** Simple x,y coordinates */
export class Coordinates {
  /**
   * @param x - pixels from left
   * @param y - pixels from top
   */
  constructor(public readonly x: number, public readonly y: number) {
  }

  toString = () => `${this.x},${this.y}`;
}

/** Coordinates for -one- arrow. */
export class ArrowCoords {
  /**
   * @param start - start coordinates of arrow
   * @param end - end coordinates of arrow
   */
  constructor(public readonly start: Coordinates, public readonly end: Coordinates) {
  }

  toString = () => `Arrow[from'${this.start.toString()}', to'${this.end.toString()}']`;
}

/** Coordinates of a cube's stickers. References the stickers' center. */
export class StickerCoords {
  constructor(public readonly coordinates: Coordinates[], public readonly cubeDimensions: Dimensions) {
  }

  get = (index: number): Coordinates | undefined => this.coordinates[index];

  /**
   * @param input - arrow coordinates like '1' or '3.2' where the first integer is the row, the second integer is the column or just a single integer
   * @returns coordinates of center of sticker the input is pointing to
   */
  getStickerCenter(input: string): Coordinates {
    let indexOfCubeletCenter: number;
    if (RegEx.isPositiveInteger(input)) {
      indexOfCubeletCenter = Number(input);
    } else if (input.includes('.')) {
      const parts = input.split('.');
      const row = parseInt(parts[0] ?? '1', 10);
      const col = parseInt(parts[1] ?? '1', 10);
      indexOfCubeletCenter = (row - 1) * this.cubeDimensions.width + col;
    } else {
      indexOfCubeletCenter = (parseInt(input, 10) || 1);
    }

    const output: Coordinates | undefined = this.coordinates[indexOfCubeletCenter - 1];

    if (!output) {   // Safety check
      // Fallback to a default (0,0) to prevent the whole SVG from failing to render
      console.warn(`Invalid sticker index: ${input}`);
      return new Coordinates(0, 0);
    }

    // console.debug(`${input} -> ${output.toString()}`);
    return output;
  }

  toString = () => `StickerCoords[cube(${this.cubeDimensions.toString()}),stickers${this.coordinates.join('/')}]`;
}

/** Coordinates for -multiple- arrows. */
export type Arrows = ArrowCoords[];

const DefaultDimensions = {
  WIDTH: 3, /* default rubik cube width  */
  HEIGHT: 3 /* default rubik cube height */
} as const;


/** Simple dimensions */
export class Dimensions {
  constructor(public readonly width: number, public readonly height: number) {
  }

  static ofPllCubeDimensions = (cubeDimensions: Dimensions) => new Dimensions(cubeDimensions.width * 100, cubeDimensions.height * 100);
  static ofOllCubeDimensions = (cubeDimensions: Dimensions) => new Dimensions(cubeDimensions.width * 100 + 100, cubeDimensions.height * 100 + 100);

  isDefaultSize(): boolean { return this.width === 3 && this.height === 3};

  toString(): string { return `Dimensions[${this.width},${this.height}]`};

  static default = (): Dimensions => new Dimensions(DefaultDimensions.WIDTH, DefaultDimensions.HEIGHT);
}
