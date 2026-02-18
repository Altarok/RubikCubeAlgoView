import {CubeState} from "../model/CubeState";
import {InvalidInputContainer} from "../model/InvalidInputContainer";
import {Dimensions} from "../model/Dimensions";
import {ArrowCoordinates} from "../model/ArrowCoordinates";
import {Coordinates} from "../model/Coordinates";

export abstract class CubeRenderer {
  cubeState: CubeState;
  /** Rotation of cube, degrees */
  cubeRotation: number;
  /** Pointer to cube SVG image */
  cubeDiv: HTMLDivElement;

  buttonLeft: HTMLButtonElement;
  buttonCopy: HTMLButtonElement;
  buttonRight: HTMLButtonElement;

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
      this.displayCubeButtonAlgorithms(element);
    }

  }

  abstract displayCubeForeground(container: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void;

  abstract displayAlgorithms(container: HTMLDivElement): void;

  displayCubeButtonAlgorithms(container: HTMLElement): void {

    let mainContainer: HTMLDivElement = container.createEl('div', { cls: 'rubik-cube-div-main-container'});

    let leftSide: HTMLDivElement = mainContainer.createEl('div', { cls: 'rubik-cube-div-left-column'});
    let textSide: HTMLDivElement = mainContainer.createEl('div', { cls: 'rubik-cube-div-right-column'});

    this.cubeDiv = leftSide.createEl('div', {attr: {id: 'cubeDiv'}, cls: 'rotatable'});
    let buttonDiv: HTMLDivElement = leftSide.createEl('div', {attr: {id: 'buttonDiv'}, cls: 'button-container'});
    let algorithmsDiv: HTMLDivElement = textSide.createEl('div', {attr: {id: 'algorithmsDiv'}});

    this.displayCube(this.cubeDiv);
    this.displayButtons(buttonDiv);
    this.displayAlgorithms(algorithmsDiv);
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

    let mainSvg: SVGSVGElement = element.createSvg('svg', {
      attr: {
        width: imageWidth,
        height: imageHeight,
        viewBox: '0 0 ' + viewBoxWidth + ' ' + viewBoxHeight
      }, cls: 'rubik-cube-pll'
    });
    let defs: SVGDefsElement = mainSvg.createSvg('defs');
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

    marker.createSvg('polygon', {attr: {points: '0 0, 10 3.5, 0 7', fill: this.cubeState.arrowColor}});

    /* Background rectangle */
    mainSvg.createSvg('rect', {attr: {fill: this.cubeState.backgroundColor}, cls: "rubik-cube-pll-rect"});

    return mainSvg;
  }



  displayArrows(mainSvg: SVGSVGElement): void {
    let arrows: ArrowCoordinates[] = this.cubeState.arrowCoordinates;
    for (let i: number = 0; i < arrows.length; i++) {
      let arrow: ArrowCoordinates = arrows[i]!;
      let arrStart: Coordinates = arrow.start();
      let arrEnd: Coordinates = arrow.end();
      //console.log('Arrow goes from ' + arrowStartCoord + ' to ' + arrowEndCoord);
      mainSvg.createSvg('line', {
        attr: {
          x1: arrStart.x,
          y1: arrStart.y,
          x2: arrEnd.x,
          y2: arrEnd.y,
          'marker-end': 'url(#arrowhead' + this.cubeState.arrowColor + ')',
          stroke: this.cubeState.arrowColor
        },
        cls: 'rubik-cube-arrow'
      });
    }
  }

  /**
   * @param {HTMLElement} element - HTML element to draw on
   */
  displayWarningForInvalidInput(element: HTMLElement): void {

    element.createEl('div', {text: 'Code block interpretation failed:', cls: 'rubik-cube-warning-text-orange'});

    let rows: string[] = this.cubeState.codeBlockContent;
    let invalidInputContainer: InvalidInputContainer = this.cubeState.invalidInputContainer!;

    if (rows.length === 0) {
      element.createEl('b', {text: '[empty]', cls: 'rubik-cube-warning-text-red'});
      element.createEl('span', {text: ' => ' + invalidInputContainer.reasonForFailure});
    } else {
      for (let r: number = 0; r < rows.length; r++) {
        let row: string = rows[r]!;
        if (invalidInputContainer.isInvalidRow(row)) {
          element.createEl('b', {text: row, cls: 'rubik-cube-warning-text-red'});
          element.createEl('span', {text: ' => ' + invalidInputContainer.reasonForFailure});
        } else {
          element.createEl('div', {text: row});
        }
      }
    }
  }

  /**
   * @param {number} degreeChange - Usually +90 or -90, but everything works
   */
  rotateCube(degreeChange: number): void {
    // Change current cube rotation
    this.cubeRotation += degreeChange;
    this.cubeDiv.style.transform = `rotate(${this.cubeRotation}deg)`;
  }

  displayButtons(buttonDiv: HTMLDivElement): void {

    this.buttonLeft = buttonDiv.createEl('button', {'title': 'Rotate left 90 degrees'});
    this.buttonCopy = buttonDiv.createEl('button', {'title': 'Copy code block at current state'});
    this.buttonRight = buttonDiv.createEl('button', {'title': 'Rotate right 90 degrees'});

    this.buttonLeft.addEventListener('click', () => {
      this.rotateCube(+90); // clock-wise quarter rotation
    });

    this.buttonRight.addEventListener('click', () => {
      this.rotateCube(-90); // anti-clock-wise quarter rotation
    });

    let turnLeftSvg: SVGSVGElement = this.buttonLeft.createSvg('svg', {attr: {'stroke-width': 1}, cls: 'rubik-cube-button'});
    turnLeftSvg.createSvg('rect', {attr: {x: 10, y: 2, width: 12, height: 12, rx: 2, ry: 2}});
    turnLeftSvg.createSvg('line', {attr: {x1: 14, y1:  2, x2: 14, y2: 14}});
    turnLeftSvg.createSvg('line', {attr: {x1: 18, y1:  2, x2: 18, y2: 14}});
    turnLeftSvg.createSvg('line', {attr: {x1: 10, y1:  6, x2: 22, y2:  6}});
    turnLeftSvg.createSvg('line', {attr: {x1: 10, y1: 10, x2: 22, y2: 10}});
    turnLeftSvg.createSvg('path', {attr: {d: 'M13 22a10 10 0 0 1 -10 -10v-2', 'stroke-width': 1.5}});
    turnLeftSvg.createSvg('polyline', {attr: {points: '0,13 3,10 6,13', 'stroke-width': 1.5}});

    let copySvg: SVGSVGElement = this.buttonCopy.createSvg('svg', {attr: {'stroke-width': 2}, cls: 'rubik-cube-button'});
    copySvg.createSvg('rect', {attr: {x: 9, y: 9, width: 13, height: 13, rx: 2, ry: 2}});
    copySvg.createSvg('path', {attr: {d: 'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'}});

    let turnRightSvg: SVGSVGElement = this.buttonRight.createSvg('svg', { attr: {'stroke-width': 1}, cls: 'rubik-cube-button'});
    turnRightSvg.createSvg('rect', {attr: {x: 2, y: 2, width: 12, height: 12, rx: 2, ry: 2}});
    turnRightSvg.createSvg('line', {attr: {x1:  6, y1:  2, x2:  6, y2: 14}});
    turnRightSvg.createSvg('line', {attr: {x1: 10, y1:  2, x2: 10, y2: 14}});
    turnRightSvg.createSvg('line', {attr: {x1:  2, y1:  6, x2: 14, y2:  6}});
    turnRightSvg.createSvg('line', {attr: {x1:  2, y1: 10, x2: 14, y2: 10}});
    turnRightSvg.createSvg('path', {attr: {d: 'M11 22a10 10 0 0 0 10 -10v-2', 'stroke-width': 1.5}});
    turnRightSvg.createSvg('polyline', {attr: {points: '18,13 21,10 24,13', 'stroke-width': 1.5}});

  }


}
