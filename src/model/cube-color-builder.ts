import {CubeColors, DefaultSettings, Settings} from "../settings/plugin-settings-tab"

export function createBackupColors(settings: Settings): CubeColors {
  return {
    arrowColor: settings.arrowColor ?? DefaultSettings.arrowColor,
    cubeColor: settings.cubeColor ?? DefaultSettings.cubeColor
  }
}
