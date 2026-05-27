import RubikCubeAlgos from "./main"
import {CubeRendererPLL} from "./view/cube-renderer"
import {MarkdownRenderChild} from "obsidian"
import {ButtonController} from "./control/button-controller"
import {CubeColors} from "./settings/plugin-settings-tab"
import CubeStateBuilder from "./model/cube-state-builder"
import {createBackupColors} from "./model/cube-color-builder"
import {CubeStatePll} from "./model/cube-state"
import {Events} from "./consts/strings";

export class MarkdownProcessorPll extends MarkdownRenderChild {

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly container: HTMLElement) {
    super(container)
    this.display()
  }

  onload(): void {
    /* Register listener which instantly redraws Rubik's Cubes while changing plugin settings.*/
    this.registerEvent(
      /*
       * Obsidian's ESLint config and the build process contradict each other a bit.
       * "as unknown as 'quit'" makes them both shut up at this point.
       */
      this.plugin.app.workspace.on(Events.rerenderCodeBlocks as unknown as 'quit', this.display.bind(this))
    )
  }

  display(): void {
    this.container.empty()
    const backupColors: CubeColors = createBackupColors(this.plugin.settings)
    const cubeState: CubeStatePll = new CubeStateBuilder(this.source, backupColors).buildPll()

    const cubeRenderer = new CubeRendererPLL(cubeState)
    cubeRenderer.display(this.container)

    if (!cubeState.codeBlockInterpretationFailed()) {
      ButtonController.addRotationButtons(cubeRenderer, cubeState /* , this.plugin */)
    }
  }
}
