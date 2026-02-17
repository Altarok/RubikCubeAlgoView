import RubikCubeAlgos from "./main";
import {PLL} from "./CalculatorPLL";
import {Dimensions} from "./model/Dimensions";
import {MarkdownPostProcessorBase} from "./MarkdownPostProcessorBase";
import {CubeRendererPLL} from "./view/CubeRendererPLL";
import {CubeStatePLL} from "./model/CubeStatePLL";

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

  onload(): void {
    /*
     * Register listener which instantly redraws Rubik's Cubes while changing plugin settings.
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

    let cubeState: CubeStatePLL = pllData.setupPll();

    new CubeRendererPLL(cubeState).display(this.element);

    // if (pllData.codeBlockInterpretationFailed()) {
    //   super.displayWarningForNonsenseCodeBlock(rows, pllData);
    //   return;
    // }

    // let viewBoxDimensions: Dimensions = pllData.getDrawDimensions();
    // let viewBoxWidth: number = viewBoxDimensions.width;
    // let viewBoxHeight: number = viewBoxDimensions.height;
    //
    // let imageWidth: number = viewBoxWidth;
    // let imageHeight: number = viewBoxHeight;
    // if (pllData.isDefaultCubeSize()) {
    //   imageWidth = 200;
    //   imageHeight = 200;
    // }

    // let mainSvg: SVGSVGElement = this.element.createSvg('svg', { attr: { width:imageWidth, height:imageHeight, viewBox:'0 0 '+viewBoxWidth+' '+viewBoxHeight }, cls: 'rubik-cube-pll' });
    // let defs: SVGDefsElement = mainSvg.createSvg('defs');
    // let marker: SVGMarkerElement = defs.createSvg('marker', { attr: {id:'arrowhead'+pllData.arrowColor, markerWidth:'10', markerHeight:'7', refX:'9', refY:'3.5', orient:'auto'}});
    // marker.createSvg('polygon', { attr: {points:'0 0, 10 3.5, 0 7' , fill:pllData.arrowColor}});
    //
    // /* Yellow base rect */
    // mainSvg.createSvg('rect', { attr: { fill:pllData.cubeColor }, cls: 'rubik-cube-pll-rect' });



    // super.displayArrows(mainSvg, pllData);
  }


}
