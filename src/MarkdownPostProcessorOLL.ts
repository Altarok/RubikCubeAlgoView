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

  display(): void {
    this.element.empty();
    const rows: string[] = this.source.split('\n').filter((row) => row.length > 0);

    let interpreter: CodeBlockInterpreterOLL = new CodeBlockInterpreterOLL(rows, this.plugin.settings);
    let cubeState: CubeStateOLL = interpreter.setupOll();

    new CubeRendererOLL(cubeState).display(this.element);
  }

}
