import {CubeState, CubeStateOLL, CubeStatePLL} from "../model/cube-state";
import { Dimensions} from "../model/geometry";
import {Algorithm, Algorithms} from "../model/algorithms";
import {OllFieldColoring} from "../model/oll-field-coloring";
import {createArrowHead, drawArrows, drawGrid, drawRotateLeftIcon, drawRotateRightIcon, drawSticker} from "./svg-utils";
import {renderAlgorithmList, renderAlgorithmSelect, showInvalidInput} from "./ui-utils";
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
    } else {
      this.displayCubeButtonAndAlgorithms(element);
    }
  }

  abstract displayCubeForeground(container: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void;

  abstract displayAlgorithms(container: HTMLDivElement): void;

  abstract displayArrows(container: SVGSVGElement): void;

  displayCubeButtonAndAlgorithms(container: HTMLElement): void {

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
    let viewBoxDimensions: Dimensions = this.cubeState.viewBoxDimensions;
    let viewBoxWidth: number = viewBoxDimensions.width;
    let viewBoxHeight: number = viewBoxDimensions.height;

    let mainSvgElement: SVGSVGElement = this.displayCubeBackground(cubeDiv, viewBoxWidth, viewBoxHeight);

    this.displayCubeForeground(mainSvgElement, viewBoxWidth, viewBoxHeight);
    this.displayArrows(mainSvgElement);
  }

  /**
   * @param {HTMLElement} element - HTML element to draw on
   * @param {number} viewBoxWidth - width of image part to zoom in to
   * @param {number} viewBoxHeight - height of image part to zoom in to
   */
  displayCubeBackground(element: HTMLElement, viewBoxWidth: number, viewBoxHeight: number): SVGSVGElement {
    let imageWidth: number = viewBoxWidth;
    let imageHeight: number = viewBoxHeight;
    if (this.cubeState.isDefaultSize()) {
      imageWidth = 200;
      imageHeight = 200;
    }

    this.mainCubeSvg = element.createSvg('svg', {
      attr: {
        width: imageWidth, height: imageHeight,
        viewBox: '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight
      }, cls: 'rubik-cube-pll'
    });

    createArrowHead(this.mainCubeSvg, this.cubeState.arrowColor);

    /* Background rectangle */
    this.mainCubeSvg.createSvg('rect', {attr: {fill: this.cubeState.backgroundColor}, cls: "rubik-cube-pll-rect"});

    return this.mainCubeSvg;
  }

  /**
   * Comes up when user's input is not interpretable. Shows complete user input, with the erroneous line marked in red, including a description of the problem.
   * @param {HTMLElement} element - HTML element to draw on
   */
  displayWarningForInvalidInput(element: HTMLElement): void {
    const error = this.cubeState.invalidInput;

    if (error) {
      showInvalidInput(element, this.cubeState.codeBlockContent, error);
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
    // this.cubeDiv.style.transform = `rotate(${this.cubeRotation}deg)`;
    // const newDegrees = currentDegrees - 90;
    applyRotation(this.layout.cubeDiv, this.cubeState.cubeRotation);
    // return newDegrees;
  }

  displayButtons(buttonDiv: HTMLDivElement): void {

    this.buttonLeft = buttonDiv.createEl('button', {'title': 'Rotate left 90 degrees'});
    // this.buttonCopy = buttonDiv.createEl('button', {'title': 'Copy code block at current state'});
    this.buttonRight = buttonDiv.createEl('button', {'title': 'Rotate right 90 degrees'});

    let turnLeftSvg: SVGSVGElement = this.buttonLeft.createSvg('svg', {
      attr: {'stroke-width': 1},
      cls: 'rubik-cube-button'
    });
    drawRotateLeftIcon(turnLeftSvg);

    let turnRightSvg: SVGSVGElement = this.buttonRight.createSvg('svg', {
      attr: {'stroke-width': 1},
      cls: 'rubik-cube-button'
    });
    drawRotateRightIcon(turnRightSvg);

  }
}

export class CubeRendererPLL extends CubeRenderer {

  constructor(private readonly cubeStatePll: CubeStatePLL) {
    super(cubeStatePll);
  }

  displayCubeForeground(svgElement: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void {
    drawGrid(svgElement, viewBoxWidth, viewBoxHeight, 100);
  }

  displayArrows(mainSvg: SVGSVGElement): void {
    drawArrows(mainSvg, this.cubeStatePll.arrowCoordinates, this.cubeStatePll.arrowColor);
  }

  redrawAlgorithms(): void {

    if (this.layout.algorithmsDiv === undefined) return;

    this.layout.algorithmsDiv.empty();
    this.displayAlgorithms(this.layout.algorithmsDiv);
  }

  displayAlgorithms(container: HTMLDivElement): void {
    const algorithms: Algorithms = this.cubeStatePll.algorithms;
    if (!algorithms || algorithms.items.length === 0) return;  /* Fail-safe, algorithms are optional */
    renderAlgorithmList(container, algorithms.items);
  }
}

export class CubeRendererOLL extends CubeRenderer {

  constructor(private readonly cubeStateOLL: CubeStateOLL) {
    super(cubeStateOLL);
  }

  displayCubeForeground(svgElement: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void {
    let cells: OllFieldColoring = this.cubeStateOLL.ollFieldColors;
    const [ cubeWidth, cubeHeight ] = [this.cubeStateOLL.cubeWidth, this.cubeStateOLL.cubeHeight]; // e.g. 3,3

    /* Upper and lower edges */
    for (let x = 0; x < cubeWidth; x++) {
      drawSticker(svgElement, 50 + x * 100, 0, 100, 50, cells.getColor(0, x + 1));
      drawSticker(svgElement, 50 + x * 100, viewBoxHeight - 50, 100, 50, cells.getColor(cells.length() - 1, x + 1));
    }

    /* Left and right edges */
    for (let y = 0; y < cubeHeight; y++) {
      drawSticker(svgElement, 0, 50 + y * 100, 50, 100, cells.getColor(y + 1, 0));
      drawSticker(svgElement, viewBoxWidth - 50, 50 + y * 100, 50, 100, cells.getColor(y + 1, cells.length() - 1));
    }

    /* Center rows/columns */
    for (let y: number = 0; y < cubeHeight; y++) {
      for (let x: number = 0; x < cubeWidth; x++) {
        drawSticker(svgElement, 50 + x * 100, 50 + y * 100, 100, 100, cells.getColor(y + 1, x + 1), true);
      }
    }

    drawGrid(svgElement, viewBoxWidth, viewBoxHeight, 50);
  }

  redrawArrows(): void {
    // for(const arr of this.arrowSVGs) {
    //   // this.arrowSVG.remove(arr);
    // }
    // // this.arrowSVGs.length = 0; // clear array, yes really
    // this.displayArrows(this.arrowSVG);
    super.redrawCube();
  }

  displayArrows(mainSvg: SVGSVGElement): void {
    drawArrows(mainSvg, this.cubeStateOLL.currentArrowCoordinates(), this.cubeStateOLL.arrowColor);
  }

  redrawAlgorithms(): void {
    if (this.layout.algorithmsDiv === undefined) return;
    this.layout.algorithmsDiv.empty();
    this.displayAlgorithms(this.layout.algorithmsDiv);
  }

  displayAlgorithms(container: HTMLDivElement): void {
    if (undefined === this.cubeStateOLL.currentAlgorithmIndex) return; /* Fail-safe, nothing selected */
    const items: Algorithm[] = this.cubeStateOLL.algorithmToArrows.getAllItems();
    renderAlgorithmSelect(container, items, this.cubeStateOLL.currentAlgorithmIndex);
  }

}

