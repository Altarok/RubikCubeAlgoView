import RubikCubeAlgos from "./main";
import {CodeBlockInterpreterOLL} from "./CodeBlockInterpreter";
import {CubeStateOLL} from "./model/cube-state";
import {CubeRendererOLL} from "./view/CubeRendererOLL";
import {MarkdownRenderChild} from "obsidian";

export class MarkdownPostProcessorOLL extends MarkdownRenderChild {
  source: string;
  plugin: RubikCubeAlgos;
  element: HTMLElement;

  constructor(source: string, plugin: RubikCubeAlgos, element: HTMLElement) {
    super(element);
    this.source = source;
    this.plugin = plugin;
    this.element = element;
    this.display();
  }

  onload(): void {
    /*
     * Register listener which instantly redraws Rubik's Cubes while changing plugin settings.
     */
    this.registerEvent(
      // @ts-ignore
      this.plugin.app.workspace.on("rubik:rerender-markdown-code-block-processors",
        this.display.bind(this)
      )
    );
  }

  display(): void {
    this.element.empty();
    const rows: string[] = this.source.split('\n')
      .map(row => row && row.trim()).filter((row) => row.length > 0)
    ;

    let interpreter: CodeBlockInterpreterOLL = new CodeBlockInterpreterOLL(rows, this.plugin.settings);
    let cubeState: CubeStateOLL = interpreter.setupOll();

    let cubeRenderer = new CubeRendererOLL(cubeState);
    cubeRenderer.display(this.element);

    if (!cubeState.codeBlockInterpretationFailed()) {
      this.addButtonFunctions(cubeRenderer, cubeState);
    }

  }

  private addButtonFunctions(cubeRenderer: CubeRendererOLL, cubeState: CubeStateOLL) {

    // console.debug('addButtonFunctions ' + cubeState.algorithmToArrows.size());

    if (cubeState.algorithmToArrows.size() > 1) {
      let radioButtons: HTMLCollectionOf<HTMLInputElement> = cubeRenderer.radioDiv.getElementsByTagName('input');

      console.debug('turn');

      for (let i: number = 0; i < radioButtons.length; i++) {
        let radioButton: HTMLInputElement = radioButtons[i]!;
        radioButton.addEventListener('click', () => {
          if (cubeState.changeAlgorithm(+radioButton.id)) {
            cubeRenderer.redrawArrows();
          }
        });
      }
    }

    cubeRenderer.buttonLeft.addEventListener('click', () => {
      cubeRenderer.rotateLeft();
      cubeState.rotateLeft();
      /*
       * TODO instead change text of divs
       */
      // cubeRenderer.redrawAlgorithms();

      // let radioButtons: HTMLCollectionOf<HTMLInputElement> = cubeRenderer.radioDiv.getElementsByTagName('input');

      let elementsByTagName: HTMLCollectionOf<HTMLLabelElement> = cubeRenderer.radioDiv.getElementsByTagName('label');

      console.debug('turn left');

      for (let i: number = 0; i < elementsByTagName.length; i++) {
        let radioButton: HTMLLabelElement = elementsByTagName[i]!;
        let radioButtonId: number = +radioButton.id;
        // radioButton.setText(cubeState.algorithmToArrows.get(+radioButtonId)!.algorithm.toString());
        let s: string = cubeState.algorithmToArrows.get(radioButtonId)!.algorithm.toString();
        console.debug('turn right: ' + radioButtonId + ' --> ' + s);
        // radioButton.setAttribute('text', s);
        radioButton.setText(s);
      }

    });

    cubeRenderer.buttonRight.addEventListener('click', () => {
      cubeRenderer.rotateRight();
      cubeState.rotateRight();
      // cubeRenderer.redrawAlgorithms()

      // let radioButtons: HTMLCollectionOf<HTMLInputElement> = cubeRenderer.radioDiv.getElementsByTagName('input');

      let elementsByTagName: HTMLCollectionOf<HTMLLabelElement> = cubeRenderer.radioDiv.getElementsByTagName('label');

      console.debug('turn right');

      for (let i: number = 0; i < elementsByTagName.length; i++) {

        let radioButton: HTMLLabelElement = elementsByTagName[i]!;
        let radioButtonId: number = +radioButton.id;
        let s: string = cubeState.algorithmToArrows.get(radioButtonId)!.algorithm.toString();
        console.debug('turn right: ' + radioButtonId + ' --> ' + s);
        // radioButton.setAttribute('text', s);
        radioButton.setText(s);
      }
    });
  }
}
