import {MarkdownPostProcessorContext, MarkdownRenderChild, Notice, TFile} from 'obsidian'
import {StringPairCallback} from './training/training-timer'
import RubikCubeAlgos from './main'
import {SpeedcubingTimerView} from './view/speedcubing-timer'
import {Strings} from './consts/strings'

/**
 * Stack mat directly in note
 */
export class MarkdownProcessorSpeedcubingTimer extends MarkdownRenderChild {
  view: SpeedcubingTimerView
  personalBest: number | null = null

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

    /* Add result to code block: result table */
    void this.plugin.app.vault.process(file, (oldContent: string) => {
      return this.updatedContent(oldContent, scramble, timeTaken)
    })
  }

  updatedContent(oldContent: string, scramble: string, timeTaken: string) {
    let lines: string[] = oldContent.split('\n')
    let indexOfRubikCubeTimerResultsCodeBlock: number = lines.indexOf(`\`\`\`${Strings.MarkdownCodeBlockNames.speedubing.results}`)
    if (indexOfRubikCubeTimerResultsCodeBlock === -1) {
      return oldContent
    }

    const speedcubingRunData: string = `${timeTaken}s (${scramble})`

    const firstLineOfCodeBlock = lines[indexOfRubikCubeTimerResultsCodeBlock + 1] || ''
    let isFirstLineShowsPersonalBest = firstLineOfCodeBlock.startsWith('pb:') || false
    if (this.personalBest === null && isFirstLineShowsPersonalBest) {
      let timeTakenStr = firstLineOfCodeBlock.replace(/pb:(\d\.\d+)s? \(.*\)$/g, '$1')
      if (timeTakenStr && /\d+\.\d{3}/.test(timeTakenStr)) this.personalBest = +timeTakenStr
    }

    if (this.personalBest === null || this.personalBest > +timeTaken) {
      this.personalBest = +timeTaken
      lines.splice(indexOfRubikCubeTimerResultsCodeBlock + 1,
        isFirstLineShowsPersonalBest ? 1 : 0,
        'pb:' + speedcubingRunData)
      isFirstLineShowsPersonalBest = true
      new Notice(`New personal best! ${timeTaken} seconds`, 2000)
    }

    lines.splice(indexOfRubikCubeTimerResultsCodeBlock + 1 + (isFirstLineShowsPersonalBest ? 1 : 0),
      0, speedcubingRunData)

    return lines.join('\n')
  }

  onunload() {
    this.view.unload()
    this.container.empty()
  }

}

