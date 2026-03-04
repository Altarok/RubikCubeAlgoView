import RubikCubeAlgos from "./main";
import {CodeBlockInterpreterPLL} from "./parser/codeblock-interpreter";
import {CubeRendererPLL} from "./view/cube-renderer";
import {CubeStatePLL} from "./model/cube-state";
import {MarkdownRenderChild} from "obsidian";
import {ButtonController} from "./control/button-controller";

export class MarkdownPostProcessorPLL extends MarkdownRenderChild {
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
      // @ts-ignore
      this.plugin.app.workspace.on('rubik:rerender-markdown-code-block-processors',
        this.display.bind(this)
      )
    );
  }

  display(): void {
    this.element.empty();
    const rows: string[] = this.source.split('\n')
    .map(row => row && row.trim())
    .filter((row) => row.length > 0);

    let interpreter: CodeBlockInterpreterPLL = new CodeBlockInterpreterPLL(rows, this.plugin.settings);
    let cubeState: CubeStatePLL = interpreter.setupPll();

    let cubeRenderer: CubeRendererPLL = new CubeRendererPLL(cubeState);
    cubeRenderer.display(this.element);

    if (!cubeState.codeBlockInterpretationFailed()) {
      ButtonController.addButtonFunctions(cubeRenderer, cubeState);
    }
  }
}
