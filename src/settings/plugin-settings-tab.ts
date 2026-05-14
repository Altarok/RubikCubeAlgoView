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

export class RubikCubeAlgoSettingsTab extends PluginSettingTab implements Settings {
  plugin: RubikCubeAlgos;
  arrowColor!: string;
  cubeColor!: string;
  /**
   * key: string with cube hash(?)
   * value: rotation
   */
  cubeRotations = {} as Record<string, number>;
  knownIds = {} as Record<string, string>;

  constructor(app: App, plugin: RubikCubeAlgos) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {

    const {containerEl} = this;

    containerEl.empty();

    new Setting(containerEl).setName('Appearance defaults').setHeading()

    new Setting(containerEl).setName('Cube color')
      .setDesc('Default hex color for cube faces. Resets to #ff0 if invalid. (yellow)')
      .addText((text) => text
        .setPlaceholder('3 or 6 digit hex value')
        .setValue(this.plugin.settings.cubeColor)
        .onChange(async (value) => {
            if (value.match('^#?([a-f0-9]{3}){1,2}$')) {
              value = addHashPrefixIfMissing(value);
              if (this.plugin.settings.cubeColor !== value) {
                this.plugin.settings.cubeColor = value;
                await this.plugin.saveSettings();
                this.display(); // Refresh the settings UI to show the new values
              }
              // } else {
              //   this.plugin.settings.cubeColor = DefaultSettings.cubeColor;
            }
            // await this.plugin.saveSettings();
            // this.display(); // Refresh the settings UI to show the new values
          }
        ));

    new Setting(containerEl).setName('Arrow color')
      .setDesc('Default hex color for algorithm arrows. Resets to #08f if invalid. (sky blue)')
      .addText((text) => text
        .setPlaceholder('3 or 6 digit hex value')
        .setValue(this.plugin.settings.arrowColor)
        .onChange(async (value) => {
            if (value.match('^#?([a-f0-9]{3}){1,2}$')) {
              value = addHashPrefixIfMissing(value);
              if (this.plugin.settings.arrowColor !== value) {
                this.plugin.settings.arrowColor = value;
                await this.plugin.saveSettings();
                this.display(); // Refresh the settings UI to show the new values
              }
              // } else {
              //   this.plugin.settings.arrowColor = DefaultSettings.arrowColor;
            }
            // await this.plugin.saveSettings();
            // this.display(); // Refresh the settings UI to show the new values
          }
        ));

    new Setting(containerEl).setName('Reset colors')
      .setDesc('Restore colors to their default values.')
      .addButton((cb) => cb
        .setButtonText('Reset')
        .setWarning() // Makes the button red to show it's an "action"
        .onClick(async () => {
          this.plugin.settings.cubeColor = DefaultSettings.cubeColor;
          this.plugin.settings.arrowColor = DefaultSettings.arrowColor;
          await this.plugin.saveSettings();
          this.display(); // Refresh the settings UI to show the new values
        })
      );
  }


}


