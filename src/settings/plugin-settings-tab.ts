import {App, PluginSettingTab, Setting} from "obsidian";
import RubikCubeAlgos from "../main";

export interface CubeColors {
  arrowColor: string;
  cubeColor: string;
}

export interface Settings extends CubeColors {
  cubeRotations: Record<string, number>;
  knownIds: Record<string, string>;
}

export const DefaultSettings: Settings = {
  cubeColor: '#ff0', /* yellow for cube */
  arrowColor: '#08f', /* sky blue for arrows */
  cubeRotations: {},
  knownIds: {}
}

function addHashPrefixIfMissing(color: string) {
  if (!color.startsWith('#')) {
    color = `#${color}`
  }
  return color
}

/* TODO move to regex class */
const validColorPattern = '^#?([a-f0-9]{3}){1,2}$';

function isValidColorInput(color: string): boolean {
  return color.match(validColorPattern) !== null
}

export default class RubikCubeAlgoSettingsTab extends PluginSettingTab {
  tempColorInput: CubeColors

  constructor(app: App, readonly plugin: RubikCubeAlgos) {
    super(app, plugin);
    this.tempColorInput = {
      arrowColor: plugin.settings.arrowColor,
      cubeColor: plugin.settings.cubeColor
    }
  }

  display(): void {

    const {containerEl} = this;

    containerEl.empty();

    this.addQuickStartGuide(containerEl);
    this.addTipForLazyUser(containerEl);
    this.addHorizontalSeparator(containerEl);
    this.addColorSettingsHeader(containerEl);
    this.addColorSettingsCube(containerEl);
    this.addColorSettingsArrows(containerEl);
    this.addColorSettingsReset(containerEl);
  }

  private addColorSettingsReset(containerEl: HTMLElement) {
    new Setting(containerEl).setName('Reset colors')
      .setDesc('Restore colors to their default values.')
      .addButton((cb) => cb
        .setButtonText('Reset')
        .setWarning() // -> red
        .onClick(async () => {
          this.plugin.settings.cubeColor = DefaultSettings.cubeColor;
          this.plugin.settings.arrowColor = DefaultSettings.arrowColor;
          await this.plugin.saveSettings();
          this.display();
        })
      );
  }

  private addColorSettingsArrows(containerEl: HTMLElement) {
    new Setting(containerEl)
      .setName('Arrow color')
      .setDesc('Default color for algorithm arrows. Resets to #08f if invalid. (sky blue)')
      .addText((text) => text
        .setPlaceholder('3 or 6 digit hex value')
        .setValue(this.plugin.settings.arrowColor)
        .onChange((value) => {
            this.tempColorInput.arrowColor = value;
            if (isValidColorInput(value)) {
              value = addHashPrefixIfMissing(value);
              if (this.plugin.settings.arrowColor !== value) {
                this.plugin.settings.arrowColor = value;
                this.plugin.rerenderCodeblocks()
                this.display();
              }
            }
          }
        ))
      .addExtraButton(button => button
        .setTooltip('Save to data.json')
        .setIcon('save')
        .onClick(async () => {
            let isValid: boolean = isValidColorInput(this.tempColorInput.arrowColor)
            let valueToSafe = isValid ? addHashPrefixIfMissing(this.tempColorInput.arrowColor) : DefaultSettings.arrowColor
            this.tempColorInput.arrowColor = valueToSafe
            this.plugin.settings.arrowColor = valueToSafe;
            await this.plugin.saveSettings();
            this.display();
          }
        ))
  }

  private addColorSettingsCube(containerEl: HTMLElement) {
    new Setting(containerEl)
      .setName('Cube color')
      .setDesc('Default color for cube faces. Resets to #ff0 if invalid. (yellow)')
      .addText((text) => text
        .setPlaceholder('3 or 6 digit hex value')
        .setValue(this.plugin.settings.cubeColor)
        .onChange((value) => {
            this.tempColorInput.cubeColor = value;
            if (isValidColorInput(value)) {
              value = addHashPrefixIfMissing(value);
              if (this.plugin.settings.cubeColor !== value) {
                this.plugin.settings.cubeColor = value;
                this.plugin.rerenderCodeblocks()
                this.display();
              }
            }
          }
        ))
      .addExtraButton(button => button
        .setTooltip('Save to data.json')
        .setIcon('save')
        .onClick(async () => {
            let isValid: boolean = isValidColorInput(this.tempColorInput.cubeColor)
            let valueToSafe = isValid ? addHashPrefixIfMissing(this.tempColorInput.cubeColor) : DefaultSettings.cubeColor
            this.tempColorInput.cubeColor = valueToSafe
            this.plugin.settings.cubeColor = valueToSafe;
            await this.plugin.saveSettings();
            this.display();
          }
        ))
  }

  private addColorSettingsHeader(containerEl: HTMLElement) {
    new Setting(containerEl).setName('Appearance defaults').setHeading()
      .setDesc('Values are validated and displayed on the fly. Save button persists to data.json.')
  }

  private addHorizontalSeparator(containerEl: HTMLElement) {
    containerEl.createEl('hr')
  }

  private addTipForLazyUser(containerEl: HTMLElement) {
    new Setting(containerEl)
      .setName('Lazy? :)')
      .setDesc(`Copy full OLL and PLL examples files from the repository's examples folder.`)
  }

  private addQuickStartGuide(containerEl: HTMLElement) {
    new Setting(containerEl).setName('Quick start guide')
    new Setting(containerEl).setName('Commands').setDesc('Use "Cmd/Ctrl + P" and search "Rubik" to insert templates.')
    new Setting(containerEl).setName('Notation').setDesc('Algorithm notation updates automatically when rotating.')
    new Setting(containerEl).setName('Customization').setDesc('Set width, height (2-10), and hex colors per block.')

  }
}
