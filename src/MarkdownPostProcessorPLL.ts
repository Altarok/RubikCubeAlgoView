import RubikCubeAlgos from "./main";
import {CodeBlockInterpreterPLL} from "./CodeBlockInterpreterPLL";
import {CubeRendererPLL} from "./view/CubeRendererPLL";
import {CubeStatePLL} from "./model/cube-state";
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
    this.registerEvent(
      // @ts-ignore
      this.plugin.app.workspace.on('rubik:rerender-markdown-code-block-processors',
        this.display.bind(this)
      )
    );
  }

  display(): void {
    this.element.empty();
    const rows: string[] = this.source.split('\n').filter((row) => row.length > 0);

    let interpreter: CodeBlockInterpreterPLL = new CodeBlockInterpreterPLL(rows, this.plugin.settings);
    let cubeState: CubeStatePLL = interpreter.setupPll();

    let cubeRenderer: CubeRendererPLL = new CubeRendererPLL(cubeState);
    cubeRenderer.display(this.element);

    if (!cubeState.codeBlockInterpretationFailed()) {
      this.addButtonFunctions(cubeRenderer, cubeState);
    }
  }

  private addButtonFunctions(cubeRenderer: CubeRendererPLL, cubeState: CubeStatePLL) {

    cubeRenderer.buttonLeft.addEventListener('click', () => {
      cubeRenderer.rotateLeft();
      cubeState.rotateLeft();
      cubeRenderer.redrawAlgorithms();
    });

    cubeRenderer.buttonRight.addEventListener('click', () => {
      cubeRenderer.rotateRight();
      cubeState.rotateRight();
      cubeRenderer.redrawAlgorithms();
    });
  }
}
