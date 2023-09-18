/**
 * @packageDocumentation General script file for index
 * @author scanet\@libreducc (Sébastien Canet)
 */
/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */
import * as Blockly from 'blockly';
import 'blockly/blocks';
import '@blockly/toolbox-search';
import { ToolboxConfiguration } from './toolbox';
import './css/index.css';
import './css/µcBlockly.css';
/**
 * Create an empty application.
 */
export interface BlocklyApplicationType {
    workspace: Blockly.Workspace;
    toolbox: ToolboxConfiguration;
    LANGUAGE_NAME: Record<string, string>;
    LANGUAGE_RTL: string[];
    WORKSPACE_OPTIONS: Record<string, unknown>;
}
export declare const µcB: BlocklyApplicationType;
/**
 * The `workspaceReboot` function saves the current workspace, sets up workspace plugins, disposes the
 * current workspace, changes the language based on the selected option in the dropdown menu, injects a
 * new workspace, logs the main workspace blocks from the session storage, sets up workspace plugins
 * again, and loads the saved blocks into the new workspace.
 */
export declare const workspaceReboot: (app: BlocklyApplicationType) => void;
export declare const workspaceSetupPlugins: (workspace: Blockly.Workspace, disposePlugin?: boolean) => void;
//# sourceMappingURL=index.d.ts.map