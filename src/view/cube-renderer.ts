import {CubeState, CubeStateOLL, CubeStatePLL} from "../model/cube-state";
import {Algorithm, Algorithms} from "../model/algorithms";
import {OllFieldColoring} from "../model/oll-field-coloring";
import {SvgUtils} from "./svg-utils";
import {UiUtils} from "./ui-utils";
import {applyRotation} from "./dom-rotation";
import {createCubeLayout, CubeLayout} from "./cube-layout";


export abstract class CubeRenderer {
  layout: CubeLayout;
  buttonLeft: HTMLButtonElement;
  buttonRight: HTMLButtonElement;
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

    this.layout = createCubeLayout(container);

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
      UiUtils.showInvalidInput(element, this.cubeState.codeBlockContent, error);
    }
  }

  /**
   * Clock-wise quarter rotation of cube.
   */
  rotateLeft(): void {
    this.rotateCube(+90);
  }

  /**
   * Anti-clock-wise quarter rotation of cube.
   */
  rotateRight(): void {
    this.rotateCube(-90);
  }

  /**
   * Change current cube rotation.
   * @param {number} degreeChange - Usually +90 or -90, but everything works
   */
  private rotateCube(degreeChange: number): void {
    this.cubeState.cubeRotation += degreeChange;
    applyRotation(this.layout.cubeDiv, this.cubeState.cubeRotation);
  }

  displayButtons(buttonDiv: HTMLDivElement): void {

    this.buttonLeft = buttonDiv.createEl('button', {'title': 'Rotate left 90 degrees'});
    // this.buttonCopy = buttonDiv.createEl('button', {'title': 'Copy code block at current state'});
    this.buttonRight = buttonDiv.createEl('button', {'title': 'Rotate right 90 degrees'});

    let turnLeftSvg: SVGSVGElement = this.buttonLeft.createSvg('svg', {
      attr: {'stroke-width': 1},
      cls: 'rubik-cube-button'
    });
    SvgUtils.drawRotateLeftIcon(turnLeftSvg);

    let turnRightSvg: SVGSVGElement = this.buttonRight.createSvg('svg', {
      attr: {'stroke-width': 1},
      cls: 'rubik-cube-button'
    });
    SvgUtils.drawRotateRightIcon(turnRightSvg);

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

  redrawAlgorithms(): void {

    if (this.layout.algorithmsDiv === undefined) return;

    this.layout.algorithmsDiv.empty();
    this.displayAlgorithms(this.layout.algorithmsDiv);
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
    let cells: OllFieldColoring = this.cubeStateOLL.ollFieldColors;
    const [cubeWidth, cubeHeight] = [this.cubeStateOLL.cubeWidth, this.cubeStateOLL.cubeHeight]; // e.g. 3,3

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
    const { arrowColor } = this.cubeStateOLL;
    SvgUtils.drawArrows(mainSvg, this.cubeStateOLL.currentArrowCoordinates(), arrowColor);
  }

  redrawAlgorithms(): void {
    if (this.layout.algorithmsDiv === undefined) return;
    this.layout.algorithmsDiv.empty();
    this.displayAlgorithms(this.layout.algorithmsDiv);
  }

  displayAlgorithms(container: HTMLDivElement) {
    const { currentAlgorithmIndex: index, algorithmToArrows } = this.cubeStateOLL;
    if (index === undefined) return; /* Fail-safe, nothing selected */
    UiUtils.renderAlgorithmSelect(container, algorithmToArrows.getAllItems(), index);
  }
}

