import {Coordinates, Dimensions, StickerCoords} from "../model/geometry";

export const Build = {
  stickerCoordinates
};

/**
 * Calculate a cube's stickers' coordinates.
 * @param cubeDimensions - cube's dimensions (stickers, not pixels)
 * @param offset - offset to add at left and upper borders
 */
function stickerCoordinates(cubeDimensions: Dimensions, offset: number): StickerCoords {
  const stickerCenterCoords: Coordinates[] = [];
  /* reverse loop order to give x coordinates priority */
  for (let h: number = 0; h < cubeDimensions.height; h++) {
    for (let w: number = 0; w < cubeDimensions.width; w++) {
      stickerCenterCoords.push(new Coordinates(w * 100 + offset, h * 100 + offset));
    }
  }
  let stickerCoords = new StickerCoords(stickerCenterCoords, cubeDimensions);
  // console.debug(`Build sticker coordinates ${stickerCoords.toString()}`);
  return stickerCoords;
}
 
