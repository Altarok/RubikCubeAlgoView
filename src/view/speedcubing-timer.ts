import {StringPairCallback, TrainingTimer} from "../training/training-timer"
import {Platform} from "obsidian"
import {CssClasses} from "../consts/strings"

export class SpeedcubingTimerView {
  isOnMobile: boolean
  timer?: TrainingTimer

  constructor(readonly container: HTMLElement, readonly callbackForSolves: StringPairCallback | undefined) {
    this.isOnMobile = Platform.isMobile
  }

  display() {
    this.container.addClass(CssClasses.timer.container)

    const userColor = getComputedStyle(document.body).getPropertyValue('--interactive-accent').trim() || '#00ff55'
    this.container.style.borderColor = userColor

    const innerContent = this.container.createEl('div')
    if (!this.isOnMobile) {
      this.container.setAttribute('tabindex', '0')
      let focusHint: HTMLElement = this.container.createEl('small', {
        text: 'Click block to focus keyboard controls',
        cls: CssClasses.timer.focusHint
      })
      this.container.addEventListener('focusin', () => {
        focusHint.setText('')
      })
      this.container.addEventListener('focusout', () => {
        focusHint.setText('Click block to focus keyboard controls')
      })
    }

    this.timer = new TrainingTimer(innerContent, this.container, this.isOnMobile, this.callbackForSolves)
    this.timer.create()
  }

  unload() {
    this.timer?.destroy()
  }
}

