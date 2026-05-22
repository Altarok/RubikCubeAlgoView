import {Plugin} from "obsidian"
import {MarkdownProcessorOll} from "./markdown-processor-oll"
import {MarkdownProcessorPll} from "./markdown-processor-pll"
import RubikCubeAlgoSettingsTab, {DefaultSettings, Settings} from "./settings/plugin-settings-tab"
import {addAppCommands} from "./plugin-command-builder"
import {MarkdownProcessorSpeedcubingTimer} from "./markdown-processor-timer"
import {SpeedCubingResultTableRenderChild} from "./markdown-processor-timer-results"

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
 * ## Default consts
 * - [ ] remove consts.json from release
 * - [ ] replace it with hardcoded values
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
 * - [x] SpeedCubing timer
 *   - [x] SpeedCubing result table
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
  settings!: Settings

  async onload() {

    await this.loadSettings()

    this.registerMarkdownCodeBlockProcessors()

    addAppCommands(this)

    this.addSettingTab(new RubikCubeAlgoSettingsTab(this.app, this))
  }

  onunload() {
  }

  async loadSettings() {
    let loadedData: Partial<Settings> = (await this.loadData()) as Partial<Settings> || {}
    this.settings = Object.assign({}, DefaultSettings, loadedData || {})
  }

  async saveSettings() {
    await this.saveData(this.settings)
    this.rerenderCodeblocks()
  }

  rerenderCodeblocks(): void {
    this.app.workspace.trigger("rubik:rerender-markdown-code-block-processors")
  }

  saveSettingsSync() {
    /* Trigger the save but don't 'await' it. It runs in the background. */
    void this.saveSettings()
    // .then(() => console.debug("Save successful"))
    // .catch(err => console.error("Save failed", err))
  }

  private registerMarkdownCodeBlockProcessors() {

    this.registerMarkdownCodeBlockProcessor("rubikCubeOLL",
      (source, el, ctx) => {
        ctx.addChild(new MarkdownProcessorOll(source, this, el))
      })

    this.registerMarkdownCodeBlockProcessor("rubikCubePLL",
      (source, el, ctx) => {
        ctx.addChild(new MarkdownProcessorPll(source, this, el))
      })

    this.registerMarkdownCodeBlockProcessor('speedcubingTimer',
      (source, el, ctx) => {
        ctx.addChild(new MarkdownProcessorSpeedcubingTimer(source, this, el, ctx))
      })

    this.registerMarkdownCodeBlockProcessor('speedcubingResults',
      (source, el, ctx) => {
        ctx.addChild(new SpeedCubingResultTableRenderChild(source, this, el, ctx))
      })
  }
}
