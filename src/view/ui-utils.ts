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
    item.algorithmLabel = li.createEl('label', {text: item.toString()});
  });
}

/**
 * Renders a list of algorithms with radio buttons for selection (used by OLL).
 */
function renderAlgorithmSelect(
  container: HTMLElement, algorithms: Algorithm[], selectedIndex: number, uniqueIdForRadioButtons: string): void {
  const ul = container.createEl('ul');
  const radioDiv = ul.createEl('div', {attr: {id: 'oll-radio-buttons-div'}});

  algorithms.forEach((item, i) => {
    const isChecked = selectedIndex === i;

    const uniqueId = uniqueIdForRadioButtons + i.toString(); // unique identifier for EACH element

    radioDiv.createEl('input', { // create HTMLInputElement
      attr: {
        type: 'radio', // radio button
        name: uniqueIdForRadioButtons, // unique identifier for radio button grp
        id: uniqueId,
        value: i.toString(), // data sent to the script ("backend") when the form is submitted
        ...(isChecked && {checked: true}) // only add checked attribute if true
      }
    });

    let radioBtnLabel: HTMLLabelElement = radioDiv.createEl('label', {
      attr: {
        for: uniqueId, // allows users to click the text to select the button
        id: 'forBtn'+uniqueId
      },
      text: item.toString()
    });
    radioDiv.createEl('br');

    item.algorithmLabel = radioBtnLabel;
  });
}
