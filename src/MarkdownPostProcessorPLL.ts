import RubikCubeAlgos from "./main";
import {PLL} from "./CalculatorPLL";
import {ArrowCoordinates} from "./ArrowCoordinates";
import {Coordinates} from "./Coordinates";
import {Dimensions} from "./Dimensions";
import {MarkdownPostProcessorBase} from "./MarkdownPostProcessorBase";


export class MarkdownPostProcessorPLL extends MarkdownPostProcessorBase {
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
    const rows: string[] = this.source.split('\n').filter((row) => row.length > 0);
    let pllData: PLL = new PLL(rows, this.plugin.settings);
    pllData.setup();

    if (pllData.codeBlockInterpretationFailed()) {
      super.paintWarningForNonsenseCodeBlock(rows, pllData);
      return;
    }

    let viewBoxDimensions: Dimensions = pllData.getDrawDimensions();
    let viewBoxWidth: number = viewBoxDimensions.width;
    let viewBoxHeight: number = viewBoxDimensions.height;

    let imageWidth: number = viewBoxWidth;
    let imageHeight: number = viewBoxHeight;
    if (pllData.isDefaultCubeSize()) {
      imageWidth = 200;
      imageHeight = 200;
    }

    let mainSvg: SVGSVGElement = this.element.createSvg('svg', { attr: { width:imageWidth, height:imageHeight, viewBox:'0 0 '+viewBoxWidth+' '+viewBoxHeight }, cls: 'rubik-cube-pll' });
    let defs: SVGDefsElement = mainSvg.createSvg('defs');
    let marker: SVGMarkerElement = defs.createSvg('marker', { attr: {id:'arrowhead'+pllData.arrowColor, markerWidth:'10', markerHeight:'7', refX:'9', refY:'3.5', orient:'auto'}});
    marker.createSvg('polygon', { attr: {points:'0 0, 10 3.5, 0 7' , fill:pllData.arrowColor}});

    /* Yellow base rect */
    mainSvg.createSvg('rect', { attr: { fill:pllData.cubeColor }, cls: 'rubik-cube-pll-rect' });

    /*
     * Background grid; static, unresponsive, black, rectangular lines
     */
    /* Vertical lines */
    for (let x:number = 100; x < viewBoxWidth; x+=100) {
      mainSvg.createSvg('line', { attr: { x1:x, x2:x, y1:0, y2:viewBoxHeight }, cls: 'rubik-cube-pll-line-grid' });
    }
    /* Horizontal lines */
    for (let y:number = 100; y < viewBoxHeight; y+=100) {
      mainSvg.createSvg('line', { attr: { x1:0, x2:viewBoxWidth, y1:y, y2:y }, cls: 'rubik-cube-pll-line-grid' });
    }

    let arrows: ArrowCoordinates[] = pllData.getArrowCoordinates();
    for (let i: number = 0; i < arrows.length; i++) {
      let arrow: ArrowCoordinates = arrows[i]!;
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
