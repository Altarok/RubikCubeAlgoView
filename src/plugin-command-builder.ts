import {Plugin} from "obsidian";
import {quickStartGuide} from "./consts/quick-start-guide";
import {CodeBlocks} from "./consts/ready-to-use-code-blocks";

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
    name: 'Add PLL code block template for 3x3 cube.',
    editorCallback: (editor) => {
      editor.replaceSelection(CodeBlocks.template_3x3_pll);
    }
  });

  plugin.addCommand({
    id: 'RubikCubeAlgo-add-pll-codeblocks-for-domino-cube',
    name: `Add partial PLL algorithm list for a ${dominoCube}. (21 code blocks)`,
    editorCallback: (editor) => {
      editor.replaceSelection(CodeBlocks.dominoCube_4_PllAlgorithms);
    }
  });

  plugin.addCommand({
    id: 'RubikCubeAlgo-add-pll-codeblocks-for-rubik-cube',
    name: `Add complete PLL algorithm list for a ${rubikCube}. (21 code blocks)`,
    editorCallback: (editor) => {
      editor.replaceSelection(CodeBlocks.rubikCube_21_PllAlgorithms);
    }
  });

  plugin.addCommand({
    id: 'RubikCubeAlgo-add-oll-codeblocks-for-rubik-cube',
    name: `Add complete OLL algorithm list for a ${rubikCube}. (57 code blocks)`,
    editorCallback: (editor) => {
      editor.replaceSelection(CodeBlocks.rubikCube_57_OllAlgorithms);
    }
  });

  plugin.addCommand({
    id: 'RubikCubeAlgo-add-quick-start-guide',
    name: 'Insert quick start guide. (~10k characters)',
    editorCallback: (editor) => {
      editor.replaceSelection(quickStartGuide);
    }
  });
}
