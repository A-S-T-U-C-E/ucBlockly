/**
 * @packageDocumentation Script file to save and load blocks on workspace
 * Author scanet\@libreducc (Sébastien Canet)
 */

/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as Blockly from 'blockly/core';

const storageKey = 'mainWorkspace';

/**
 * The function `workspaceSaveBlocks` saves the blocks in a Blockly workspace to the local storage.
 * @param workspace - The `workspace` parameter is an instance of the Blockly.Workspace class. It
 * represents the Blockly workspace that contains all the blocks and their connections.
 */
export const workspaceSaveBlocks = (workspace: Blockly.Workspace) => {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
};

/**
  * The function `workspaceLoadBlocks` loads blocks from local storage into a Blockly workspace.
  * @param workspace - The "workspace" parameter is an instance of the Blockly.Workspace class. It
  * represents the Blockly workspace where blocks are loaded.
  * @returns If there is no data in the localStorage, then nothing is being returned.
  */

export const workspaceLoadBlocks = (workspace: Blockly.Workspace) => {
  const data = window.localStorage?.getItem(storageKey);
  if (!data) return;

  // Don't emit events during loading.
  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(JSON.parse(data), workspace);
  Blockly.Events.enable();
};
