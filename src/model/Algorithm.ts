import {ArrowCoordinates} from "./ArrowCoordinates";

export const possibleSteps = [
  "R", "R'", "R2", // right side
  "r", "r'", "r2", // right side, 2 layers deep ('r' is alternative to 'Rw')
  "L", "L'", "L2", // left side
  "l", "l'", "l2", // left side, 2 layers deep ('l' is alternative to 'Lw')
  "F", "F'", "F2", // front
  "f", "f'", "f2", // front, 2 layers deep ('f' is alternative to 'Fw')
  "B", "B'", "B2", // back
  "b", "b'", "b2", // back, 2 layers deep ('b' is alternative to 'Bw')
  "U", "U'", "U2", // top
  "u", "u'", "u2", // top, 2 layers deep ('u' is alternative to 'Uw')
  "D", "D'", "D2", // bottom
  "d", "d'", "d2", // bottom, 2 layers deep ('d' is alternative to 'Dw')

  "x", "x'", "x2", // whole cube, around X axis (to the right)
  "y", "y'", "y2", // whole cube, around Y axis (to the top)
  "z", "z'", "z2", // whole cube, around Z axis (to the front)

  "M", "M'", "M2", // vertical middle layer, around X axis, 90 degrees to the front (like L/R')
  "S", "S'", "S2", // vertical middle layer, around Z axis, 90 degrees to the right (like F/B')
  "E", "E'", "E2"  // horizontal middle layer, around Y axis, 90 degrees to the right (like D/U')
] as const;

export type AlgorithmStep = (typeof possibleSteps)[number];

type TurnCubeMap = Record<AlgorithmStep, AlgorithmStep>;

const turnCubeLeftMap: TurnCubeMap = {
  "R": "F", "R'": "F'", "R2": "F2",
  "r": "f", "r'": "f'", "r2": "f2",
  "L": "B", "L'": "B'", "L2": "B2",
  "l": "b", "l'": "b'", "l2": "b2",
  "F": "L", "F'": "L'", "F2": "L2",
  "f": "l", "f'": "l'", "f2": "l2",
  "B": "R", "B'": "R'", "B2": "R2",
  "b": "r", "b'": "r'", "b2": "r2",
  "U": "U", "U'": "U'", "U2": "U2",
  "u": "u", "u'": "u'", "u2": "u2",
  "D": "D", "D'": "D'", "D2": "D2",
  "d": "d", "d'": "d'", "d2": "d2",
  "x": "z", "x'": "z'", "x2": "z2", // !!
  "y": "y", "y'": "y'", "y2": "y2",
  "z": "x'", "z'": "x", "z2": "x2", // !!
  "M": "S'", "M'": "S", "M2": "S2", // !!
  "S": "M", "S'": "M'", "S2": "M2", // !!
  "E": "E", "E'": "E'", "E2": "E2"
};

/**
 * A Rubik's Cube algorithm is a sequence of rotations
 * aimed to change a cube's state in a specific way.
 */
export class Algorithm {
  steps: AlgorithmStep[];

  constructor(steps: AlgorithmStep[]) {
    this.steps = steps;
  }

  rotate(quarterTurns: number): void {

    for (let i: number = 0; i < this.steps.length; i++) {
      let algStep: AlgorithmStep = this.steps[i]!;

      for (let ii: number = 0; ii < quarterTurns; ii++) {
        algStep = turnCubeLeftMap[algStep];
      }

      this.steps[i] = algStep;
    }
  }


  toString(): string {
    let s: string = ''
    for (const step of this.steps) {
      s += step + ' ';
    }
    return s.trim();
  }

  clone(): Algorithm {
    return new Algorithm(Object.assign([], this.steps));
  }
}

export class Algorithms extends Array<Algorithm> {

  constructor() {
    super();
  }

  rotate(quarterTurns: number): void {
    this.forEach(algorithm => {
      algorithm.rotate(quarterTurns)
    });
  }
}

export class MappedAlgorithm {
  private algorithm: Algorithm;
  private arrows: ArrowCoordinates[];

  constructor(algorithm: Algorithm, arrows: ArrowCoordinates[]) {
    this.algorithm = algorithm;
    this.arrows = arrows;
  }

  rotate(quarterTurns: number): void {
    this.algorithm.rotate(quarterTurns);
  }
}

export class MappedAlgorithms extends Map<number, MappedAlgorithm> {
  constructor() {
    super();
  }
  rotate(quarterTurns: number): void {
    for (const mappedAlgorithm of this.values()){
      mappedAlgorithm.algorithm.rotate(quarterTurns);
    }
  }

}

