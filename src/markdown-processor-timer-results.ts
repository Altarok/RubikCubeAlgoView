import {MarkdownPostProcessorContext, MarkdownRenderChild} from 'obsidian'
import RubikCubeAlgos from "./main"
import {DNF, Result, Solve, SpeedcubeTimesCalculator, SpeedcubeTimesStatistics} from "./model/speedcubing-statistics"


/**
 * Speedcubing results
 */
export class SpeedcubeResultsRenderChild extends MarkdownRenderChild {
  content: string[]
  times: Solve[]

  constructor(readonly source: string, readonly plugin: RubikCubeAlgos, readonly container: HTMLElement, readonly ctx: MarkdownPostProcessorContext) {
    super(container)
    this.content = source.split('\n').filter(Boolean)
    this.times = []
    this.collectData()
    const statistics: SpeedcubeTimesStatistics = this.createStatistics()
    this.display(statistics)
  }

  display(stats: SpeedcubeTimesStatistics): void {
    // 1. Initialize the root table component
    const table = this.container.createEl('table', { cls: 'rubik-cube-stats-table' });

    // 2. Build the scannable header
    const thead = table.createEl('thead');
    const headerRow = thead.createEl('tr');
    headerRow.createEl('th', { text: 'Metric', attr: { scope: 'col' } });
    headerRow.createEl('th', { text: 'Value', attr: { scope: 'col' } });

    const tbody = table.createEl('tbody');

    // Helper function to format a Result object to a plain-text string
    const formatResult = (res: Result): string => {
      if (res === 'N/A') return 'N/A'
      if (res === 'DNF') return 'DNF'
      let displayTime = (res as number).toFixed(2)
      // if (res.isPlusTwo) displayTime += ' (+2)'
      return `${displayTime}s`
    }

    // Helper function to cleanly build the grouping banner rows
    const addGroupHeader = (title: string) => {
      const row = tbody.createEl('tr', { cls: 'stats-group-header' })
      row.createEl('td', { text: title, attr: { colspan: '2' } })
    }

    // Helper function to add individual data rows with layout attributes
    const addDataRow = (label: string, valueStr: string, isBoldLabel = false, isHighlightValue = false) => {
      const row = tbody.createEl('tr')

      // Label Cell
      const labelCell = row.createEl('td')
      if (isBoldLabel) {
        labelCell.createEl('strong', { text: label })
      } else {
        labelCell.setText(label)
      }

      // Value Cell
      const valueCell = row.createEl('td', { text: valueStr })
      if (isHighlightValue) {
        valueCell.addClass('stats-value-highlight')
      }
    }

    // --- Group 1: Session Bounds ---
    addGroupHeader('Session Bounds')
    addDataRow('Personal Best (PB)', formatResult(stats.personalBest), true, true)
    addDataRow('Session Best', formatResult(stats.best))
    addDataRow('Session Worst', formatResult(stats.worst))
    addDataRow('Total Solves', stats.count.toString())

    // --- Group 2: Competitive Averages ---
    addGroupHeader('Competitive Averages')
    addDataRow('Average of 5 (Ao5)', formatResult(stats.Ao5), true)
    addDataRow('Average of 12 (Ao12)', formatResult(stats.Ao12), true)
    addDataRow('Mean of 3 (Mo3)', formatResult(stats.Mo3))

    // --- Group 3: Session Consistency ---
    addGroupHeader('Session Consistency')
    addDataRow('Global Session Mean', formatResult(stats.globalMean))
    // Standard Deviation displays as a straight duration differential
    addDataRow('Standard Deviation (\u03C3)', `${(stats.standardDeviation as number).toFixed(2)}`)


    // <table class="rubik-cube-stats-table">
    // <thead>
    //   <tr>
    //     <th scope="col">Metric</th>
    //   <th scope="col">Value</th>
    //   </tr>
    //   </thead>
    //   <tbody>
    //   <!-- Group 1: Session Bounds -->
    // <tr class="stats-group-header">
    // <td colspan="2">Session Bounds</td>
    // </tr>
    // <tr>
    // <td><strong>Personal Best (PB)</strong></td>
    // <td class="stats-value-highlight">8.92</td>
    //   </tr>
    //   <tr>
    //   <td>Session Best</td>
    // <td>9.52</td>
    // </tr>
    // <tr>
    // <td>Session Worst</td>
    // <td>14.15</td>
    // </tr>
    // <tr>
    // <td>Total Solves</td>
    // <td><code>42</code></td>
    // </tr>
    //
    // <!-- Group 2: Competitive Averages -->
    // <tr class="stats-group-header">
    // <td colspan="2">Competitive Averages</td>
    // </tr>
    // <tr>
    // <td><strong>Average of 5 (Ao5)</strong></td>
    // <td>10.45</td>
    // </tr>
    // <tr>
    // <td><strong>Average of 12 (Ao12)</strong></td>
    // <td>11.20</td>
    // </tr>
    // <tr>
    // <td>Mean of 3 (Mo3)</td>
    // <td>11.85</td>
    // </tr>
    //
    // <!-- Group 3: Session Distribution -->
    // <tr class="stats-group-header">
    // <td colspan="2">Session Consistency</td>
    // </tr>
    // <tr>
    // <td>Global Session Mean</td>
    // <td>12.04</td>
    // </tr>
    // <tr>
    // <td>Standard Deviation (&sigma;)</td>
    // <td class="stats-deviation-value">0.72s</td>
    // </tr>
    // </tbody>
    // </table>

  }

  createStatistics(): SpeedcubeTimesStatistics {
    return new SpeedcubeTimesCalculator(this.times).run()
  }

  collectData() {
    if (!this.content || this.content.length < 1) return
    for (const line of this.content) {
      let timeTakenStr = line.replace(/s? \(.*\)$/g, '')

      if (timeTakenStr && /\d+\.\d{3}/.test(timeTakenStr)) {
        let timeTaken: number = +timeTakenStr
        this.times.push(timeTaken)
      } else if (timeTakenStr === DNF) {
        this.times.push(DNF)
      } else {
        throw new Error('Illegal time measurement: ' + timeTakenStr)
      }
    }
  }

}
