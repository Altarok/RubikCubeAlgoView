import {MarkdownRenderChild} from "obsidian";
import RubikCubeAlgos from "./main";
import {PLL} from "./RCA-PLL-Calculations";
import {ArrowCoordinates} from "./ArrowCoordinates";
import {Coordinates} from "./Coordinates";


export class PLLView extends MarkdownRenderChild {
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
     * Register listener which instantly redraws rubik cubes while changing plugin settings.
     */
    this.registerEvent(
      this.plugin.app.workspace.on('rubik:rerender-markdown-code-block-processors',
        this.display.bind(this)
      )
    );
  }

  display() {
    this.element.empty();
    const rows = this.source.split('\n').filter((row) => row.length > 0);
    let pllData = new PLL(rows, this.plugin.settings);
    pllData.setup();

    let widthXheight = pllData.getCubeSize();

    if (pllData.codeBlockInterpretationFailed()){
      this.element.createEl('div', { text: 'Rubik Cube PLL pattern interpretation failed.' , cls:'rubik-cube-warning-text-orange' });
      this.element.createEl('div', { text: '```rubikCubePLL' });
      if (rows.length === 0) {
        this.element.createEl('b', { text: '[empty]' , cls:'rubik-cube-warning-text-red' });
        this.element.createEl('text', { text: ' => ' + pllData.reasonForFailure } );
      } else {
        for (let r:number = 0; r < rows.length; r++) {
          let row = rows[r];
          if (pllData.isRowInterpretable(row)) {
            this.element.createEl('div', { text: row } );
          } else {
            this.element.createEl('b', { text: row , cls:'rubik-cube-warning-text-red' });
            this.element.createEl('text', { text: ' => ' + pllData.reasonForFailure  } );
          }
        }
      }
      this.element.createEl('div', { text: '```' });
      return;
    }

    let w: number = widthXheight[0];
    let h: number = widthXheight[1];
    let mainSvg = this.element.createSvg('svg', { attr: { viewBox:'0 0 '+w+' '+h, width:w, height:h }, cls: 'rubik-cube-pll' });
    let defs = mainSvg.createSvg('defs');
    let marker = defs.createSvg('marker', { attr: {id:'arrowhead'+pllData.arrowColor, markerWidth:'10', markerHeight:'7', refX:'9', refY:'3.5', orient:'auto'}});
    marker.createSvg('polygon', { attr: {points:'0 0, 10 3.5, 0 7' , fill:pllData.arrowColor}});

    /* Yellow base rect */
    mainSvg.createSvg('rect', { attr: { fill:pllData.cubeColor }, cls: 'rubik-cube-pll-rect' });

    /*
     * Background grid; static, unresponsive, black, rectangular lines
     */
    /* Vertical lines */
    for (let x:number = 100; x < w; x+=100) {
      mainSvg.createSvg('line', { attr: { x1:x, x2:x, y1:0, y2:h }, cls: 'rubik-cube-pll-line-grid' });
    }
    /* Horizontal lines */
    for (let y:number = 100; y < h; y+=100) {
      mainSvg.createSvg('line', { attr: { x1:0, x2:w, y1:y, y2:y }, cls: 'rubik-cube-pll-line-grid' });
    }

    let arrows: ArrowCoordinates[] = pllData.getArrowCoordinates();
    for (let i: number = 0; i < arrows.length; i++) {
      let arrow: ArrowCoordinates = arrows[i];
      let arrStart: Coordinates = arrow.start();
      let arrEnd: Coordinates = arrow.end();
      //console.log("Arrow goes from "+arrowStartCoord+" to "+arrowEndCoord);
      mainSvg.createSvg('line', {
        attr: { x1: arrStart.x, y1: arrStart.y, x2: arrEnd.x, y2: arrEnd.y, 'marker-end': 'url(#arrowhead' + pllData.arrowColor + ')', stroke: pllData.arrowColor },
        cls: 'rubik-cube-pll-line-arrow'
      });
    }
    //console.log('<< rubikCubePLL');
  }


}
