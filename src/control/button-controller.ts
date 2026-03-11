import {CubeRenderer} from "../view/cube-renderer";
import CubeState from "../model/cube-state";
import {setIcon} from "obsidian";
import RubikCubeAlgos from "../main";
import {StringUtils} from "../parser/string-utils";

export const ButtonController = {
  addRotationButtons
};

function changeStateOfResetRotationButton(cubeRenderer: CubeRenderer, cubeState: CubeState) {
  if (cubeRenderer.buttonResetRotation)
    cubeRenderer.buttonResetRotation.disabled = cubeState.locked || (cubeState.defaultRotationBackup === cubeState.currentRotationNormalized);

  if (cubeRenderer.buttonSaveRotation) {
    if (cubeState.defaultRotationBackup != 0) {
      /* if there is a backup rotation saved - allow un-saving*/
      cubeRenderer.buttonSaveRotation.disabled = false;
    } else if (cubeState.defaultRotationBackup != cubeState.currentRotationNormalized) {
      /* if there is no backup, but the rotation equals default value - prevent saving */
      cubeRenderer.buttonSaveRotation.disabled = false;
    } else {
      cubeRenderer.buttonSaveRotation.disabled = true;
    }
  }
}

function changeStateOfRotationButtons(cubeRenderer: CubeRenderer, cubeState: CubeState) {
  console.debug('Locked: ' + cubeState.locked);
  cubeRenderer.buttonLeft.disabled = cubeState.locked;
  cubeRenderer.buttonRight.disabled = cubeState.locked;
  changeStateOfResetRotationButton(cubeRenderer, cubeState);
}

function persistRotationInSettings(cubeState: CubeState, plugin: RubikCubeAlgos) {

  const algorithmType = cubeState.algorithmType;
  let hash = StringUtils.cubeHash(cubeState.id, algorithmType);

  if (!hash) {
    console.warn('Cube has no hashable ID, will no persist current rotation.');
    return;

  }
  console.debug(`Cube hash: ${hash}, will persist current rotation: ${cubeState.currentRotationNormalized}`);
  const innerMap = plugin.settings.cubeRotations[algorithmType as string];
  if (cubeState.currentRotationNormalized === 0) {
    innerMap[hash] = cubeState.currentRotationNormalized;
  } else {
    innerMap[hash] = null;
  }

}


function addRotationButtons(cubeRenderer: CubeRenderer, cubeState: CubeState, plugin: RubikCubeAlgos) {

  changeStateOfResetRotationButton(cubeRenderer, cubeState);

  if (cubeState.specialFlags.has('no-rotation')) {
    return;
  }

  cubeRenderer.buttonLeft.addEventListener('click', () => {
    cubeState.rotateLeft();
    cubeRenderer.rotateCube();

    changeStateOfResetRotationButton(cubeRenderer, cubeState);
  });

  cubeRenderer.buttonRight.addEventListener('click', () => {
    cubeState.rotateRight();
    cubeRenderer.rotateCube();

    changeStateOfResetRotationButton(cubeRenderer, cubeState);
  });


  cubeRenderer.buttonResetRotation.addEventListener('click', () => {
    cubeState.resetRotation();
    cubeRenderer.rotateCube();

    changeStateOfResetRotationButton(cubeRenderer, cubeState);
  });

  cubeRenderer.buttonLockRotation.addEventListener('click', () => {

    cubeState.locked = !cubeState.locked;

    if (cubeState.locked) {
      setIcon(cubeRenderer.buttonLockRotation, 'lock');
    } else {
      setIcon(cubeRenderer.buttonLockRotation, 'lock-open');
    }

    changeStateOfRotationButtons(cubeRenderer, cubeState);
  });


  /*
   * No ID means no hash, therefore no saving of metadata ..
   */
  if (cubeState.id) {
    /* If an ID is given, the button exists */
    let buttonSaveRotation = cubeRenderer.buttonSaveRotation!;
    buttonSaveRotation.addEventListener('click', () => {

      if (cubeState.defaultRotationBackup != 0) {

        /*
         * TODO un-save default rotation
         */
        cubeState.defaultRotationBackup = 0;
        setIcon(buttonSaveRotation, 'save');
        console.debug('Reset default rotation.');
        buttonSaveRotation.setText('Save rotation.');

      } else if (cubeState.defaultRotationBackup != cubeState.currentRotationNormalized) {

        /*
         * TODO save current rotation as new default rotation
         */
        cubeState.defaultRotationBackup = cubeState.currentRotationNormalized;
        setIcon(buttonSaveRotation, 'save-off');
        console.debug('New default rotation: ' + cubeState.defaultRotationBackup);
        buttonSaveRotation.setText(`Un-save default rotation. (current: ${cubeState.defaultRotationBackup})`);

      }

      persistRotationInSettings(cubeState, plugin);

      plugin.saveSettingsSync();

      changeStateOfResetRotationButton(cubeRenderer, cubeState);
    });
  }
}
