import {Plugin} from "obsidian";
import {CodeBlockInterpreter} from "./parser/codeblock-interpreter";
import {MarkdownPostProcessorOLL} from "./MarkdownPostProcessorOLL";
import {MarkdownPostProcessorPLL} from "./MarkdownPostProcessorPLL";
import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";

/*
 * # Logic
 * ## Misc
 * - [x] visualize cube, arrows
 * - [x] visualize OLL and PLL algorithms
 * - [x] arrow- and cube-colors
 * - [x] algorithms change according to rotation
 * - [x] change algorithm key (number to string) to be able to get the right one without knowing its index
 *   - [x] add hash() method to sub class Algorithm
 * - [x] remove 'y' after rotation
 * - [x] mobile support
 *   - [ ] remove redundant CSS
 * - [ ] remove 'y0'
 *
 * ## Rotation
 * - [ ] Change cube rotation to integer type [0-3] // to be multiplied by 90 degrees
 *   - turn left -> rotation = (rotation + delta + 4) % 4, then apply rotation
 *   - turn right -> rotation = (rotation - delta + 4) % 4, then apply rotation
 *
 * # Input
 * - [x] PLL with dimensions
 * - [x] OLL with and w/o colour
 * - [x] arrows: x-y = arrow from x to y
 *   - [x] double-sided arrows: x+y = 1 arrow from x to y, 1 arrow from y to x
 *   - [x] chained arrows: x-y-z = 3 arrows, 1 from x to y, 1 from y to z, 1 from z to x
 *     - [ ] prevent duplicates
 * - [x] algorithms
 *   - [x] algorithms mapped to arrows
 *   - [ ] mark as favorite
 *
 * ## Flags
 * - [x] add flag: 'no-rotation'
 *   - [ ] then add svg in center sticker "no location change"
 * - [ ] Add flag: 'keep-y-prefix' -> y am Start aendern, Rest lassen
 *   - do not change algorithm on rotation, only the amount of y prefix
 *   - add rotation as parameter to method Algorithm.toString when using flag 'keep-y-prefix'. Skip y when #y = currentRotation
 * - [ ] Add flag: 'do-not-auto-remove-y-prefix' -> y am Start automatisch raus schmeissen
 * - [ ] Add flag: 'punkt-gespiegelt'
 * - [ ] Add flag: 'achsen-gespiegelt' vertical und/oder(?) horizontal
 *
 * # GUI
 * - [x] Button: rotate cube
 * - [x] Button: reset cube rotation
 * - [ ] Button: save rotation as default
 * - [ ] Button: save algorithm as default
 * - [ ] Button: mirror algorithm vertically (when allowed by flag)
 * - [ ] Button: lock rotation
 */
export default class RubikCubeAlgos extends Plugin {
  settings: RubikCubeAlgoSettingsTab;

  async onload() {

    await this.loadSettings();

    this.registerMarkdownCodeBlockProcessor("rubikCubeOLL",
      (source, el, ctx) => {
        ctx.addChild(new MarkdownPostProcessorOLL(source, this, el));
      }
    );

    this.registerMarkdownCodeBlockProcessor("rubikCubePLL",
      (source, el, ctx) => {
        ctx.addChild(new MarkdownPostProcessorPLL(source, this, el));
      }
    );

    this.addCommand({
      id: "RubikCubeAlgo-add-code-block-template-3x3-OLL",
      name: "Add code block template for 3x3 cube: OLL.",
      editorCallback: (editor, view) => {
        editor.replaceSelection(CodeBlockInterpreter.get3by3OllTemplate());
      }
    });

    this.addCommand({
      id: "RubikCubeAlgo-add-code-block-template-3x3-PLL",
      name: "Add code block template for 3x3 cube: PLL.",
      editorCallback: (editor, view) => {
        editor.replaceSelection(CodeBlockInterpreter.get3by3PllTemplate());
      }
    });

    this.addSettingTab(
      new RubikCubeAlgoSettingsTab(
        this.app,
        this
      )
    );
  }

  onunload() {
  }

  async loadSettings() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.app.workspace.trigger(
      "rubik:rerender-markdown-code-block-processors"
    );
  }
};
