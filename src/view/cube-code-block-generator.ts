import RubikCubeAlgos from '../main'
import {App, Modal} from 'obsidian'
import {GenericModal, MandatoryInput, OptionalInput, OutputData} from '@Altarok/obsidian-dev-utils/src'
import {Settings} from '../settings/plugin-settings-tab'
import {knownOllIdsWithDescription, knownPllIdsWithDescription} from '../consts/predefined-cases'
import {GenericMarkdownProcessor} from '../markdown-processor'

// npm update @Altarok/obsidian-dev-utils
class CodeBlockCreatorModal extends Modal {
  constructor(public readonly app: App, public readonly plugin: RubikCubeAlgos) {
    super(app)
  }

  onOpen() {
    const {contentEl} = this
    contentEl.empty()

    const output: Record<string, OutputData> = {}

    const mandatoryInput: Readonly<MandatoryInput>[] = createMandatoryInput()
    const optionalInput: Readonly<OptionalInput>[] = createOptionalInput(this.plugin.settings)

    const onUpdatePreview = (previewEl: HTMLElement): void => {
      previewEl.empty()
      if (!output.id) {
        previewEl.createDiv({ text: 'Please select algorithm.' })
        return
      }

      let pseudoCodeBlockContent = ''

      const allFlatInputs = [
        ...mandatoryInput,
        ...optionalInput.flatMap(i => i.type === 'expandable' ? i.nestedInput : [i])
      ]

      // Object.entries(output).forEach(([key, value]) => {
      //   if (key && value) {
      //
      //     const matchingInputDefinition = allFlatInputs.find(input => input.key === key)
      //     const ignoreKey: boolean = matchingInputDefinition?.ignoreKeyInCodeBlock === true
      //
      //     if (ignoreKey) {
      //       pseudoCodeBlockContent += `${value}\n`
      //     } else {
      //       pseudoCodeBlockContent += `${key}: ${value}\n`
      //     }
      //   }
      // })

      for (const key in output) {
        if (Object.prototype.hasOwnProperty.call(output, key)) {
          const value = output[key]

          // Guard against undefined values to satisfy noUncheckedIndexedAccess
          if (value !== undefined && value !== null) {
            const matchingInputDefinition = allFlatInputs.find(input => input.key === key)
            const ignoreKey = matchingInputDefinition?.ignoreKeyInCodeBlock === true

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

    new GenericModal(contentEl,
      {
        pluginName: `Rubik's Cube algorithms`,
        codeBlockId: 'rubikCube',
        mandatory: mandatoryInput,
        optional: optionalInput,
        output,
        onUpdatePreview
      }).display()

    contentEl.focus()
  }

  onClose() {
    this.contentEl.empty()
  }
}

export default CodeBlockCreatorModal

function createMandatoryInput(): Readonly<MandatoryInput>[] {
  return [
    {
      type: 'conditional', prompt: 'Choose cube ..',
      key: 'id',
      subPrompt: '.. and algorithm',
      nestedInput: [{
        key: "Rubik's Cube (OLL)", dropdownOptions: knownOllIdsWithDescription
      }, {
        key: "Rubik's Cube (PLL)", dropdownOptions: knownPllIdsWithDescription
      }]
    }
  ]
}

function createOptionalInput(pluginSettings: Settings): Readonly<OptionalInput>[] {

  const flagDropdownOptions: Record<string, string> = {
    'default': 'none',
    'no-buttons': 'no-buttons',
    'no-setup': 'no-setup'
  }

  return [
    {
      type: 'expandable', prompt: 'Colors',
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
      nestedInput: [{
        type: 'dropdownMulti', prompt: 'Special flags', key: 'flags',
        tooltip: 'Select each you want to apply.',
        current: 'default', resetOnCurrent: true,
        dropdownOptions: flagDropdownOptions
      }]
    },
  ]
}
