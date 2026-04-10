import RubikCubeAlgos from "./main";
import {CubeRendererPLL} from "./view/cube-renderer";
import {MarkdownRenderChild} from "obsidian";
import {ButtonController} from "./control/button-controller";
import {CubeColors} from "./settings/RubikCubeAlgoSettings";
import CubeStateBuilder from "./model/cube-state-builder";

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
    const backupColors: CubeColors = this.plugin.settings.createBackupColors();
    const cubeState = new CubeStateBuilder(this.source, backupColors).buildPll();

    const cubeRenderer: CubeRendererPLL = new CubeRendererPLL(cubeState);
    cubeRenderer.display(this.element);

    if (!cubeState.codeBlockInterpretationFailed()) {
      ButtonController.addRotationButtons(cubeRenderer, cubeState, this.plugin);
    }
  }
}
