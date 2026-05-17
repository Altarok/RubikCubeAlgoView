import {App, Modal} from 'obsidian';

export class TimerModal extends Modal {
  private isRunning: boolean = false;
  private isReadyToStart: boolean = false;
  private isHoldingSpace: boolean = false;
  private isShowingResult: boolean = false;

  private startTime: number = 0;
  private timerInterval: NodeJS.Timeout | null = null;
  private displayEl!: HTMLElement;

  // Track the bound listeners so we can clean them up perfectly
  private handleKeyDownBound = this.handleKeyDown.bind(this);
  private handleKeyUpBound = this.handleKeyUp.bind(this);

  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const {contentEl} = this;
    contentEl.empty();
    contentEl.addClass('cube-timer-modal');

    this.displayEl = contentEl.createEl('h1', {text: '0.00', cls: 'rubik-cube-algorithms-training-timer-display'});
    // contentEl.createEl('p', {
    //   text: 'Hold SPACE to ready, release to start.',
    //   cls: 'rubik-cube-algorithms-training-timer-hint'
    // });


    contentEl.createEl('p', {
      text: 'Hold space bar. Release to start.',
      cls: 'rubik-cube-algorithms-training-timer-hint'
    });
    contentEl.createEl('p', {
      text: 'Press space bar to stop / reset.',
      cls: 'rubik-cube-algorithms-training-timer-hint'
    });

    // Attach event listeners to the modal container window
    window.addEventListener('keydown', this.handleKeyDownBound);
    window.addEventListener('keyup', this.handleKeyUpBound);
  }

  onClose() {
    // Clean up global listeners immediately to prevent memory leaks
    window.removeEventListener('keydown', this.handleKeyDownBound);
    window.removeEventListener('keyup', this.handleKeyUpBound);

    this.stopTimerLogic();
    this.contentEl.empty();
  }

  private handleKeyDown(evt: KeyboardEvent) {
    if (evt.key !== ' ') return;
    evt.preventDefault(); // Stop page scrolling

    // Prevent OS keyboard repeat events from firing repeatedly while holding down
    if (this.isHoldingSpace) return;
    this.isHoldingSpace = true;

    if (this.isRunning) {
      // Instantly stop the clock on down-press
      this.stopTimerLogic();
    } else if (this.isShowingResult) {
      this.resetTimerLogic();
    } else {
      // Readying the state: Turn timer red/green to show it's primed
      this.isReadyToStart = true;
      this.displayEl.addClass('rubik-cube-algorithms-training-timer-display.timer-readying');
    }
  }

  private handleKeyUp(evt: KeyboardEvent) {
    if (evt.key !== ' ') return;
    this.isHoldingSpace = false;

    if (this.isReadyToStart) {
      this.isReadyToStart = false;
      this.displayEl.removeClass('rubik-cube-algorithms-training-timer-display.timer-readying');
      this.startTimerLogic();
    }
  }

  private startTimerLogic() {
    this.isRunning = true;
    this.startTime = Date.now();
    this.displayEl.addClass('rubik-cube-algorithms-training-timer-display.timer-running');

    this.timerInterval = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000;
      this.displayEl.setText(elapsed.toFixed(2));
    }, 10);
  }

  private stopTimerLogic() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.displayEl.removeClass('rubik-cube-algorithms-training-timer-display.timer-running');

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const finalTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    this.displayEl.setText(finalTime);
    this.isShowingResult = true
  }


  private resetTimerLogic() {
    if (!this.isShowingResult) return;
    this.isShowingResult = false;
    // this.displayEl.removeClass('rubik-cube-algorithms-training-timer-running');

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const finalTime = '0.00';
    this.displayEl.setText(finalTime);
  }

}
