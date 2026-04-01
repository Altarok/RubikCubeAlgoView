import {Plugin} from "obsidian";
import {MarkdownPostProcessorOLL} from "./MarkdownPostProcessorOLL";
import {MarkdownPostProcessorPLL} from "./MarkdownPostProcessorPLL";
import {DefaultSettings, RubikCubeAlgoSettingsTab} from "./settings/RubikCubeAlgoSettings";
import {Templates} from "./model/templates";

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
 * - [x] remove 'y0'
 * - [ ] validate actual OLL input
 *
 * ## Rotation
 * - [x] Change cube rotation to integer type [0-3] // to be multiplied by 90 degrees
 *   - turn left -> rotation = (rotation + delta + 4) % 4, then apply rotation
 *   - turn right -> rotation = (rotation - delta + 4) % 4, then apply rotation
 *
 * # Input
 * - [x] PLL with dimensions
 * - [x] OLL with and w/o color
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
 * - [ ] add flag: 'keep-y-prefix' -> change y on parsing, keep rest
 *   - do not change algorithm on rotation, only the amount of y prefix
 *   - add rotation as parameter to method Algorithm.toString when using flag 'keep-y-prefix'. Skip y when #y = currentRotation
 * - [ ] add flag: 'do-not-auto-remove-y-prefix' -> automatically swallow y prefix on parsing
 * - [ ] add flag: 'point-mirrored'
 * - [ ] add flag: 'axis-mirrored' vertical a/o(?) horizontal
 * - [x] add flag: 'no-buttons'
 *
 * # GUI
 * - [x] Button: rotate cube
 * - [x] Button: reset cube rotation
 * - [x] Button: save rotation as default
 * - [ ] Button: save algorithm as default
 * - [ ] Button: mirror algorithm vertically (when allowed by flag)
 * - [x] Button: lock rotation
 * - [ ] Shorten cross arrows by ~10% (see OLL-37, alg 2) -> could/should reduce confusion
 *
 * # Unit tests
 * - [x] setup env
 *   - [x] add vitest to imported packages
 *   - [x] npm audit, npm update
 * - [x] create first test file
 * - [ ] test most notorious files
 *   - [ ] parser.ts -> parser.test.ts
 *   - [x] geometry-builder.ts
 *   - [x] string-util.ts
 */
export default class RubikCubeAlgos extends Plugin {
  settings: RubikCubeAlgoSettingsTab;

  async onload() {

    // console.log('>> onload');

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
      id: 'RubikCubeAlgo-add-code-block-template-3x3-OLL',
      // eslint-disable-next-line obsidianmd/ui/sentence-case
      name: 'Add OLL code block template for 3x3 cube.',
      editorCallback: (editor) => {
        editor.replaceSelection(Templates.OLL_CodeBlock);
      }
    });

    this.addCommand({
      id: 'RubikCubeAlgo-add-code-block-template-3x3-PLL',
      // eslint-disable-next-line obsidianmd/ui/sentence-case
      name: 'Add PLL code block template for 3x3 cube.',
      editorCallback: (editor) => {
        editor.replaceSelection(Templates.PLL_CodeBlock);
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
    const loadedData = await this.loadData();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.settings = Object.assign({}, DefaultSettings, loadedData);

    // Convert the plain object from JSON back into a Map
    this.settings.cubeRotations = new Map(Object.entries(loadedData?.cubeRotations || {}));
    this.settings.knownIds = new Map(Object.entries(loadedData?.knownIds || {}));
  }

  async saveSettings() {
    const storageData = {
      ...this.settings,
      cubeRotations: Object.fromEntries(this.settings.cubeRotations)
    };

    await this.saveData(storageData);
    this.app.workspace.trigger("rubik:rerender-markdown-code-block-processors");
    // console.debug('Settings updated');
  }

  saveSettingsSync() {
    // Trigger the save but don't 'await' it. It runs in the background.
    this.saveSettings()
    // .then(() => console.debug("Save successful"))
    // .catch(err => console.error("Save failed", err));
  }
}
