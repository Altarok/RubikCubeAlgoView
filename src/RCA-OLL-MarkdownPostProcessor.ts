import { MarkdownRenderChild } from "obsidian";
import RubikCubeAlgos from "./main";
import { OLL } from "./RCA-OLL-Calculations";


export class OLLView extends MarkdownRenderChild {
  source: string;
  plugin: RubikCubeAlgos;
  constructor(
    source: string,
    plugin: RubikCubeAlgos,
    element: HTMLElement
  ) {
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
    const rows = this.source.split('\n').filter((row) => row.length > 0);
    let ollData = new OLL(rows, this.plugin.settings); 
    let cells = ollData.interpretCodeBlock(rows);
    let widthXheight = ollData.getDimensions();

    if (false === ollData.codeBlockInterpretationSuccessful){
      this.element.createEl('div', { text: "--- Rubik Cube OLL pattern interpretation failed ---" });
      this.element.createEl('div', { text: 'Faulty input:' });
      let explanationDiv = this.element.createEl('div');
      explanationDiv.createEl('b', { text: '"'+ollData.lastNonInterpretableLine+'"', cls:'rubik-cube-warning-text'  });
      if (ollData.reasonForFailure) {
        explanationDiv.createEl('div', { text: 'Reason: '+ollData.reasonForFailure});
      }        
      return; 
    }
    
    let w = widthXheight[0]; 
    let h = widthXheight[1]; 
    console.log('rubikCubeOLL: w='+w+',h='+h);
    let mainSvg = this.element.createSvg('svg', { attr: { width:200, height:200, viewBox:'0 0 '+w+' '+h }, cls: "rubik-cube-pll" });
    //let defs = mainSvg.createSvg('defs');
    //let marker = defs.createSvg('marker', { attr: {id:"arrowhead"+ollData.arrowColor, markerWidth:"10", markerHeight:"7", refX:"9", refY:"3.5", orient:"auto"}});
    //marker.createSvg('polygon', { attr: {points:"0 0, 10 3.5, 0 7" , fill:ollData.arrowColor}});
    
    /* Black base rect */
    //mainSvg.createSvg('rect', { attr: { fill:'#0' }, cls: "rubik-cube-pll-rect" }); 
    
    /*
     * Edge rows/columns
     */
    let cubeWidth = rows[0].length;
    let cubeHeight = rows.length;
     
    /* upper row border */
    for (let x:number = 0; x < cubeWidth-2; x++) {
      mainSvg.createSvg('rect', { attr: { x:50+x*100, y:0, width:'100', height:'50', fill:this.getColor(cells[0][x+1]) }, cls: "rubik-cube-rect" }); 
    }
    /* lower row border */
    for (let x:number = 0; x < cubeWidth-2; x++) {
      mainSvg.createSvg('rect', { attr: { x:50+x*100, y:h-50, width:'100', height:'50', fill:this.getColor(cells[cells.length-1][x+1]) }, cls: "rubik-cube-rect" }); 
    }
    /* left column border */
    for (let y:number = 0; y < cubeHeight-2; y++) {
      mainSvg.createSvg('rect', { attr: { x:0, y:50+y*100, width:50, height:100, fill:this.getColor(cells[y+1][0]) }, cls: "rubik-cube-rect" }); 
    }
    /* right column border */
    for (let y:number = 0; y < cubeHeight-2; y++) {
      mainSvg.createSvg('rect', { attr: { x:w-50, y:50+y*100, width:50, height:100, fill:this.getColor(cells[y+1][cells.length-1]) }, cls: "rubik-cube-rect" }); 
    }

    /*
     * Center rows/columns
     */
    /* Vertical lines */
    for (let y:number = 0; y < cubeHeight-2; y++) {
      for (let x:number = 0; x < cubeWidth-2; x++) {
        mainSvg.createSvg('rect', { attr: { x:50+x*100, y:50+y*100, width:100, height:100, fill:this.getColor(cells[y+1][x+1]) }, cls: "rubik-cube-pll-line-grid" });
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
  
    //for (let i = 0; i < ARROWS.length; i++) {
    //  let arrow = ARROWS[i];
    //  let arrowStartCoord = arrow[0];
    //  let arrowEndCoord = arrow[1];
    //  //console.log("Arrow goes from "+arrowStartCoord+" to "+arrowEndCoord);
    //  mainSvg.createSvg('line', { attr: { x1:arrowStartCoord[0], x2:arrowEndCoord[0], y1:arrowStartCoord[1], y2:arrowEndCoord[1],
    //        'marker-end':'url(#arrowhead'+ollData.arrowColor+')', stroke:ollData.arrowColor,  },
    //  cls: "rubik-cube-pll-line-arrow" });
    //}
    //console.log('<< rubikCubeOLL');
  }

  private getColor(colorIndex:string):string {
    let c:string = '#000'; 
    if (!colorIndex) {
      c = '#f00';
    } else {
      switch (colorIndex) {
        
      case 'r': c = '#cc0000'; break; // darker red (80%)
      case 'R': c = '#ff0000'; break; // red
      
      case 'o': c = '#cc5000'; break; // darker orange
      case 'O': c = '#ff6400'; break; // orange
      
      case 'b': c = '#00009a'; break; // darker blue
      case 'B': c = '#0000bb'; break; // blue
      
      case 'g': c = '#009a00'; break; // darker green
      case 'G': c = '#00bb00'; break; // green
      
      case 'Y': c = '#ff0000'; break; // yellow
      case 'y': c = '#cc0000'; break; // darker yellow
        
      case 'W': c = '#ffffff'; break; // white
      case 'w': c = '#cccccc'; break; // grey (80%)
      
        
      case '.': c = '#444'; break;
      case '0': c = '#444'; break;
      case '1': c = '#ff0'; break;
      default: c = '#000'; break;
      }
    }
    console.log("getColor() '"+colorIndex+"' => '"+c+"'")
    return c;
  }

}
