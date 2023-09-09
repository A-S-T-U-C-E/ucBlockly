/**
 * @packageDocumentation General script file for translation
 * Author Blockly Team (https://github.com/google/blockly/blob/develop/demos/code/code.js) 
 * Author scanet\@libreducc (Sébastien Canet)
 */

/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as Blockly from 'blockly';
import { basic_toolbox } from './toolbox';
import { addReplaceParamToUrl, genWorkspace, BlocklyApplicationType, µcB } from './index';
import { workspaceSaveBlocks, workspaceLoadBlocks } from './serialization';
import { languagesMap, languagesMapBlockly, LanguageItem } from './languages/languageMap';

const dropdownMenu: HTMLSelectElement = document.querySelector('#languageMenu')!;

/**
 * The function `getStringParamFromUrl` retrieves a string parameter from the URL and returns its
 * value, or a default value if the parameter is not found.
 * @param name - The `name` parameter is a string that represents the name of the parameter
 * you want to extract from the URL.
 * @param defaultValue - The `defaultValue` parameter is a string that represents the default
 * value to be returned if the specified query parameter is not found in the URL.
 * @returns The function `getStringParamFromUrl` returns a string value.
 */
const getStringParamFromUrl = (name: string, defaultValue: string): string => {
  const regex = new RegExp('[?&]' + name + '=([^&]+)');
  const val = regex.exec(location.search);
  return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
};

/**
 * Get the language of this user from the URL.
 * @returns User's language.
 */
const getLang = (blocklyObject: BlocklyApplicationType): string => {
  let lang: string;
  lang = getStringParamFromUrl('lang', '');
  if (blocklyObject.LANGUAGE_NAME[lang] === undefined || !lang) {
    // Default to English.
    lang = 'en';
  }
  return lang;
};

/**
 * Is the current language (µcB.LANG) an RTL language?
 * @returns True if RTL, false if LTR.
 */
const isRtl = (blocklyObject: BlocklyApplicationType): boolean => {
  return blocklyObject.LANGUAGE_RTL.indexOf(getLang(µcB)) !== -1;
};

/**
 * The function `µcB_changeLanguage` is used to change the language of a coding environment and update
 * the HTML accordingly.
 */
const µcB_changeLanguage = (): void => {
  const newLang: string = dropdownMenu.options[dropdownMenu.selectedIndex].value;
  window.history.pushState({}, "µcB", addReplaceParamToUrl(window.location.search, "lang", newLang));
  // Set the HTML's language and direction.
  const rtl: boolean = isRtl(µcB);
  µcB_changeLanguageHTML(newLang);
  // verify if exist, else it's initialisation
  if (µcB.workspace) {
    workspaceSaveBlocks(µcB.workspace);
    µcB.workspace.dispose();
  }
  Blockly.setLocale(languagesMapBlockly[newLang]);
  µcB_changeLanguageToolbox(newLang);
  genWorkspace(rtl);
  workspaceLoadBlocks(µcB.workspace!);
  (µcB.workspace as Blockly.WorkspaceSvg).scrollCenter();
};

/**
 * The function `µcB_changeLanguageHTML` updates the text content of elements with the class "lang"
 * based on the selected language.
 * @param newLang - The `newLang` parameter is a string that represents the new language that
 * the user wants to change to.
 */
const µcB_changeLanguageHTML = (newLang: string): void => {
  const langElements = document.querySelectorAll('.lang');
  const selectedLangItem = languagesMap[newLang];
  if (selectedLangItem) {
    langElements.forEach((element) => {
      const key = element.getAttribute('key');
      if (key && selectedLangItem[key as keyof LanguageItem]) {
        element.textContent = selectedLangItem[key as keyof LanguageItem];
      }
    });
  }
}

/**
 * The function `µcB_changeLanguageToolbox` updates the category names in the toolbox based on the
 * selected language.
 * @param newLang - The `newLang` parameter is a string that represents the new language to be
 * set for the toolbox.
 */
const µcB_changeLanguageToolbox = (newLang: string): void => {
  // initialisation categories names
  if (!µcB.toolbox)
    µcB.toolbox = JSON.parse(JSON.stringify(basic_toolbox));

  function updateCategoryNames(lang: string) {
    const toolboxCopy = JSON.parse(JSON.stringify(basic_toolbox.contents));
    const langMap: LanguageItem = languagesMap[lang];
    interface Category {
      kind: string;
      name: string;
      contents?: Category[];
    }
    function replaceCategoryName(category: Category) {
      if (category.kind === 'category' && category.name && langMap[category.name as keyof LanguageItem]) {
        category.name = langMap[category.name as keyof LanguageItem];
      }
      if (category.contents) {
        category.contents.forEach((content: Category) => {
          replaceCategoryName(content);
        });
      }
    }
    toolboxCopy.forEach((content: Category) => {
      replaceCategoryName(content);
    });
    return toolboxCopy;
  }
  µcB.toolbox!.contents = updateCategoryNames(newLang);
}

/**
 * The `initLanguage` function is responsible for populating the language selection menu on a webpage
 * with options sorted alphabetically.
 * @param blocklyObject - The `blocklyObject` parameter is an object that
 * contains information about the Blockly application. It likely includes properties such as
 * `LANGUAGE_NAME`, which is an object that maps language codes to their corresponding names.
 */
export const initLanguage = (blocklyObject: BlocklyApplicationType): void => {
  // Sort languages alphabetically.
  const languages = [];
  for (const lang in blocklyObject.LANGUAGE_NAME) {
    languages.push([blocklyObject.LANGUAGE_NAME[lang], lang]);
  }

  const comp = (a: string[], b: string[]) => {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0])
      return 1;
    if (a[0] < b[0])
      return -1;
    return 0;
  };
  languages.sort(comp);
  // This code block is responsible for populating the language selection menu on the webpage.
  const languageMenu: HTMLSelectElement = document.getElementById('languageMenu') as HTMLSelectElement;
  languageMenu.options.length = 0;
  for (const element of languages) {
    const tuple = element;
    const lang = tuple[tuple.length - 1];
    const option = new Option(tuple[0], lang);
    if (lang === getLang(blocklyObject)) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
  µcB_changeLanguage();
  dropdownMenu.addEventListener('change', µcB_changeLanguage, true);
}