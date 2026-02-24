import {CubeState, CubeStateOLL, CubeStatePLL} from "../model/cube-state";
import {InvalidInput, isInvalidRow} from "../model/invalid-input";
import {ArrowCoords, Arrows, Coordinates, Dimensions} from "../model/geometry";
import {Algorithm, Algorithms} from "../model/algorithms";
import {OllFieldColoring} from "../model/oll-field-coloring";
import {createArrowHead, drawArrows, drawGrid, drawRotateLeftIcon, drawRotateRightIcon, drawSticker} from "./svg-utils";
import {showInvalidInput} from "./ui-utils";


export abstract class CubeRenderer {
  cubeState: CubeState;
  /** Rotation of cube, degrees */
  cubeRotation: number;
  /** Pointer to cube SVG image */
  cubeDiv: HTMLDivElement;
  /** Pointer to algorithms container  */
  algorithmsDiv: HTMLDivElement

  buttonLeft: HTMLButtonElement;
  // buttonCopy: HTMLButtonElement;
  buttonRight: HTMLButtonElement;
  mainCubeSvg: SVGSVGElement;

  protected constructor(cubeState: CubeState) {
    this.cubeState = cubeState;
    this.cubeRotation = 0;
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

    let mainContainer: HTMLDivElement = container.createEl('div', {cls: 'rubik-cube-div-main-container'});

    let leftSide: HTMLDivElement = mainContainer.createEl('div', {cls: 'rubik-cube-div-left-column'});
    let textSide: HTMLDivElement = mainContainer.createEl('div', {cls: 'rubik-cube-div-right-column'});

    this.cubeDiv = leftSide.createEl('div', {attr: {id: 'cubeDiv'}, cls: 'rotatable'});
    let buttonDiv: HTMLDivElement = leftSide.createEl('div', {attr: {id: 'buttonDiv'}, cls: 'button-container'});
    this.algorithmsDiv = textSide.createEl('div', {attr: {id: 'algorithmsDiv'}});

    this.displayCube(this.cubeDiv);
    this.displayButtons(buttonDiv);
    this.displayAlgorithms(this.algorithmsDiv);
  }

  redrawCube(): void {
    this.cubeDiv.removeChild(this.mainCubeSvg);
    // this.mainCubeSvg.detach();
    this.displayCube(this.cubeDiv);
  }

  displayCube(element: HTMLDivElement): void {
    let viewBoxDimensions: Dimensions = this.cubeState.viewBoxDimensions;
    let viewBoxWidth: number = viewBoxDimensions.width;
    let viewBoxHeight: number = viewBoxDimensions.height;

    let mainSvgElement: SVGSVGElement = this.displayCubeBackground(element, viewBoxWidth, viewBoxHeight);
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
    this.cubeRotation += degreeChange;
    this.cubeDiv.style.transform = `rotate(${this.cubeRotation}deg)`;
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
  cubeState: CubeStatePLL;

  constructor(cubeState: CubeStatePLL) {
    super(cubeState);
    this.cubeState = cubeState;
  }

  displayCubeForeground(svgElement: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void {
    drawGrid(svgElement, viewBoxWidth, viewBoxHeight, 100);
  }

  displayArrows(mainSvg: SVGSVGElement): void {
    drawArrows(mainSvg, this.cubeState.arrowCoordinates, this.cubeState.arrowColor);
  }

  redrawAlgorithms(): void {

    if (this.algorithmsDiv === undefined) return;

    this.algorithmsDiv.empty();
    this.displayAlgorithms(this.algorithmsDiv);
  }

  displayAlgorithms(container: HTMLDivElement): void {

    let algorithms: Algorithms = this.cubeState.algorithms;

    /* Fail-safe */
    if (algorithms === undefined || algorithms.length() === 0) return;

    let ul: HTMLUListElement = container.createEl('ul');

    let items: Algorithm[] = algorithms.items;

    for (let i: number = 0; i < items.length; i++) {
      ul.createEl('li', {text: items[i]!.toString()});
    }
  }
}

export class CubeRendererOLL extends CubeRenderer {
  cubeState: CubeStateOLL;
  radioDiv: HTMLDivElement;
  // arrowSVG: SVGSVGElement;
  // arrowSVGs: SVGLineElement[];

  constructor(cubeState: CubeStateOLL) {
    super(cubeState);
    this.cubeState = cubeState;
    // this.arrowSVGs = new Array<SVGLineElement>();
  }

  displayCubeForeground(svgElement: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void {
    let cells: OllFieldColoring = this.cubeState.ollFieldColors;
    const [ cubeWidth, cubeHeight ] = [this.cubeState.cubeWidth, this.cubeState.cubeHeight]; // e.g. 3,3

    /*
     * Edge rows/columns
     */
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
    drawArrows(mainSvg, this.cubeState.currentArrowCoordinates(), this.cubeState.arrowColor);
  }

  redrawAlgorithms(): void {

    if (this.algorithmsDiv === undefined) return;

    this.algorithmsDiv.empty();
    this.displayAlgorithms(this.algorithmsDiv);
  }

  displayAlgorithms(container: HTMLDivElement): void {

    if (undefined === this.cubeState.currentAlgorithmIndex) return;

    let ul: HTMLUListElement = container.createEl('ul');

    // let algorithmIterator: MapIterator<MappedAlgorithm> = this.cubeState.algorithmToArrows.values();

    this.radioDiv = ul.createEl('div', {attr: {id: 'radioButtons'}});

    console.debug(`Draw algorithms. Selected: ${this.cubeState.currentAlgorithmIndex}, count: ${this.cubeState.algorithmToArrows.size()}`);

    for (let i: number = 0; i < this.cubeState.algorithmToArrows.size(); i++) {
      let algorithm: Algorithm = this.cubeState.algorithmToArrows.get(i)!.algorithm;

      let checked: boolean = this.cubeState.currentAlgorithmIndex === i;

      if (checked) {
        this.radioDiv.createEl('input', {
          attr: {
            name: 'algorithm-selection',
            type: 'radio',
            id: '' + i,
            value: '' + i,
            checked
          }
        });
      } else {
        this.radioDiv.createEl('input', {
          attr: {
            name: 'algorithm-selection',
            type: 'radio',
            id: '' + i,
            value: '' + i
          }
        });
      }
      this.radioDiv.createEl('label', {attr: {id: '' + i, for: '' + i}, text: algorithm.toString()});
      this.radioDiv.createEl('br');
    }

  }

}

