import {MarkdownRenderChild} from "obsidian";
import {BaseCodeBlockInterpreter} from "./BaseCodeBlockInterpreter";
import {ArrowCoordinates} from "./model/ArrowCoordinates";
import {Coordinates} from "./model/Coordinates";
import {ArrowCalculations} from "./ArrowCalculations";

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
  displayWarningForNonsenseCodeBlock(rows: string[], cubeData: BaseCodeBlockInterpreter): void {

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

  displayArrows(mainSvg: SVGSVGElement, cubeData: ArrowCalculations) : void {
    let arrows: ArrowCoordinates[] = cubeData.getArrowCoordinates();
    for (let i: number = 0; i < arrows.length; i++) {
      let arrow: ArrowCoordinates = arrows[i]!;
      let arrStart: Coordinates = arrow.start();
      let arrEnd: Coordinates = arrow.end();
      //console.log('Arrow goes from ' + arrowStartCoord + ' to ' + arrowEndCoord);
      mainSvg.createSvg('line', {
        attr: {
          x1: arrStart.x,
          y1: arrStart.y,
          x2: arrEnd.x,
          y2: arrEnd.y,
          'marker-end': 'url(#arrowhead' + cubeData.arrowColor + ')',
          stroke: cubeData.arrowColor
        },
        cls: 'rubik-cube-arrow'
      });
    }
  }

  /*
  TODO add buttons:

  <div class="button-container">

	<button type="button" aria-label="Rotate Left 90 degrees">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
		<rect x='10' y='2' width='12' height='12' ></rect>
		<line x1='14' y1='2' x2='14' y2='14' ></line>
		<line x1='18' y1='2' x2='18' y2='14' ></line>
		<line x1='10' y1='6' x2='22' y2='6' ></line>
		<line x1='10' y1='10' x2='22' y2='10' ></line>
		 <path d="M13 22a10 10 0 0 1 -10 -10v-2"></path>
		<polyline points="0 13 3 10 6 13" stroke-width="1.5" stroke-linecap="butt"></polyline>
		</svg>
	</button>

	<button type="button" aria-label="Copy">
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect> <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
	</svg>
	</button>

	<button type="button" aria-label="Rotate Left 90 degrees">
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
		<rect x='2' y='2' width='12' height='12' ></rect>
		<line x1='6' y1='2' x2='6' y2='14' ></line>
		<line x1='10' y1='2' x2='10' y2='14' ></line>
		<line x1='2' y1='6' x2='14' y2='6' ></line>
		<line x1='2' y1='10' x2='14' y2='10' ></line>
		 <path d="M11 22a10 10 0 0 0 10 -10v-2"></path>
		<polyline points="18 13 21 10 24 13" stroke-width="1.5"></polyline>
		</svg>
	</button>

</div>
   */

}
