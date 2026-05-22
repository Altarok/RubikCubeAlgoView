import {App, Modal} from 'obsidian'
import {TrainingTimer} from "./training-timer"

/** Stack mat in popup - does not asve results */
export class TimerModal extends Modal {
  timer?: TrainingTimer

  constructor(app: App, readonly isOnMobile: boolean) {
    super(app)
  }

  onOpen() {
    const {contentEl} = this
    contentEl.empty()

    this.timer = new TrainingTimer(contentEl, window, this.isOnMobile, undefined)
    this.timer.create()

    contentEl.setAttribute('tabindex', '-1')
    contentEl.focus()
  }

  onClose() {
    this.timer?.destroy()
    this.contentEl.empty()
  }

}
