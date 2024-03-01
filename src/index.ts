/**
 * @packageDocumentation General script file for index
 * @author scanet\@libreduc.cc (Sébastien Canet)
 */

/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as Blockly from "blockly";
import * as monaco from 'monaco-editor';
//import { blocks } from "blockly/blocks";
import "@blockly/block-plus-minus";
import "@blockly/toolbox-search";

import { arduinoGenerator } from "./generators/arduino";
import { workspaceSaveBlocks, workspaceLoadBlocks } from "./serialization";
import { HTML_populateLanguages, µcB_changeLanguage } from "./language";
import { changeTheme, changeRenderer } from "./options";
import { basic_toolbox2, ToolboxConfiguration } from "./toolbox";
import { setParamsBlockly, setPluginsInURL } from "./tools";

//plugins

/* import {blocks, unregisterProcedureBlocks} from '@blockly/block-shareable-procedures';
unregisterProcedureBlocks();
Blockly.common.defineBlocks(blocks);*/
import { Backpack } from "@blockly/workspace-backpack";
import { PositionedMinimap } from "@blockly/workspace-minimap";
import { ZoomToFitControl } from "@blockly/zoom-to-fit";
import { WorkspaceSearch } from "@blockly/plugin-workspace-search";
import { ContentHighlight } from "@blockly/workspace-content-highlight";
import { Modal } from "@blockly/plugin-modal";
import { NavigationController } from "@blockly/keyboard-navigation";
import { shadowBlockConversionChangeListener } from "@blockly/shadow-block-converter";
import { ContinuousToolbox, ContinuousFlyout, ContinuousMetrics } from '@blockly/continuous-toolbox';
import { Multiselect, MultiselectBlockDragger } from '@mit-app-inventor/blockly-plugin-workspace-multiselect';
//import { LexicalVariablesPlugin } from '@mit-app-inventor/blockly-block-lexical-variables';

import "./css/index.css";
import "./css/µcBlockly.css";


// Set up UI elements
const div_workspace_content_area: HTMLElement = document.getElementById("div_workspace_content_area")!;
const div_workspace_content_blockly: HTMLElement = document.getElementById("div_workspace_content_blockly")!;
const div_content_code: HTMLElement = document.getElementById('div_content_code')!;
const div_content_monacoEditor: HTMLElement = document.getElementById('div_content_monacoEditor')!;

const codeEditor = monaco.editor.create(div_content_monacoEditor, {
  automaticLayout: true,
  formatOnPaste: true,
  formatOnType: true,
  language: 'cpp',
  lineNumbers: "on",
  readOnly: false,
  scrollBeyondLastLine: false,
});
div_content_monacoEditor.style.display = 'none';

/**
 * Create an empty application.
 */
/* The above code is defining an interface called `BlocklyApplicationType` in TypeScript. This
interface has the following properties: */
export interface BlocklyApplicationType {
  workspace: Blockly.Workspace;
  toolbox: ToolboxConfiguration;
  toolboxChoice: string;
  LANGUAGE_NAME: Record<string, string>;
  LANGUAGE_RTL: string[];
  PLUGINS: string[];
  WORKSPACE_OPTIONS: Record<string, unknown>;
}
/* The above code is defining a constant variable named `µcB` which is of type
`BlocklyApplicationType`. It exports this variable for use in other modules. The
`BlocklyApplicationType` is an interface or type that is not shown in the code snippet. The
`LANGUAGE_NAME` property is an empty object, and the `LANGUAGE_RTL` property is an empty array. */
export const µcB: BlocklyApplicationType = {
  workspace: new Blockly.Workspace(),
  toolbox: JSON.parse(JSON.stringify(basic_toolbox2)), //deep copy
  toolboxChoice: "cat",
  LANGUAGE_NAME: {},
  LANGUAGE_RTL: [],
  PLUGINS: [],
  WORKSPACE_OPTIONS: {},
};

/**
 * Define all options for workspace.
 */
