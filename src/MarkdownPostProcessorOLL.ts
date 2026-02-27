import RubikCubeAlgos from "./main";
import {CodeBlockInterpreterOLL} from "./CodeBlockInterpreter";
import {CubeStateOLL} from "./model/cube-state";
import {CubeRendererOLL} from "./view/cube-renderer";
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
    this.registerEvent(
      // @ts-ignore
      this.plugin.app.workspace.on("rubik:rerender-markdown-code-block-processors",
        this.display.bind(this)
      )
    );
  }

  display(): void {
    this.element.empty();
    const rows: string[] = this.source.split('\n')
      .map(row => row && row.trim()).filter((row) => row.length > 0)    ;

    let interpreter: CodeBlockInterpreterOLL = new CodeBlockInterpreterOLL(rows, this.plugin.settings);
    let cubeState: CubeStateOLL = interpreter.setupOll();

    let cubeRenderer = new CubeRendererOLL(cubeState);
    cubeRenderer.display(this.element);

    if (!cubeState.codeBlockInterpretationFailed()) {
      this.addButtonFunctions(cubeRenderer, cubeState);
    }

  }

  private addButtonFunctions(cubeRenderer: CubeRendererOLL, cubeState: CubeStateOLL) {

    if (cubeState.algorithmToArrows.size() > 1) {

      let radioButtons: HTMLCollectionOf<HTMLInputElement> = cubeRenderer.layout.algorithmsDiv.getElementsByTagName('input');

      for (let i: number = 0; i < radioButtons.length; i++) {
        let radioButton: HTMLInputElement = radioButtons[i]!;
        radioButton.addEventListener('click', () => {
          if (cubeState.changeAlgorithm(radioButton.id)) {
            cubeRenderer.redrawArrows();
          }
        });
      }
    }

    if (cubeState.specialFlags.contains('no-rotation')) {
      return;
    }

    cubeRenderer.buttonLeft.addEventListener('click', () => {
      cubeState.rotateLeft();
      cubeRenderer.rotateCube();
    });

    cubeRenderer.buttonReset.addEventListener('click', () => {
      cubeState.resetRotation();
      cubeRenderer.rotateCube();
    });

    cubeRenderer.buttonRight.addEventListener('click', () => {
      cubeState.rotateRight();
      cubeRenderer.rotateCube();
    });
  }
}
