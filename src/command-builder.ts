import {Platform, Plugin} from 'obsidian'
import {TimerModal} from './training/training-timer-modal'
import {InsertTextCommandData, Strings} from "consts/strings"
import RubikCubeAlgos from './main'
import CodeBlockCreatorModal from './view/cube-code-block-generator'

function addInsertTextCommand(plugin: Plugin, data: InsertTextCommandData): void {
  plugin.addCommand({
    id: data.id,
    name: data.name,
    editorCallback: (editor) => {
      editor.replaceSelection(data.content)
    }
  })
}

/**
 * Add commands for plugin.
 */
export function addAppCommands(plugin: RubikCubeAlgos): void {

  if (plugin.settings.activateCommandCodeblockTemplates) {
    addInsertTextCommand(plugin, Strings.Commands.insertText.ollCodeBlockTemplate)
    addInsertTextCommand(plugin, Strings.Commands.insertText.pllCodeBlockTemplate)
  }

  if (plugin.settings.activateCommandCodeblockExamples) {
    addInsertTextCommand(plugin, Strings.Commands.insertText.ollCompleteLibrary)
    addInsertTextCommand(plugin, Strings.Commands.insertText.pllCompleteLibrary)
    addInsertTextCommand(plugin, Strings.Commands.insertText.dominoPllPartialLibrary)
  }

  if (plugin.settings.activateCommandQuickStartGuide) {
    addInsertTextCommand(plugin, Strings.Commands.insertText.quickStartGuide)
  }

  plugin.addCommand({
    id: Strings.Commands.openSpeedCubingTimerAsModal.id,
    name: Strings.Commands.openSpeedCubingTimerAsModal.name,
    callback: () => {
      new TimerModal(plugin.app, Platform.isMobile).open()
    }
  })

  plugin.addCommand({
    id: 'RubikCubeAlgo-open-code-block-creator',
    name: 'Open code block creator',
    callback: () => {
      new CodeBlockCreatorModal(plugin.app, plugin).open()
    }
  })
}