µcB.WORKSPACE_OPTIONS = {
  grid: {
    spacing: 20,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
  scrollbars: true,
  toolbox: µcB.toolbox,
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 6,
    minScale: 0.1,
    scaleSpeed: 1.2,
    pinch: true,
  },
  trashcan: true,
  plugins: {
    'blockDragger': MultiselectBlockDragger,
  },
  // For integration with other plugins that also
  // need to change the blockDragger above (such as
  // scroll-options).
  //baseBlockDragger: ScrollBlockDragger,

  // Double click the blocks to collapse/expand
  // them (A feature from MIT App Inventor).
  useDoubleClick: true,
  // Bump neighbours after dragging to avoid overlapping.
  bumpNeighbours: false,
  // Keep the fields of multiple selected same-type blocks with the same value
  multiFieldUpdate: true,
  // Use custom icon for the multi select controls.
  multiselectIcon: {
    hideIcon: false,
    weight: 3,
    enabledIcon: 'https://github.com/mit-cml/workspace-multiselect/raw/main/test/media/select.svg',
    disabledIcon: 'https://github.com/mit-cml/workspace-multiselect/raw/main/test/media/unselect.svg',
  },
  multiselectCopyPaste: {
    // Enable the copy/paste accross tabs feature (true by default).
    crossTab: true,
    // Show the copy/paste menu entries (true by default).
    menu: true,
  },
};

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
µcB.LANGUAGE_NAME = {
  ar: "العربية",
  en: "English",
  es: "Español",
  fr: "Français",
};

/**
 * List of RTL languages.
 */
µcB.LANGUAGE_RTL = ["ar", "fa", "he", "lki"];

/* The above code is creating instances of different plugins for a TypeScript application.*/
const plugin_KeyboardNav = new NavigationController();
let plugin_contentHighlight = new ContentHighlight();
let plugin_minimap = new PositionedMinimap();
let plugin_modal = new Modal();
let plugin_workspaceSearch = new WorkspaceSearch();
let plugin_zoomToFit = new ZoomToFitControl();

/**
 * The `µcB_workspaceOnResize` function calculates the position and dimensions of `div_workspace_content_blockly` based on the
 * position and dimensions of `div_workspace_content_area`, and then resizes the Blockly workspace inside it.
 */
const µcB_workspaceOnResize = (): void => {
  let x: number = 0;
  let y: number = 0;
  let element: HTMLElement = div_workspace_content_area;
  do {
    x += element.offsetLeft;
    y += element.offsetTop;
    element = element.offsetParent as HTMLElement;
  } while (element);
  div_workspace_content_blockly.style.width =
    div_workspace_content_area.offsetWidth + "px";
  div_workspace_content_blockly.style.height =
    div_workspace_content_area.offsetHeight + "px";
  div_workspace_content_blockly.style.left = x + "px";
  div_workspace_content_blockly.style.top = y + "px";
  Blockly.svgResize(µcB.workspace as Blockly.WorkspaceSvg);
};

/**
 * The function `µcB_workspaceManageResize` is a TypeScript function that handles resizing of elements
 * in a workspace.
 * @param mouseDown - The `mouseDown` parameter is an object that represents the mouse down event. It contains
 * information about the event, such as the target element and the position of the mouse.
 * @param sizeProp - The `sizeProp` parameter is used to specify the property that represents the
 * size of the elements being resized. It can be any valid property that represents the size, such as
 * `offsetWidth`, `offsetHeight`, `clientWidth`, `clientHeight`, etc.
 * @param posProp - The `posProp` parameter is a string that represents the property of the mouse
 * event object that contains the position value. It can be either "pageX" or "pageY" depending on
 * whether the resizing is happening horizontally or vertically.
 * @returns The function does not have a return statement, so it does not return anything.
 */
