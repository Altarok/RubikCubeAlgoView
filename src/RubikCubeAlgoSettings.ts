import {App, PluginSettingTab, Setting} from "obsidian";
import RubikCubeAlgos from "./main";

export const DEFAULT_SETTINGS = {
  CUBE_COLOR: "#ff0", /* yellow for cube */
  ARROW_COLOR: "#08f" /* sky blue for arrows */
};

export class RubikCubeAlgoSettingsTab extends PluginSettingTab {
  plugin: RubikCubeAlgos;
  cubeColor: string;
  arrowColor: string;

  constructor(app: App, plugin: RubikCubeAlgos) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {

    const {containerEl} = this;

    containerEl.empty();

    new Setting(containerEl)
    .setName('Default cube color')
    .setDesc('Starting value: #ff0 (yellow)')
    .addText((text) => text
    .setPlaceholder('3 or 6 digit hex value')
    .setValue(this.plugin.settings.cubeColor)
    .onChange(async (value) => {
        if (value.match('^#([a-f0-9]{3}){1,2}$')) {
          this.plugin.settings.cubeColor = value;
        } else {
          this.plugin.settings.cubeColor = DEFAULT_SETTINGS.CUBE_COLOR;
        }
        await this.plugin.saveSettings();
      }
    ));

    new Setting(containerEl)
    .setName('Default arrow color')
    .setDesc('Starting value: #08f (sky blue)')
    .addText((text) => text
    .setPlaceholder('3 or 6 digit hex value')
    .setValue(this.plugin.settings.arrowColor)
    .onChange(async (value) => {
        if (value.match('^#([a-f0-9]{3}){1,2}$')) {
          this.plugin.settings.arrowColor = value;
        } else {
          this.plugin.settings.arrowColor = DEFAULT_SETTINGS.ARROW_COLOR;
        }
        await this.plugin.saveSettings();
      }
    ));
  }
}
