import * as Blockly from 'blockly';
import { µcB, rebootWorkspace } from './index';

import DarkTheme from '@blockly/theme-dark';
import ModernTheme from '@blockly/theme-modern';
import HighContrastTheme from '@blockly/theme-highcontrast';
import DeuteranopiaTheme from '@blockly/theme-deuteranopia';
import TritanopiaTheme from '@blockly/theme-tritanopia';

/**
 * The function `changeTheme` sets the theme of the Blockly workspace based on the `themeChoice`
 * parameter.
 * @param themeChoice - The parameter `themeChoice` is a string that represents the user's choice of
 * theme. It can have the following values:
 */
export function changeTheme(themeChoice: string = 'classic') {
  if (!themeChoice)
    themeChoice = (document.getElementById('themeMenu') as HTMLSelectElement).value;
  if (themeChoice === "dark") {
    (µcB.workspace as Blockly.WorkspaceSvg).setTheme(DarkTheme);
  } else if (themeChoice === "high_contrast") {
    (µcB.workspace as Blockly.WorkspaceSvg).setTheme(HighContrastTheme);
  } else if (themeChoice === "deuteranopia") {
    (µcB.workspace as Blockly.WorkspaceSvg).setTheme(DeuteranopiaTheme);
  } else if (themeChoice === "tritanopia") {
    (µcB.workspace as Blockly.WorkspaceSvg).setTheme(TritanopiaTheme);
  } else if (themeChoice === "modern") {
    (µcB.workspace as Blockly.WorkspaceSvg).setTheme(ModernTheme);
  } /*else if (themeChoice === "blackWhite") {
    (µcB.workspace as Blockly.WorkspaceSvg).setTheme(BaWTheme);
  }*/ else if (themeChoice === "zelos") {
    (µcB.workspace as Blockly.WorkspaceSvg).setTheme(Blockly.Themes.Zelos);
  } else {
    (µcB.workspace as Blockly.WorkspaceSvg).setTheme(Blockly.Themes.Classic);
  }
}

export function changeRenderer(renderNew: string = (document.getElementById('rendererMenu') as HTMLSelectElement).value){  
  µcB.WORKSPACE_OPTIONS['renderer'] = renderNew;
  rebootWorkspace();
}