import RubikCubeAlgos from '../main'
import {App, Modal} from 'obsidian'
// import {GenericModal, MandatoryInput, OptionalInput, OutputData} from '@Altarok/obsidian-dev-utils/src'
import {Settings} from '../settings/plugin-settings-tab'
import {MandatoryInput, OptionalInput, OutputData} from "../EXTERNAL/code-block-creator-types";
import {GenericModal} from "../EXTERNAL/code-block-creator-modal";
import {Flags} from "../model/flags";
import {knownOllIds, knownPllIds} from "../consts/predefined-cases";

// npm update @Altarok/obsidian-dev-utils
export class CodeBlockCreatorModal extends Modal {
  constructor(public readonly app: App, public readonly plugin: RubikCubeAlgos) {
    super(app)
  }

  onOpen() {
    const {contentEl} = this
    contentEl.empty()

    /* Copy global settings */
    const globalSettings: Record<string, string> = {}
    globalSettings['codeBlockId'] = ''
    globalSettings['width'] = '3'
    globalSettings['height'] = '3'
    globalSettings['cubeColor'] = this.plugin.settings.cubeColor
    globalSettings['arrowColor'] = this.plugin.settings.arrowColor
    globalSettings['flags'] = ''
    globalSettings['setup'] = ''
    globalSettings['arrows'] = ''

    const localSettings: Record<string, OutputData> = {}

    const mandatoryInput: Readonly<MandatoryInput>[] = createMandatoryInput()
    const optionalInput: Readonly<OptionalInput>[] = createOptionalInput(this.plugin.settings)

    new GenericModal(contentEl,
      {
        pluginName: `Rubik's Cube algorithms`,
        codeBlockId: 'rubikCube',
        mandatory: mandatoryInput,
        optional: optionalInput,
        output: localSettings,
        // createCodeBlock: (): string => {
        //   let code = ''
        //   const codeBlockId = localSettings.codeBlockId
        //   /* add main smiles notation */
        //   // if (localSettings.codeBlockId) code += `${localSettings.codeBlockId}\n`
        //
        //   if (localSettings.width || localSettings.height) {
        //     code += `dimension:${localSettings.width ?? 3},${localSettings.height ?? 3}\n`
        //   }
        //
        //   return `\`\`\`${codeBlockId}\n${code}\`\`\``
        // },
        onUpdatePreview: (previewEl: HTMLElement): void => {
          previewEl.empty()
        }
      }).display()

    contentEl.focus()
  }

  onClose() {
    this.contentEl.empty()
  }
}

function createMandatoryInput(): Readonly<MandatoryInput>[] {
  return [
    // {
    //   type: 'dropdown',
    //   prompt: 'Choose type of cube',
    //   key: 'codeBlockId',
    //   current: 'rubikCubePLL',
    //   dropdownOptions: ['rubikCubePLL', 'rubikCubeOLL'] as const
    // }
  ]
}

function createOptionalInput(pluginSettings: Settings): Readonly<OptionalInput>[] {
  return [
    {
      type: 'conditional', prompt: 'Choose cube and algorithm.',
      key: 'id', current: undefined,
      nestedInput: [
        {
          option: "Rubik's Cube (OLL algorithm)",
          dropdown: {
            type: 'dropdown', prompt: 'OLL algorithm.', key: '-',
            current: 'oll-1',
            dropdownOptions: knownOllIds
          }
        },
        {
          option: "Rubik's Cube (PLL algorithm)",
          dropdown: {
            type: 'dropdown', prompt: 'PLL algorithm.', key: '-',
            current: 'pll-1',
            dropdownOptions: knownPllIds
          }
        }
      ]
    },
    {
      type: 'expandable', prompt: 'Choose colors.',
      nestedInput: [
        {
          type: 'color',
          prompt: 'Cube color',
          key: 'cubeColor',
          current: pluginSettings.cubeColor,
        }, {
          type: 'color',
          prompt: 'Arrow color',
          key: 'arrowColor',
          current: pluginSettings.arrowColor,
        }
      ]
    },
    {
      type: 'dropdown-multi', prompt: 'Advanced flags.', key: 'flags',
      current: 'default', resetOnCurrent: true,
      dropdownOptions: Flags.FlagTypes as readonly string[]
    },
    // {
    //   type: 'expandable', prompt: 'Choose dimensions.',
    //   nestedInput: [
    //     {
    //       type: 'slider', prompt: 'Change width.', key: 'width',
    //       from: 2, to: 5, step: 1, current: 3
    //     }, {
    //       type: 'slider', prompt: 'Change height.', key: 'height',
    //       from: 2, to: 5, step: 1, current: 3
    //     }
    //   ]
    // },

  ]
}
