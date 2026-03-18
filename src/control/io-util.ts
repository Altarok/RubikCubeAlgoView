import CubeState from "../model/cube-state";
import RubikCubeAlgos from "../main";
import {StringUtils} from "../parser/string-utils";

export const IO = {
  saveRotation, unsaveRotation
}

/**
 * Save cube's current rotation to data.json.
 * @param cubeState
 * @param plugin
 */
function unsaveRotation(cubeState: CubeState, plugin: RubikCubeAlgos) {
  setRotation(0, cubeState, plugin);
}

function saveRotation(cubeState: CubeState, plugin: RubikCubeAlgos) {
  setRotation(cubeState.currentRotationNormalized, cubeState, plugin);
}

function setRotation(valueToSafe: number, cubeState: CubeState, plugin: RubikCubeAlgos) {
  let hash: string | undefined = StringUtils.cubeHash(cubeState.id, cubeState.algorithmType);

  if (!hash) {
    /* Should not be possible since cubes without id do not get a save button. */
    console.warn('Cube has no hashable ID, will no persist.');
    return;
  }

  console.debug(`Cube hash: ${hash}, will persist current rotation: ${valueToSafe}`);
  if (valueToSafe !== undefined) {
    if (valueToSafe !== 0) {
      /* Save new value */
      plugin.settings.cubeRotations.set(hash, valueToSafe);
      cubeState.defaultRotation = valueToSafe;
    } else {
      /* Delete value */
      plugin.settings.cubeRotations.delete(hash);
      cubeState.defaultRotation = 0;
    }
  }

  plugin.saveSettingsSync();
}
