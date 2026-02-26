import {InvalidInput, isInvalidRow} from "../model/invalid-input";
import {Algorithm} from "../model/algorithms";

export const UiUtils = {
  renderAlgorithmList,
  renderAlgorithmSelect,
  showInvalidInput
};

/**
 * Renders a formatted error message when code block interpretation fails.
 */
function showInvalidInput(container: HTMLElement, rows: string[], error: InvalidInput): void {
  container.createEl('div', {
    text: 'Code block interpretation failed:',
    cls: 'rubik-cube-warning-text-orange'
  });

  if (rows.length === 0) {
    const p = container.createEl('p');
    p.createEl('b', {text: '[empty]', cls: 'rubik-cube-warning-text-red'});
    p.createEl('span', {text: ` => ${error.reason}`});
    return;
  }

  const listContainer = container.createEl('div', {cls: 'rubik-cube-error-list'});

  rows.forEach(row => {
    if (isInvalidRow(error, row)) {
      const errorRow = listContainer.createEl('div');
      errorRow.createEl('b', {text: row, cls: 'rubik-cube-warning-text-red'});
      errorRow.createEl('span', {text: ` => ${error.reason}`});
    } else {
      listContainer.createEl('div', {text: row});
    }
  });
}

/**
 * Renders a simple bullet point list of algorithms (used by PLL).
 */
function renderAlgorithmList(container: HTMLElement, algorithms: Algorithm[]): void {
  if (algorithms.length === 0) return;

  const ul = container.createEl('ul');
  algorithms.forEach(item => {
    let li = ul.createEl('li'); // { text: item.toString() }
    let listLabel: HTMLLabelElement = li.createEl('label', {text: item.toString()});
    item.algorithmLabel = listLabel;
  });
}

/**
 * Renders a list of algorithms with radio buttons for selection (used by OLL).
 */
function renderAlgorithmSelect(
  container: HTMLElement,
  algorithms: Algorithm[], // { algorithm: Algorithm }[],
  selectedIndex: number
): void {
  const ul = container.createEl('ul');
  const radioDiv = ul.createEl('div', {attr: {id: 'oll-radio-buttons-div'}});

  algorithms.forEach((item, i) => {
    const isChecked = selectedIndex === i;

    radioDiv.createEl('input', {
      attr: {
        name: 'algorithm-selection',
        type: 'radio',
        id: i.toString(),
        value: i.toString(),
        ...(isChecked && {checked: true}) // Only add checked attribute if true
      }
    });

    let radioBtnLabel: HTMLLabelElement = radioDiv.createEl('label', {
      attr: {for: i.toString(), id: i,},
      text: item.toString()
    });
    radioDiv.createEl('br');

    item.algorithmLabel = radioBtnLabel;
  });
}
