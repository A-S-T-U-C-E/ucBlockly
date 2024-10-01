/**
 * @packageDocumentation Complete helper functions for generating Arduino for blocks.
 * @author scanet\@libreduc.cc (Sébastien Canet)
 */

/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as Blockly from "blockly";

export enum Order {
  ATOMIC = 0, // 0 "" ...
  NEW = 1.1, // new
  MEMBER = 1.2, // . []
  FUNCTION_CALL = 2, // ()
  INCREMENT = 3.1, // ++
  DECREMENT = 3.2, // --
  BITWISE_NOT = 4.1, // ~
  UNARY_PLUS = 4.2, // +
  UNARY_NEGATION = 4.3, // -
  LOGICAL_NOT = 4.4, // !
  TYPEOF = 4.5, // typeof
  VOID = 4.6, // void
  DELETE = 4.7, // delete
  AWAIT = 4.8, // await
  EXPONENTIATION = 5.0, // **
  MULTIPLICATION = 5.1, // *
  DIVISION = 5.2, // /
  MODULUS = 5.3, // %
  SUBTRACTION = 6.1, // -
  ADDITION = 6.2, // +
  BITWISE_SHIFT = 7, // << >> >>>
  RELATIONAL = 8, // < <= > >=
  IN = 8.1, // in
  INSTANCEOF = 8.2, // instanceof
  EQUALITY = 9, // == != === !==
  BITWISE_AND = 10, // &
  BITWISE_XOR = 11, // ^
  BITWISE_OR = 12, // |
  LOGICAL_AND = 13, // &&
  LOGICAL_OR = 14, // ||
  CONDITIONAL = 15, // ?:
  ASSIGNMENT = 16, // = += -= **= *= /= %= <<= >>= ...
  YIELD = 17, // yield
  COMMA = 18, // ,
  NONE = 99, // (...)
}
/**
 * JavaScript code generator class.
 */
export class ArduinoGenerator extends Blockly.CodeGenerator {
  // macros define
  private macros_ = Object.create(null);
  // libraries
  private libraries_ = Object.create(null);
  // variables definition
  private variables_ = Object.create(null);
  // objetcs definition
  private objects_ = Object.create(null);
  // functions definition
  private functions_ = Object.create(null);
  // setup
  private setups_ = Object.create(null);
  // user defined setup
  private userSetups_ = Object.create(null);
  // loop
  private loops_ = Object.create(null);
  /**
   * List of outer-inner pairings that do NOT require parentheses.
   * @type {!Array<!Array<number>>}
   */
  ORDER_OVERRIDES: [Order, Order][] = [
    // (foo()).bar -> foo().bar
    // (foo())[0] -> foo()[0]
    [Order.FUNCTION_CALL, Order.MEMBER],
    // (foo())() -> foo()()
    [Order.FUNCTION_CALL, Order.FUNCTION_CALL],
    // (foo.bar).baz -> foo.bar.baz
    // (foo.bar)[0] -> foo.bar[0]
    // (foo[0]).bar -> foo[0].bar
    // (foo[0])[1] -> foo[0][1]
    [Order.MEMBER, Order.MEMBER],
    // (foo.bar)() -> foo.bar()
    // (foo[0])() -> foo[0]()
    [Order.MEMBER, Order.FUNCTION_CALL],

    // !(!foo) -> !!foo
    [Order.LOGICAL_NOT, Order.LOGICAL_NOT],
    // a * (b * c) -> a * b * c
    [Order.MULTIPLICATION, Order.MULTIPLICATION],
    // a + (b + c) -> a + b + c
    [Order.ADDITION, Order.ADDITION],
    // a && (b && c) -> a && b && c
    [Order.LOGICAL_AND, Order.LOGICAL_AND],
    // a || (b || c) -> a || b || c
    [Order.LOGICAL_OR, Order.LOGICAL_OR],
  ];
  constructor(name = "Arduino") {
    super(name);
    this.isInitialized = false;
    for (const key in Order) {
      // Must assign Order[key] to a temporary to get the type guard to work;
      // see https://github.com/microsoft/TypeScript/issues/10530.
      const value = Order[key];
      // Skip reverse-lookup entries in the enum.  Due to
      // https://github.com/microsoft/TypeScript/issues/55713 this (as
      // of TypeScript 5.5.2) actually narrows the type of value to
      // never - but that still allows the following assignment to
      // succeed.
      if (typeof value === "string") continue;
      (this as unknown as Record<string, Order>)["ORDER_" + key] = value;
    }

    this.addReservedWords(
      "setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto," +
        "define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer," +
        "constants,floating,point,void,boolean,char,unsigned,byte,int,word,long," +
        "float,double,string,String,array,static,volatile,const,sizeof,pinMode," +
        "digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone," +
        "noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds," +
        "min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random," +
        "lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt," +
        "detachInterrupt,interrupts,noInterrupts" +
        Object.getOwnPropertyNames(globalThis).join(","),
    );
  }

