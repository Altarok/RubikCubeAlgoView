import RubikCubeAlgos from "./main"
import {CubeStateOll} from "./model/cube-state"
import {CubeRendererOLL} from "./view/cube-renderer"
import {MarkdownRenderChild} from "obsidian"
import {ButtonController} from "./control/button-controller"
import {CubeColors} from "./settings/plugin-settings-tab"
import CubeStateBuilder from "./model/cube-state-builder"
import {createBackupColors} from "./model/cube-color-builder"
import {Events} from "./consts/strings";

export class MarkdownProcessorOll extends MarkdownRenderChild {

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly element: HTMLElement) {
    super(element)
    this.display()
  }

  onload(): void {
    /* Register listener which instantly redraws Rubik's Cubes while changing plugin settings.  */
    this.registerEvent(
      /*
       * Obsidian's ESLint config and the build process contradict each other a bit.
       * "as unknown as 'quit'" makes them both shut up at this point.
       */
      this.plugin.app.workspace.on(Events.rerenderCodeBlocks as unknown as 'quit', this.display.bind(this))
    )
  }

  display(): void {
    this.element.empty()

    const backupColors: CubeColors = createBackupColors(this.plugin.settings)
    const cubeState: CubeStateOll = new CubeStateBuilder(this.source, backupColors).buildOll(this.plugin.settings)

    const cubeRenderer = new CubeRendererOLL(cubeState)
    cubeRenderer.display(this.element)

    if (!cubeState.codeBlockInterpretationFailed()) {
      this.addButtonFunctions(cubeRenderer, cubeState)
      ButtonController.addRotationButtons(cubeRenderer, cubeState /* , this.plugin */)
    }
  }

  private addButtonFunctions(cubeRenderer: CubeRendererOLL, cubeState: CubeStateOll) {

    if (cubeState.algorithmToArrows.size() > 1) {

      let radioButtons: HTMLCollectionOf<HTMLInputElement> = cubeRenderer.layout.algorithmsDiv.getElementsByTagName('input')

      for (let i: number = 0; i < radioButtons.length; i++) {
        let radioButton: HTMLInputElement = radioButtons[i]!
        radioButton.addEventListener('click', () => {
          if (cubeState.changeAlgorithm(radioButton.id)) {
            cubeRenderer.redrawArrows()
          }
        })
      }
    }
  }
}