const µcB_workspaceManageResize = (
  mouseDown: Event,
  sizeProp: string,
  posProp: string,
): void => {
  const recall: HTMLElement = mouseDown.target as HTMLElement;
  const prev = recall?.previousElementSibling as HTMLInputElement | null;
  const next = recall?.nextElementSibling as HTMLInputElement | null;
  if (!prev || !next) {
    return;
  }
  mouseDown.preventDefault();
  interface IElement {
    [key: string]: string;
  }
  let prevSize: number = Number((prev as unknown as IElement)[sizeProp]);
  let nextSize: number = Number((next as unknown as IElement)[sizeProp]);
  const sumSize: number = prevSize + nextSize;
  const prevGrow: number = Number(prev.style.flexGrow);
  const nextGrow: number = Number(next.style.flexGrow);
  const sumGrow: number = prevGrow + nextGrow;
  let lastPos: number = Number((mouseDown as unknown as IElement)[posProp]);

  /**
   * The function `onMouseMove` adjusts the flex grow values of two elements based on the mouse
   * movement.
   * @param mouseMove - The parameter "mouseMove" represents the mouse move event object. It contains
   * information about the mouse position and other related data.
   */
  const onMouseMove = (mouseMove: Event): void => {
    let pos: number = Number((mouseMove as unknown as IElement)[posProp]);
    const difference: number = pos - lastPos;
    prevSize += difference;
    nextSize -= difference;
    if (prevSize < 0) {
      nextSize += prevSize;
      pos -= prevSize;
      prevSize = 0;
    }
    if (nextSize < 0) {
      prevSize += nextSize;
      pos += nextSize;
      nextSize = 0;
    }
    const prevGrowNew: number = sumGrow * (prevSize / sumSize);
    const nextGrowNew: number = sumGrow * (nextSize / sumSize);
    prev.style.flexGrow = String(prevGrowNew);
    next.style.flexGrow = String(nextGrowNew);
    lastPos = pos;
    µcB_workspaceOnResize();
  };

  /**
   * The function `onMouseUp` sets the cursor style and removes event listeners when the mouse button
   * is released.
   */
  const onMouseUp = (): void => {
    const html = document.querySelector("html") as HTMLElement;
    html.style.cursor = "default";
    if (String(posProp) === "pageX") {
      recall.style.cursor = "ew-resize";
    } else {
      recall.style.cursor = "ns-resize";
    }
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
};

/**
 * The function `µcB_addFlexResizerEvents` adds event listeners to the body of the document to handle mouse
 * events on flex resizer elements and resize the Blockly workspace accordingly.
 * @param workspace - The `workspace` parameter is of type `Blockly.WorkspaceSvg`. It represents the
 * Blockly workspace on which the resizer events will be added.
 * @returns Nothing is being returned. The function has a return type of `void`, which means it does
 * not return any value.
 */
const µcB_addFlexResizerEvents = (): void => {
  document.body.addEventListener("mousedown", function (mouseDown: Event) {
    const html = document.querySelector("html") as HTMLElement;
    const mouseTarget = mouseDown.target as HTMLElement;
    if (mouseTarget.nodeType !== 1 || mouseTarget.tagName !== "FLEX-RESIZER") {
      return;
    }
    const parentNode = mouseTarget.parentNode as HTMLElement;
    const resizeHorizontal: boolean = parentNode.classList.contains("wrapper_element");
    const resizeVertical: boolean = parentNode.classList.contains("wrapper_global");
    if (resizeHorizontal && resizeVertical) {
      return;
    } else if (resizeHorizontal) {
      mouseTarget.style.cursor = "col-resize";
      html.style.cursor = "col-resize"; // avoid cursor's flickering
      µcB_workspaceManageResize(mouseDown, "offsetWidth", "pageX");
    } else if (resizeVertical) {
      mouseTarget.style.cursor = "row-resize";
      html.style.cursor = "row-resize"; // avoid cursor's flickering
      µcB_workspaceManageResize(mouseDown, "offsetHeight", "pageY");
    }
    Blockly.svgResize(µcB.workspace as Blockly.WorkspaceSvg);
  });
};

/**
 * The function `HTML_onChange` sets up event listeners for the `onchange` event of two HTML select
 * elements and calls corresponding functions based on the selected values.
 */
const HTML_onChange = (): void => {
  const langMenu = <HTMLSelectElement>document.getElementById("languageMenu");
  langMenu.onchange = () => {
    const rtl: boolean = µcB_changeLanguage(true);
    µcB.WORKSPACE_OPTIONS["rtl"] = rtl;
    workspaceReboot(µcB);
  };
  const themeMenu = <HTMLSelectElement>document.getElementById("themeMenu");
  themeMenu.onchange = () => {
    const theme = changeTheme(µcB, themeMenu.value);
    return theme;
  };
  const rendererMenu = <HTMLSelectElement>document.getElementById("rendererMenu");
  rendererMenu.onchange = () => {
    const renderer = changeRenderer(µcB, rendererMenu.value);
    return renderer;
  };
  const pluginMinimapCheck = <HTMLInputElement>document.getElementById("pluginMinimap");
  pluginMinimapCheck.onchange = () => {
    const isThereMinimap: HTMLElement = document.getElementsByClassName(
      "blockly-minimap",
    )[0] as HTMLElement;
    isThereMinimap.style.visibility = pluginMinimapCheck.checked
      ? "visible"
      : "hidden";
    setPluginsInURL('pluginMinimap', 'minimap');
    return pluginMinimapCheck.checked;
  };
  const pluginKeyboardNavCheck = <HTMLInputElement>document.getElementById("pluginKeyboardNav");
  pluginKeyboardNavCheck.onchange = () => {
    pluginKeyboardNavCheck.checked
      ? plugin_KeyboardNav.enable(µcB.workspace)
      : plugin_KeyboardNav.disable(µcB.workspace);
    setPluginsInURL('pluginKeyboardNav', 'keybnav');
    return pluginKeyboardNavCheck.checked;
  };
  const pluginHighlightCheck = <HTMLInputElement>document.getElementById("pluginHighlight");
  pluginHighlightCheck.onchange = () => {
    if (pluginHighlightCheck.checked) {
      plugin_contentHighlight = new ContentHighlight(µcB.workspace);
      plugin_contentHighlight.init();
    }
    else
      plugin_contentHighlight.dispose();
    setPluginsInURL('pluginHighlight', 'highlight');
    return pluginHighlightCheck.checked;
  };
  const pluginContinuousToolbox = <HTMLInputElement>document.getElementById("pluginContinuousToolbox");
  pluginContinuousToolbox.onchange = () => {
    if (pluginContinuousToolbox.checked) {
      µcB.WORKSPACE_OPTIONS['plugins'] = {
        'toolbox': ContinuousToolbox,
        'flyoutsVerticalToolbox': ContinuousFlyout,
        'metricsManager': ContinuousMetrics,
      };
      //modify categories alignment in toolbox
      (document.getElementsByClassName("blocklyToolboxContents")[0] as HTMLElement).style.alignItems = "center";
    } else {
      delete µcB.WORKSPACE_OPTIONS["plugins"];
      (document.getElementsByClassName("blocklyToolboxContents")[0] as HTMLElement).style.alignItems = "start";
    }
    setPluginsInURL('pluginContinuousToolbox', 'ctoolbox');
    workspaceReboot(µcB);
    return pluginContinuousToolbox.checked;
  };
  const codeEditorSwitch = <HTMLInputElement>document.getElementById("codeEditorSwitch");
  codeEditorSwitch.onchange = () => {
    if (codeEditorSwitch.checked) {
      div_content_code.style.display = 'none';
      div_content_monacoEditor.style.display = 'block';
      //needed AFTER monaco create editor, not to use in css file
      div_content_monacoEditor.style.height = "100%";
      div_content_monacoEditor.style.width = "100%";
    }
    else {
      div_content_code.style.display = 'block';
      div_content_monacoEditor.style.display = 'none';
    }
    setPluginsInURL('codeEditorSwitch', 'codeEditor');
    return codeEditorSwitch.checked;
  };
};

/**
 * The function `workspaceListeners` adds event listeners to a Blockly workspace to save changes to
 * storage and run code whenever the workspace changes meaningfully.
 * @param workspace - The parameter "workspace" is of type Blockly.WorkspaceSvg. It represents the
 * Blockly workspace where the blocks are being used.
 */
const workspaceListeners = (workspace: Blockly.WorkspaceSvg): void => {
  // Every time the workspace changes state, save the changes to storage.
  workspace.addChangeListener((e: Blockly.Events.Abstract): void => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    workspaceSaveBlocks(workspace, "mainWorkspace_blocks");
  });

  // Whenever the workspace changes meaningfully, run the code again.
  workspace.addChangeListener((e: Blockly.Events.Abstract): void => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (
      e.isUiEvent ||
      e.type == Blockly.Events.FINISHED_LOADING ||
      workspace.isDragging()
    ) {
      return;
    }
    if (div_content_code.offsetParent === null) codeEditor.setValue(arduinoGenerator.workspaceToCode(workspace));
    else div_content_code.textContent = arduinoGenerator.workspaceToCode(workspace);
  });
};

