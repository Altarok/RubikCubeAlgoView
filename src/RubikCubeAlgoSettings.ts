import { App, PluginSettingTab, Setting } from "obsidian";
import RubikCubeAlgos from "./main";

export const DEFAULT_SETTINGS = {
	CUBE_COLOR: "#ff0", /* yellow for cube */
	ARROW_COLOR: "#08f" /* sky blue for arrows */
};

export class RubikCubeAlgoSettingsTab extends PluginSettingTab {
	
	constructor(app, plugin) {
		super(app, plugin);
		this.plugin = plugin;
	}
	 
	display() {
		
		const { containerEl } = this;
	
		containerEl.empty();
	
		new import_obsidian.Setting(containerEl)
			.setName("Default cube color")
			.setDesc("Starting value: #ff0 (yellow)")
			.addText((text) => text
				.setPlaceholder("3 or 6 digit hex value") 
				.setValue(this.plugin.settings.cubeColor)
				.onChange(async (value) => {
					if (value.match("^#([a-f0-9]{3}){1,2}$")) {
						this.plugin.settings.cubeColor = value;
						await this.plugin.saveSettings();
					}
				}
		));
	
		new import_obsidian.Setting(containerEl)
			.setName("Default arrow color")
			.setDesc("Starting value: #08f (sky blue)")
			.addText((text) => text
				.setPlaceholder("3 or 6 digit hex value")
				.setValue(this.plugin.settings.arrowColor)
				.onChange(async (value) => {
					if (value.match("^#([a-f0-9]{3}){1,2}$")) {
						this.plugin.settings.arrowColor = value;
						await this.plugin.saveSettings();
					}
				}
		));
	}
};