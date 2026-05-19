import {generateScramble} from "./algorithm-scrambler";

/** Number of digits to measure */
const fractionDigits: number = 3
const noTime: string = `0.${'0'.repeat(fractionDigits)}`


/**
 * Stack mat
 */
export class TrainingTimer {
  private isRunning: boolean = false
  private isReadyToStart: boolean = false
  private isHolding: boolean = false
  private isShowingResult: boolean = false

  private startTime: number = 0
  private scrambleEl!: HTMLElement
  private displayEl!: HTMLElement
  private timerAnimationFrame: number | null = null

  private handleKeyDownBound = this.handleKeyDown.bind(this)
  private handleKeyUpBound = this.handleKeyUp.bind(this)
  private handleTouchStartBound = this.handleTouchStart.bind(this)
  private handleTouchEndBound = this.handleTouchEnd.bind(this)
  private onBlur = this.handleBlur.bind(this)

  constructor(readonly contentEl: HTMLElement, readonly modalEl: HTMLElement, readonly isOnMobile: boolean) {
  }

  onOpen() {

    /*Add a class to the outermost modal container for full-screen CSS overrides*/
    if (this.isOnMobile) this.modalEl.addClass('rubik-cube-algorithms-fullscreen-modal');
    else this.contentEl.addClass('rubik-cube-algorithms-timer-modal')

    this.scrambleEl = this.contentEl.createEl('p', {text: generateScramble(), cls: 'rubik-cube-algorithms-timer-hint'})

    this.displayEl = this.contentEl.createEl('h1', {text: noTime, cls: 'rubik-cube-algorithms-timer-display'})

    this.addHints(this.contentEl);

    if (this.isOnMobile) {
      // Mobile: Listen for touch interactions on the entire screen
      this.modalEl.addEventListener('touchstart', this.handleTouchStartBound)
      this.modalEl.addEventListener('touchend', this.handleTouchEndBound)
    } else {
      // Desktop: Keep the classic keyboard listener behavior
      window.addEventListener('keydown', this.handleKeyDownBound)
      window.addEventListener('keyup', this.handleKeyUpBound)
      window.addEventListener('blur', this.onBlur)
    }
  }

  /** Change hint text based on the platform */
  private addHints(contentEl: HTMLElement) {
    const hintText1: string = this.isOnMobile ? 'Tap and hold anywhere to ready, release to start.' : 'Hold space bar. Release to start.'
    const hintText2: string = this.isOnMobile ? 'Tap anywhere to stop / reset.' : 'Press space bar to stop / reset.'
    contentEl.createEl('p', {text: hintText1, cls: 'rubik-cube-algorithms-timer-hint'})
    contentEl.createEl('p', {text: hintText2, cls: 'rubik-cube-algorithms-timer-hint'})
  }

  onClose() {
    this.stopTimer()

    // Unbind everything depending on platform to prevent leaks
    if (this.isOnMobile) {
      this.modalEl.removeEventListener('touchstart', this.handleTouchStartBound)
      this.modalEl.removeEventListener('touchend', this.handleTouchEndBound)
    } else {
      window.removeEventListener('keydown', this.handleKeyDownBound)
      window.removeEventListener('keyup', this.handleKeyUpBound)
      window.removeEventListener('blur', this.onBlur)
    }
    this.contentEl.empty()
  }

  // --- Core Timer Flow Engine ---
  private triggerDownAction() {
    if (this.isHolding) return
    this.isHolding = true

    if (this.isRunning) {
      this.stopTimer() // Instantly stop clock on tap
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
      this.startTimer()
    }
  }

  // --- Event Handlers ---
  private handleKeyDown(evt: KeyboardEvent) {
    if (evt.key !== ' ') return
    evt.preventDefault()
    evt.stopPropagation()
    this.triggerDownAction()
  }

  private handleKeyUp(evt: KeyboardEvent) {
    if (evt.key !== ' ') return
    this.triggerUpAction()
  }

  private handleTouchStart(evt: TouchEvent) {
    // Prevent zoom/scrolling behaviors while tapping the timer
    evt.preventDefault()
    evt.stopPropagation()
    this.triggerDownAction()
  }

  private handleTouchEnd(evt: TouchEvent) {
    evt.preventDefault()
    this.triggerUpAction()
  }

  private handleBlur() {
    if (this.isReadyToStart) {
      this.isReadyToStart = false
      this.displayEl.removeClass('rubik-cube-algorithms-timer-readying')
    }
    this.isHolding = false
  }

  // --- Timer Actions ---
  private startTimer() {
    this.isRunning = true
    this.startTime = Date.now()
    this.displayEl.addClass('rubik-cube-algorithms-timer-running')

    const updateDisplay = () => {
      if (!this.isRunning) return
      const elapsed = (Date.now() - this.startTime) / 1000
      this.displayEl.setText(elapsed.toFixed(fractionDigits))
      this.timerAnimationFrame = requestAnimationFrame(updateDisplay)
    }

    this.timerAnimationFrame = requestAnimationFrame(updateDisplay)
  }

  private stopTimer() {
    if (!this.isRunning) return
    this.isRunning = false
    this.displayEl.removeClass('rubik-cube-algorithms-timer-running')

    if (this.timerAnimationFrame) {
      cancelAnimationFrame(this.timerAnimationFrame)
      this.timerAnimationFrame = null
    }

    const finalTime = ((Date.now() - this.startTime) / 1000).toFixed(fractionDigits)
    this.displayEl.setText(finalTime)
    this.isShowingResult = true
  }

  private resetTimerLogic() {
    if (!this.isShowingResult) return
    this.isShowingResult = false
    this.displayEl.setText(noTime)
    this.scrambleEl.setText(generateScramble())
  }

}
