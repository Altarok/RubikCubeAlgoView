import {MarkdownRenderChild} from "obsidian";
import {BaseCodeBlockInterpreter} from "./BaseCodeBlockInterpreter";

export abstract class MarkdownPostProcessorBase extends MarkdownRenderChild {
  element: HTMLElement;

  protected constructor(element: HTMLElement) {
    super(element);
    this.element = element;
  }

  /**
   * @param {string[]} rows - code block content
   * @param {BaseCodeBlockInterpreter[]} cubeData - container of erronous code block input
   */
  paintWarningForNonsenseCodeBlock(rows: string[], cubeData: BaseCodeBlockInterpreter): void {

    this.element.createEl('div', {text: 'Code block interpretation failed:', cls: 'rubik-cube-warning-text-orange'});

    if (rows.length === 0) {
      this.element.createEl('b', {text: '[empty]', cls: 'rubik-cube-warning-text-red'});
      this.element.createEl('span', {text: ' => ' + cubeData.reasonForFailure});
    } else {
      for (let r: number = 0; r < rows.length; r++) {
        let row: string = rows[r]!;
        if (cubeData.isRowInterpretable(row)) {
          this.element.createEl('div', {text: row});
        } else {
          this.element.createEl('b', {text: row, cls: 'rubik-cube-warning-text-red'});
          this.element.createEl('span', {text: ' => ' + cubeData.reasonForFailure});
        }
      }
    }
  }
}
