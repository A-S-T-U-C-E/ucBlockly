/**
 * @packageDocumentation General script file for various function useful for application
 * @author Blockly Team (https://github.com/google/blockly/blob/develop/demos/code/code.js) 
 * @author scanet\@libreduc.cc (Sébastien Canet)
 */

import { BlocklyApplicationType } from './index';

/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * The function adds or replaces a parameter and its value in a given URL.
 * @param url - The `url` parameter is a string representing the URL to which the parameter
 * needs to be added or replaced.
 * @param param - The `param` parameter is a string that represents the name of the query
 * parameter that you want to add or replace in the URL.
 * @param value - The `value` parameter is a string representing the value that you want to
 * add or replace for the specified parameter in the URL.
 * @returns The function `addReplaceParamToUrl` returns a modified version of the input `url` string
 * with the specified `param` and `value` added or replaced.
 */

export const addReplaceParamToUrl = (url: string, param: string, value: string): string => {
  const re = new RegExp("([?&])" + param + "=.*?(&|$)", "i");
  const separator = url.indexOf('?') !== -1 ? "&" : "?";
  if (re.exec(url)) {
    return url.replace(re, '$1' + param + "=" + value + '$2');
  } else {
    return url + separator + param + "=" + value;
  }
};

export const setParamsBlockly = (app: BlocklyApplicationType): void => {
  const searchParams = new URLSearchParams(window.location.search);
  let newParam: string | null;
  let dropdownMenu: HTMLSelectElement;
  newParam = searchParams.get('lang');
  dropdownMenu = document.getElementById('languageMenu') as HTMLSelectElement;
  if (newParam == null || newParam == "null")
    newParam = dropdownMenu.options[dropdownMenu.selectedIndex].value;
  else
    (document.getElementById('languageMenu')! as HTMLSelectElement).value = newParam;
  window.sessionStorage?.setItem('paramLang', newParam);
  window.history.pushState({}, "µcB", addReplaceParamToUrl(window.location.search, "lang", newParam));

  newParam = searchParams.get('theme');
  dropdownMenu = document.getElementById('themeMenu') as HTMLSelectElement;
  if (newParam == null || newParam == "null")
    newParam = dropdownMenu.options[dropdownMenu.selectedIndex].value;
  else
    (document.getElementById('themeMenu')! as HTMLSelectElement).value = newParam;
  app.WORKSPACE_OPTIONS['theme'] = newParam;
  window.sessionStorage?.setItem('paramTheme', newParam);
  window.history.pushState({}, "µcB", addReplaceParamToUrl(window.location.search, "theme", newParam));

  newParam = searchParams.get('renderer');
  dropdownMenu = document.getElementById('rendererMenu') as HTMLSelectElement;
  if (newParam == null || newParam == "null")
    newParam = dropdownMenu.options[dropdownMenu.selectedIndex].value;
  else
    (document.getElementById('rendererMenu')! as HTMLSelectElement).value = newParam;
  app.WORKSPACE_OPTIONS['renderer'] = newParam;
  window.sessionStorage?.setItem('paramRenderer', newParam);
  window.history.pushState({}, "µcB", addReplaceParamToUrl(window.location.search, "renderer", newParam));
};

export const setPluginsInURL = (pluginName: string, pluginKey: string): void => {
  const searchParams = new URLSearchParams(window.location.search);
  let paramsURL: string[] | null = [""];
  if (searchParams.get('options') !== null)
    paramsURL = searchParams.get('options')!.split(',');
  //clean array from all null or undefined entry
  paramsURL = paramsURL.filter(Boolean);

  let result: string = "";
  const checkBox: boolean = (document.getElementById(pluginName) as HTMLInputElement).checked;
  window.sessionStorage.setItem(pluginName, checkBox.toString());
  if (checkBox) {
    if (!paramsURL.includes(pluginKey)) {
      paramsURL.push(pluginKey);
    }
    result = paramsURL.join(',');
  } else {
    result = paramsURL.join(',');
    result = result.split(",").filter(n => n != pluginKey).join(",");
  }
  window.history.pushState({}, "µcB", addReplaceParamToUrl(window.location.search, "options", result));
}