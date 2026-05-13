import {CubeColors, DefaultSettings, RubikCubeAlgoSettingsTab} from "../settings/RubikCubeAlgoSettings";

export function createBackupColors(settings: RubikCubeAlgoSettingsTab): CubeColors {
  return {
    arrowColor: settings.arrowColor ?? DefaultSettings.ARROW_COLOR,
    cubeColor: settings.cubeColor ?? DefaultSettings.CUBE_COLOR
  };
}
