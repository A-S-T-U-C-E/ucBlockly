import * as Blockly from 'blockly';
import { workspaceReboot, BlocklyApplicationType } from './index';
import { addReplaceParamToUrl } from './tools';

import DarkTheme from '@blockly/theme-dark';
import ModernTheme from '@blockly/theme-modern';
import HighContrastTheme from '@blockly/theme-highcontrast';
import DeuteranopiaTheme from '@blockly/theme-deuteranopia';
import TritanopiaTheme from '@blockly/theme-tritanopia';
import BandWTheme from './theme_black_and_white';

import {initTheme} from '@aneilmac/blockly-theme-seshat';
const Seshat = initTheme(Blockly);

/**
 * The function `changeTheme` allows the user to change the theme of a Blockly workspace based on a
 * given theme choice.
 * @param themeChoice - The `themeChoice` parameter is a string that represents the
 * chosen theme. It is optional and has a default value of `'classic'`.
 */
const themeMappings: { [key: string]: Blockly.Theme } = {
  classic: Blockly.Themes.Classic,
  modern: ModernTheme,
  deuteranopia: DeuteranopiaTheme,
  tritanopia: TritanopiaTheme,
  zelos: Blockly.Themes.Zelos,
  high_contrast: HighContrastTheme,
  dark: DarkTheme,
  blackWhite: BandWTheme,
  seshat: Seshat,
};

export const changeTheme = (app: BlocklyApplicationType, themeChoice?: string): string => {
  if (!themeChoice)
    themeChoice = (document.getElementById('themeMenu') as HTMLSelectElement).value;
  app.WORKSPACE_OPTIONS['theme'] = themeMappings[themeChoice];
  if (themeMappings.hasOwnProperty(themeChoice)) {
    (app.workspace as Blockly.WorkspaceSvg).setTheme(themeMappings[themeChoice]);
  }
  window.history.pushState({}, "µcB", addReplaceParamToUrl(window.location.search, "theme", themeChoice));
  return themeChoice;
}

/**
 * The function `changeRenderer` updates the renderer option in the `µcB.WORKSPACE_OPTIONS` object and
 * then reboots the workspace.
 * @param renderNew - The `renderNew` parameter is a string that represents the value of the
 * selected option in the `rendererMenu` HTML select element.
 */
export const changeRenderer = (app: BlocklyApplicationType, renderNew: string = (document.getElementById('rendererMenu') as HTMLSelectElement).value): string => {
  app.WORKSPACE_OPTIONS['renderer'] = renderNew;
  workspaceReboot(app);
  window.history.pushState({}, "µcB", addReplaceParamToUrl(window.location.search, "renderer", renderNew));
  return renderNew;
}