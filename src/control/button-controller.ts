import {CubeRenderer} from "../view/cube-renderer";
import CubeState from "../model/cube-state";
import {setIcon} from "obsidian";
import RubikCubeAlgos from "../main";
import {StringUtils} from "../parser/string-utils";

export const ButtonController = {
  addRotationButtons
};

function changeStateOfResetRotationButton(buttonResetRotation: HTMLButtonElement, cubeState: CubeState) {
  if(!buttonResetRotation) return;
  buttonResetRotation.disabled = cubeState.locked || (cubeState.currentRotation === cubeState.defaultRotation);
}

function changeStateOfRotationButtons(cubeRenderer: CubeRenderer, cubeState: CubeState) {
  console.debug('Locked: ' + cubeState.locked);
  cubeRenderer.buttonLeft.disabled = cubeState.locked;
  cubeRenderer.buttonRight.disabled = cubeState.locked;
  changeStateOfResetRotationButton(cubeRenderer.buttonResetRotation, cubeState);
}

function persistRotationInSettings (cubeState: CubeState, plugin: RubikCubeAlgos) {

  const algorithmType = cubeState.algorithmType;
  let hash = StringUtils.cubeHash(cubeState.id, algorithmType);

  if (!hash) {
    console.warn('Cube has no hashable ID, will no persist current rotation.');
    return;

  }
  console.debug(`Cube hash: ${hash}, will persist current rotation: ${cubeState.defaultRotation}`);
  const innerMap= plugin.settings.cubeRotations[algorithmType as string];
  innerMap[hash] = cubeState.currentRotationNormalized;
}


function addRotationButtons(cubeRenderer: CubeRenderer, cubeState: CubeState, plugin: RubikCubeAlgos) {

  changeStateOfResetRotationButton(cubeRenderer.buttonResetRotation, cubeState);

  if (cubeState.specialFlags.has('no-rotation')) {
    return;
  }

  cubeRenderer.buttonLeft.addEventListener('click', () => {
    cubeState.rotateLeft();
    cubeRenderer.rotateCube();

    changeStateOfResetRotationButton(cubeRenderer.buttonResetRotation, cubeState);
  });

  cubeRenderer.buttonRight.addEventListener('click', () => {
    cubeState.rotateRight();
    cubeRenderer.rotateCube();

    changeStateOfResetRotationButton(cubeRenderer.buttonResetRotation, cubeState);
  });


  cubeRenderer.buttonResetRotation.addEventListener('click', () => {
    cubeState.resetRotation();
    cubeRenderer.rotateCube();

    changeStateOfResetRotationButton(cubeRenderer.buttonResetRotation, cubeState);
  });

  cubeRenderer.buttonLockRotation.addEventListener('click', () => {

    cubeState.locked = !cubeState.locked;

    if (cubeState.locked) {
      setIcon(cubeRenderer.buttonLockRotation,'lock');
    } else {
      setIcon(cubeRenderer.buttonLockRotation,'lock-open');
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

      if (cubeState.defaultRotation !== 0) {

        /*
         * TODO un-save default rotation
         */
        cubeState.defaultRotation = 0;
        setIcon(buttonSaveRotation, 'save');
        console.debug('Reset default rotation.');

      } else {

        /*
         * TODO save current rotation as new default rotation
         */
        cubeState.defaultRotation = cubeState.currentRotation;
        setIcon(buttonSaveRotation, 'save-off');
        console.debug('New default rotation: ' + cubeState.defaultRotation);

      }

      persistRotationInSettings(cubeState, plugin);

      plugin.saveSettingsSync();

      changeStateOfResetRotationButton(cubeRenderer.buttonResetRotation, cubeState);
    });
  }
}
