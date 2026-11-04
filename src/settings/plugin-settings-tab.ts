import {App, ColorComponent, PluginSettingTab, Setting, SettingDefinitionItem} from 'obsidian'
import RubikCubeAlgos from '../main'
import {AddEntryModal} from './highlight-creation-modal'

const VISIBLE_ICON = 'eye' /* an open eye */
const INVISIBLE_ICON = 'eye-off' /* an open eye, with strike-through */

export type CubeColors = {
  arrowColor: string
  cubeColor: string
}

export type SectionHighlight = {
  section: string
  visible: boolean
  color: string
}

export type Settings = CubeColors & {
  cubeRotations: Record<string, number>
  cubeScaling: number
  activateCommandQuickStartGuide: boolean
  activateCommandCodeblockExamples: boolean
  activateCommandCodeblockTemplates: boolean
  activateRibbonIconForCodeblockCreator: boolean
  highlightFallbackColor: string
  highlights: SectionHighlight[]
}

export const DefaultSettings: Settings = {
  cubeColor: '#ffff00', /* yellow */
  arrowColor: '#0088ff', /* sky blue */
  cubeRotations: {},
  cubeScaling: 100,
  activateCommandQuickStartGuide: true,
  activateCommandCodeblockExamples: true,
  activateCommandCodeblockTemplates: true,
  activateRibbonIconForCodeblockCreator: true,
  highlightFallbackColor: 'limegreen',
  highlights: []
}

export class RubikCubeAlgoSettingsTab extends PluginSettingTab {
  tempColorInput: CubeColors

  constructor(app: App,
              readonly plugin: RubikCubeAlgos) {
    super(app, plugin)
    this.tempColorInput = {arrowColor: plugin.settings.arrowColor, cubeColor: plugin.settings.cubeColor}
  }

  private openAddForm() {

    const existingSections: string[] = this.settings.highlights.map(g => g.section)

    new AddEntryModal(this.plugin, existingSections, (newEntry: SectionHighlight) => {
      this.settings.highlights.push(newEntry)
      void this.plugin.saveData(this.settings).then(() => this.update())
    }).open()
  }

  public getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      { // start group: commands
        type: 'group',
        heading: 'Commands',
        items: [
          {
            name: 'Quick start guide',
            desc: 'Use command to add quick start guide to open note.',
            control: {type: 'toggle', key: 'activateCommandQuickStartGuide'}
          },
          {
            name: 'Code block examples',
            desc: `Use command to add complete Rubik's Cube algorithm lists to open note.`,
            control: {type: 'toggle', key: 'activateCommandCodeblockExamples'},
          },
          {
            name: 'Code block templates',
            desc: 'Use command to add code block templates for manual.',
            control: {type: 'toggle', key: 'activateCommandCodeblockTemplates'}
          },
          {
            name: 'Add ribbon icon',
            desc: 'Button opens code block creator utility',
            control: {type: 'toggle', key: 'activateRibbonIconForCodeblockCreator'}
          },
          {
            name: 'Hint',
            desc: 'Reload app or plugin after changing one of those settings!',
          },
        ],
      }, // end group: commands
      { // start group: colors
        type: 'group',
        heading: 'Colors',
        items: [
          {
            name: 'Cube color',
            desc: 'Default color for cube faces. Resets to yellow.',
            control: {type: 'color', key: 'cubeColor'}
          },
          {
            name: 'Arrow color',
            desc: 'Default color for arrows. Resets to sky blue.',
            control: {type: 'color', key: 'arrowColor'}
          },
          {
            name: 'Reset default colors',
            render: (setting) => {
              setting.addButton(bb => bb.setDestructive()
                .setButtonText('Reset')
                .onClick(async () => {
                  this.plugin.settings.cubeColor = DefaultSettings.cubeColor
                  this.plugin.settings.arrowColor = DefaultSettings.arrowColor
                  await this.plugin.saveData(this.plugin.settings)
                  this.update()
                }))
            }
          }
        ]
      },
      {
        type: 'group',
        heading: 'Display options',
        items: [
          {
            name: 'Scaling',
            desc: 'Scales cube. Default: 100%',
            control: {
              type: 'slider', key: 'cubeScaling',
              min: 50, max: 150, step: 5, defaultValue: DefaultSettings.cubeScaling
            }
          }
        ]
      },
      {
        type: 'page',
        name: 'Algorithm Highlighting',
        desc: 'Choose sections to highlight for faster learning.',
        items: [
          {
            heading: 'Algorithm section',
            type: 'list',
            desc: 'Control section visibility and color.',
            emptyState: 'No section defined yet.',
            addItem: {name: 'Add section', action: () => this.openAddForm()},
            // onReorder: (oldIndex: number, newIndex: number) => {
            //   const [moved] = this.settings.highlights.splice(oldIndex, 1)
            //   if (moved) {
            //     this.settings.highlights.splice(newIndex, 0, moved)
            //     // this.settings.highlights.forEach((cal, index) => cal.priority = index)
            //     void (async () => {
            //       await this.plugin.saveSettings()
            //       this.update()
            //     })()
            //   }
            // },
            onReorder: (oldIndex, newIndex) => {
              let highlights = this.settings.highlights
              let [moved] = highlights.splice(oldIndex, 1)
              if (moved) highlights.splice(newIndex, 0, moved)
              void this.plugin.saveSettings()
              this.update()
            },
            onDelete: (idx: number) => {
              this.settings.highlights.splice(idx, 1)
              void this.plugin.saveSettings()
              this.update()
            },
            items: this.settings.highlights.map((h) => ({
              name: h.section,
              render: (setting: Setting) => this.renderItemRow(setting, h)
            }))
          },
          {
            name: 'Color',
            desc:
              `Default color for highlights.`,
            control:
              {
                type: 'color', key:
                  'highlightFallbackColor', defaultValue:
                DefaultSettings.highlightFallbackColor
              }
          }
          ,
        ]
      }
    ] // end group: colors
  }

  private renderItemRow(setting: Setting,
                        item: SectionHighlight): void {
    let cc: ColorComponent
    setting
      // .addButton(btn => btn.setIcon('pen').setTooltip('Rename', {delay: -1})
      //   .onClick(async () => {
      //     this.openRenameForm(target, item)
      //     await this.plugin.saveSettings()
      //   })
      // )
      .addButton(btn => btn
        .setIcon(item.visible ? VISIBLE_ICON : INVISIBLE_ICON)
        .setTooltip('Click to toggle visibility', {delay: -1})
        .onClick(async () => {
          item.visible = !item.visible
          void btn.setIcon(item.visible ? VISIBLE_ICON : INVISIBLE_ICON)
          await this.plugin.saveSettings()
        })
      )
      .addColorPicker(c => cc = c
        .setValue(item.color ?? this.settings.highlightFallbackColor)
        .onChange(async (value) => {
            item.color = value
            await this.plugin.saveSettings()
          }
        )
      )
      .addButton(btn => btn
        .setIcon('rotate-ccw')
        .setTooltip('Reset color', {delay: -1})
        .onClick(async () => {
          cc.setValue(this.highlightFallbackColor)
          item.color = this.highlightFallbackColor
          await this.plugin.saveSettings()
        })
      )
  }

  private get highlightFallbackColor() {
    return this.settings.highlightFallbackColor
  }


  private get settings() {
    return this.plugin.settings
  }


}
