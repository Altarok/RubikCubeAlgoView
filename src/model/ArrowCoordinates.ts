import {Coordinates} from "./Coordinates";

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

}
