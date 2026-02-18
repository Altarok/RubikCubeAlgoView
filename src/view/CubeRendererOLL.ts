import {CubeRenderer} from "./CubeRenderer";
import {CubeStateOLL} from "../model/CubeStateOLL";
import {OllFieldColors} from "../OllFieldColors";

export class CubeRendererOLL extends CubeRenderer {
  cubeState: CubeStateOLL;

  constructor(cubeState: CubeStateOLL) {
    super(cubeState);
    this.cubeState = cubeState;
  }

  displayCubeForeground(svgElement: SVGSVGElement, viewBoxWidth: number, viewBoxHeight: number): void {
    /*
     * Edge rows/columns
     */

    let cells: OllFieldColors = this.cubeState.ollFieldColors;


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

  displayAlgorithms(container: HTMLDivElement): void {

    let ul: HTMLUListElement = container.createEl('ul');

    /*
     * TODO replace with user input
     */
    ul.createEl('li', {text: "Fake algorithms"});
    ul.createEl('li', {text: "For now"});

  }

}
