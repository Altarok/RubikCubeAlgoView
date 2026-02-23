import {CubeRenderer} from "./CubeRenderer";
import {CubeStateOLL} from "../model/CubeStateOLL";
import {OllFieldColors} from "../OllFieldColors";
import {ArrowCoordinates} from "../model/ArrowCoordinates";
import {Coordinates} from "../model/Coordinates";

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
      let arrStart: Coordinates = arrow.start();
      let arrEnd: Coordinates = arrow.end();
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

    if (undefined === this.cubeState.currentAlgorithm) return;

    let ul: HTMLUListElement = container.createEl('ul');

    let algorithmIterator: MapIterator<Algorithm> = this.cubeState.algorithmToArrows.keys();

    this.radioDiv = ul.createEl('div', {id:'radioButton'});

    console.log('Draw algorithms. Current selection: ');
    console.log(this.cubeState.currentAlgorithm.toString());

    for (const algorithm of algorithmIterator) {

      let checked: boolean = algorithm.toString() === this.cubeState.currentAlgorithm.toString();

      if (checked) {
        this.radioDiv.createEl('input', {attr: {name:'algorithm-selection' + this.cubeState.id, type:'radio', id:algorithm.toString(), checked}});
      } else {
        this.radioDiv.createEl('input', {attr: {name:'algorithm-selection' + this.cubeState.id, type:'radio', id:algorithm.toString()}});
      }
      this.radioDiv.createEl('label', {attr: {for:algorithm.toString()}, text: algorithm.toString()});
      this.radioDiv.createEl('br');
    }



    // <input type="radio" id="html" name="fav_language" value="HTML">
    //   <label for="html">HTML</label><br>
    //   <input type="radio" id="css" name="fav_language" value="CSS">
    //   <label for="css">CSS</label><br>
    //   <input type="radio" id="javascript" name="fav_language" value="JavaScript">
    //   <label for="javascript">JavaScript</label>

    //   , {attr: {type:'radio', name:'nam', id:'1'}, text: '1'});
    // ul.createEl('div', {attr: {type:'radio', name:'nam', id:'2'}, text: '2'});

    // /*
    //  * TODO replace with user input
    //  */
    // ul.createEl('li', {text: "For now"});

  }

}

