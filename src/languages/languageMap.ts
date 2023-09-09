/**
 * @packageDocumentation Define type and table of translated definition
 * Author scanet\@libreducc (Sébastien Canet)
 */

/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { arLang } from './ar';
import { esLang } from './es';
import { enLang } from './en';
import { frLang } from './fr';

/* The `export interface LanguageMap` is defining an interface called `LanguageMap`. This interface
represents a mapping of language codes (string keys) to language items (values of type
`LanguageItem`). The `LanguageItem` interface defines the structure of each language item,
specifying the properties and their types. */
export interface LanguageMap {
  [key: string]: LanguageItem;
}

/* The code is creating a constant variable `languagesMap` of type `LanguageMap`. `LanguageMap` is an
interface that defines an object with string keys and values of type `LanguageItem`. */
export const languagesMap: LanguageMap = {
  'ar': arLang["ar"],
  'es': esLang["es"],
  'en': enLang["en"],
  'fr': frLang["fr"],
}

import * as ar from 'blockly/msg/ar';
import * as en from 'blockly/msg/en';
import * as es from 'blockly/msg/es';
import * as fr from 'blockly/msg/fr';

// Create a type for the Blockly workspace language map
type LanguageMapBlockly = {
  [key: string]: { [key: string]: string };
}

// Create table for alockly workspace language map
export const languagesMapBlockly: LanguageMapBlockly = {
  'ar': ar,
  'es': es,
  'en': en,
  'fr': fr,
};

/* The `export interface LanguageItem` is defining an interface called `LanguageItem`. This interface
specifies the structure of each language item, specifying the properties and their types. In this
case, the `LanguageItem` interface has the following properties: */
export interface LanguageItem {
  HOME: string;
  ABOUT: string;
  CONTACT: string;
  CAT_LOGIC: string;
  CAT_LOOPS: string;
  CAT_MATHS: string;
  CAT_TEXT: string;
  CAT_LISTS: string;
  CAT_COLOR: string;
  CAT_VARIABLES: string;
  CAT_FUNCTIONS: string;
}