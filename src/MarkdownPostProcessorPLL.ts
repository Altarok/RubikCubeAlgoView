import RubikCubeAlgos from "./main";
import {CodeBlockInterpreter} from "./parser/codeblock-interpreter";
import {CubeRendererPLL} from "./view/cube-renderer";
import {CubeStatePLL} from "./model/cube-state";
import {MarkdownRenderChild} from "obsidian";
import {ButtonController} from "./control/button-controller";
import {StringUtils} from "./parser/string-utils";
import {UserInput} from "./model/codeblock-input";

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
    const userInput: UserInput = StringUtils.codeBlockToStrings(this.source);

    // console.debug(userInput.toString());

    let cubeState = new CodeBlockInterpreter(userInput, this.plugin.settings).createPllCubeState();

    if (userInput.getId()) {
      // debugger;
      let hash: string | undefined = StringUtils.cubeHash(userInput.getId(), 'pll');
      const cubeRotation = this.plugin.settings.cubeRotations['pll'];
      let defaultRotation: number | undefined = cubeRotation[hash] ?? undefined;
      if (defaultRotation) {
        console.debug('Pre-set rotation found: ' + defaultRotation);
        cubeState.setDefaultRotation(defaultRotation);
      }
    }

    let cubeRenderer: CubeRendererPLL = new CubeRendererPLL(cubeState);
    cubeRenderer.display(this.element);
    cubeRenderer.rotateCube();

    if (!cubeState.codeBlockInterpretationFailed()) {
      ButtonController.addRotationButtons(cubeRenderer, cubeState, this.plugin);
    }
  }
}