// The function `µcB_workspaceInit` build workspace by calling sub constructor
const µcB_workspaceInit = (): void => {
  // Define resizable flex views: workspace, code, console.
  window.addEventListener("resize", µcB_workspaceOnResize, false);
  µcB_addFlexResizerEvents();
  // Add different listeners related to Blockly workspace
  workspaceListeners(µcB.workspace as Blockly.WorkspaceSvg);
};

/**
 * The `workspaceReboot` function saves the current workspace, sets up workspace plugins, disposes the
 * current workspace, changes the language based on the selected option in the dropdown menu, injects a
 * new workspace, logs the main workspace blocks from the session storage, sets up workspace plugins
 * again, and loads the saved blocks into the new workspace.
 */
export const workspaceReboot = (app: BlocklyApplicationType): void => {
  workspaceSaveBlocks(app.workspace, "mainWorkspace_blocks");
  workspaceSetupPlugins(app.workspace, true);
  app.workspace.dispose();
  app.workspace = Blockly.inject(
    div_workspace_content_blockly,
    app.WORKSPACE_OPTIONS,
  );
  const multiselectPlugin = new Multiselect(app.workspace);
  multiselectPlugin.init(app.WORKSPACE_OPTIONS);
  //LexicalVariablesPlugin.init(app.workspace);
  //specific to continuous toolbox plugin
  const pluginContinuousToolbox = <HTMLInputElement>(
    document.getElementById("pluginContinuousToolbox")
  );
  if (!pluginContinuousToolbox.checked) {
    const tempCategories = Array.from(
      document.getElementsByClassName('blocklyTreeRowContentContainer') as HTMLCollectionOf<HTMLElement>
    );
    tempCategories.forEach(tempCategory => {
      tempCategory.style.flexDirection = "row";
    });
  }
  workspaceSetupPlugins(app.workspace, false);
  //getPluginsBlockly(app);
  //specific to this plugin
  const isThereMinimap: HTMLElement = document.getElementsByClassName(
    "blockly-minimap",
  )[0] as HTMLElement;
  if (isThereMinimap) {
    const pluginMinimapCheck = <HTMLInputElement>(
      document.getElementById("pluginMinimap")
    );
    isThereMinimap.style.visibility = pluginMinimapCheck.checked
      ? "visible"
      : "hidden";
  }
  workspaceLoadBlocks(app.workspace, "mainWorkspace_blocks");
  (app.workspace as Blockly.WorkspaceSvg).scrollCenter();
};

