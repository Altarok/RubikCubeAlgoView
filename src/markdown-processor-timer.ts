import {MarkdownPostProcessorContext, MarkdownRenderChild, Platform, TFile} from 'obsidian'
import {StringPairCallback, TrainingTimer} from "./training/training-timer"
import RubikCubeAlgos from "./main"
import {CssClasses} from "./view/css-util"

/**
 * Stack mat directly in note
 */
export class SpeedCubingTimerRenderChild extends MarkdownRenderChild {
  isOnMobile: boolean
  timer?: TrainingTimer
  focusHint?: HTMLElement

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly container: HTMLElement, readonly ctx: MarkdownPostProcessorContext) {
    super(container)
    this.isOnMobile = Platform.isMobile
  }

  onload() {
    this.container.empty()
    this.container.addClass(CssClasses.timer.container)

    const userColor = getComputedStyle(document.body).getPropertyValue('--interactive-accent').trim() || '#00ff55'
    this.container.style.borderColor = userColor

    const innerContent = this.container.createEl('div')
    if (!this.isOnMobile) {
      this.container.setAttribute('tabindex', '0')
      this.focusHint = this.container.createEl('small', {
        text: 'Click block to focus keyboard controls',
        cls: CssClasses.timer.focusHint
      })
    }

    this.container.addEventListener('focusin', () => {
      this.container.style.boxShadow = `0 0 8px ${userColor}`
      this.focusHint?.setText('')
    })

    this.container.addEventListener('focusout', () => {
      this.container.setCssProps({boxShadow: 'none'})
      this.focusHint?.setText('Click block to focus keyboard controls')
    })

    this.timer = new TrainingTimer(innerContent, this.container, this.isOnMobile, this.logCubeData)
    this.timer.onOpen()
  }

  // Apply it to an implementation
  logCubeData: StringPairCallback = (scramble: string, timeTaken: string) => {
    // console.log(`Finished scramble[${scramble}] in ${timeTaken}s`)

    const file = this.plugin.app.vault.getAbstractFileByPath(this.ctx.sourcePath)
    if (!(file instanceof TFile)) return

    // 3. Process the file safely to update the content
    void this.plugin.app.vault.process(file, (oldContent: string) => {
      return this.updatedContent(oldContent, scramble, timeTaken)
    })
  }

  updatedContent(oldContent: string,  scramble: string, timeTaken: string) {
    let lines: string[] =  oldContent.split('\n')
    let indexOfRubikCubeTimerResultsCodeBlock: number = lines.indexOf('```rubikCubeTimerResults')
    if (indexOfRubikCubeTimerResultsCodeBlock === -1) {
      return oldContent
    }
    let speedcubingRunData: string = `${timeTaken}s (${scramble})`
    lines.splice(indexOfRubikCubeTimerResultsCodeBlock + 1, 0, speedcubingRunData)
    let newContent = lines.join('\n')
    return newContent
  }

  onunload() {
    this.timer?.onClose()
    this.container.empty()
  }

}

