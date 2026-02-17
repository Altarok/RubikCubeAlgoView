import {CubeState} from "../model/CubeState";
import {InvalidInputContainer} from "../model/InvalidInputContainer";
import {Dimensions} from "../model/Dimensions";
import {ArrowCoordinates} from "../model/ArrowCoordinates";
import {Coordinates} from "../model/Coordinates";

export abstract class CubeRenderer {
  cubeState: CubeState;

  protected constructor(cubeState: CubeState) {
    this.cubeState = cubeState;
  }

  /**
   * @param {HTMLElement} element - HTML element to draw on
   */
  display(element: HTMLElement): void {

    if (this.cubeState.codeBlockInterpretationFailed()){
      this.displayWarningForInvalidInput(element);
    } else {

      let viewBoxDimensions: Dimensions = this.cubeState.viewBoxDimensions;
      let viewBoxWidth: number = viewBoxDimensions.width;
      let viewBoxHeight: number = viewBoxDimensions.height;

      let mainSvgElement: SVGSVGElement = this.displayCubeBackground(element, viewBoxWidth, viewBoxHeight);
      this.displayCubeForeground(mainSvgElement, viewBoxWidth, viewBoxHeight);
      this.displayArrows(mainSvgElement);
    }

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

    let mainSvg: SVGSVGElement = element.createSvg('svg', { attr: { width:imageWidth, height:imageHeight, viewBox:'0 0 '+viewBoxWidth+' '+viewBoxHeight }, cls: 'rubik-cube-pll' });
    let defs: SVGDefsElement = mainSvg.createSvg('defs');
    let marker: SVGMarkerElement = defs.createSvg('marker', { attr: {id:'arrowhead' + this.cubeState.arrowColor, markerWidth:'10', markerHeight:'7', refX:'9', refY:'3.5', orient:'auto'}});

    marker.createSvg('polygon', { attr: {points:'0 0, 10 3.5, 0 7' , fill:this.cubeState.arrowColor }});

    /* Background rectangle */
    mainSvg.createSvg('rect', { attr: { fill:this.cubeState.backgroundColor }, cls: "rubik-cube-pll-rect" });

    return mainSvg;
  }

  abstract displayCubeForeground(svgElement: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void;

  displayArrows(mainSvg: SVGSVGElement) : void {
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
  /*
    TODO add buttons:

    <div class="button-container">

    <button type="button" aria-label="Rotate Left 90 degrees">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <rect x='10' y='2' width='12' height='12' ></rect>
      <line x1='14' y1='2' x2='14' y2='14' ></line>
      <line x1='18' y1='2' x2='18' y2='14' ></line>
      <line x1='10' y1='6' x2='22' y2='6' ></line>
      <line x1='10' y1='10' x2='22' y2='10' ></line>
       <path d="M13 22a10 10 0 0 1 -10 -10v-2"></path>
      <polyline points="0 13 3 10 6 13" stroke-width="1.5" stroke-linecap="butt"></polyline>
      </svg>
    </button>

    <button type="button" aria-label="Copy">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect> <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
    </button>

    <button type="button" aria-label="Rotate Left 90 degrees">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <rect x='2' y='2' width='12' height='12' ></rect>
      <line x1='6' y1='2' x2='6' y2='14' ></line>
      <line x1='10' y1='2' x2='10' y2='14' ></line>
      <line x1='2' y1='6' x2='14' y2='6' ></line>
      <line x1='2' y1='10' x2='14' y2='10' ></line>
       <path d="M11 22a10 10 0 0 0 10 -10v-2"></path>
      <polyline points="18 13 21 10 24 13" stroke-width="1.5"></polyline>
      </svg>
    </button>

  </div>
     */
}
