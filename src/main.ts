import {Platform, Plugin} from 'obsidian'
import {MarkdownProcessorOll} from './markdown-processor-oll'
import {MarkdownProcessorPll} from './markdown-processor-pll'
import RubikCubeAlgoSettingsTab, {DefaultSettings, Settings} from './settings/plugin-settings-tab'
import {addAppCommands} from './command-builder'
import {MarkdownProcessorSpeedcubingTimer} from './markdown-processor-timer'
import SpeedCubingResultTableRenderChild from './markdown-processor-timer-results'
import {Strings} from './consts/strings'
import {CodeBlockCreatorModal} from "./view/code-block-generator-modal";

export default class RubikCubeAlgos extends Plugin {
  settings!: Settings

  async onload() {

    await this.loadSettings()

    this.registerMarkdownCodeBlockProcessors()

    this.addSettingTab(new RubikCubeAlgoSettingsTab(this.app, this))

    addAppCommands(this)

    if (!Platform.isMobile) {

      this.addRibbonIcon('lucide-blocks', 'Rubik Cube algorithms: Open code block creator', () => {
        this.showCodeBlockCreator()
      });
    }
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
    this.app.workspace.trigger(Strings.Events.rerenderCodeBlocks)
  }

  saveSettingsSync() {
    /* Trigger the save but don't 'await' it. It runs in the background. */
    void this.saveSettings()
    // .then(() => console.debug('Save successful'))
    // .catch(err => console.error('Save failed', err))
  }

  private registerMarkdownCodeBlockProcessors() {

    this.registerMarkdownCodeBlockProcessor(Strings.MarkdownCodeBlockNames.cubes.oll,
      (source, el, ctx) => {
        ctx.addChild(new MarkdownProcessorOll(source, this, el))
      })

    this.registerMarkdownCodeBlockProcessor(Strings.MarkdownCodeBlockNames.cubes.pll,
      (source, el, ctx) => {
        ctx.addChild(new MarkdownProcessorPll(source, this, el))
      })

    this.registerMarkdownCodeBlockProcessor(Strings.MarkdownCodeBlockNames.speedubing.timer,
      (source, el, ctx) => {
        ctx.addChild(new MarkdownProcessorSpeedcubingTimer(source, this, el, ctx))
      })

    this.registerMarkdownCodeBlockProcessor(Strings.MarkdownCodeBlockNames.speedubing.results,
      (source, el, ctx) => {
        ctx.addChild(new SpeedCubingResultTableRenderChild(source, this, el, ctx))
      })
  }

  private showCodeBlockCreator() {
    new CodeBlockCreatorModal(this.app, this).open()
  }
}
