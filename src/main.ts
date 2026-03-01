import {Plugin} from "obsidian";
import {CodeBlockInterpreter} from "./CodeBlockInterpreter";
import {MarkdownPostProcessorOLL} from "./MarkdownPostProcessorOLL";
import {MarkdownPostProcessorPLL} from "./MarkdownPostProcessorPLL";
import {DEFAULT_SETTINGS, RubikCubeAlgoSettingsTab} from "./RubikCubeAlgoSettings";


/*
 * - [x] change algorithm key (number to string) to be able to get the right one without knowing its index
 *   - [x] add hash() method to sub class Algorithm
 * - [x] remove 'y' after rotation
 * - [x] add flag: no-rotation, with svg in center sticker "no location change"
 * - [x] added mobile support with a lot of AI-inspired CSS changes
 *   - [ ] remove redundant CSS
 * - [ ] remove 'y0' 
 */
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
      // @ts-ignore
      name: "Add code block template for 3x3 cube: OLL.",
      editorCallback: (editor, view) => {
        editor.replaceSelection(CodeBlockInterpreter.get3by3OllTemplate());
      }
    });

    this.addCommand({
      id: "RubikCubeAlgo-add-code-block-template-3x3-PLL",
      // @ts-ignore
      name: "Add code block template for 3x3 cube: PLL.",
      editorCallback: (editor, view) => {
        editor.replaceSelection(CodeBlockInterpreter.get3by3PllTemplate());
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
