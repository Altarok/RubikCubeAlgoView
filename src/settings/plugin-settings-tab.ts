import {App, PluginSettingTab, SettingDefinitionItem} from 'obsidian'
import RubikCubeAlgos from '../main'
import {Strings} from 'consts/strings'

export type CubeColors = {
  arrowColor: string
  cubeColor: string
}

export type Settings = CubeColors & {
  cubeRotations: Record<string, number>
  activateCommandQuickStartGuide: boolean
  activateCommandCodeblockExamples: boolean
  activateCommandCodeblockTemplates: boolean
  activateRibbonIconForCodeblockCreator: boolean
}

export const DefaultSettings: Settings = {
  cubeColor: '#ffff00', /* yellow */
  arrowColor: '#0088ff', /* sky blue */
  cubeRotations: {},
  activateCommandQuickStartGuide: true,
  activateCommandCodeblockExamples: true,
  activateCommandCodeblockTemplates: true,
  activateRibbonIconForCodeblockCreator: true
}

export class RubikCubeAlgoSettingsTab extends PluginSettingTab {
  tempColorInput: CubeColors

  constructor(app: App, readonly plugin: RubikCubeAlgos) {
    super(app, plugin)
    this.tempColorInput = {arrowColor: plugin.settings.arrowColor, cubeColor: plugin.settings.cubeColor}
  }

  public getSettingDefinitions(): SettingDefinitionItem[] {
    return [
      { // start group: commands
        type: 'group',
        heading: 'Commands',
        items: [
          {
            name: Strings.SettingsUI.quickStartGuide.name,
            desc: Strings.SettingsUI.quickStartGuide.desc,
            control: {type: 'toggle', key: 'activateCommandQuickStartGuide'}
          },
          {
            name: Strings.SettingsUI.examples.name,
            desc: Strings.SettingsUI.examples.desc,
            control: {type: 'toggle', key: 'activateCommandCodeblockExamples'},
          },
          {
            name: Strings.SettingsUI.templates.name,
            desc: Strings.SettingsUI.templates.desc,
            control: {type: 'toggle', key: 'activateCommandCodeblockTemplates'}
          },
          {
            name: 'Add ribbon icon',
            desc: 'Button opens code block creator utility',
            control: {type: 'toggle', key: 'activateRibbonIconForCodeblockCreator'}
          },
          {
            name: Strings.SettingsUI.hint.name,
            desc: Strings.SettingsUI.hint.desc,
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
              setting.addButton(bb => bb
                .setDestructive()
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
      }
    ] // end group: colors
  }

}