// The function `workspaceSetupPlugins` sets up all plugins added in workspace
const workspaceSetupPlugins = (
  workspace: Blockly.Workspace,
  disposePlugin: boolean = false,
): void => {
  const backpackOptions = {
    allowEmptyBackpackOpen: true,
    useFilledBackpackImage: true,
    skipSerializerRegistration: false,
    contextMenu: {
      emptyBackpack: true,
      removeFromBackpack: true,
      copyToBackpack: true,
      copyAllToBackpack: true,
      pasteAllToBackpack: true,
      disablePreconditionChecks: true,
    },
  };
  const plugin_backpack = new Backpack(
    workspace as Blockly.WorkspaceSvg,
    backpackOptions,
  );
  plugin_modal = new Modal(workspace);
  plugin_workspaceSearch = new WorkspaceSearch(workspace);
  plugin_zoomToFit = new ZoomToFitControl(workspace);
  const pluginHighlightCheck: HTMLInputElement = document.getElementById("pluginHighlight") as HTMLInputElement;
  if (disposePlugin) {
    µcB.workspace.addChangeListener(shadowBlockConversionChangeListener);
    plugin_KeyboardNav.dispose();
    plugin_backpack.dispose();
    plugin_contentHighlight.dispose();
    plugin_minimap.dispose();
    plugin_modal.dispose();
    plugin_workspaceSearch.dispose();
    plugin_zoomToFit.dispose();
  } else {
    µcB.workspace.removeChangeListener(shadowBlockConversionChangeListener);
    plugin_KeyboardNav.init();
    plugin_KeyboardNav.addWorkspace(workspace);
    plugin_backpack.init();
    if (pluginHighlightCheck.checked) {
      plugin_contentHighlight = new ContentHighlight(workspace as Blockly.WorkspaceSvg);
      plugin_contentHighlight.init();
    }
    //particular to this plugin
    plugin_minimap = new PositionedMinimap(workspace);
    plugin_minimap.init();
    plugin_modal.init();
    plugin_workspaceSearch.init();
    plugin_zoomToFit.init();
  }
  /* it seems there's conflict with nav keyboard copy function
  const options = {
    contextMenu: true,
    shortcut: true
  } 
  const crossTabCopyPastePlugin = new CrossTabCopyPaste();
  crossTabCopyPastePlugin.init(options);*/
};

