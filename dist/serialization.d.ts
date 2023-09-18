/**
 * @packageDocumentation Script file to save and load blocks on workspace
 * @author scanet\@libreducc (Sébastien Canet)
 */
/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import * as Blockly from 'blockly/core';
/**
 * The function `workspaceSaveBlocks` saves the blocks in a Blockly workspace to the local storage.
 * @param workspace - The `workspace` parameter is an instance of the Blockly.Workspace class. It
 * represents the Blockly workspace that contains all the blocks and their connections.
 */
export declare const workspaceSaveBlocks: (workspace: Blockly.Workspace, storageKeyWorkspaceBlocks: string) => void;
/**
 * The function loads blocks into a Blockly workspace from session storage.
 * @param workspace - The `workspace` parameter is an instance of the `Blockly.Workspace` class. It
 * represents the Blockly workspace where blocks are loaded.
 * @returns If the `data` variable is falsy (null, undefined, empty string), then nothing is being
 * returned.
 */
export declare const workspaceLoadBlocks: (workspace: Blockly.Workspace, storageKeyWorkspaceBlocks: string) => void;
//# sourceMappingURL=serialization.d.ts.map