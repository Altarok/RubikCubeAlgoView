import {CubeColors, DefaultSettings, Settings} from "../settings/RubikCubeAlgoSettings";

export function createBackupColors(settings: Settings): CubeColors {
  return {
    arrowColor: settings.arrowColor ?? DefaultSettings.ARROW_COLOR,
    cubeColor: settings.cubeColor ?? DefaultSettings.CUBE_COLOR
  };
}
