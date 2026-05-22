import {MarkdownPostProcessorContext, MarkdownRenderChild,  TFile} from 'obsidian'
import {StringPairCallback} from "./training/training-timer"
import RubikCubeAlgos from "./main"
import {SpeedcubingTimerView} from "./view/speedcubing-timer"
import {CodeBlocks} from "./consts/strings"

/**
 * Stack mat directly in note
 */
export class MarkdownProcessorSpeedcubingTimer extends MarkdownRenderChild {
  view: SpeedcubingTimerView

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly container: HTMLElement, readonly ctx: MarkdownPostProcessorContext) {
    super(container)
    this.view = new SpeedcubingTimerView(this.container, this.logCubeData)
  }


  onload() {
    this.container.empty()
    this.view.display()
  }

  logCubeData: StringPairCallback = (scramble: string, timeTaken: string) => {

    const file = this.plugin.app.vault.getAbstractFileByPath(this.ctx.sourcePath)
    if (!(file instanceof TFile)) return

    /* safely process file */
    void this.plugin.app.vault.process(file, (oldContent: string) => {
      return this.updatedContent(oldContent, scramble, timeTaken)
    })
  }

  updatedContent(oldContent: string,  scramble: string, timeTaken: string) {
    let lines: string[] =  oldContent.split('\n')
    let indexOfRubikCubeTimerResultsCodeBlock: number = lines.indexOf(`\`\`\`${CodeBlocks.speedubing.results}`)
    if (indexOfRubikCubeTimerResultsCodeBlock === -1) {
      return oldContent
    }
    let speedcubingRunData: string = `${timeTaken}s (${scramble})`
    lines.splice(indexOfRubikCubeTimerResultsCodeBlock + 1, 0, speedcubingRunData)
    let newContent = lines.join('\n')
    return newContent
  }

  onunload() {
    this.view.unload()
    this.container.empty()
  }

}

