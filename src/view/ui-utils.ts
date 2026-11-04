import {Strings} from '../consts/strings'
import {InvalidInput} from '../model/invalid-input-container'
import {Algorithm} from '../model/algorithms'

const CssClasses = Strings.CssClasses

export const UiUtils = {
  showInvalidInput,
  renderAlgorithmSetup
}

function findMatchingError(errors: InvalidInput[], row: string): InvalidInput | undefined {
  let res: InvalidInput | undefined = undefined
  errors.forEach(error => {
    if (error.isInvalidRow(row)) {
      res = error
    }
  })
  return res
}

function renderAlgorithmSetup(container: HTMLElement, setupAlgorithm?: Algorithm): void {
  if (!setupAlgorithm) return

  // const ul =
  container.createDiv({text: `Setup: ${setupAlgorithm.toString()}`})

  // let li = ul.createEl('li')
  // item.algorithmLabel = li.createEl('label', {text: item.toString()})
}

/**
 * Renders a formatted error message when code block interpretation fails.
 */
function showInvalidInput(container: HTMLElement, rows: string[], errors: InvalidInput[]): void {
  container.createDiv({text: 'Code block interpretation failed:', cls: CssClasses.warnings.orange})

  if (rows.length === 0) {
    const p = container.createEl('p')
    p.createEl('b', {text: '[empty]', cls: CssClasses.warnings.red})
    p.createSpan({text: ` => ${errors[0]!.reason}`})
    return
  }

  const listContainer = container.createDiv()

  rows.forEach(row => {

    let matchingError: InvalidInput | undefined = findMatchingError(errors, row)

    if (matchingError) {
      const errorRow = listContainer.createDiv()
      errorRow.createEl('b', {text: row, cls: CssClasses.warnings.red})
      errorRow.createSpan({text: ` => ${matchingError.reason}`})
    } else {
      listContainer.createDiv({text: row})
    }
  })
}
