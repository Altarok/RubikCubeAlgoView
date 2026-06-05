import {StringPairCallback, TrainingTimer} from '../training/training-timer'
import {Platform} from 'obsidian'
import {Strings} from '../consts/strings'

export class SpeedcubingTimerView {
  private readonly isOnMobile: boolean
  private timer?: TrainingTimer
  private focusHint?: HTMLElement 

  constructor(readonly container: HTMLElement, readonly callbackForSolves: StringPairCallback | undefined) {
    this.isOnMobile = Platform.isMobile
  }

  display() {
    this.container.addClass(Strings.CssClasses.timer.container)

    this.container.style.borderColor = window.getComputedStyle(window.activeDocument.body).getPropertyValue('--interactive-accent').trim() || '#00ff55'

    const innerContent = this.container.createEl('div')
    if (!this.isOnMobile) {
      this.container.setAttribute('tabindex', '0')
      this.focusHint = this.container.createEl('small', {
        text: 'Click block to focus keyboard controls',
        cls: Strings.CssClasses.timer.focusHint
      })
    }

    this.timer = new TrainingTimer(innerContent, this.container, this.isOnMobile, this.callbackForSolves)
    this.timer.create()

    this.container.addEventListener('focusin', () => {
      this.focusHint?.setText('')
      this.timer?.setFocus()
    })
    this.container.addEventListener('focusout', () => {
      this.focusHint?.setText('Click block to focus keyboard controls')
      this.timer?.removeFocus()
    })
  }

  unload() {
    this.timer?.destroy()
  }
}

