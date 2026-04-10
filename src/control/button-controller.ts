import {CubeRenderer} from "../view/cube-renderer";
import {CubeState} from "../model/cube-state";
import {setIcon} from "obsidian";
import RubikCubeAlgos from "../main";
import {IO} from "./io-util";
import {StringUtils} from "../parser/string-utils";

export const ButtonController = {
  addRotationButtons
}

function changeStateOfRotationDependantButtons(cubeRenderer: CubeRenderer, cubeState: CubeState) {
  if (cubeRenderer.buttonResetRotation) {
    if (cubeState.locked)
      cubeRenderer.buttonResetRotation.disabled = cubeState.currentRotationNormalized === cubeState.defaultRotation;
    else
      cubeRenderer.buttonResetRotation.disabled = cubeState.currentRotationNormalized === 0;
  }

  // if (cubeRenderer.buttonSaveRotation) {
  //   if (cubeState.locked) {
  //     /* if there is a backup - always allow un-saving the backup */
  //     cubeRenderer.buttonSaveRotation.disabled = false;
  //   } else {
  //     /* if there is no backup - prevent creation of backup when rotation is zero */
  //     cubeRenderer.buttonSaveRotation.disabled = cubeState.currentRotationNormalized === 0;
  //   }
  // }
}

function changeStateOfRotationButtons(cubeRenderer: CubeRenderer, cubeState: CubeState) {
  console.debug('Locked: ' + cubeState.locked);
  cubeRenderer.buttonLeft!.disabled = cubeState.locked;
  cubeRenderer.buttonRight!.disabled = cubeState.locked;
  changeStateOfRotationDependantButtons(cubeRenderer, cubeState);
}

/**
 * Save cube's current rotation to data.json.
 * @param cubeState
 * @param plugin
 */
function persistRotationInSettings(cubeState: CubeState, plugin: RubikCubeAlgos) {

  let hash = StringUtils.cubeHash(cubeState.id, cubeState.algorithmType);

  if (!hash) {
    /*
     * Should not be possible since cubes without id do not get a save button.
     */
    console.warn('Cube has no hashable ID, will no persist.');
    return;
  }
  console.debug(`Cube hash: ${hash}, will persist current rotation: ${cubeState.currentRotationNormalized}`);
  if (cubeState.currentRotationNormalized !== undefined) {
    if (cubeState.currentRotationNormalized !== 0)
      plugin.settings.cubeRotations.set(hash, cubeState.currentRotationNormalized);
    else
      plugin.settings.cubeRotations.delete(hash);
  }

  plugin.saveSettingsSync();
}


function addRotationButtons(cubeRenderer: CubeRenderer, cubeState: CubeState, plugin: RubikCubeAlgos) {

  changeStateOfRotationDependantButtons(cubeRenderer, cubeState);

  if (cubeState.flags.contains('no-buttons')) {
    return;
  }

  // /*
  //  * TODO add non-rotation-related button stuff
  //  */
  //
  // if (cubeState.flags.has('no-rotation')) {
  //   return;
  // }

  cubeRenderer.buttonLeft!.addEventListener('click', () => {
    cubeState.rotateLeft();
    cubeRenderer.rotateCube();

    changeStateOfRotationDependantButtons(cubeRenderer, cubeState);
  });

  cubeRenderer.buttonRight!.addEventListener('click', () => {
    cubeState.rotateRight();
    cubeRenderer.rotateCube();

    changeStateOfRotationDependantButtons(cubeRenderer, cubeState);
  });


  cubeRenderer.buttonResetRotation!.addEventListener('click', () => {
    cubeState.resetRotation();
    cubeRenderer.rotateCube();

    changeStateOfRotationDependantButtons(cubeRenderer, cubeState);
  });

  // cubeRenderer.buttonLockRotation.addEventListener('click', () => {
  //
  //   cubeState.locked = !cubeState.locked;
  //
  //   if (cubeState.locked) {
  //     setIcon(cubeRenderer.buttonLockRotation, 'lock');
  //   } else {
  //     setIcon(cubeRenderer.buttonLockRotation, 'lock-open');
  //   }
  //
  //   changeStateOfRotationButtons(cubeRenderer, cubeState);
  // });


  /*
   * No ID means no hash, therefore no saving of metadata ..
   */
  // if (cubeState.getId() && cubeRenderer.buttonSaveRotation) {
  //   /* If an ID is given, the button exists */
  //   let buttonSaveRotation = cubeRenderer.buttonSaveRotation!;
  //   buttonSaveRotation.addEventListener('click', () => {
  //
  //     if (cubeState.locked) {
  //
  //       /*
  //        * Unlock default rotation
  //        */
  //       cubeState.defaultRotation = 0;
  //       setIcon(buttonSaveRotation, 'save'); // reset icon
  //       console.debug('Reset default rotation.');
  //       buttonSaveRotation.setText('Save rotation.'); // reset mouse over
  //       cubeState.locked = false;
  //
  //       IO.unsaveRotation(cubeState, plugin);
  //       changeStateOfRotationDependantButtons(cubeRenderer, cubeState);
  //
  //     } else {
  //
  //
  //       if (cubeState.currentRotationNormalized === cubeState.defaultRotation) {
  //         /*
  //          * Do nothing, as the current rotation is already at default
  //          * TODO button should be deactivated
  //          */
  //         console.warn('Nothing to save. Current rotation already is default. TODO button should be deactivated!');
  //
  //       } else {
  //
  //         /*
  //          * Save current rotation as new default
  //          * TODO save current rotation as new default rotation
  //          */
  //         cubeState.defaultRotation = cubeState.currentRotationNormalized;
  //         setIcon(buttonSaveRotation, 'save-off'); // change icon to 'un-save'
  //         console.debug('New default rotation: ' + cubeState.defaultRotation);
  //         buttonSaveRotation.setText(`Un-save default rotation. (current: ${cubeState.defaultRotation})`);
  //         cubeState.locked = true;
  //
  //         IO.saveRotation(cubeState, plugin);
  //         changeStateOfRotationDependantButtons(cubeRenderer, cubeState);
  //       }
  //
  //     }
  //   });
  // }
}
