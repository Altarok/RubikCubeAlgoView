import {Coordinates} from "./Coordinates";

/**
 * Coordinates for -one- arrow.
 */
export class ArrowCoordinates {
  /** x,y (pixel coordinates) */
  startCoordinates: Coordinates;
  /** x,y (pixel coordinates) */
  endCoordinates: Coordinates;

  constructor(start: Coordinates, end: Coordinates) {
    this.startCoordinates = start;
    this.endCoordinates = end;
  }

  start(): Coordinates {
    return this.startCoordinates;
  }

  end(): Coordinates {
    return this.endCoordinates;
  }

  toString(): string {
    return "'Arrow[from'" + this.startCoordinates.toString() + "', to'" + this.endCoordinates.toString() + "']"
  }

}

