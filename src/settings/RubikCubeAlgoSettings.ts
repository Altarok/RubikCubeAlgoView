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

export const DefaultSettings = {
  CUBE_COLOR: '#ff0', /* yellow for cube */
  ARROW_COLOR: '#08f', /* sky blue for arrows */
  cubeRotations: {},
  knownIds: {}
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

    new Setting(containerEl)
    .setName('Default cube color')
    .setDesc('Starting value: #ff0 (yellow)')
    .addText((text) => text
    .setPlaceholder('3 or 6 digit hex value')
    .setValue(this.cubeColor)
    .onChange(async (value) => {
        if (value.match('^#([a-f0-9]{3}){1,2}$')) {
          this.cubeColor = value;
          // console.info('Change default cube color: ' + this.cubeColor);
        } else {
          this.cubeColor = DefaultSettings.CUBE_COLOR;
          // console.info('Reset default cube color: ' + this.cubeColor);
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
          this.arrowColor = value;
        } else {
          this.arrowColor = DefaultSettings.ARROW_COLOR;
        }
        await this.plugin.saveSettings();
      }
    ));
  }
}


