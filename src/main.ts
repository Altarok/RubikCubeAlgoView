import { MarkdownRenderChild, Plugin, App } from "obsidian";
import { OLL } from "./RCA-OLL-Calculations";
import { PLL } from "./RCA-PLL-Calculations";
import { OLLView } from "./RCA-OLL-MarkdownPostProcessor";
import { PLLView } from "./RCA-PLL-MarkdownPostProcessor";
import { DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab } from "./RubikCubeAlgoSettings";

// src/main.ts
export default class RubikCubeAlgos extends Plugin {
	
	async onload() {
	 
		await this.loadSettings();

	
		this.registerMarkdownCodeBlockProcessor( "rubikCubeOLL",
			(source, el, ctx) => {
				ctx.addChild(new OLLView(source, this, el));
			}
		);
	
		this.registerMarkdownCodeBlockProcessor( "rubikCubePLL",
			(source, el, ctx) => {
				ctx.addChild(new PLLView(source, this, el));
			}
		);
		
		this.addCommand({
			id: "RubikCubeAlgo-add-codeblock-template-3x3-OLL",
			name: "Add codeblock template: 3x3 OLL",
			editorCallback: (editor, view) => {
				editor.replaceSelection(OLL.get3by3CodeBlockTemplate());
			}
		});
	
		this.addCommand({
			id: "RubikCubeAlgo-add-codeblock-template-3x3-PLL",
			name: "Add codeblock template: 3x3 PLL",
			editorCallback: (editor, view) => {
				editor.replaceSelection(PLL.get3by3CodeBlockTemplate());
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
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}
	
	async saveSettings() {
		await this.saveData(this.settings);
		this.app.workspace.trigger(
			"rubik:rerender-markdown-code-block-processors"
		);
	}
};
