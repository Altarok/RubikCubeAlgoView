import {App, PluginSettingTab, Setting} from 'obsidian'
// import {App, PluginSettingTab, Setting, SettingDefinitionItem} from 'obsidian'
import RubikCubeAlgos from '../main'
import {RegEx} from '../parser/regex-util'

// import {Strings} from "../consts/strings";

export interface CubeColors {
  arrowColor: string
  cubeColor: string
}

export interface Settings extends CubeColors {
  cubeRotations: Record<string, number>
  acivateCommandQuickStartGuide: boolean
  acivateCommandCodeblockExamples: boolean
  acivateCommandCodeblockTemplates: boolean
}

export const DefaultSettings: Settings = {
  cubeColor: '#ffff00', /* yellow */
  arrowColor: '#0088ff', /* sky blue */
  cubeRotations: {},
  acivateCommandQuickStartGuide: true,
  acivateCommandCodeblockExamples: true,
  acivateCommandCodeblockTemplates: true
}

function addHashPrefixIfMissing(color: string) {
  if (!color.startsWith('#')) {
    color = `#${color}`
  }
  return color
}

function isValidColorInput(color: string): boolean {
  return RegEx.isColorHexValueWithOptionalPrefix(color)
}

export default class RubikCubeAlgoSettingsTab extends PluginSettingTab {
  tempColorInput: CubeColors

  // isNewSettingsAPI: boolean = false // TODO #v1.13.0

  constructor(app: App, readonly plugin: RubikCubeAlgos) {
    super(app, plugin)
    this.tempColorInput = {
      arrowColor: plugin.settings.arrowColor,
      cubeColor: plugin.settings.cubeColor
    }
  }

  // public getSettingDefinitions(): SettingDefinitionItem<string>[] {
  //   this.isNewSettingsAPI = true
  //
  //   return [
  //     { // start group: commands
  //       type: 'group',
  //       heading: 'Commands',
  //       items: [
  //         {
  //           name: Strings.SettingsUI.quickStartGuide.name,
  //           desc: Strings.SettingsUI.quickStartGuide.desc,
  //           control: {
  //             type: 'toggle',
  //             key: 'acivateCommandQuickStartGuide'
  //           }
  //         },
  //         {
  //           name: Strings.SettingsUI.examples.name,
  //           desc: Strings.SettingsUI.examples.desc,
  //           control: {
  //             type: 'toggle',
  //             key: 'acivateCommandCodeblockExamples'
  //           },
  //         },
  //         {
  //           name: Strings.SettingsUI.templates.name,
  //           desc: Strings.SettingsUI.templates.desc,
  //           control: {
  //             type: 'toggle',
  //             key: 'acivateCommandCodeblockTemplates'
  //           }
  //         },
  //         {
  //           name: Strings.SettingsUI.hint.name,
  //           desc: Strings.SettingsUI.hint.desc,
  //         },
  //       ],
  //     }, // end group: commands
  //     { // start group: colors
  //       type: 'group',
  //       heading: 'Colors',
  //       items: [
  //         {
  //           name: 'Color picker: Cube color',
  //           render: (setting: Setting) => {
  //             this.addColorSettingsCube(setting)
  //           },
  //         },
  //         {
  //           name: 'Color picker: Arrow color',
  //           render: (setting: Setting) => {
  //             this.addColorSettingsArrows(setting)
  //           },
  //         },
  //         {
  //           name: 'Button: reset default colors',
  //           render: (setting: Setting) => {
  //             this.addColorSettingsReset(setting)
  //           },
  //         },
  //         {
  //           name: Strings.SettingsUI.hint.name,
  //           desc: 'Colors update live on change. Click save to persist your choice.',
  //         },
  //       ],
  //     }, // end group: colors
  //   ];
  // }

  display(): void {
    // this.isNewSettingsAPI = false // TODO #v1.13.0

    const {containerEl} = this

    containerEl.empty()

    this.addQuickStartGuide(containerEl)
    this.addHorizontalSeparator(containerEl)
    // this.addColorSettingsHeader(containerEl)
    this.addColorSettingsCube(new Setting(containerEl))
    this.addColorSettingsArrows(new Setting(containerEl))
    this.addColorSettingsReset(new Setting(containerEl))
  }

