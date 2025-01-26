/**
 * @packageDocumentation Complete helper functions for generating Arduino for blocks.
 * @author scanet\@libreduc.cc (Sébastien Canet)
 */

/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import {ArduinoGenerator} from './arduino/arduino_generator';
/* import * as colour from './arduino/colour.js';
import * as lists from './arduino/lists.js'; */
import * as logic from './arduino/logic';
/* import * as loops from './arduino/loops.js';
import * as math from './arduino/math.js';
import * as procedures from './arduino/procedures.js';
import * as text from './arduino/text.js';
import * as variables from './arduino/variables.js';
import * as variablesDynamic from './arduino/variables_dynamic.js'; */

export * from './arduino/arduino_generator';

/**
 * Arduino code generator instance.
 * {@type ArduinoGenerator}
 */
export const arduinoGenerator: ArduinoGenerator = new ArduinoGenerator();
// Add reserved words.  This list should include all words mentioned
// in RESERVED WORDS: comments in the imports above.
arduinoGenerator.addReservedWords('math,random,Number');

// Install per-block-type generator functions:
const generators: typeof arduinoGenerator.forBlock = {
  ...logic,
};
for (const name in generators) {
  arduinoGenerator.forBlock[name] = generators[name];
}
