import CubeState, {CubeStateOLL, CubeStatePLL} from "../model/cube-state";
import {Algorithms} from "../model/algorithms";
import {OllFieldColoring} from "../model/oll-field-coloring";
import {SvgUtils} from "./svg-utils";
import {UiUtils} from "./ui-utils";
import {applyRotation} from "./dom-rotation";
import {createCubeLayout, CubeLayout} from "./cube-layout";
import {setIcon} from "obsidian";


export abstract class CubeRenderer {
  layout: CubeLayout;
  buttonLeft: HTMLButtonElement;
  buttonRight: HTMLButtonElement;
  buttonResetRotation: HTMLButtonElement;
  buttonLockRotation: HTMLButtonElement;
  buttonSaveRotation?: HTMLButtonElement;
  mainCubeSvg: SVGSVGElement;

  protected constructor(private readonly cubeState: CubeState) {
  }

  /**
   * @param {HTMLElement} element - HTML element to draw on
   */
  display(element: HTMLElement): void {

    if (this.cubeState.codeBlockInterpretationFailed()) {
      this.displayWarningForInvalidInput(element);
      return;
    }

    this.displayCubeButtonAndAlgorithms(element);
  }

  abstract displayCubeForeground(container: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void;

  abstract displayAlgorithms(container: HTMLDivElement): void;

  abstract displayArrows(container: SVGSVGElement): void;

  displayCubeButtonAndAlgorithms(container: HTMLElement) {

    this.layout = createCubeLayout(container, this.cubeState.specialFlags.has('no-buttons'));

    this.displayCube(this.layout.cubeDiv);
    this.displayButtons(this.layout.buttonDiv);
    this.displayAlgorithms(this.layout.algorithmsDiv);
  }

  redrawCube(): void {
    this.layout.cubeDiv.removeChild(this.mainCubeSvg);
    this.displayCube(this.layout.cubeDiv);
  }

  displayCube(cubeDiv: HTMLDivElement): void {
    const {width: viewBoxWidth, height: viewBoxHeight} = this.cubeState.viewBoxDimensions;

    const mainSvgElement: SVGSVGElement = this.displayCubeBackground(cubeDiv, viewBoxWidth, viewBoxHeight);

    this.displayCubeForeground(mainSvgElement, viewBoxWidth, viewBoxHeight);
    this.displayArrows(mainSvgElement);
  }

  /**
   * @param {HTMLElement} element - HTML element to draw on
   * @param {number} viewBoxWidth - view box width of image part to zoom in to
   * @param {number} viewBoxHeight - view box height of image part to zoom in to
   */
  displayCubeBackground(element: HTMLElement, viewBoxWidth: number, viewBoxHeight: number): SVGSVGElement {
    const isDefault = this.cubeState.isDefaultSize();
    const imageWidth = isDefault ? 200 : viewBoxWidth;
    const imageHeight = isDefault ? 200 : viewBoxHeight;

    this.mainCubeSvg = element.createSvg('svg', {
      attr: {
        width: imageWidth,
        height: imageHeight,
        viewBox: `0 0 ${viewBoxWidth} ${viewBoxHeight}`
      }, cls: 'rubik-cube-pll'
    });

    SvgUtils.createArrowHead(this.mainCubeSvg, this.cubeState.arrowColor);

    /* Background rectangle */
    SvgUtils.drawBackgroundRect(this.mainCubeSvg, this.cubeState.backgroundColor);

    return this.mainCubeSvg;
  }

  /**
   * Comes up when user's input is not interpretable. Shows complete user input, with the erroneous line marked in red, including a description of the problem.
   * @param {HTMLElement} element - HTML element to draw on
   */
  displayWarningForInvalidInput(element: HTMLElement): void {
    const error = this.cubeState.invalidInput;

    if (error) {
      UiUtils.showInvalidInput(element, this.cubeState.userInput.completeCodeBlock, error);
    }
  }

  /**
   * Change current cube rotation.
   */
  rotateCube(): void {
    const degrees = this.cubeState.currentRotation * 90;
    applyRotation(this.layout.cubeDiv, degrees);
  }

  displayButtons(buttonDiv: HTMLDivElement | undefined): void {

    if (!buttonDiv || this.cubeState.specialFlags.has('no-buttons')) {
      return;
    }

    /*
     * TODO this would be the place for buttons not related to rotation
     */

    if (!buttonDiv || this.cubeState.specialFlags.has('no-rotation')) {
      return;
    }

    this.buttonLeft = buttonDiv.createEl('button', {'title': 'Rotate left 90 degrees'});
    let turnLeftSvg: SVGSVGElement = this.buttonLeft.createSvg('svg', {cls: 'rubik-cube-button'});
    SvgUtils.drawRotateLeftIcon(turnLeftSvg);

    this.buttonRight = buttonDiv.createEl('button', {'title': 'Rotate right 90 degrees'});
    let turnRightSvg: SVGSVGElement = this.buttonRight.createSvg('svg', {cls: 'rubik-cube-button'});
    SvgUtils.drawRotateRightIcon(turnRightSvg);

    this.buttonResetRotation = buttonDiv.createEl('button', {'title': 'Reset rotation'});
    setIcon(this.buttonResetRotation, 'reset')

    this.buttonLockRotation = buttonDiv.createEl('button', {'title': 'Lock rotation'});
    setIcon(this.buttonLockRotation, 'lock-open')

    if (this.cubeState.id){
      let title: string;
      if (this.cubeState.locked) {
        title = `Un-save default rotation. (current: ${this.cubeState.defaultRotation})`
      } else {
        title = 'Save rotation.';
      }
      this.buttonSaveRotation = buttonDiv.createEl('button', {title});
      if (this.cubeState.locked) {
        setIcon(this.buttonSaveRotation, 'save-off');
      }else{
        setIcon(this.buttonSaveRotation, 'save');
      }
    }
  }
}

export class CubeRendererPLL extends CubeRenderer {