const pluginsSetupWorkspace = (): void => {
  const searchParams = new URLSearchParams(window.location.search);
  let paramsURL: string[] = [""];
  if (searchParams.get('options') !== null) {
    paramsURL = searchParams.get('options')!.split(',');
    //clean array from all null or undefined entry
    paramsURL = paramsURL.filter(Boolean);
  }
  if ((window.sessionStorage.getItem('pluginMinimap') == "true") || (paramsURL.includes('minimap'))) {
    const pluginMinimapCheck: HTMLInputElement = document.getElementById("pluginMinimap") as HTMLInputElement;
    pluginMinimapCheck.checked = true;
    pluginMinimapCheck.dispatchEvent(new Event('change'));
  }
  if ((window.sessionStorage.getItem('pluginKeyboardNav') == "true") || (paramsURL.includes('keybnav'))) {
    const pluginKeyboardNavCheck: HTMLInputElement = document.getElementById("pluginKeyboardNav") as HTMLInputElement;
    pluginKeyboardNavCheck.checked = true;
    pluginKeyboardNavCheck.dispatchEvent(new Event('change'));
  }
  if ((window.sessionStorage.getItem('pluginHighlight') == "true") || (paramsURL.includes('highlight'))) {
    const pluginHighlightCheck: HTMLInputElement = document.getElementById("pluginHighlight") as HTMLInputElement;
    pluginHighlightCheck.checked = true;
    pluginHighlightCheck.dispatchEvent(new Event('change'));
  }
  if ((window.sessionStorage.getItem('pluginContinuousToolbox') == "true") || (paramsURL.includes('ctoolbox'))) {
    const pluginContinuousToolboxCheck: HTMLInputElement = document.getElementById("pluginContinuousToolbox") as HTMLInputElement;
    pluginContinuousToolboxCheck.checked = true;
    pluginContinuousToolboxCheck.dispatchEvent(new Event('change'));
  }
  if ((window.sessionStorage.getItem('codeEditorSwitch') == "true") || (paramsURL.includes('codeEditor'))) {
    const codeEditorSwitchCheck: HTMLInputElement = document.getElementById("codeEditorSwitch") as HTMLInputElement;
    codeEditorSwitchCheck.checked = true;
    codeEditorSwitchCheck.dispatchEvent(new Event('change'));
  }
}
/**
 * Collection of functions ordered by priority: 1.DOM - 2.inside DOM - 3.inside window
 */

/**
 * The `DomIsLoaded` function waits for the DOM to be ready and then executes a callback function.
 * @param callback - The parameter "callback" is a callback function that will be executed when the DOM
 * is ready.
 */
