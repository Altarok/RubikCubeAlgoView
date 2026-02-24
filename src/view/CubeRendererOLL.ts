import {CubeRenderer} from "./CubeRenderer";
import {CubeStateOLL} from "../model/cube-state";
import {OllFieldColors} from "../model/OllFieldColors";
import {ArrowCoordinates, Coordinates} from "../model/arrowCoordinates";
import {Algorithms} from "../model/algorithms";

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
    let cells: OllFieldColors = this.cubeState.ollFieldColors;

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

    let arrows: ArrowCoordinates[] = this.cubeState.currentArrowCoordinates();

    for (let i: number = 0; i < arrows.length; i++) {
      let arrow: ArrowCoordinates = arrows[i]!;
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

    console.log('Draw algorithms. Current selection: ' + this.cubeState.currentAlgorithmIndex);

    for (let i: number = 0; i < this.cubeState.algorithmToArrows.size; i++) {
    // for (const algorithm of algorithmIterator) {
      let algorithm: Algorithms = this.cubeState.algorithmToArrows.get(i)!.algorithm;

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

