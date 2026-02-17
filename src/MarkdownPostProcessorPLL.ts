import RubikCubeAlgos from "./main";
import {CodeBlockInterpreterPLL} from "./CodeBlockInterpreterPLL";
import {CubeRendererPLL} from "./view/CubeRendererPLL";
import {CubeStatePLL} from "./model/CubeStatePLL";
import {MarkdownRenderChild} from "obsidian";

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
    // @ts-ignore
    this.registerEvent(
      this.plugin.app.workspace.on('rubik:rerender-markdown-code-block-processors',
        this.display.bind(this)
      )
    );
  }

  display() {
    this.element.empty();
    const rows: string[] = this.source.split('\n').filter((row) => row.length > 0);

    let interpreter: CodeBlockInterpreterPLL = new CodeBlockInterpreterPLL(rows, this.plugin.settings);
    let cubeState: CubeStatePLL = interpreter.setupPll();

    new CubeRendererPLL(cubeState).display(this.element);

  }

}
