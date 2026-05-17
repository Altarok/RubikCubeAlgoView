import { App, Modal } from 'obsidian';

export class TimerModal extends Modal {
  private isRunning: boolean = false;
  private startTime: number = 0;
  private timerInterval: NodeJS.Timeout | null = null;
  private displayEl!: HTMLElement;

  constructor(app: App) {
    super(app);
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    // Add a class for custom CSS styling (centering, large text)
    contentEl.addClass('rubik-cube-algorithms-training-timer-modal');

    // Create the timer text element
    this.displayEl = contentEl.createEl('h1', { text: '0.00', cls: 'rubik-cube-algorithms-training-timer-display' });
    contentEl.createEl('p', { text: 'Hold space bar. Release to start.', cls: 'rubik-cube-algorithms-training-timer-hint' });
    contentEl.createEl('p', { text: 'Press space bar to stop / reset.', cls: 'rubik-cube-algorithms-training-timer-hint' });

    // Listen for keyboard events *only* while the modal is open
    this.scope.register([], ' ', (evt: KeyboardEvent) => {
      // Prevent the space bar from scrolling the background note
      evt.preventDefault();
      this.toggleTimer();
    });
  }

  onClose() {
    this.stopTimerLogic();
    const { contentEl } = this;
    contentEl.empty();
  }

  private toggleTimer() {
    if (this.isRunning) {
      this.stopTimerLogic();
    } else {
      this.startTimerLogic();
    }
  }

  private startTimerLogic() {
    this.isRunning = true;
    this.startTime = Date.now();
    this.displayEl.addClass('timer-running');

    this.timerInterval = setInterval(() => {
      const elapsed = (Date.now() - this.startTime) / 1000;
      this.displayEl.setText(elapsed.toFixed(2));
    }, 10); // Update every 10ms for smooth millisecond rendering
  }

  private stopTimerLogic() {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.displayEl.removeClass('timer-running');

    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const finalTime = ((Date.now() - this.startTime) / 1000).toFixed(2);
    this.displayEl.setText(finalTime);

    // Optional: Trigger a callback function here to save 'finalTime' to your note
  }
}
