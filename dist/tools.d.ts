/**
 * @packageDocumentation General script file for various function useful for application
 * @author Blockly Team (https://github.com/google/blockly/blob/develop/demos/code/code.js)
 * @author scanet\@libreducc (Sébastien Canet)
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
export declare const addReplaceParamToUrl: (url: string, param: string, value: string) => string;
/**
 * The function `getStringParamFromUrl` retrieves a string parameter from the URL and returns its
 * value, or a default value if the parameter is not found.
 * @param name - The `name` parameter is a string that represents the name of the parameter
 * you want to extract from the URL.
 * @param defaultValue - The `defaultValue` parameter is a string that represents the default
 * value to be returned if the specified query parameter is not found in the URL.
 * @returns The function `getStringParamFromUrl` returns a string value.
 */
export declare const getStringParamFromUrl: (name: string) => string;
export declare const setParams: (app: BlocklyApplicationType) => void;
//# sourceMappingURL=tools.d.ts.map