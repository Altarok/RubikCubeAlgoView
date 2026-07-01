import RubikCubeAlgos from './main'
import {CubeState, CubeStateOll, CubeStatePll} from './model/cube-state'
import {CubeRenderer, CubeRendererOLL, CubeRendererPLL} from './view/cube-renderer'
import {MarkdownRenderChild} from 'obsidian'
import {CubeColors} from './settings/plugin-settings-tab'
import CubeStateBuilder from './model/cube-state-builder'
import {createBackupColors} from './model/cube-color'
import {Strings} from './consts/strings'

export class GenericMarkdownProcessor extends MarkdownRenderChild {

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly element: HTMLElement) {
    super(element)
    this.display()
  }

  onload(): void {
    /* Register listener which instantly redraws Rubik's Cubes while changing plugin settings.  */
    this.registerEvent(
      /*
       * Obsidian's ESLint config and the build process contradict each other a bit.
       * `as unknown as 'quit'` makes them both shut up at this point.
       */
      this.plugin.app.workspace.on(Strings.Events.rerenderCodeBlocks as unknown as 'quit', this.display.bind(this))
    )
  }

  display(): void {
    this.displayIgnoringErrors(false)
  }

  displayIgnoringErrors(ignore: boolean): void {
    this.element.empty()

    const backupColors: CubeColors = createBackupColors(this.plugin.settings)
    const cubeState: CubeState = new CubeStateBuilder(this.source, backupColors).build(this.plugin.settings)

    if (ignore && cubeState.invalidInput.length > 0) {
      return
    }

    let cubeRenderer: CubeRenderer
    if (cubeState) {
      if (cubeState.algorithmType === 'oll') {
        cubeRenderer = new CubeRendererOLL(cubeState as CubeStateOll)
      } else if (cubeState.algorithmType === 'pll') {
        cubeRenderer = new CubeRendererPLL(cubeState as CubeStatePll)
      } else {
        cubeRenderer = new CubeRenderer(cubeState)
      }
      cubeRenderer.display(this.element)
    }
  }


}
