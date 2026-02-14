import { MarkdownRenderChild } from "obsidian";
import RubikCubeAlgos from "./main";
import { OLL } from "./RCA-OLL-Calculations";
import {OllFieldInput} from "./OllFieldInput";
import {ArrowCoordinates} from "./ArrowCoordinates";
import {Coordinates} from "./Coordinates";


export class OLLView extends MarkdownRenderChild {
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
  //  /*
  //   * Register listener which instantly redraws rubik cubes while changing plugin settings.
  //   */
  //  this.registerEvent(
  //    this.plugin.app.workspace.on(
  //      "rubik:rerender-markdown-code-block-processors",
  //      this.display.bind(this)
  //    )
  //  );
  }
  
  display() {
    this.element.empty();
    const rows: string[] = this.source.split('\n').filter((row) => row.length > 0);
    let ollData: OLL = new OLL(rows, this.plugin.settings);
    ollData.setup();
    let cells: OllFieldInput = ollData.getOllFieldInput();

    if (ollData.codeBlockInterpretationFailed()){

      // eslint-disable-next-line obsidianmd/ui/sentence-case
      this.element.createEl('div', { text: "--- Rubik Cube OLL pattern interpretation failed ---" });
      this.element.createEl('div', { text: 'Faulty input:' });
      let explanationDiv = this.element.createEl('div');
      explanationDiv.createEl('b', { text: '"'+ollData.lastNonInterpretableLine+'"', cls:'rubik-cube-warning-text'  });
      if (ollData.reasonForFailure) {
        explanationDiv.createEl('div', { text: 'Reason: '+ollData.reasonForFailure});
      }
      return;
    }

    let widthXheight: number[] = ollData.getDimensions();
    let w: number = widthXheight[0];
    let h: number = widthXheight[1];

    // console.log('rubikCubeOLL: w='+w+',h='+h);
    let mainSvg = this.element.createSvg('svg', { attr: { width:200, height:200, viewBox:'0 0 '+w+' '+h }, cls: "rubik-cube-pll" });
    let defs = mainSvg.createSvg('defs');
    let marker = defs.createSvg('marker', { attr: {id:'arrowhead' + ollData.arrowColor, markerWidth:'10', markerHeight:'7', refX:'9', refY:'3.5', orient:'auto'}});
    marker.createSvg('polygon', { attr: {points:'0 0, 10 3.5, 0 7' , fill:ollData.arrowColor}});

    /* Black base rect */
    //mainSvg.createSvg('rect', { attr: { fill:'#0' }, cls: "rubik-cube-pll-rect" }); 
    
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
      mainSvg.createSvg('rect', { attr: { x:50+x*100, y:h-50, width:'100', height:'50', fill:cells.getColor(cells.length()-1, x+1) }, cls: "rubik-cube-rect" });
    }
    /* left column border */
    for (let y:number = 0; y < cubeHeight-2; y++) {
      mainSvg.createSvg('rect', { attr: { x:0, y:50+y*100, width:50, height:100, fill:cells.getColor(y+1, 0) }, cls: "rubik-cube-rect" });
    }
    /* right column border */
    for (let y:number = 0; y < cubeHeight-2; y++) {
      mainSvg.createSvg('rect', { attr: { x:w-50, y:50+y*100, width:50, height:100, fill:cells.getColor(y+1, cells.length()-1) }, cls: "rubik-cube-rect" });
    }

    /*
     * Center rows/columns
     */
    /* Vertical lines */
    for (let y:number = 0; y < cubeHeight-2; y++) {
      for (let x:number = 0; x < cubeWidth-2; x++) {
        mainSvg.createSvg('rect', { attr: { x:50+x*100, y:50+y*100, width:100, height:100, fill:cells.getColor(y+1, x+1) }, cls: "rubik-cube-pll-line-grid" });
      }
    }

    /*
     * Background grid; static, unresponsive, black rectangular lines
     */
    /* Vertical lines */
    for (let x:number = 50; x < w; x+=100) {
      mainSvg.createSvg('line', { attr: { x1:x, x2:x, y1:0, y2:h }, cls: "rubik-cube-pll-line-grid" });
    }
    /* Horizontal lines */ 
    for (let y:number = 50; y < h; y+=100) {
      mainSvg.createSvg('line', { attr: { x1:0, x2:w, y1:y, y2:y }, cls: "rubik-cube-pll-line-grid" });
    }

    let arrows: ArrowCoordinates[] = ollData.getArrowCoordinates();
    for (let i: number = 0; i < arrows.length; i++) {
      let arrow: ArrowCoordinates = arrows[i];
      let arrStart: Coordinates = arrow.start();
      let arrEnd: Coordinates = arrow.end();
      //console.log("Arrow goes from "+arrowStartCoord+" to "+arrowEndCoord);
      mainSvg.createSvg('line', {
        attr: { x1: arrStart.x, y1: arrStart.y, x2: arrEnd.x, y2: arrEnd.y, 'marker-end': 'url(#arrowhead' + ollData.arrowColor + ')', stroke: ollData.arrowColor },
        cls: 'rubik-cube-pll-line-arrow'
      });
    }
    //console.log('<< rubikCubeOLL');
  }

}
