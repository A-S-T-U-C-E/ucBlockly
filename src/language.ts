/**
 * @packageDocumentation General script file for translation
 * @author Blockly Team (https://github.com/google/blockly/blob/develop/demos/code/code.js) 
 * @author scanet\@libreducc (Sébastien Canet)
 */

/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as Blockly from 'blockly';
import { basic_toolbox } from './toolbox';
import { µcB_workspaceInject, BlocklyApplicationType, µcB } from './index';
import { addReplaceParamToUrl, getStringParamFromUrl } from './tools';
import { workspaceSaveBlocks, workspaceLoadBlocks } from './serialization';
import { languagesMap, languagesMapBlockly, LanguageItem } from './languages/languageMap';

const dropdownMenu: HTMLSelectElement = document.getElementById('languageMenu') as HTMLSelectElement;


/**
 * The function `getLangParamFromUrl` retrieves the language parameter from a URL and returns it,
 * defaulting to English if the parameter is not found or is invalid.
 * @param {BlocklyApplicationType} blocklyObject - The `blocklyObject` parameter is of type
 * `BlocklyApplicationType`.
 * @returns the value of the `lang` variable, which is a string representing the language parameter
 * obtained from the URL.
 */
const getLangParamFromUrl = (blocklyObject: BlocklyApplicationType): string => {
  let lang: string;
  lang = getStringParamFromUrl('lang', '');
  if (blocklyObject.LANGUAGE_NAME[lang] === undefined || !lang) {
    // Default to English.
    lang = 'en';
  }
  return lang;
};

const getLangParamFromDropdown = (): string => {
  const newLang: string = dropdownMenu.options[dropdownMenu.selectedIndex].value;
  window.history.pushState({}, "µcB", addReplaceParamToUrl(window.location.search, "lang", newLang));
  return newLang;
};

/**
 * The function checks if the language of a Blockly object is right-to-left (RTL).
 * @param {BlocklyApplicationType} blocklyObject - The `blocklyObject` parameter is an object that
 * represents the Blockly application. It likely contains various properties and methods related to the
 * Blockly functionality.
 * @returns a boolean value.
 */
const isLangRtl = (blocklyObject: BlocklyApplicationType): boolean => {
  return blocklyObject.LANGUAGE_RTL.indexOf(getLangParamFromUrl(µcB)) !== -1;
};

/**
 * The function `µcB_changeLanguage` is used to change the language of a coding environment and update
 * the HTML accordingly.
 */
export const µcB_changeLanguage = (): void => {
  const newLang = getLangParamFromDropdown();
  // Set the HTML's language and direction.
  const rtl: boolean = isLangRtl(µcB);
  HTMLchangeLanguage(newLang);
  // verify if exist, else it's initialisation
  if (µcB.workspace) {
    workspaceSaveBlocks(µcB.workspace);
    µcB.workspace.dispose();
  }
  Blockly.setLocale(languagesMapBlockly[newLang]);
  µcB_changeLanguageToolbox(newLang);
  µcB_workspaceInject(rtl);
  workspaceLoadBlocks(µcB.workspace);
  (µcB.workspace as Blockly.WorkspaceSvg).scrollCenter();
};

/**
 * The function `HTMLchangeLanguage` updates the text content of elements with the class "lang"
 * based on the selected language.
 * @param newLang - The `newLang` parameter is a string that represents the new language that
 * the user wants to change to.
 */
const HTMLchangeLanguage = (newLang: string): void => {
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
 * The function `µcB_changeLanguageToolbox` changes the names of categories in a toolbox based on a
 * language map.
 * @param {string} newLang - The `newLang` parameter is a string that represents the new language to
 * which the toolbox should be changed.
 */
const µcB_changeLanguageToolbox = (newLang: string): void => {
  const toolboxCopy = JSON.parse(JSON.stringify(basic_toolbox.contents));
  const langMap: LanguageItem = languagesMap[newLang];
  interface Category {
    kind: string;
    name: string;
    contents?: Category[];
  }
  /**
   * The function replaces the name of a category with its corresponding translation if available in
   * the language map.
   * @param {Category} category - The parameter `category` is of type `Category`, which is an object
   * that represents a category.
   */
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
  µcB.toolbox.contents = toolboxCopy;
}

/**
 * The `initLanguage` function is responsible for populating the language selection menu on a webpage
 * with options sorted alphabetically.
 * @param blocklyObject - The `blocklyObject` parameter is an object that
 * contains information about the Blockly application. It likely includes properties such as
 * `LANGUAGE_NAME`, which is an object that maps language codes to their corresponding names.
 */
export const initLanguage = (blocklyObject: BlocklyApplicationType): void => {
  /**
   * The function sorts an array of language names based on their first argument.
   * @param {string[]} a - a is an array of strings representing languages. Each element in the array
   * is an array itself, with the first element being the name of the language (e.g. 'English',
   * 'Русский', '简体字', etc) and the remaining elements being additional information about the language.
   * @param {string[]} b - The parameter `b` is an array of strings.
   * @returns The `comp` function is being used as a comparator function to sort the `languages` array.
   * The `comp` function compares two elements `a` and `b` based on their first element (`a[0]` and
   * `b[0]`).
   */
  const comp = (a: string[], b: string[]) => {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0])
      return 1;
    if (a[0] < b[0])
      return -1;
    return 0;
  };

  const languages = [];
  for (const lang in blocklyObject.LANGUAGE_NAME) {
    languages.push([blocklyObject.LANGUAGE_NAME[lang], lang]);
  }
  languages.sort(comp);
  /* This code block is responsible for populating the language selection menu on a webpage with
  options sorted alphabetically. */
  const languageMenu: HTMLSelectElement = document.getElementById('languageMenu') as HTMLSelectElement;
  languageMenu.options.length = 0;
  for (const element of languages) {
    const tuple = element;
    const lang = tuple[tuple.length - 1];
    const option = new Option(tuple[0], lang);
    if (lang === getLangParamFromUrl(blocklyObject)) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
}