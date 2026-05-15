import {App, PluginSettingTab, Setting} from "obsidian"
import RubikCubeAlgos from "../main"
import {RegEx} from "../parser/regex-util";

export interface CubeColors {
  arrowColor: string
  cubeColor: string
}

export interface Settings extends CubeColors {
  cubeRotations: Record<string, number>
}

export const DefaultSettings: Settings = {
  cubeColor: '#ffff00', /* yellow */
  arrowColor: '#0088ff', /* sky blue */
  cubeRotations: {}
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

  constructor(app: App, readonly plugin: RubikCubeAlgos) {
    super(app, plugin)
    this.tempColorInput = {
      arrowColor: plugin.settings.arrowColor,
      cubeColor: plugin.settings.cubeColor
    }
  }

  display(): void {

    const {containerEl} = this

    containerEl.empty()

    this.addQuickStartGuide(containerEl)
    this.addHorizontalSeparator(containerEl)
    this.addColorSettingsHeader(containerEl)
    this.addColorSettingsCube(containerEl)
    this.addColorSettingsArrows(containerEl)
    this.addColorSettingsReset(containerEl)
  }

  private addColorSettingsReset(containerEl: HTMLElement) {
    new Setting(containerEl).setName('Reset colors')
      .setDesc('Restore colors to their default values.')
      .addButton((cb) => cb
        .setButtonText('Reset')
        .setWarning() // -> red
        .onClick(async () => {
          this.tempColorInput.cubeColor = DefaultSettings.cubeColor
          this.tempColorInput.arrowColor = DefaultSettings.arrowColor

          this.plugin.settings.cubeColor = DefaultSettings.cubeColor
          this.plugin.settings.arrowColor = DefaultSettings.arrowColor
          await this.plugin.saveSettings()
          this.display()
        })
      )
  }

  private addColorSettingsArrows(containerEl: HTMLElement) {
    new Setting(containerEl)
      .setName('Arrow color')
      .setDesc('Default color for algorithm arrows. Resets to #0088ff if invalid. (sky blue)')
      .addText((text) => text
        .setPlaceholder('3 or 6 digit hex value')
        .setValue(this.tempColorInput.arrowColor).onChange((value) => this.changeCurrentArrowColor(value))
      )
      .addColorPicker(color => color
        .setValue(this.tempColorInput.arrowColor).onChange((value) => this.changeCurrentArrowColor(value))
      )
      .addExtraButton(button => button
        .setTooltip('Save to consts.json')
        .setIcon('save')
        .onClick(async () => {
            let isValid: boolean = isValidColorInput(this.tempColorInput.arrowColor)
            let valueToSafe = isValid ? addHashPrefixIfMissing(this.tempColorInput.arrowColor) : DefaultSettings.arrowColor
            this.tempColorInput.arrowColor = valueToSafe
            this.plugin.settings.arrowColor = valueToSafe
            await this.plugin.saveSettings()
            this.display()
          }
        ))
  }

  private addColorSettingsCube(containerEl: HTMLElement) {
    new Setting(containerEl)
      .setName('Cube color')
      .setDesc('Default color for cube faces. Resets to #ffff00 if invalid. (yellow)')
      .addText((text) => text
        .setPlaceholder('3 or 6 digit hex value')
        .setValue(this.tempColorInput.cubeColor).onChange((value) => this.changeCurrentCubeColor(value))
      )
      .addColorPicker(color => color
        .setValue(this.tempColorInput.cubeColor).onChange((value) => this.changeCurrentCubeColor(value))
      )
      .addExtraButton(button => button
        .setTooltip('Save to consts.json')
        .setIcon('save')
        .onClick(async () => {
            let isValid: boolean = isValidColorInput(this.tempColorInput.cubeColor)
            let valueToSafe = isValid ? addHashPrefixIfMissing(this.tempColorInput.cubeColor) : DefaultSettings.cubeColor
            this.tempColorInput.cubeColor = valueToSafe
            this.plugin.settings.cubeColor = valueToSafe
            await this.plugin.saveSettings()
            this.display()
          }
        ))
  }

  private changeCurrentCubeColor(hexColor: string) {
    this.tempColorInput.cubeColor = hexColor
    if (isValidColorInput(hexColor)) {
      hexColor = addHashPrefixIfMissing(hexColor)
      if (this.plugin.settings.cubeColor !== hexColor) {
        this.plugin.settings.cubeColor = hexColor
        this.plugin.rerenderCodeblocks()
        this.display()
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

  private addColorSettingsHeader(containerEl: HTMLElement) {
    new Setting(containerEl).setName('Appearance defaults').setHeading()
      .setDesc('Values are validated and displayed on the fly. Save button persists to consts.json.')
  }

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
