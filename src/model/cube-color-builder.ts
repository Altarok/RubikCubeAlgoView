import {CubeColors, DefaultSettings, RubikCubeAlgoSettingsTab} from "../settings/RubikCubeAlgoSettings";

export function createBackupColors(settings: RubikCubeAlgoSettingsTab): CubeColors {
  return {
    arrow: settings.arrowColor ?? DefaultSettings.ARROW_COLOR,
    cube: settings.cubeColor ?? DefaultSettings.CUBE_COLOR
  };
}
