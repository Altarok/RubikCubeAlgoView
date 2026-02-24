/** Simple x,y coordinates */
export class Coordinates {
  /**
   * @param x - pixels from left
   * @param y - pixels from top
   */
  constructor(public readonly x: number, public readonly y: number) {}
  toString(): string { return `${this.x},${this.y}`; }
}

/** Coordinates for -one- arrow. */
export class ArrowCoords {
  /**
   * @param start - start coordinates of arrow
   * @param end - end coordinates of arrow
   */
  constructor(public readonly start: Coordinates, public readonly end: Coordinates) {}
  toString(): string { return `Arrow[from'${this.start}', to'${this.end}']`; }
}

/** Coordinates for -multiple- arrows. */
export type Arrows = ArrowCoords[];

export interface Dimensions {
  readonly width: number;
  readonly height: number;
}

