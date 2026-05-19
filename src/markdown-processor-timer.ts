import {MarkdownRenderChild, Platform} from 'obsidian'
import {TrainingTimer} from "./training/training-timer";

export class TimerRenderChild extends MarkdownRenderChild {
  // private isRunning: boolean = false
  // private isHolding: boolean = false
  // private isReadyToStart: boolean = false
  // private isShowingResult: boolean = false
  // private startTime: number = 0
  // private animationFrameId: number | null = null
  //
  // private displayEl!: HTMLElement
  //
  // // Track event bound references so we can remove them safely on unload
  // private onKeyDown = this.handleKeyDown.bind(this)
  // private onKeyUp = this.handleKeyUp.bind(this)
  // private onTouchStart = this.handleTouchStart.bind(this)
  // private onTouchEnd = this.handleTouchEnd.bind(this)
  // private onBlur = this.handleBlur.bind(this)

  private timer!: TrainingTimer

  constructor(readonly containerEl: HTMLElement) {
    super(containerEl)
  }

  /**
   * Called automatically by Obsidian when the element renders on viewable display
   */
  onload() {
    this.timer = new TrainingTimer(this.containerEl, this.containerEl, Platform.isMobile)
    this.timer.onOpen()

    // this.containerEl.addClass('rubik-cube-timer-container')
    //
    // if (!Platform.isMobile) {
    //   this.containerEl.setAttribute('tabindex', '0')
    //   this.containerEl.createEl('small', {
    //     text: 'Click block to focus keyboard controls',
    //     cls: 'timer-focus-hint'
    //   })
    // }

    // this.displayEl = this.containerEl.createEl('h1', {
    //   text: '0.000',
    //   cls: 'rubik-cube-algorithms-timer-display'
    // })

    // Attach local lifecycle platform listeners
    // if (Platform.isMobile) {
    //   this.containerEl.addEventListener('touchstart', this.onTouchStart)
    //   this.containerEl.addEventListener('touchend', this.onTouchEnd)
    // } else {
    //   this.containerEl.addEventListener('keydown', this.onKeyDown)
    //   this.containerEl.addEventListener('keyup', this.onKeyUp)
    //   this.containerEl.addEventListener('blur', this.onBlur)
    // }
  }

  /**
   * Called automatically by Obsidian when the note switches, closes,
   * or scrolling moves the block completely out of sight
   */
  onunload() {
    this.timer.onClose()
    // this.stopTimer()
    //
    // if (Platform.isMobile) {
    //   this.containerEl.removeEventListener('touchstart', this.onTouchStart)
    //   this.containerEl.removeEventListener('touchend', this.onTouchEnd)
    // } else {
    //   this.containerEl.removeEventListener('keydown', this.onKeyDown)
    //   this.containerEl.removeEventListener('keyup', this.onKeyUp)
    //   this.containerEl.removeEventListener('blur', this.onBlur)
    // }
    //
    // this.containerEl.empty()
  }

  // // --- Operational Handling ---
  // private triggerDownAction() {
  //   if (this.isHolding) return
  //   this.isHolding = true
  //
  //   if (this.isRunning) {
  //     this.stopTimer()
  //   } else {
  //     if (this.isShowingResult) {
  //       this.displayEl.setText('0.000')
  //       this.isShowingResult = false
  //     }
  //     this.isReadyToStart = true
  //     this.displayEl.addClass('rubik-cube-algorithms-timer-readying')
  //   }
  // }
  //
  // private triggerUpAction() {
  //   this.isHolding = false
  //   if (this.isReadyToStart) {
  //     this.isReadyToStart = false
  //     this.displayEl.removeClass('rubik-cube-algorithms-timer-readying')
  //     this.startTimer()
  //   }
  // }
  //
  // private startTimer() {
  //   this.isRunning = true
  //   this.startTime = Date.now()
  //   this.displayEl.addClass('rubik-cube-algorithms-timer-running')
  //
  //   const frame = () => {
  //     if (!this.isRunning) return
  //     const elapsed = (Date.now() - this.startTime) / 1000
  //     this.displayEl.setText(elapsed.toFixed(3))
  //     this.animationFrameId = requestAnimationFrame(frame)
  //   }
  //   this.animationFrameId = requestAnimationFrame(frame)
  // }
  //
  // private stopTimer() {
  //   if (!this.isRunning) return
  //   this.isRunning = false
  //   this.displayEl.removeClass('rubik-cube-algorithms-timer-running')
  //
  //   if (this.animationFrameId) {
  //     cancelAnimationFrame(this.animationFrameId)
  //     this.animationFrameId = null
  //   }
  //
  //   const finalTime = ((Date.now() - this.startTime) / 1000).toFixed(3)
  //   this.displayEl.setText(finalTime)
  //   this.isShowingResult = true
  // }
  //
  // // --- Internal Event Maps ---
  // private handleKeyDown(evt: KeyboardEvent) {
  //   if (evt.key !== ' ') return
  //   evt.preventDefault()
  //   evt.stopPropagation()
  //   this.triggerDownAction()
  // }
  //
  // private handleKeyUp(evt: KeyboardEvent) {
  //   if (evt.key !== ' ') return
  //   evt.preventDefault()
  //   evt.stopPropagation()
  //   this.triggerUpAction()
  // }
  //
  // private handleTouchStart(evt: TouchEvent) {
  //   evt.preventDefault()
  //   this.triggerDownAction()
  // }
  //
  // private handleTouchEnd(evt: TouchEvent) {
  //   evt.preventDefault()
  //   this.triggerUpAction()
  // }
  //
  // private handleBlur() {
  //   if (this.isReadyToStart) {
  //     this.isReadyToStart = false
  //     this.displayEl.removeClass('rubik-cube-algorithms-timer-readying')
  //   }
  //   this.isHolding = false
  // }
}
