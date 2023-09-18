/**
 * @packageDocumentation General script file for translation
 * @author Blockly Team (https://github.com/google/blockly/blob/develop/demos/code/code.js)
 * @author scanet\@libreducc (Sébastien Canet)
 */
import { BlocklyApplicationType } from './index';
/**
 * The function `µcB_changeLanguage` changes the language and direction of the HTML, saves the
 * workspace blocks, disposes the workspace, sets the Blockly locale, changes the language of the
 * toolbox, injects the workspace, loads the saved blocks, and centers the workspace.
 */
export declare const µcB_changeLanguage: (menuOrUrl: boolean) => boolean;
/**
 * The `HTML_populateLanguages` function is responsible for populating the language selection menu on a webpage
 * with options sorted alphabetically.
 * @param blocklyObject - The `blocklyObject` parameter is an object that
 * contains information about the Blockly application. It likely includes properties such as
 * `LANGUAGE_NAME`, which is an object that maps language codes to their corresponding names.
 */
export declare const HTML_populateLanguages: (blocklyObject: BlocklyApplicationType) => void;
//# sourceMappingURL=language.d.ts.map