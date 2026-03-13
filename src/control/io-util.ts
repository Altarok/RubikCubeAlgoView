import CubeState from "../model/cube-state";
import RubikCubeAlgos from "../main";
import {StringUtils} from "../parser/string-utils";

export const IO = {
  saveRotation
}

/**
 * Save cube's current rotation to data.json.
 * @param cubeState
 * @param plugin
 */
function saveRotation(cubeState: CubeState, plugin: RubikCubeAlgos) {

  let hash: string | undefined = StringUtils.cubeHash(cubeState.id, cubeState.algorithmType);

  if (!hash) {
    /* Should not be possible since cubes without id do not get a save button. */
    console.warn('Cube has no hashable ID, will no persist.');
    return;
  }

  console.debug(`Cube hash: ${hash}, will persist current rotation: ${cubeState.currentRotationNormalized}`);
  if (cubeState.currentRotationNormalized !== undefined) {
    if (cubeState.currentRotationNormalized !== 0) {
      /* Save new value */
      plugin.settings.cubeRotations.set(hash, cubeState.currentRotationNormalized);
      cubeState.defaultRotation = cubeState.currentRotationNormalized;
    } else {
      /* Delete value */
      plugin.settings.cubeRotations.delete(hash);
      cubeState.defaultRotation = 0;
    }
  }

  plugin.saveSettingsSync();
}

