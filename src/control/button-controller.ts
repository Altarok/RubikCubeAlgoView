import {CubeRenderer} from "../view/cube-renderer";
import {CubeState} from "../model/cube-state";

export const ButtonController = {
  addButtonFunctions
};


function addButtonFunctions(cubeRenderer: CubeRenderer, cubeState: CubeState) {

  if (cubeState.specialFlags.contains('no-rotation')) {
    return;
  }

  cubeRenderer.buttonLeft.addEventListener('click', () => {
    cubeState.rotateLeft();
    cubeRenderer.rotateCube();
  });

  cubeRenderer.buttonReset.addEventListener('click', () => {
    cubeState.resetRotation();
    cubeRenderer.rotateCube();
  });

  cubeRenderer.buttonRight.addEventListener('click', () => {
    cubeState.rotateRight();
    cubeRenderer.rotateCube();
  });
}
