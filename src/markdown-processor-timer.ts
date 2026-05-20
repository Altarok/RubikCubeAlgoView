import {MarkdownRenderChild, Platform} from 'obsidian'
import {TrainingTimer} from "./training/training-timer";
import RubikCubeAlgos from "./main";

/**
 * Stack mat directly in note
 */
export class TimerRenderChild extends MarkdownRenderChild {
  isOnMobile: boolean
  timer?: TrainingTimer

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly container: HTMLElement) {
    super(container)
    this.isOnMobile = Platform.isMobile
  }

  onload() {
    this.container.empty();
    this.container.addClass('rubik-cube-timer-container');

    const userColor = getComputedStyle(document.body).getPropertyValue('--interactive-accent').trim() ||  '#00ff55'
    this.container.style.borderColor = userColor;
    this.container.style.boxShadow = `0 0 8px ${userColor}`

    const innerContent = this.container.createEl('div', { cls: 'timer-block-content' })
    if (!this.isOnMobile) {
      this.container.setAttribute('tabindex', '0')
      this.container.createEl('small', {
        text: 'Click block to focus keyboard controls',
        cls: 'timer-focus-hint'
      })
    }

    this.timer = new TrainingTimer(innerContent, this.container, this.isOnMobile)
    this.timer.onOpen()
  }

  onunload() {
    this.timer?.onClose()
    this.container.empty()
  }

}
