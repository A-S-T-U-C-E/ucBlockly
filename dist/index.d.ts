/**
 * @packageDocumentation General script file for index
 * Author scanet\@libreducc (Sébastien Canet)
 */
/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import * as Blockly from 'blockly';
import 'blockly/blocks';
import { ToolboxConfiguration } from './toolbox';
import './css/index.css';
import './css/µcBlockly.css';
/**
 * Create an empty application.
 */
export interface BlocklyApplicationType {
    workspace?: Blockly.Workspace;
    toolbox?: ToolboxConfiguration;
    LANGUAGE_NAME: Record<string, string>;
    LANGUAGE_RTL: string[];
}
export declare const µcB: BlocklyApplicationType;
/**
 * The function `genWorkspace` creates a Blockly workspace with specified options and injects it into a
 * specified HTML element.
 * @param isRtl - The `isRtl` parameter is a boolean value that determines whether the
 * workspace should be displayed in right-to-left (RTL) mode. If `isRtl` is `true`, the workspace will
 * be displayed in RTL mode, otherwise it will be displayed in left-to-right (LTR) mode
 */
export declare const genWorkspace: (isRtl: boolean) => void;
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
//# sourceMappingURL=index.d.ts.map