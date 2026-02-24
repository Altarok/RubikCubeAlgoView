import {CubeRenderer} from "./CubeRenderer";
import {CubeStatePLL} from "../model/cube-state";
import {Algorithms} from "../model/algorithms";
import {ArrowCoordinates, Coordinates} from "../model/arrowCoordinates";

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
    let arrows: ArrowCoordinates[] = this.cubeState.arrowCoordinates;
    for (let i: number = 0; i < arrows.length; i++) {
      let arrow: ArrowCoordinates = arrows[i]!;
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

    let algorithms: Algorithms[] = this.cubeState.algorithms;

    /* Fail-safe */
    if (algorithms === undefined || algorithms.length === 0) return;

    let ul: HTMLUListElement = container.createEl('ul');

    for (let i: number = 0; i < algorithms.length; i++) {
      ul.createEl('li', {text: algorithms[i]!.toString()});
    }
  }
}
