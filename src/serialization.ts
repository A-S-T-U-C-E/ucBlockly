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
export const workspaceSaveBlocks = function(workspace: Blockly.Workspace, storageKeyWorkspaceBlocks: string) {
  const data = Blockly.serialization.workspaces.save(workspace);
  window.sessionStorage?.setItem(storageKeyWorkspaceBlocks, JSON.stringify(data));
};

/**
 * The function loads blocks into a Blockly workspace from session storage.
 * @param workspace - The `workspace` parameter is an instance of the `Blockly.Workspace` class. It
 * represents the Blockly workspace where blocks are loaded.
 * @returns If the `data` variable is falsy (null, undefined, empty string), then nothing is being
 * returned.
 */
export const workspaceLoadBlocks = function(workspace: Blockly.Workspace, storageKeyWorkspaceBlocks: string) {
  const data = window.sessionStorage?.getItem(storageKeyWorkspaceBlocks);
  if (!data) return;

  // Don't emit events during loading.
  Blockly.Events.disable();
  Blockly.serialization.workspaces.load(JSON.parse(data), workspace);
  Blockly.Events.enable();
};

//blockly json serialization and merging 
/* function remove_blocks(obj: Blockly.Block) {
  const properties = Object.getOwnPropertyNames(obj)
  for (const element of properties) {
    if (element == 'block') {
      // remove the block but keep the id
      const id = obj['block'].id
      delete obj['block']
      obj.block = { "id": id }
    } else if (typeof (obj[element]) == 'object') {
      remove_blocks(obj[element])
    }
  }
}

function inject_blocks(obj: Blockly.Block, saved_blocks: Blockly.Block) {
  const properties = Object.getOwnPropertyNames(obj)
  for (const element of properties) {
    if (element == 'block') {
      obj.block = saved_blocks[obj.block.id]
    } else if (typeof (obj[element]) == 'object') {
      inject_blocks(obj[element], saved_blocks)
    }
  }
}

function save_mergeable(workspace) {
  const blocks = workspace.getAllBlocks();
  const save_blocks = {};
  for (const element of blocks) {
    const json_obj = Blockly.serialization.blocks.save(element, {
      addCoordinates: true,
      addInputBlocks: true,
      addNextBlocks: true,
      doFullSerialization: true
    })

    remove_blocks(json_obj)
    save_blocks[element.id] = json_obj

  }
  save_blocks['top_blocks'] = workspace.getTopBlocks().map(block => block.id);


  return save_blocks
}

function load_mergeable(saved_blocks, workspace) {
  const keys = Object.keys(saved_blocks)
  for (const element of keys) {
    inject_blocks(saved_blocks[element], saved_blocks)
  }
  workspace.clear()
  for (const element of saved_blocks['top_blocks']) {
    const id = element;
    Blockly.serialization.blocks.append(saved_blocks[id], workspace)
  }
} */