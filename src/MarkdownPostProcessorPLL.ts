import RubikCubeAlgos from "./main";
import {CodeBlockInterpreterPLL} from "./parser/codeblock-interpreter";
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

    console.log(userInput)

    let interpreter: CodeBlockInterpreterPLL = new CodeBlockInterpreterPLL(userInput, this.plugin.settings);
    let cubeState: CubeStatePLL = interpreter.setupPll();

    let cubeRenderer: CubeRendererPLL = new CubeRendererPLL(cubeState);
    cubeRenderer.display(this.element);

    if (!cubeState.codeBlockInterpretationFailed()) {
      ButtonController.addRotationButtons(cubeRenderer, cubeState);
    }
  }
}