  private addColorSettingsReset(setting: Setting) {
    setting.setName('Reset colors').setDesc('Restore default color values.')
      .addButton((cb) => cb
        .setButtonText('Reset')
        .setWarning() // TODO #v1.13.0 .setDestructive() // -> red
        .onClick(async () => {
          this.tempColorInput.cubeColor = DefaultSettings.cubeColor
          this.tempColorInput.arrowColor = DefaultSettings.arrowColor

          this.plugin.settings.cubeColor = DefaultSettings.cubeColor
          this.plugin.settings.arrowColor = DefaultSettings.arrowColor
          await this.plugin.saveSettings()
          this.updateGUI()
        })
      )
  }

  private addColorSettingsArrows(setting: Setting) {
    setting.setName('Arrow color').setDesc('Default color for algorithm arrows. Resets to #0088ff (sky blue).')
      .addText((text) => text
        .setValue(this.tempColorInput.arrowColor)
        .setDisabled(true))
      .addColorPicker(color => color
        .setValue(this.tempColorInput.arrowColor).onChange((value) => this.changeCurrentArrowColor(value)))
      .addExtraButton(button =>
        button.setTooltip('Save').setIcon('save').onClick(async () => {
            let isValid: boolean = isValidColorInput(this.tempColorInput.arrowColor)
            let valueToSafe = isValid ? addHashPrefixIfMissing(this.tempColorInput.arrowColor) : DefaultSettings.arrowColor
            this.tempColorInput.arrowColor = valueToSafe
            this.plugin.settings.arrowColor = valueToSafe
            await this.plugin.saveSettings()
            this.updateGUI()
          }
        ))
  }

  private addColorSettingsCube(setting: Setting) {
    setting
      .setName('Cube color')
      .setDesc('Default color for cube faces. Resets to #ffff00 (yellow).')
      .addText((text) => text
        .setValue(this.tempColorInput.cubeColor)
        .setDisabled(true))
      .addColorPicker(color => color.setValue(this.tempColorInput.cubeColor).onChange((value) => this.changeCurrentCubeColor(value)))
      .addExtraButton(button =>
        button.setTooltip('Save').setIcon('save').onClick(async () => {
            let isValid: boolean = isValidColorInput(this.tempColorInput.cubeColor)
            let valueToSafe = isValid ? addHashPrefixIfMissing(this.tempColorInput.cubeColor) : DefaultSettings.cubeColor
            this.tempColorInput.cubeColor = valueToSafe
            this.plugin.settings.cubeColor = valueToSafe
            await this.plugin.saveSettings()
            this.updateGUI()
          }
        ))
  }

  updateGUI() {
    // TODO #v1.13.0 .setDestructive() // -> red
    // if (this.isNewSettingsAPI) this.update()
    // else
    this.display()
  }

  private changeCurrentCubeColor(hexColor: string) {
    this.tempColorInput.cubeColor = hexColor
    if (isValidColorInput(hexColor)) {
      hexColor = addHashPrefixIfMissing(hexColor)
      if (this.plugin.settings.cubeColor !== hexColor) {
        this.plugin.settings.cubeColor = hexColor
        this.plugin.rerenderCodeblocks()
        this.updateGUI()
      }
    }
  }

  private changeCurrentArrowColor(hexColor: string) {
    this.tempColorInput.arrowColor = hexColor
    if (isValidColorInput(hexColor)) {
      hexColor = addHashPrefixIfMissing(hexColor)
      if (this.plugin.settings.arrowColor !== hexColor) {
        this.plugin.settings.arrowColor = hexColor
        this.plugin.rerenderCodeblocks()
        this.display()
      }
    }
  }

  // TODO #v1.13.0
  // private addColorSettingsHeader(containerEl: HTMLElement) {
  //   new Setting(containerEl).setName('Appearance defaults').setHeading()
  //   .setDesc('Values are validated and displayed on the fly. Save button persists to data.json.')
  // }

  private addHorizontalSeparator(containerEl: HTMLElement) {
    containerEl.createEl('hr')
  }

  private addQuickStartGuide(containerEl: HTMLElement) {
    new Setting(containerEl).setName('Commands').setDesc('Use "Cmd/Ctrl + P" and search "Rubik" to use built-in commands.')
    new Setting(containerEl).setName('Quick start guide').setDesc('Use command to add quick start guide to any note. (~10k characters)')
    new Setting(containerEl).setName('Just want finished code blocks?').setDesc('Use commands to insert complete OLL or PLL algorithm lists.')
    new Setting(containerEl).setName('Searching for templates?').setDesc('Use commands to insert code block templates with explanatory comments.')
    // new Setting(containerEl).setName('Notation').setDesc('Algorithm notation updates automatically when rotating.')
    // new Setting(containerEl).setName('Customization').setDesc('Set width, height (2-10), a'nd hex colors per block.')
  }
}
