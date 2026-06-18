import RubikCubeAlgos from '../main'
import {App, Modal} from 'obsidian'
import {AnyInput, GenericModal, OutputData} from '@Altarok/obsidian-dev-utils/src'
import {Settings} from "../settings/plugin-settings-tab";

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

    const mandatoryInput: Readonly<AnyInput>[] = createMandatoryInput();
    const optionalInput: Readonly<AnyInput>[] = createOptionalInput(this.plugin.settings);

    new GenericModal(contentEl,
      {
        pluginName: `Rubik's Cube algorithms`,
        mandatory: mandatoryInput,
        optional: optionalInput,
        output: localSettings,
        createCodeBlock: (): string => {
          let code = ''
          const codeBlockId = localSettings.codeBlockId
          /* add main smiles notation */
          // if (localSettings.codeBlockId) code += `${localSettings.codeBlockId}\n`

          if (localSettings.width || localSettings.height) {
            code += `dimension:${localSettings.width ?? 3},${localSettings.height ?? 3}\n`
          }

          return `\`\`\`${codeBlockId}\n${code}\`\`\``
        },
        onUpdatePreview: (previewEl: HTMLElement): void => {
          previewEl.empty();
        }
      }).display()

    contentEl.focus()
  }

  onClose() {
    this.contentEl.empty()
  }
}

function createMandatoryInput(): Readonly<AnyInput>[] {
  return [
    {
      type: 'dropdown',
      name: 'type of cube',
      key: 'codeBlockId',
      current: 'rubikCubePLL',
      dropdownOptions: ['rubikCubePLL', 'rubikCubeOLL'] as const
    }
  ]
}

function createOptionalInput(pluginSettings: Settings): Readonly<AnyInput>[] {
  return [
    {
      type: 'dropdown',
      name: 'width',
      key: 'codeBlockId',
      current: '3',
      dropdownOptions: ['2', '3'] as const
    },
    {
      type: 'dropdown',
      name: 'height',
      key: 'codeBlockId',
      current: '3',
      dropdownOptions: ['2', '3'] as const
    },
    {
      type: 'color',
      name: 'cube color',
      key: 'cubeColor',
      current: pluginSettings.cubeColor,
    }, {
      type: 'color',
      name: 'arrow color',
      key: 'arrowColor',
      current: pluginSettings.arrowColor,
    }
  ]
}
