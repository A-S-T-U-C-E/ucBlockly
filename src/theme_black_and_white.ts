/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @packageDocumentation Black & White theme.
 */

import * as Blockly from 'blockly/core';

export default Blockly.Theme.defineTheme('black_and_white', {
  'name': 'Black and white',
  'base': Blockly.Themes.Classic,
  'blockStyles': {
    'colour_blocks': {
      'colourPrimary': '#000000',
      'colourSecondary': '#000000',
      'colourTertiary': '#000000',
    },
    'list_blocks': {
      'colourPrimary': '#000000',
      'colourSecondary': '#000000',
      'colourTertiary': '#000000',
    },
    'logic_blocks': {
      'colourPrimary': '#000000',
      'colourSecondary': '#000000',
      'colourTertiary': '#000000',
    },
    'loop_blocks': {
      'colourPrimary': '#000000',
      'colourSecondary': '#000000',
      'colourTertiary': '#000000',
    },
    'math_blocks': {
      'colourPrimary': '#000000',
      'colourSecondary': '#000000',
      'colourTertiary': '#000000',
    },
    'procedure_blocks': {
      'colourPrimary': '#000000',
      'colourSecondary': '#000000',
      'colourTertiary': '#000000',
    },
    'text_blocks': {
      'colourPrimary': '#000000',
      'colourSecondary': '#000000',
      'colourTertiary': '#000000',
    },
    'variable_blocks': {
      'colourPrimary': '#000000',
      'colourSecondary': '#000000',
      'colourTertiary': '#000000',
    },
    'variable_dynamic_blocks': {
      'colourPrimary': '#000000',
      'colourSecondary': '#000000',
      'colourTertiary': '#000000',
    },
    'hat_blocks': {
      'colourPrimary': '#000000',
      'colourSecondary': '#000000',
      'colourTertiary': '#000000',
      'hat': 'cap',
    },
  },
  'categoryStyles': {
    'colour_category': {
      'colour': '#000000',
    },
    'list_category': {
      'colour': '#000000',
    },
    'logic_category': {
      'colour': '#000000',
    },
    'loop_category': {
      'colour': '#000000',
    },
    'math_category': {
      'colour': '#000000',
    },
    'procedure_category': {
      'colour': '#000000',
    },
    'text_category': {
      'colour': '#000000',
    },
    'variable_category': {
      'colour': '#000000',
    },
    'variable_dynamic_category': {
      'colour': '#000000',
    },
  },
  'componentStyles': {},
  'fontStyle': {},
  'startHats': undefined,
});