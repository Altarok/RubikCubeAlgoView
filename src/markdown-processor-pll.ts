import RubikCubeAlgos from "./main"
import {CubeRendererPLL} from "./view/cube-renderer"
import {MarkdownRenderChild} from "obsidian"
import {ButtonController} from "./control/button-controller"
import {CubeColors} from "./settings/plugin-settings-tab"
import CubeStateBuilder from "./model/cube-state-builder"
import {createBackupColors} from "./model/cube-color-builder"
import {CubeStatePll} from "./model/cube-state";

export class MarkdownProcessorPll extends MarkdownRenderChild {

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly element: HTMLElement) {
    super(element)
    this.display()
  }

  onload(): void {
    /* Register listener which instantly redraws Rubik's Cubes while changing plugin settings.*/
    this.registerEvent(
      // @ts-ignore
      this.plugin.app.workspace.on('rubik:rerender-markdown-code-block-processors',
        this.display.bind(this)
      )
    )
  }

  display(): void {
    this.element.empty()
    const backupColors: CubeColors = createBackupColors(this.plugin.settings)
    const cubeState: CubeStatePll = new CubeStateBuilder(this.source, backupColors).buildPll()

    const cubeRenderer = new CubeRendererPLL(cubeState)
    cubeRenderer.display(this.element)

    if (!cubeState.codeBlockInterpretationFailed()) {
      ButtonController.addRotationButtons(cubeRenderer, cubeState, this.plugin)
    }
  }
}
