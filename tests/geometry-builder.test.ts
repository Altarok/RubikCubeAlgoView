import {describe, it, expect} from 'vitest';
import {Build} from "../src/parser/geometry-builder";
import {Dimensions} from "../src/model/geometry";

const ollOffset = 100;
const pllOffset = 50;

describe('Build.stickerCoordinates(..)', () => {

  it('should create a list of distinct coordinates', () => {

    let defaultDimensions = new Dimensions(3, 3);

    let stickerCoords = Build.stickerCoordinates(defaultDimensions, ollOffset);

    expect(stickerCoords).toBeTruthy();
    expect(stickerCoords.coordinates.length).toBe(9);
    for (let i = 0; i < 9; i++) {
      expect(stickerCoords.get(i)).toMatchObject(stickerCoords.coordinates[i]);
    }
    let coords = stickerCoords.coordinates;

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


});
