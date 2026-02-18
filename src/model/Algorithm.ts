export const possibleSteps: string[] = [
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
  "E", "E'", "E2" // horizontal middle layer, around Y axis, 90 degrees to the right (like D/U')
] as const;

/**
 * A Rubik's Cube algorithm is a sequence of rotations
 * aimed to change a cube's state in a specific way.
 */
export class Algorithm {
  steps: string[];

  constructor(steps: string[]) {
    this.steps = steps;
  }

  toString(): string {
    let s: string = ''
    for (const step of this.steps) {
      s += step + ' ';
    }
    return s.trim();
  }

}
