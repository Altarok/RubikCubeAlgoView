import {Plugin} from "obsidian";
import {CodeBlockInterpreterOLL} from "./CodeBlockInterpreterOLL";
import {CodeBlockInterpreterPLL} from "./CodeBlockInterpreterPLL";
import {MarkdownPostProcessorOLL} from "./MarkdownPostProcessorOLL";
import {MarkdownPostProcessorPLL} from "./MarkdownPostProcessorPLL";
import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";

export default class RubikCubeAlgos extends Plugin {
  settings: RubikCubeAlgoSettingsTab;

  async onload() {

    await this.loadSettings();

    this.registerMarkdownCodeBlockProcessor("rubikCubeOLL",
      (source, el, ctx) => {
        ctx.addChild(new MarkdownPostProcessorOLL(source, this, el));
      }
    );

    this.registerMarkdownCodeBlockProcessor("rubikCubePLL",
      (source, el, ctx) => {
        ctx.addChild(new MarkdownPostProcessorPLL(source, this, el));
      }
    );

    this.addCommand({
      id: "RubikCubeAlgo-add-code-block-template-3x3-OLL",
      name: "Add code block template for 3x3 cube: OLL.",
      editorCallback: (editor, view) => {
        editor.replaceSelection(CodeBlockInterpreterOLL.get3by3CodeBlockTemplate());
      }
    });

    this.addCommand({
      id: "RubikCubeAlgo-add-code-block-template-3x3-PLL",
      name: "Add code block template for 3x3 cube: PLL.",
      editorCallback: (editor, view) => {
        editor.replaceSelection(CodeBlockInterpreterPLL.get3by3CodeBlockTemplate());
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.app.workspace.trigger(
      "rubik:rerender-markdown-code-block-processors"
    );
  }
};