const DomIsLoaded = (callback: () => void): void => {
  if (document.readyState !== "loading") {
    callback();
  } else {
    document.addEventListener("DOMContentLoaded", callback);
  }
};
// The `DomIsLoaded` function prepares everything needed by structure of DOM.
DomIsLoaded((): void => {
  HTML_populateLanguages(µcB);
  µcB_changeLanguage(false);
  µcB.workspace = Blockly.inject(
    div_workspace_content_blockly,
    µcB.WORKSPACE_OPTIONS,
  );
  const multiselectPlugin = new Multiselect(µcB.workspace);
  multiselectPlugin.init(µcB.WORKSPACE_OPTIONS);
  //LexicalVariablesPlugin.init(µcB.workspace);
  µcB_workspaceInit();
});

/* The `window.onload` event is triggered when the entire page has finished loading, including all
resources such as images and scripts. */
window.onload = (): void => {
  HTML_onChange();
  if (div_content_code.offsetParent === null) codeEditor.setValue(arduinoGenerator.workspaceToCode(µcB.workspace));
  else div_content_code.textContent = arduinoGenerator.workspaceToCode(µcB.workspace);
  let tempComponent: HTMLElement = document.getElementById("flex_container_up") as HTMLElement;
  /* The above code is retrieving values from the sessionStorage and applying them as styles to
  different elements on the page. */
  if (window.sessionStorage.getItem("flex_container_up"))
    tempComponent.style.flex =
      window.sessionStorage.getItem("flex_container_up")!;
  tempComponent = document.getElementById("flex_container_up_left")!;
  if (window.sessionStorage.getItem("flex_container_up_left"))
    tempComponent.style.flex = window.sessionStorage.getItem(
      "flex_container_up_left",
    )!;
  tempComponent = document.getElementById("flex_container_up_right")!;
  if (window.sessionStorage.getItem("flex_container_up_right"))
    tempComponent.style.flexGrow = window.sessionStorage.getItem(
      "flex_container_up_right",
    )!;
  tempComponent = document.getElementById("flex_container_bottom")!;
  if (window.sessionStorage.getItem("flex_container_bottom"))
    tempComponent.style.flexGrow = window.sessionStorage.getItem(
      "flex_container_bottom",
    )!;
  workspaceSetupPlugins(µcB.workspace, false);
  // initialize specific plugins
  const minimapDiv = document.getElementsByClassName("blockly-minimap")[0] as HTMLElement;
  minimapDiv.style.visibility = "hidden";
  const pluginMinimap = document.getElementById("pluginMinimap") as HTMLInputElement;
  pluginMinimap.checked = false;
  const tempCategories = Array.from(
    document.getElementsByClassName('blocklyTreeRowContentContainer') as HTMLCollectionOf<HTMLElement>
  );
  tempCategories.forEach(tempCategory => {
    tempCategory.style.flexDirection = "row";
  });
  µcB_workspaceOnResize();
  setParamsBlockly(µcB);
  workspaceLoadBlocks(µcB.workspace, "mainWorkspace_blocks");
  (µcB.workspace as Blockly.WorkspaceSvg).scrollCenter();
  pluginsSetupWorkspace();
};

/* The above code is a TypeScript code snippet that sets the `onbeforeunload` event handler for the
window object. This event is triggered when the user is about to leave the current page, and save windows position in UI. */
window.onbeforeunload = (): void => {
  window.sessionStorage?.setItem(
    "flex_container_up",
    document.getElementById("flex_container_up")!.style.flex,
  );
  window.sessionStorage?.setItem(
    "flex_container_up_left",
    document.getElementById(`flex_container_up_left`)!.style.flex,
  );
  window.sessionStorage?.setItem(
    "flex_container_up_right",
    document.getElementById(`flex_container_up_right`)!.style.flexGrow,
  );
  window.sessionStorage?.setItem(
    "flex_container_bottom",
    document.getElementById(`flex_container_bottom`)!.style.flexGrow,
  );
  workspaceSaveBlocks(µcB.workspace, "mainWorkspace_blocks");
  workspaceSetupPlugins(µcB.workspace, true);
};
