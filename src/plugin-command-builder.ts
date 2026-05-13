import {Plugin} from "obsidian";
import {CodeBlocks} from "./model/templates";

const dominoCube: string = 'Domino Cube (3x3x2)'
const rubikCube: string = 'Rubik Cube'

/**
 * Add commands for plugin.
 */
export function addAppCommands(plugin: Plugin): void {

  plugin.addCommand({
    id: 'RubikCubeAlgo-add-code-block-template-3x3-OLL',
    name: 'Add OLL code block template for 3x3 cube',
    editorCallback: (editor) => {
      editor.replaceSelection(CodeBlocks.template_3x3_oll);
    }
  });

  plugin.addCommand({
    id: 'RubikCubeAlgo-add-code-block-template-3x3-PLL',
    name: 'Add PLL code block template for 3x3 cube',
    editorCallback: (editor) => {
      editor.replaceSelection(CodeBlocks.template_3x3_pll);
    }
  });

  plugin.addCommand({
    id: 'RubikCubeAlgo-add-codeblocks-for-3x3x2-PLL',
    name: `Add 4 PLL examples for a ${dominoCube} (partial list)`,
    editorCallback: (editor) => {
      editor.replaceSelection(CodeBlocks.dominoCube_4_PllAlgorithms);
    }
  });

  plugin.addCommand({
    id: 'RubikCubeAlgo-add-codeblocks-for-3x3x2-PLL',
    name: `Add 21 PLL examples for a ${rubikCube} (complete list)`,
    editorCallback: (editor) => {
      editor.replaceSelection(CodeBlocks.dominoCube_4_PllAlgorithms);
    }
  });

}
