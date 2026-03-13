import RubikCubeAlgos from "./main";
import {createOllCube} from "./parser/codeblock-interpreter";
import {CubeStateOLL} from "./model/cube-state";
import {CubeRendererOLL} from "./view/cube-renderer";
import {MarkdownRenderChild} from "obsidian";
import {ButtonController} from "./control/button-controller";
import {StringUtils} from "./parser/string-utils";
import {UserInput} from "./model/codeblock-input";
import {CubeColors, DefaultSettings} from "./RubikCubeAlgoSettings";

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
    const userInput: UserInput = StringUtils.codeBlockToStrings(this.source);

    // console.debug(userInput.toString());

    const colors: CubeColors = {
      arrow: this.plugin.settings.arrowColor ?? DefaultSettings.ARROW_COLOR,
      cube: this.plugin.settings.cubeColor ?? DefaultSettings.CUBE_COLOR
    };

    let cubeState = createOllCube(userInput, colors);

    if (userInput.getId()) {
      let hash: string = StringUtils.cubeHash(userInput.getId(), 'oll');
      let defaultRotation: number | undefined = this.plugin.settings.cubeRotations.get(hash);
      cubeState.setDefaultRotation(defaultRotation);
    }

    let cubeRenderer = new CubeRendererOLL(cubeState);
    cubeRenderer.display(this.element);
    cubeRenderer.rotateCube();

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

    ButtonController.addRotationButtons(cubeRenderer, cubeState, this.plugin);
  }
}
