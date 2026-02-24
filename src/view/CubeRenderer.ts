import {CubeState, CubeStateOLL, CubeStatePLL} from "../model/cube-state";
import {InvalidInput, isInvalidRow} from "../model/invalid-input";
import {ArrowCoords, Arrows, Coordinates, Dimensions} from "../model/geometry";
import {Algorithm, Algorithms} from "../model/algorithms";
import {OllFieldColoring} from "../model/oll-field-coloring";


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

export class CubeRendererPLL extends CubeRenderer {
  cubeState: CubeStatePLL;

  constructor(cubeState: CubeStatePLL) {
    super(cubeState);
    this.cubeState = cubeState;
  }

  displayCubeForeground(svgElement: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void {
    /*
     * Background grid; static, unresponsive, black, rectangular lines
     */
    /* Vertical lines */
    for (let x: number = 100; x < viewBoxWidth; x += 100) {
      svgElement.createSvg('line', {attr: {x1: x, x2: x, y1: 0, y2: viewBoxHeight}, cls: 'rubik-cube-pll-line-grid'});
    }
    /* Horizontal lines */
    for (let y: number = 100; y < viewBoxHeight; y += 100) {
      svgElement.createSvg('line', {attr: {x1: 0, x2: viewBoxWidth, y1: y, y2: y}, cls: 'rubik-cube-pll-line-grid'});
    }
  }

  displayArrows(mainSvg: SVGSVGElement): void {
    let arrows: Arrows = this.cubeState.arrowCoordinates;
    for (let i = 0; i < arrows.length; i++) {
      let arrow: ArrowCoords = arrows[i]!;
      let arrStart: Coordinates = arrow.start;
      let arrEnd: Coordinates = arrow.end;
      mainSvg.createSvg('line', {
        attr: {
          x1: arrStart.x, y1: arrStart.y, x2: arrEnd.x, y2: arrEnd.y,
          'marker-end': 'url(#arrowhead' + this.cubeState.arrowColor + ')',
          stroke: this.cubeState.arrowColor
        },
        cls: 'rubik-cube-arrow'
      });
    }
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

    /*
     * Edge rows/columns
     */
    /* upper row border */
    for (let x:number = 0; x < this.cubeState.cubeWidth; x++) {
      svgElement.createSvg('rect', { attr: { x:50+x*100, y:0, width:'100', height:'50', fill:cells.getColor(0, x+1) }, cls: "rubik-cube-rect" });
    }
    /* lower row border */
    for (let x:number = 0; x < this.cubeState.cubeWidth; x++) {
      svgElement.createSvg('rect', { attr: { x:50+x*100, y:viewBoxHeight-50, width:'100', height:'50', fill:cells.getColor(cells.length()-1, x+1) }, cls: "rubik-cube-rect" });
    }
    /* left column border */
    for (let y:number = 0; y < this.cubeState.cubeHeight; y++) {
      svgElement.createSvg('rect', { attr: { x:0, y:50+y*100, width:50, height:100, fill:cells.getColor(y+1, 0) }, cls: "rubik-cube-rect" });
    }
    /* right column border */
    for (let y:number = 0; y < this.cubeState.cubeHeight; y++) {
      svgElement.createSvg('rect', { attr: { x:viewBoxWidth-50, y:50+y*100, width:50, height:100, fill:cells.getColor(y+1, cells.length()-1) }, cls: "rubik-cube-rect" });
    }

    /*
     * Center rows/columns
     */
    for (let y:number = 0; y < this.cubeState.cubeHeight; y++) {
      for (let x:number = 0; x < this.cubeState.cubeWidth; x++) {
        svgElement.createSvg('rect', { attr: { x:50+x*100, y:50+y*100, width:100, height:100, fill:cells.getColor(y+1, x+1) }, cls: "rubik-cube-pll-line-grid" });
      }
    }

    /*
     * Background grid; static, unresponsive, black rectangular lines
     */
    /* Vertical lines */
    for (let x:number = 50; x < viewBoxWidth; x+=100) {
      svgElement.createSvg('line', { attr: { x1:x, x2:x, y1:0, y2:viewBoxHeight }, cls: "rubik-cube-pll-line-grid" });
    }
    /* Horizontal lines */
    for (let y:number = 50; y < viewBoxHeight; y+=100) {
      svgElement.createSvg('line', { attr: { x1:0, x2:viewBoxWidth, y1:y, y2:y }, cls: "rubik-cube-pll-line-grid" });
    }
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

    // let algorithmIterator: MapIterator<Algorithm> = this.cubeState.algorithmToArrows.keys();

    // this.arrowSVG = mainSvg;

    let arrows: Arrows = this.cubeState.currentArrowCoordinates();

    for (let i: number = 0; i < arrows.length; i++) {
      let arrow: ArrowCoords = arrows[i]!;
      let arrStart: Coordinates = arrow.start;
      let arrEnd: Coordinates = arrow.end;
      // let arrowSVG: SVGLineElement =
      mainSvg.createSvg('line', {
        attr: {
          x1: arrStart.x, y1: arrStart.y, x2: arrEnd.x, y2: arrEnd.y,
          'marker-end': 'url(#arrowhead' + this.cubeState.arrowColor + ')',
          stroke: this.cubeState.arrowColor
        },
        cls: 'rubik-cube-arrow'
      });
      // this.arrowSVGs.push(arrowSVG);
    }
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

    this.radioDiv = ul.createEl('div', {attr: { id:'radioButtons' }});

    console.debug(`Draw algorithms. Selected: ${this.cubeState.currentAlgorithmIndex}, count: ${this.cubeState.algorithmToArrows.size()}`);

    for (let i: number = 0; i < this.cubeState.algorithmToArrows.size(); i++) {
      let algorithm: Algorithm = this.cubeState.algorithmToArrows.get(i)!.algorithm;

      let checked: boolean = this.cubeState.currentAlgorithmIndex === i;

      if (checked) {
        this.radioDiv.createEl('input', {attr: {name:'algorithm-selection', type:'radio', id:''+i, value:''+i, checked}});
      } else {
        this.radioDiv.createEl('input', {attr: {name:'algorithm-selection', type:'radio', id:''+i, value:''+i}});
      }
      this.radioDiv.createEl('label', {attr: {id:''+i, for:''+i}, text: algorithm.toString()});
      this.radioDiv.createEl('br');
    }

  }

}

