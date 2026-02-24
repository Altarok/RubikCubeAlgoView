import {CubeState} from "../model/cube-state";
import {InvalidInput, isInvalidRow} from "../model/invalid-input";
import {Dimensions} from "../model/Dimensions";


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

  redrawCube(): void{
    this.cubeDiv.removeChild( this.mainCubeSvg);
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
    if (this.cubeState.isDefaultCubeSize()) {
      imageWidth = 200;
      imageHeight = 200;
    }

    this.mainCubeSvg = element.createSvg('svg', {
      attr: {
        width: imageWidth, height: imageHeight,
        viewBox: '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight
      }, cls: 'rubik-cube-pll'
    });
    let defs: SVGDefsElement =  this.mainCubeSvg.createSvg('defs');
    let marker: SVGMarkerElement = defs.createSvg('marker', {
      attr: {
        id: 'arrowhead' + this.cubeState.arrowColor,
        markerWidth: '10',
        markerHeight: '7',
        refX: '9',
        refY: '3.5',
        orient: 'auto'
      }
    });

    /* Arrow head. Triangle with coordinates 0,0 / 10,3.5 / 0,7   */
    marker.createSvg('polygon', {attr: {points: '0,0 10,3.5 0,7', fill: this.cubeState.arrowColor}});

    /* Background rectangle */
    this.mainCubeSvg.createSvg('rect', {attr: {fill: this.cubeState.backgroundColor}, cls: "rubik-cube-pll-rect"});

    return  this.mainCubeSvg;
  }

  /**
   * Comes up when user's input is not interpretable. Shows complete user input, with the erroneous line marked in red, including a description of the problem.
   * @param {HTMLElement} element - HTML element to draw on
   */
  displayWarningForInvalidInput(element: HTMLElement): void {

    element.createEl('div', {text: 'Code block interpretation failed:', cls: 'rubik-cube-warning-text-orange'});

    let rows: string[] = this.cubeState.codeBlockContent;
    let invalidInput: InvalidInput = this.cubeState.invalidInput!;

    if (rows.length === 0) {
      element.createEl('b', {text: '[empty]', cls: 'rubik-cube-warning-text-red'});
      element.createEl('span', {text: ' => ' + invalidInput.reason});
    } else {
      for (let r: number = 0; r < rows.length; r++) {
        let row: string = rows[r]!;
        if (isInvalidRow(invalidInput, row)) {
          element.createEl('b', {text: row, cls: 'rubik-cube-warning-text-red'});
          element.createEl('span', {text: ' => ' + invalidInput.reason});
        } else {
          element.createEl('div', {text: row});
        }
      }
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
    turnLeftSvg.createSvg('rect', {attr: {x: 10, y: 2, width: 12, height: 12, rx: 2, ry: 2}});
    turnLeftSvg.createSvg('line', {attr: {x1: 14, y1: 2, x2: 14, y2: 14}});
    turnLeftSvg.createSvg('line', {attr: {x1: 18, y1: 2, x2: 18, y2: 14}});
    turnLeftSvg.createSvg('line', {attr: {x1: 10, y1: 6, x2: 22, y2: 6}});
    turnLeftSvg.createSvg('line', {attr: {x1: 10, y1: 10, x2: 22, y2: 10}});
    turnLeftSvg.createSvg('path', {attr: {d: 'M13 22a10 10 0 0 1 -10 -10v-2', 'stroke-width': 1.5}});
    turnLeftSvg.createSvg('polyline', {attr: {points: '0,13 3,10 6,13', 'stroke-width': 1.5}});

    // let copySvg: SVGSVGElement = this.buttonCopy.createSvg('svg', {attr: {'stroke-width': 2}, cls: 'rubik-cube-button'});
    // copySvg.createSvg('rect', {attr: {x: 9, y: 9, width: 13, height: 13, rx: 2, ry: 2}});
    // copySvg.createSvg('path', {attr: {d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'}});

    let turnRightSvg: SVGSVGElement = this.buttonRight.createSvg('svg', {
      attr: {'stroke-width': 1},
      cls: 'rubik-cube-button'
    });
    turnRightSvg.createSvg('rect', {attr: {x: 2, y: 2, width: 12, height: 12, rx: 2, ry: 2}});
    turnRightSvg.createSvg('line', {attr: {x1: 6, y1: 2, x2: 6, y2: 14}});
    turnRightSvg.createSvg('line', {attr: {x1: 10, y1: 2, x2: 10, y2: 14}});
    turnRightSvg.createSvg('line', {attr: {x1: 2, y1: 6, x2: 14, y2: 6}});
    turnRightSvg.createSvg('line', {attr: {x1: 2, y1: 10, x2: 14, y2: 10}});
    turnRightSvg.createSvg('path', {attr: {d: 'M11 22a10 10 0 0 0 10 -10v-2', 'stroke-width': 1.5}});
    turnRightSvg.createSvg('polyline', {attr: {points: '18,13 21,10 24,13', 'stroke-width': 1.5}});

  }

}
