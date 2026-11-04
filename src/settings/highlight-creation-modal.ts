import {Modal, Notice, Setting} from 'obsidian'
import FantasyGanttPlugin from '../main'
import {SectionHighlight} from './plugin-settings-tab'
import {RegEx} from '../parser/regex-util'

const DESCRIPTION = `Must be unique.`
const DESCRIPTION_DUPLICATE = 'This section is already defined. Please choose another.'
const DESCRIPTION_INVALID = `Invalid format! Use only [xyzRrLlFfBbUuDdMSE] and ['2].`

// function getRandomHexColor(): string {
//   return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0')}`
// }

export class AddEntryModal extends Modal {

  private existingIds: Set<string>

  constructor(readonly plugin: FantasyGanttPlugin,
              existingIds: string[],
              readonly onSubmit: (entry: SectionHighlight) => void) {
    super(plugin.app)
    this.existingIds = new Set(existingIds)
  }

  onOpen() {
    const result: Partial<SectionHighlight> = {visible: true, color: this.plugin.settings.highlightFallbackColor}

    const {contentEl} = this
    contentEl.empty()
    contentEl.createEl('h2', {text: 'Add new section'})
    contentEl.createDiv({text: 'IDs are case-sensitive.'})

    let addButton: HTMLButtonElement

    const idSetting = new Setting(contentEl).setName('ID')
      .setDesc(DESCRIPTION)
      .addText(text => {
        text.onChange(value => {
          result.section = value.trim()

          // Validation checks
          const isValidFormat = RegEx.isAlgorithm(result.section)
          const isUnique = !this.existingIds.has(result.section)
          const isValid = result.section.length > 0 && isValidFormat && isUnique

          // Toggle error UI feedback
          idSetting.descEl.toggleClass('is-error', !isValid && result.section.length > 0)
          if (!isValidFormat && result.section.length > 0) {
            void idSetting.setDesc(DESCRIPTION_INVALID)
          } else if (!isUnique) {
            void idSetting.setDesc(DESCRIPTION_DUPLICATE)
          } else {
            void idSetting.setDesc(DESCRIPTION)
          }

          // Disable/Enable the submit button
          if (addButton) {
            addButton.disabled = !isValid
          }
        })
      })

    new Setting(contentEl).setDesc('Choose a color')
      .addColorPicker(c =>
        c.setValue(result.color!)
          .onChange(v => result.color = v))

    new Setting(contentEl).addButton(btn => {
      btn.setButtonText('Add')
        .setCta()
        .onClick(() => {
          // !ID_REGEX.test(result.id) || this.existingIds.has(result.id)
          if (!result.section || addButton.disabled) {
            new Notice('Please enter a valid, unique section.')
            return
          }

          this.close()
          this.onSubmit(result as SectionHighlight)
        })

      addButton = btn.buttonEl
      addButton.disabled = true // Initially disabled until user types a valid ID
    })

  }

  /*
   * Delete when clean that Obsidian does that for me
   * https://docs.obsidian.md/Plugins/User+interface/Modals
   */
  onClose() {
    const {contentEl} = this
    contentEl.empty()
  }
}
