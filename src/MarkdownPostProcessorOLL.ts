import RubikCubeAlgos from "./main";
import { CodeBlockInterpreterOLL } from "./CodeBlockInterpreterOLL";
import {CubeStateOLL} from "./model/CubeStateOLL";
import {CubeRendererOLL} from "./view/CubeRendererOLL";
import {MarkdownRenderChild} from "obsidian";

export class MarkdownPostProcessorOLL extends MarkdownRenderChild {
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
   // @ts-ignore
    this.registerEvent(
     this.plugin.app.workspace.on("rubik:rerender-markdown-code-block-processors",
       this.display.bind(this)
     )
   );
  }

  display() {
    this.element.empty();
    const rows: string[] = this.source.split('\n').filter((row) => row.length > 0);

    let interpreter: CodeBlockInterpreterOLL = new CodeBlockInterpreterOLL(rows, this.plugin.settings);
    let cubeState: CubeStateOLL = interpreter.setupOll();

    new CubeRendererOLL(cubeState).display(this.element);

    // let cells: OllFieldInput = ollData.getOllFieldInput();

    // if (ollData.codeBlockInterpretationFailed()){
    //   super.displayWarningForNonsenseCodeBlock(rows, ollData);
    //   return;
    // }

    // let viewBoxDimensions: Dimensions = ollData.getDrawDimensions();
    // let viewBoxWidth: number = viewBoxDimensions.width;
    // let viewBoxHeight: number = viewBoxDimensions.height;
    //
    // let imageWidth: number = viewBoxWidth;
    // let imageHeight: number = viewBoxHeight;
    // if (ollData.isDefaultCubeSize()) {
    //   imageWidth = 200;
    //   imageHeight = 200;
    // }


    // let mainSvg: SVGSVGElement = this.element.createSvg('svg', { attr: { width:imageWidth, height:imageHeight, viewBox:'0 0 '+viewBoxWidth+' '+viewBoxHeight }, cls: "rubik-cube-pll" });
    // let defs: SVGDefsElement = mainSvg.createSvg('defs');
    // let marker: SVGMarkerElement = defs.createSvg('marker', { attr: {id:'arrowhead' + ollData.arrowColor, markerWidth:'10', markerHeight:'7', refX:'9', refY:'3.5', orient:'auto'}});
    // marker.createSvg('polygon', { attr: {points:'0 0, 10 3.5, 0 7' , fill:ollData.arrowColor}});
    //
    // /* Black base rect */
    // mainSvg.createSvg('rect', { attr: { fill:'#000' }, cls: "rubik-cube-pll-rect" });

    // super.displayArrows(mainSvg, ollData);
  }

}
