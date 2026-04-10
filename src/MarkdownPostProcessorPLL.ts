import RubikCubeAlgos from "./main";
import {createPllCube} from "./parser/codeblock-interpreter";
import {CubeRendererPLL} from "./view/cube-renderer";
import {MarkdownRenderChild} from "obsidian";
import {ButtonController} from "./control/button-controller";
import {StringUtils} from "./parser/string-utils";
import {UserInput} from "./model/codeblock-input";
import {CubeColors, DefaultSettings} from "./settings/RubikCubeAlgoSettings";
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

    /*
     * TODO delete old unused stuff
     */
    // const userInput: UserInput = StringUtils.codeBlockToStrings(this.source);

    // console.debug(userInput.toString());

    /*
     * TODO move inside settings
     */
    const colors: CubeColors = {
      arrow: this.plugin.settings.arrowColor ?? DefaultSettings.ARROW_COLOR,
      cube: this.plugin.settings.cubeColor ?? DefaultSettings.CUBE_COLOR
    };

    // let cubeState = createPllCube(userInput, colors);
    //
    // if (userInput.getId()) {
    //   let hash = StringUtils.cubeHash(userInput.getId(), 'pll');
    //   let defaultRotation: number | undefined = this.plugin.settings.cubeRotations.get(hash);
    //   cubeState.setDefaultRotation(defaultRotation);
    // }

    let cubeStateNew = new CubeStateBuilder(this.source, colors).buildPll();

    let cubeRenderer: CubeRendererPLL = new CubeRendererPLL(cubeStateNew);
    cubeRenderer.display(this.element);

    if (!cubeStateNew.codeBlockInterpretationFailed()) {
      ButtonController.addRotationButtons(cubeRenderer, cubeStateNew, this.plugin);
    }
  }
}
