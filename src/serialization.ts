/**
 * @packageDocumentation Script file to save and load blocks on workspace
 * @author scanet\@libreduc.cc (Sébastien Canet)
 */

/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

//import * as Blockly from 'blockly/core';


//blockly json serialization and merging 
/*function remove_blocks(obj: Blockly.Block) {
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
}*/