  /**
   * Initialise the database of variable names.
   *
   * @param workspace Workspace to generate code from.
   */
  init(workspace: Blockly.Workspace) {
    super.init(workspace);

    this.macros_ = Object.create(null);
    this.libraries_ = Object.create(null);
    this.variables_ = Object.create(null);
    this.objects_ = Object.create(null);
    this.functions_ = Object.create(null);
    this.setups_ = Object.create(null);
    this.userSetups_ = Object.create(null);
    this.loops_ = Object.create(null);

    if (!this.nameDB_) {
      this.nameDB_ = new Blockly.Names(this.RESERVED_WORDS_);
    } else {
      this.nameDB_.reset();
    }

    this.nameDB_!.setVariableMap(workspace.getVariableMap());
    this.nameDB_!.populateVariables(workspace);
    this.nameDB_!.populateProcedures(workspace);

    const defvars = [];
    // Add developer variables (not created or named by the user).
    const devVarList = Blockly.Variables.allDeveloperVariables(workspace);
    for (let i = 0; i < devVarList.length; i++) {
      defvars.push(
        this.nameDB_!.getName(
          devVarList[i],
          Blockly.Names.NameType.DEVELOPER_VARIABLE,
        ),
      );
    }

    // Add user variables, but only ones that are being used.
    const variables = Blockly.Variables.allUsedVarModels(workspace);
    for (let i = 0; i < variables.length; i++) {
      defvars.push(
        this.nameDB_!.getName(
          variables[i].getId(),
          Blockly.Names.NameType.VARIABLE,
        ),
      );
    }

    // Declare all of the variables.
    if (defvars.length) {
      this.definitions_["variables"] = "int " + defvars.join(", ") + ";";
    }
    this.isInitialized = true;
  }

  /**
   * Prepend the generated code with the variable definitions.
   *
   * @param code Generated code.
   * @returns Completed code.
   */
  finish(code: string): string {
    // Convert the definitions dictionary into a list.
    const definitions = Object.values(this.definitions_);
    // macros definition
    const macros = Object.values(this.macros_);
    // libraries
    const libraries = Object.values(this.libraries_);
    // variables definition
    const variables = Object.values(this.variables_);
    // objetcs definition
    const objects = Object.values(this.objects_);
    // functions definition
    const functions = Object.values(this.functions_);
    // setup
    const setups = Object.values(this.setups_);
    // user defined setup
    const userSetups = Object.values(this.userSetups_);
    // loop
    const loops = Object.values(this.loops_);

    // Call Blockly.CodeGenerator's finish.
    super.finish(code);
    this.isInitialized = false;

    this.nameDB_!.reset();

    const newcode =
      (macros.length > 0 ? `${macros.join("\n")}\n\n` : "") +
      (libraries.length > 0 ? `${libraries.join("\n")}\n\n` : "") +
      (variables.length > 0 ? `${variables.join("\n")}\n\n` : "") +
      (objects.length > 0 ? `${objects.join("\n")}\n\n` : "") +
      (functions.length > 0 ? `${functions.join("\n")}\n\n` : "") +
      `void setup() {\n${setups.join("\n")}\n${userSetups.join("\n")}\n}\n\n` +
      `void loop() {\n${loops.join("\n") + code}\n}`;
    return newcode;
  }

