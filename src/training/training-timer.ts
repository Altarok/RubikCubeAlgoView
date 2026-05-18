import {App, Modal, Platform} from 'obsidian'

/** Number of digits to measure */
const fractionDigits: number = 3
const noTime: string = `0.${'0'.repeat(fractionDigits)}`

/**
 * Stack mat
 */
export class TimerModal extends Modal {
  private isRunning: boolean = false
  private isReadyToStart: boolean = false
  private isHolding: boolean = false
  private isShowingResult: boolean = false

  private startTime: number = 0
  private timerInterval: ReturnType<typeof setInterval> | null = null
  private displayEl!: HTMLElement

  // Bound listeners for clean setup/destruction
  private handleKeyDownBound = this.handleKeyDown.bind(this)
  private handleKeyUpBound = this.handleKeyUp.bind(this)
  private handleTouchStartBound = this.handleTouchStart.bind(this)
  private handleTouchEndBound = this.handleTouchEnd.bind(this)

  constructor(app: App, readonly isOnMobile: boolean) {
    super(app)
  }

  onOpen() {
    const {contentEl} = this
    contentEl.empty()
    contentEl.addClass('rubik-cube-algorithms-timer-modal')

    this.displayEl = contentEl.createEl('h1', {text: noTime, cls: 'rubik-cube-algorithms-timer-display'})

    // Change hint text based on the platform

    const hintText1: string = this.isOnMobile ? 'Tap and hold anywhere to ready, release to start.' : 'Hold space bar. Release to start.'
    const hintText2: string = this.isOnMobile ? 'Tap anywhere to stop / reset.' : 'Press space bar to stop / reset.'
    contentEl.createEl('p', {text: hintText1, cls: 'rubik-cube-algorithms-timer-hint'})
    contentEl.createEl('p', {text: hintText2, cls: 'rubik-cube-algorithms-timer-hint'})

    if (Platform.isMobile) {
      // Mobile: Listen for touch interactions on the entire modal content area
      contentEl.addEventListener('touchstart', this.handleTouchStartBound)
      contentEl.addEventListener('touchend', this.handleTouchEndBound)
    } else {
      // Desktop: Keep the classic keyboard listener behavior
      window.addEventListener('keydown', this.handleKeyDownBound)
      window.addEventListener('keyup', this.handleKeyUpBound)
    }
  }

  onClose() {
    // Unbind everything depending on platform to prevent leaks
    if (Platform.isMobile) {
      this.contentEl.removeEventListener('touchstart', this.handleTouchStartBound)
      this.contentEl.removeEventListener('touchend', this.handleTouchEndBound)
    } else {
      window.removeEventListener('keydown', this.handleKeyDownBound)
      window.removeEventListener('keyup', this.handleKeyUpBound)
    }

    this.stopTimerLogic()
    this.contentEl.empty()
  }

  // --- Core Timer Flow Engine ---
  private triggerDownAction() {
    if (this.isHolding) return
    this.isHolding = true

    if (this.isRunning) {
      this.stopTimerLogic() // Instantly stop clock on tap
    } else if (this.isShowingResult) {
      this.resetTimerLogic()
    } else {
      this.isReadyToStart = true
      this.displayEl.addClass('rubik-cube-algorithms-timer-readying')
    }
  }

  private triggerUpAction() {
    this.isHolding = false

    if (this.isReadyToStart) {
      this.isReadyToStart = false
      this.displayEl.removeClass('rubik-cube-algorithms-timer-readying')
      this.startTimerLogic()
    }
  }

  // --- Event Handlers ---
  private handleKeyDown(evt: KeyboardEvent) {
    if (evt.key !== ' ') return
    evt.preventDefault()
    this.triggerDownAction()
  }

  private handleKeyUp(evt: KeyboardEvent) {
    if (evt.key !== ' ') return
    this.triggerUpAction()
  }

  private handleTouchStart(evt: TouchEvent) {
    // Prevent zoom/scrolling behaviors while tapping the timer
    evt.preventDefault()
    this.triggerDownAction()
  }

  private handleTouchEnd(evt: TouchEvent) {
    evt.preventDefault()
    this.triggerUpAction()
  }

  // --- Timer Actions ---
  private startTimerLogic() {
    this.isRunning = true
    this.startTime = Date.now()
    this.displayEl.addClass('rubik-cube-algorithms-timer-running')

    this.timerInterval = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000
      this.displayEl.setText(elapsed.toFixed(fractionDigits))
    }, 10)
  }

  private stopTimerLogic() {
    if (!this.isRunning) return
    this.isRunning = false
    this.displayEl.removeClass('rubik-cube-algorithms-timer-running')

    this.clearInterval()

    const finalTime = ((Date.now() - this.startTime) / 1000).toFixed(fractionDigits)
    this.displayEl.setText(finalTime)
    this.isShowingResult = true
  }

  private resetTimerLogic() {
    if (!this.isShowingResult) return
    this.isShowingResult = false
    this.clearInterval()
    this.displayEl.setText(noTime)
  }

  private clearInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval)
      this.timerInterval = null
    }
  }
}
