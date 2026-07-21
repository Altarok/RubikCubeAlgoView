import {App, Modal} from 'obsidian'
import RubikCubeAlgos from '../main'
import {Settings} from '../settings/plugin-settings-tab'
import {knownOllIdsWithDescription, knownPllIdsWithDescription} from '../consts/predefined-cases'
import {GenericMarkdownProcessor} from '../markdown-processor'
import {GenericModal, GenericModalInput, UserInput, OutputData, NonExpandableInput} from '../../../obsidian-dev-utils/src/index'

class CodeBlockCreatorModal extends Modal {
  constructor(public readonly app: App, public readonly plugin: RubikCubeAlgos) {
    super(app)
  }

  onOpen() {
    const {contentEl} = this
    contentEl.empty()

    const output: Record<string, OutputData> = {}

    const mandatoryInput: Readonly<UserInput>[] = createMandatoryInput()
    const optionalInput: Readonly<UserInput>[] = createOptionalInput(this.plugin.settings)

    const allFlatInputs: Readonly<NonExpandableInput>[] = [
      ...mandatoryInput.flatMap(i => i.type === 'expandable' ? i.nestedInput : [i]),
      ...optionalInput.flatMap(i => i.type === 'expandable' ? i.nestedInput : [i])
    ]

    const onUpdatePreview = (previewEl: HTMLElement): void => {
      previewEl.empty()
      if (!output.id) {
        previewEl.createDiv({text: 'Please select algorithm.'})
        return
      }

      let pseudoCodeBlockContent = ''


      for (const key in output) {
        if (Object.prototype.hasOwnProperty.call(output, key)) {
          const value = output[key]

          // Guard against undefined values to satisfy noUncheckedIndexedAccess
          if (value !== undefined && value !== null) {
            const matchingInputDefinition = allFlatInputs.find(input => input.key === key)
            const ignoreKey: boolean = matchingInputDefinition?.ignoreKeyInCodeBlock ?? false

            if (ignoreKey) {
              pseudoCodeBlockContent += `${String(value)}\n`
            } else {
              pseudoCodeBlockContent += `${key}: ${String(value)}\n`
            }
          }
        }
      }

      new GenericMarkdownProcessor(pseudoCodeBlockContent, this.plugin, previewEl).display() // IgnoringErrors(true)
    }

    const modalInput: GenericModalInput = {
      pluginName: `Rubik's Cube algorithms`,
      codeBlockId: 'rubikCube',
      input: allFlatInputs,
      onUpdatePreview,
      output
    }

    new GenericModal(contentEl, modalInput).display()

    contentEl.focus()
  }

  onClose() {
    this.contentEl.empty()
  }
}

export default CodeBlockCreatorModal

function createMandatoryInput(): Readonly<UserInput>[] {
  return [{
    type: 'conditional', key: 'id',
    prompt: 'Choose cube ..', subPrompt: '.. and algorithm',
    mandatory: true,
    current: 'oll-1',
    nestedInput: [{
      key: "Rubik's Cube (OLL)", dropdownOptions: knownOllIdsWithDescription
    }, {
      key: "Rubik's Cube (PLL)", dropdownOptions: knownPllIdsWithDescription
    }]
  }]
}

function createOptionalInput(pluginSettings: Settings): Readonly<UserInput>[] {

  const flagDropdownOptions: Record<string, string> = {
    'default': 'none',
    'no-buttons': 'no-buttons',
    'no-setup': 'no-setup'
  }

  return [
    {
      type: 'expandable', prompt: 'Colors',
      mandatory: false,
      nestedInput: [{
        type: 'color',
        prompt: 'Cube color',
        key: 'cubeColor',
        current: pluginSettings.cubeColor,
      }, {
        type: 'color',
        prompt: 'Arrow color',
        key: 'arrowColor',
        current: pluginSettings.arrowColor,
      }]
    },
    {
      type: 'expandable', prompt: 'Advanced',
      mandatory: false,
      nestedInput: [{
        type: 'dropdownMulti', prompt: 'Special flags', key: 'flags',
        tooltip: 'Select each you want to apply.',
        current: 'default', resetOnCurrent: true,
        dropdownOptions: flagDropdownOptions
      }]
    },
  ]
}