  addMacro(tag: string, code: string): void {
    if (this.macros_[tag] === undefined) {
      this.macros_[tag] = code;
    }
  }

  addLibrary(tag: string, code: string): void {
    if (this.libraries_[tag] === undefined) {
      this.libraries_[tag] = code;
    }
  }

  addVariable(tag: string, code: string): void {
    if (this.variables_[tag] === undefined) {
      this.variables_[tag] = code;
    }
  }

  addObject(tag: string, code: string): void {
    if (this.objects_[tag] === undefined) {
      this.objects_[tag] = code;
    }
  }

  addFunction(tag: string, code: string): void {
    if (this.functions_[tag] === undefined) {
      this.functions_[tag] = code;
    }
  }

  addSetup(tag: string, code: string): void {
    if (this.setups_[tag] === undefined) {
      this.setups_[tag] = code;
    }
  }

  addUserSetup(tag: string, code: string): void {
    if (this.userSetups_[tag] === undefined) {
      this.userSetups_[tag] = code;
    }
  }

  addLoop(tag: string, code: string): void {
    if (this.loops_[tag] === undefined) {
      this.loops_[tag] = code;
    }
  }

  /**
   * Naked values are top-level blocks with outputs that aren't plugged into
   * anything.  A trailing semicolon is needed to make this legal.
   * @param {string} line Line of generated code.
   * @return {string} Legal line of code.
   */
  scrubNakedValue(line: string): string {
    return line + "\n";
  }

  /**
   * Encode a string as a properly escaped Arduino string, complete with quotes.
   *
   * @param string Text to encode.
   * @returns Arduino string.
   */
  quote_(string: string): string {
    string = string.replace(/\\/g, "\\\\").replace(/\n/g, "\\\n");

    let quote = "'";
    if (string.indexOf("'") !== -1) {
      if (string.indexOf('"') === -1) {
        quote = '"';
      } else {
        string = string.replace(/'/g, "\\'");
      }
    }
    return quote + string + quote;
  }

  /**
   * Encode a string as a properly escaped multiline Arduino string, complete
   * with quotes.
   *
   * @param string Text to encode.
   * @returns Arduino string.
   */
  multiline_quote_(string: string): string {
    const lines = string.split(/\n/g).map(this.quote_);
    // Join with the following, plus a newline:
    // + '\n' +
    return lines.join(" + '\\n' + \n");
  }

  /**
   * Common tasks for generating Arduino from blocks.
   * Handles comments for the specified block and any connected value blocks.
   * Calls any statements following this block.
   *
   * @param block The current block.
   * @param code The Arduino code created for this block.
   * @param thisOnly True to generate code for only this statement.
   * @returns Arduino code with comments and subsequent blocks added.

   */
  scrub_(block: Blockly.Block, code: string, thisOnly = false): string {
    let commentCode = "";
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      // Collect comment for this block.
      let comment = block.getCommentText();
      if (comment) {
        comment = Blockly.utils.string.wrap(comment, this.COMMENT_WRAP - 3);
        commentCode += this.prefixLines(comment + "\n", "// ");
      }
      // Collect comments for all value arguments.
      // Don't collect comments for nested statements.
      for (let i = 0; i < block.inputList.length; i++) {
        if (block.inputList[i].type === Blockly.inputs.inputTypes.VALUE) {
          const childBlock = block.inputList[i].connection!.targetBlock();
          if (childBlock) {
            comment = this.allNestedComments(childBlock);
            if (comment) {
              commentCode += this.prefixLines(comment, "// ");
            }
          }
        }
      }
    }
    const nextBlock =
      block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = thisOnly ? "" : this.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  }
}
