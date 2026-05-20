import {MarkdownRenderChild, Platform} from 'obsidian'
import {TrainingTimer} from "./training/training-timer";
import RubikCubeAlgos from "./main";
import {CssClasses} from "./view/css-util";

/**
 * Stack mat directly in note
 */
export class TimerRenderChild extends MarkdownRenderChild {
  isOnMobile: boolean
  timer?: TrainingTimer
  focusHint?: HTMLElement;

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly container: HTMLElement) {
    super(container)
    this.isOnMobile = Platform.isMobile
  }

  onload() {
    this.container.empty();
    this.container.addClass(CssClasses.timer.container);

    const userColor = getComputedStyle(document.body).getPropertyValue('--interactive-accent').trim() || '#00ff55'
    this.container.style.borderColor = userColor;

    const innerContent = this.container.createEl('div')
    if (!this.isOnMobile) {
      this.container.setAttribute('tabindex', '0')
      this.focusHint = this.container.createEl('small', {
        text: 'Click block to focus keyboard controls',
        cls: CssClasses.timer.focusHint
      })
    }

    this.container.addEventListener('focusin', () => {
      this.container.style.boxShadow = `0 0 8px ${userColor}`;
      this.focusHint?.setText('')
    });

    this.container.addEventListener('focusout', () => {
      this.container.setCssProps({boxShadow: 'none'})
      this.focusHint?.setText('Click block to focus keyboard controls')
    });

    this.timer = new TrainingTimer(innerContent, this.container, this.isOnMobile)
    this.timer.onOpen()
  }

  onunload() {
    this.timer?.onClose()
    this.container.empty()
  }

}
