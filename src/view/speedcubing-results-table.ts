import {CssClasses} from "consts/strings"
import {DNF, N_A, Result, SpeedcubeTimesStatistics} from "../model/speedcubing-statistics"

/**
 * Format a Result to a plain string
 */
function formatResult(res: Result, fractionDigits: number = 2): string {
  if (res === N_A) return N_A
  if (res === DNF) return DNF
  let displayTime = res.toFixed(fractionDigits)
  // if (res.isPlusTwo) displayTime += ' (+2)'
  return `${displayTime}s`
}

/**
 * Clean build of grouping banner rows
 */
function addGroupHeader(tbody: HTMLTableSectionElement, title: string) {
  const row = tbody.createEl('tr', {cls: CssClasses.speedcubingResults.header})
  row.createEl('td', {text: title, attr: {colspan: '2'}})
}

/**
 * Add individual data rows with layout attributes
 */
function addDataRow(tbody: HTMLTableSectionElement, label: string, valueStr: string, isBoldLabel = false, isHighlightValue = false) {
  const row = tbody.createEl('tr')

  /* Label Cell */
  const labelCell = row.createEl('td')
  if (isBoldLabel)
    labelCell.createEl('strong', {text: label})
  else
    labelCell.setText(label)

  /* Value Cell */
  const valueCell = row.createEl('td', {text: valueStr})
  if (isHighlightValue) valueCell.addClass(CssClasses.speedcubingResults.highlight)
}

export function drawSpeedCubingResultsTable(container: HTMLElement, stats: SpeedcubeTimesStatistics) {
  // 1. Initialize the root table component
  const table = container.createEl('table', {cls: CssClasses.speedcubingResults.table})

  // 2. Build the scannable header
  const thead = table.createEl('thead')
  const headerRow = thead.createEl('tr')
  headerRow.createEl('th', {text: 'Metric', attr: {scope: 'col'}})
  headerRow.createEl('th', {text: 'Value', attr: {scope: 'col'}})

  const tbody = table.createEl('tbody')


  // --- Group 1: Session Bounds ---
  addGroupHeader(tbody, 'Session Bounds')
  addDataRow(tbody, 'Personal Best (PB)', formatResult(stats.personalBest, 3), true, true)
  addDataRow(tbody, 'Session Best', formatResult(stats.best))
  addDataRow(tbody, 'Session Worst', formatResult(stats.worst))
  addDataRow(tbody, 'Total Solves', stats.count.toString())

  // --- Group 2: Competitive Averages ---
  addGroupHeader(tbody, 'Competitive Averages')
  addDataRow(tbody, 'Average of 5 (Ao5)', formatResult(stats.Ao5), true)
  addDataRow(tbody, 'Average of 12 (Ao12)', formatResult(stats.Ao12), true)
  addDataRow(tbody, 'Mean of 3 (Mo3)', formatResult(stats.Mo3))

  // --- Group 3: Session Consistency ---
  addGroupHeader(tbody, 'Session Consistency')
  addDataRow(tbody, 'Global Session Mean', formatResult(stats.globalMean))
  // Standard Deviation displays as a straight duration differential
  addDataRow(tbody, 'Standard Deviation (\u03C3)', `${(stats.standardDeviation as number).toFixed(2)}`)

}
