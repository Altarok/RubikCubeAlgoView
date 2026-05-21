import {App, Modal} from 'obsidian'
import {TrainingTimer} from "./training-timer";

/**
 * Stack mat in popup
 */
export class TimerModal extends Modal {
  timer?: TrainingTimer

  constructor(app: App, readonly isOnMobile: boolean) {
    super(app)
  }

  onOpen() {
    const {contentEl/*, modalEl*/} = this
    contentEl.empty()

    this.timer = new TrainingTimer(contentEl, window, this.isOnMobile, undefined)
    this.timer.onOpen()

    contentEl.setAttribute('tabindex', '-1')
    contentEl.focus()
  }

  onClose() {
    this.timer?.onClose()
    this.contentEl.empty()
  }

}
