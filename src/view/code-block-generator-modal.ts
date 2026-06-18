import RubikCubeAlgos from '../main'
import {App, Modal} from 'obsidian'
import {AnyInput, GenericModal, OutputData} from '@Altarok/obsidian-dev-utils/src'

export class CodeBlockCreatorModal extends Modal {
  constructor(public readonly app: App, public readonly plugin: RubikCubeAlgos) {
    super(app)
  }


  onOpen() {
    const {contentEl} = this
    contentEl.empty()

    /* Copy global settings */
    const globalSettings: Record<string, string> = {}
    globalSettings['codeBlockId'] = '3'
    globalSettings['width'] = '3'
    globalSettings['height'] = '3'
    globalSettings['cubeColor'] = this.plugin.settings.cubeColor
    globalSettings['arrowColor'] = this.plugin.settings.arrowColor
    globalSettings['flags'] = ''
    globalSettings['setup'] = ''
    globalSettings['arrows'] = ''

    const localSettings: Record<string, OutputData> = {}


    const mandatoryInput = createMandatoryInput();
    const optionalInput = createOptionalInput(globalSettings);

    new GenericModal(contentEl,
      {
        pluginName: `Rubik's Cube algorithms`,
        mandatory: mandatoryInput,
        optional: optionalInput,
        output: localSettings,
        createCodeBlock:():string => {

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

function createMandatoryInput(): Readonly<AnyInput>[]  {
  return [
    {
      type: 'dropdown',
      name: 'type of cube',
      key: 'codeBlockId',
      current: '',
      dropdownOptions: ['rubikCubePLL', 'rubikCubeOLL'] as const
    }
  ]
}

function createOptionalInput(): Readonly<AnyInput>[]  {
  return [
    // {
    //   type: 'dropdown',
    //   name: 'type of cube',
    //   key: 'codeBlockId',
    //   current: '',
    //   dropdownOptions: ['rubikCubePLL', 'rubikCubeOLL'] as const
    // }
  ]
}
