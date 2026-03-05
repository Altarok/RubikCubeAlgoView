import {describe, it, expect} from 'vitest';
import {Build} from "../src/parser/geometry-builder";
import {Coordinates, Dimensions, StickerCoords} from "../src/model/geometry";

const ollOffset = 100;
const pllOffset = 50;

function baseTests(stickerCoords: StickerCoords): Coordinates[] {
  expect(stickerCoords).toBeTruthy();
  expect(stickerCoords.coordinates.length).toBe(9);
  for (let i = 0; i < 9; i++) {
    expect(stickerCoords.get(i)).toMatchObject(stickerCoords.coordinates[i] as Coordinates);
  }
  return stickerCoords.coordinates;
}

describe('Build.stickerCoordinates(..)', () => {

  it('should create a list of distinct coordinates - OLL case', () => {

    const defaultDimensions = new Dimensions(3, 3);
    const stickerCoords = Build.stickerCoordinates(defaultDimensions, ollOffset);
    const coords:Coordinates[] = baseTests(stickerCoords);

    /*
     * Expect the first coordinates to provide sticker coordinates of up-most row
     */
    expect(coords[0]).toMatchObject({x: 100, y: 100});
    expect(coords[1]).toMatchObject({x: 200, y: 100});
    expect(coords[2]).toMatchObject({x: 300, y: 100});

    expect(coords[3]).toMatchObject({x: 100, y: 200});
    expect(coords[4]).toMatchObject({x: 200, y: 200});
    expect(coords[5]).toMatchObject({x: 300, y: 200});

    expect(coords[6]).toMatchObject({x: 100, y: 300});
    expect(coords[7]).toMatchObject({x: 200, y: 300});
    expect(coords[8]).toMatchObject({x: 300, y: 300});
  });

  it('should create a list of distinct coordinates - PLL case', () => {

    const defaultDimensions = new Dimensions(3, 3);
    const stickerCoords = Build.stickerCoordinates(defaultDimensions, pllOffset);
    const coords:Coordinates[] = baseTests(stickerCoords);

    /*
     * Expect the first coordinates to provide sticker coordinates of up-most row
     */
    expect(coords[0]).toMatchObject({x:  50, y:  50});
    expect(coords[1]).toMatchObject({x: 150, y:  50});
    expect(coords[2]).toMatchObject({x: 250, y:  50});
    expect(coords[3]).toMatchObject({x:  50, y: 150});
    expect(coords[4]).toMatchObject({x: 150, y: 150});
    expect(coords[5]).toMatchObject({x: 250, y: 150});
    expect(coords[6]).toMatchObject({x:  50, y: 250});
    expect(coords[7]).toMatchObject({x: 150, y: 250});
    expect(coords[8]).toMatchObject({x: 250, y: 250});
  });

});
