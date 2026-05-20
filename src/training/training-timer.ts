import {generateScramble} from "./algorithm-scrambler"

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


  constructor(readonly contentEl: HTMLElement, readonly eventHandler: HTMLElement | Window, readonly isOnMobile: boolean) {
  }

  onOpen() {

    /*Add a class to the outermost modal container for full-screen CSS overrides*/
    if (!this.isOnMobile) {
      this.contentEl.addClass('rubik-cube-algorithms-timer-modal')
    }

    this.addTexts(this.contentEl)

    if (this.isOnMobile) {
      // Mobile: Listen for touch interactions on the entire screen
      this.eventHandler.addEventListener('touchstart', this.handleTouchStartBound)
      this.eventHandler.addEventListener('touchend', this.handleTouchEndBound)
    } else {
      // Desktop: Keep the classic keyboard listener behavior
      this.eventHandler.addEventListener('keydown', this.handleKeyDownBound)
      this.eventHandler.addEventListener('keyup', this.handleKeyUpBound)
      this.eventHandler.addEventListener('blur', this.onBlur)
    }

    /*
     * TODO use this to request keep screen awake
     */
    // Request the lock as soon as the modal/block becomes active on mobile
    // if (this.isOnMobile) {
    //   this.requestWakeLock();
    //   document.addEventListener('visibilitychange', this.handleVisibilityChange);
    // }
  }

  /** Change hint text based on the platform */
  private addTexts(contentEl: HTMLElement) {
    this.scrambleEl = this.contentEl.createEl('div', {text: generateScramble(), cls: 'rubik-cube-algorithms-scramble-display'})
    this.displayEl = this.contentEl.createEl('h1', {text: noTime, cls: 'rubik-cube-algorithms-timer-display'})

    const hintText1: string = this.isOnMobile ? 'Tap and hold anywhere to ready, release to start.' : 'Hold space bar. Release to start.'
    const hintText2: string = this.isOnMobile ? 'Tap anywhere to stop / reset.' : 'Press space bar to stop / reset.'
    contentEl.createEl('div', {text: hintText1, cls: 'rubik-cube-algorithms-timer-hint'})
    contentEl.createEl('div', {text: hintText2, cls: 'rubik-cube-algorithms-timer-hint'})
  }

  onClose() {
    this.stopTimer()

    // Unbind everything depending on platform to prevent leaks
    if (this.isOnMobile) {
      this.eventHandler.removeEventListener('touchstart', this.handleTouchStartBound)
      this.eventHandler.removeEventListener('touchend', this.handleTouchEndBound)
    } else {
      this.eventHandler.removeEventListener('keydown', this.handleKeyDownBound)
      this.eventHandler.removeEventListener('keyup', this.handleKeyUpBound)
      this.eventHandler.removeEventListener('blur', this.onBlur)
    }

    // if (this.isOnMobile) {
    //   document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    //   this.releaseWakeLock();
    // }
  }

  /* core timer engine */
  private triggerDownAction() {
    if (this.isHolding) return
    this.isHolding = true

    if (this.isRunning) {
      this.stopTimer() // Instantly stop clock on tap / press
    } else if (this.isShowingResult) {
      this.resetTimerLogic()
    } else {
      this.isReadyToStart = true
      // this.displayEl.removeClass('rubik-cube-algorithms-timer-display')
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

  // --- Event Handlers ---
  private handleKeyDown(e: Event) {
    const evt = e as KeyboardEvent;
    if (evt.key !== ' ') return
    evt.preventDefault()
    evt.stopPropagation()
    this.triggerDownAction()
  }

  private handleKeyUp(e: Event) {
    const evt = e as KeyboardEvent;
    if (evt.key !== ' ') return
    evt.preventDefault()
    evt.stopPropagation()
    this.triggerUpAction()
  }

  private handleTouchStart(e: Event) {
    const evt = e as TouchEvent;
    // Prevent zoom/scrolling behaviors while tapping the timer
    evt.preventDefault()
    evt.stopPropagation()
    this.triggerDownAction()
  }

  private handleTouchEnd(e: Event) {
    const evt = e as TouchEvent;
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

  ////////////////

  // /**
  //  * Requests a screen wake lock if supported by the mobile webview platform
  //  */
  // private async requestWakeLock() {
  //   if (!('wakeLock' in navigator)) {
  //     console.warn('Screen Wake Lock API is not supported on this platform.')
  //     return;
  //   }
  //
  //   try {
  //     // Re-requesting only if we don't already hold an active lock handle
  //     if (!this.wakeLock) {
  //       this.wakeLock = await navigator.wakeLock.request('screen')
  //
  //       // Listen for accidental or system-enforced releases (e.g. extreme low battery)
  //       this.wakeLock.addEventListener('release', () => {
  //         this.wakeLock = null
  //       })
  //     }
  //   } catch (err) {
  //     console.error('Failed to acquire Wake Lock:', err)
  //   }
  // }
  //
  // /**
  //  * Explicitly releases the lock when the timer session is closed
  //  */
  // private async releaseWakeLock() {
  //   if (this.wakeLock) {
  //     try {
  //       await this.wakeLock.release();
  //       this.wakeLock = null;
  //     } catch (err) {
  //       console.error('Failed to release Wake Lock smoothly:', err)
  //     }
  //   }
  // }
  //
  // /**
  //  * If the user switches apps or locks their screen manually, the browser invalidates
  //  * the active wake lock. We need to re-acquire it the second the app comes back to focus.
  //  */
  // private async handleVisibilityChange() {
  //   if (document.visibilityState === 'visible') {
  //     await this.requestWakeLock()
  //   }
  // }

}
