import {InvalidInput, isInvalidRow} from "../model/invalid-input";

/**
 * Renders a formatted error message when code block interpretation fails.
 */
export function showInvalidInput(container: HTMLElement, rows: string[], error: InvalidInput): void {
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
