import RubikCubeAlgos from "./main";
import { OLL } from "./CalculatorOLL";
import {OllFieldInput} from "./OllFieldInput";
import {Dimensions} from "./Dimensions";
import {MarkdownPostProcessorBase} from "./MarkdownPostProcessorBase";

export class MarkdownPostProcessorOLL extends MarkdownPostProcessorBase {
  source: string;
  plugin: RubikCubeAlgos;
  element: HTMLElement;

  constructor(source: string, plugin: RubikCubeAlgos, element: HTMLElement) {
    super(element);
    this.source = source;
    this.plugin = plugin;
    this.element = element;
    this.display();
  }
  
  onload() {
   /*
    * Register listener which instantly redraws Rubik's Cubes while changing plugin settings.
    */
   this.registerEvent(
     this.plugin.app.workspace.on("rubik:rerender-markdown-code-block-processors",
       this.display.bind(this)
     )
   );
  }

  display() {
    this.element.empty();
    const rows: string[] = this.source.split('\n').filter((row) => row.length > 0);
    let ollData: OLL = new OLL(rows, this.plugin.settings);
    ollData.setup();
    let cells: OllFieldInput = ollData.getOllFieldInput();

    if (ollData.codeBlockInterpretationFailed()){
      super.displayWarningForNonsenseCodeBlock(rows, ollData);
      return;
    }

    let viewBoxDimensions: Dimensions = ollData.getDrawDimensions();
    let viewBoxWidth: number = viewBoxDimensions.width;
    let viewBoxHeight: number = viewBoxDimensions.height;

    let imageWidth: number = viewBoxWidth;
    let imageHeight: number = viewBoxHeight;
    if (ollData.isDefaultCubeSize()) {
      imageWidth = 200;
      imageHeight = 200;
    }


    let mainSvg: SVGSVGElement = this.element.createSvg('svg', { attr: { width:imageWidth, height:imageHeight, viewBox:'0 0 '+viewBoxWidth+' '+viewBoxHeight }, cls: "rubik-cube-pll" });
    let defs: SVGDefsElement = mainSvg.createSvg('defs');
    let marker: SVGMarkerElement = defs.createSvg('marker', { attr: {id:'arrowhead' + ollData.arrowColor, markerWidth:'10', markerHeight:'7', refX:'9', refY:'3.5', orient:'auto'}});
    marker.createSvg('polygon', { attr: {points:'0 0, 10 3.5, 0 7' , fill:ollData.arrowColor}});

    /* Black base rect */
    mainSvg.createSvg('rect', { attr: { fill:'#000' }, cls: "rubik-cube-pll-rect" });
    
    /*
     * Edge rows/columns
     */
    let cubeWidth = rows[0]!.length;
    let cubeHeight = rows.length;
     
    /* upper row border */
    for (let x:number = 0; x < cubeWidth-2; x++) {
      mainSvg.createSvg('rect', { attr: { x:50+x*100, y:0, width:'100', height:'50', fill:cells.getColor(0, x+1) }, cls: "rubik-cube-rect" });
    }
    /* lower row border */
    for (let x:number = 0; x < cubeWidth-2; x++) {
      mainSvg.createSvg('rect', { attr: { x:50+x*100, y:viewBoxHeight-50, width:'100', height:'50', fill:cells.getColor(cells.length()-1, x+1) }, cls: "rubik-cube-rect" });
    }
    /* left column border */
    for (let y:number = 0; y < cubeHeight-2; y++) {
      mainSvg.createSvg('rect', { attr: { x:0, y:50+y*100, width:50, height:100, fill:cells.getColor(y+1, 0) }, cls: "rubik-cube-rect" });
    }
    /* right column border */
    for (let y:number = 0; y < cubeHeight-2; y++) {
      mainSvg.createSvg('rect', { attr: { x:viewBoxWidth-50, y:50+y*100, width:50, height:100, fill:cells.getColor(y+1, cells.length()-1) }, cls: "rubik-cube-rect" });
    }

    /*
     * Center rows/columns
     */
    for (let y:number = 0; y < cubeHeight-2; y++) {
      for (let x:number = 0; x < cubeWidth-2; x++) {
        mainSvg.createSvg('rect', { attr: { x:50+x*100, y:50+y*100, width:100, height:100, fill:cells.getColor(y+1, x+1) }, cls: "rubik-cube-pll-line-grid" });
      }
    }

    /*
     * Background grid; static, unresponsive, black rectangular lines
     */
    /* Vertical lines */
    for (let x:number = 50; x < viewBoxWidth; x+=100) {
      mainSvg.createSvg('line', { attr: { x1:x, x2:x, y1:0, y2:viewBoxHeight }, cls: "rubik-cube-pll-line-grid" });
    }
    /* Horizontal lines */ 
    for (let y:number = 50; y < viewBoxHeight; y+=100) {
      mainSvg.createSvg('line', { attr: { x1:0, x2:viewBoxWidth, y1:y, y2:y }, cls: "rubik-cube-pll-line-grid" });
    }

    super.displayArrows(mainSvg, ollData);
  }

}
