import {CubeRenderer} from "./CubeRenderer";
import {CubeStatePLL} from "../model/CubeStatePLL";
import {Algorithm} from "../model/Algorithm";

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

  redrawAlgorithms(): void {

    if (this.algorithmsDiv === undefined) return;

    this.algorithmsDiv.empty();
    this.displayAlgorithms(this.algorithmsDiv);

  }

  displayAlgorithms(container: HTMLDivElement): void {

    let algorithms: Algorithm[]  = this.cubeState.algorithms;

    /* Fail-safe */
    if (algorithms === undefined || algorithms.length === 0) return;

    let ul: HTMLUListElement = container.createEl('ul');

    for (let i: number = 0; i < algorithms.length; i++) {
      ul.createEl('li', {text: algorithms[i]!.toString()});
    }
  }
}