  constructor(private readonly cubeStatePll: CubeStatePLL) {
    super(cubeStatePll);
  }

  displayCubeForeground(svgElement: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void {
    SvgUtils.drawGrid(svgElement, viewBoxWidth, viewBoxHeight, 100);
  }

  displayArrows(mainSvg: SVGSVGElement): void {
    SvgUtils.drawArrows(mainSvg, this.cubeStatePll.arrowCoordinates, this.cubeStatePll.arrowColor);
  }

  displayAlgorithms(container: HTMLDivElement): void {
    const algorithms: Algorithms = this.cubeStatePll.algorithms;
    if (!algorithms || algorithms.items.length === 0) return;  /* Fail-safe, algorithms are optional */
    UiUtils.renderAlgorithmList(container, algorithms.items);
  }
}

export class CubeRendererOLL extends CubeRenderer {

  constructor(private readonly cubeStateOLL: CubeStateOLL) {
    super(cubeStateOLL);
  }

  displayCubeForeground(svgElement: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void {
    // debugger;
    let cells: OllFieldColoring = this.cubeStateOLL.ollFieldInput;
    const [cubeWidth, cubeHeight] = [this.cubeStateOLL.dimensions.width, this.cubeStateOLL.dimensions.height]; // e.g. 3,3

    const stickerSize = 100;
    const half = stickerSize / 2;
    const gridLen = cells.length();

    /* Upper and lower edges */
    for (let x = 0; x < cubeWidth; x++) {
      const xPos = half + x * stickerSize;
      SvgUtils.drawSticker(svgElement, xPos, 0, stickerSize, half, cells.getColor(0, x + 1));
      SvgUtils.drawSticker(svgElement, xPos, viewBoxHeight - half, stickerSize, half, cells.getColor(gridLen - 1, x + 1));
    }

    /* Left and right edges */
    for (let y = 0; y < cubeHeight; y++) {
      const yPos = half + y * stickerSize;
      SvgUtils.drawSticker(svgElement, 0, yPos, half, stickerSize, cells.getColor(y + 1, 0));
      SvgUtils.drawSticker(svgElement, viewBoxWidth - half, yPos, half, stickerSize, cells.getColor(y + 1, gridLen - 1));
    }

    /* Center rows/columns */
    for (let y = 0; y < cubeHeight; y++) {
      for (let x = 0; x < cubeWidth; x++) {
        SvgUtils.drawSticker(svgElement, half + x * stickerSize, half + y * stickerSize, stickerSize, stickerSize, cells.getColor(y + 1, x + 1), true);
      }
    }

    SvgUtils.drawGrid(svgElement, viewBoxWidth, viewBoxHeight, half);
  }

  redrawArrows(): void {
    super.redrawCube();
  }

  displayArrows(mainSvg: SVGSVGElement): void {
    const {arrowColor} = this.cubeStateOLL;
    SvgUtils.drawArrows(mainSvg, this.cubeStateOLL.currentArrowCoordinates(), arrowColor);
  }

  displayAlgorithms(container: HTMLDivElement) {
    const {selectedAlgorithmHash, algorithmToArrows, uniqueIdForRadioButtons} = this.cubeStateOLL;
    if (selectedAlgorithmHash === undefined) return; /* Fail-safe, nothing selected */
    UiUtils.renderAlgorithmSelect(container, algorithmToArrows.getAllItems(), selectedAlgorithmHash, uniqueIdForRadioButtons);
  }
}

