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
import "@blockly/block-plus-minus";
import "@blockly/toolbox-search";

import { arduinoGenerator } from "./generators/arduino";
import { HTML_populateLanguages, changeLanguageToolbox, getLangParamFromUrl } from "./language";
import { setPluginsInURL } from "./tools";
import { basic_toolbox } from "./toolbox";
import { BlocklyApplication } from "./blockly_application_type";
//plugins
import { ContentHighlight } from "@blockly/workspace-content-highlight";
import { ContinuousToolbox, ContinuousFlyout, ContinuousMetrics } from '@blockly/continuous-toolbox';
//import { Multiselect, MultiselectBlockDragger } from '@mit-app-inventor/blockly-plugin-workspace-multiselect';
//import { LexicalVariablesPlugin } from '@mit-app-inventor/blockly-block-lexical-variables';

import "./css/index.css";
import "./css/µcBlockly.css";


// Set up UI elements
const div_workspace_content_area: HTMLElement = document.getElementById("div_workspace_content_area")!;
const div_workspace_content_blockly: HTMLElement = document.getElementById("div_workspace_content_blockly")!;
const div_content_code: HTMLElement = document.getElementById('div_content_code')!;
const div_content_monacoEditor: HTMLElement = document.getElementById('div_content_monacoEditor')!;

export const µcB_codeEditor = monaco.editor.create(div_content_monacoEditor, {
  automaticLayout: true,
  formatOnPaste: true,
  formatOnType: true,
  language: 'cpp',
  lineNumbers: "on",
  readOnly: false,
  scrollBeyondLastLine: false,
});
div_content_monacoEditor.style.display = 'none';

const µcB: BlocklyApplication = new BlocklyApplication(
  basic_toolbox,
  {
    grid: {
      spacing: 20,
      length: 3,
      colour: "#ccc",
      snap: true,
    },
    scrollbars: true,
    toolbox: changeLanguageToolbox(getLangParamFromUrl(), basic_toolbox),
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
      //'blockDragger': MultiselectBlockDragger,
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
  },
  div_workspace_content_blockly
);

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
//let plugin_contentHighlight = new ContentHighlight();

/**
 * Handles the resizing of the workspace.
 * This function calculates the offset position of the workspace content area,
 * and assigns these values, along with its width and height, to the workspace content blockly.
 * It then triggers a resize event on the Blockly workspace.
 */
export const µcB_workspaceOnResize = (): void => {
  let { offsetLeft: x, offsetTop: y } = div_workspace_content_area;
  let element: HTMLElement = div_workspace_content_area;
  while (element.offsetParent) {
    element = element.offsetParent as HTMLElement;
    x += element.offsetLeft;
    y += element.offsetTop;
  }
  const { offsetWidth: width, offsetHeight: height } = div_workspace_content_area;
  Object.assign(div_workspace_content_blockly.style, {
    width: `${width}px`,
    height: `${height}px`,
    left: `${x}px`,
    top: `${y}px`,
  });
  Blockly.svgResize(µcB.workspace as Blockly.WorkspaceSvg);
};

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
 * The function `µcB_addFlexResizerEvents` adds event listeners for resizing elements horizontally or
 * vertically based on their parent's class.
 * @returns In the provided code snippet, the `µcB_addFlexResizerEvents` function is returning `void`,
 * which means it does not return any value. The function sets up event listeners for mouse events on
 * the document body, specifically for the "mousedown" event. When the mouse is clicked, it checks if
 * the target element is a "FLEX-RESIZER" element and then performs certain
 */
export const µcB_addFlexResizerEvents = (): void => {
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
    const rtl: boolean = µcB.changeLanguage(true);
    µcB.WORKSPACE_OPTIONS["rtl"] = rtl;
    µcB.workspaceReboot();
  };
  const themeMenu = <HTMLSelectElement>document.getElementById("themeMenu");
  themeMenu.onchange = () => {
    const theme = µcB.changeTheme(themeMenu.value);
    return theme;
  };
  const rendererMenu = <HTMLSelectElement>document.getElementById("rendererMenu");
  rendererMenu.onchange = () => {
    const renderer = µcB.changeRenderer(rendererMenu.value);
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
    /* pluginKeyboardNavCheck.checked
      ? µcB.plugin_KeyboardNav.enable(µcB.workspace)
      : µcB.plugin_KeyboardNav.disable(µcB.workspace); */
    setPluginsInURL('pluginKeyboardNav', 'keybnav');
    return pluginKeyboardNavCheck.checked;
  };
  const pluginHighlightCheck = <HTMLInputElement>document.getElementById("pluginHighlight");
  pluginHighlightCheck.onchange = () => {
    if (pluginHighlightCheck.checked) {
      µcB.plugin_contentHighlight = new ContentHighlight(µcB.workspace);
      µcB.plugin_contentHighlight.init();
    }
    else
      µcB.plugin_contentHighlight.dispose();
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
      const tempCategories = Array.from(
        document.getElementsByClassName('blocklyTreeRowContentContainer') as HTMLCollectionOf<HTMLElement>
      );
      tempCategories.forEach(tempCategory => {
        tempCategory.style.flexDirection = "row";
      });
      (document.getElementsByClassName("blocklyToolboxContents")[0] as HTMLElement).style.alignItems = "start";
    }
    setPluginsInURL('pluginContinuousToolbox', 'ctoolbox');
    µcB.workspaceReboot();
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
      div_content_monacoEditor.remove();
    }
    setPluginsInURL('codeEditorSwitch', 'codeEditor');
    return codeEditorSwitch.checked;
  };
};

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
  µcB.changeLanguage(false);
  //const multiselectPlugin = new Multiselect(µcB.workspace);
  //multiselectPlugin.init(µcB.WORKSPACE_OPTIONS);
  //LexicalVariablesPlugin.init(µcB.workspace);
  µcB.workspaceInit();
});

/* The `window.onload` event is triggered when the entire page has finished loading, including all
resources such as images and scripts. */
window.onload = (): void => {
  HTML_onChange();
  µcB_codeEditor.setValue(arduinoGenerator.workspaceToCode(µcB.workspace));
  div_content_code.textContent = arduinoGenerator.workspaceToCode(µcB.workspace);
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
  µcB.workspaceSetupPlugins(false);
  // initialize specific plugins
  const minimapDiv = document.getElementsByClassName("blockly-minimap")[0] as HTMLElement;
  minimapDiv.style.visibility = "hidden";
  const pluginMinimap = document.getElementById("pluginMinimap") as HTMLInputElement;
  pluginMinimap.checked = false;
  let tempCategories = Array.from(
    document.getElementsByClassName('blocklyTreeRowContentContainer') as HTMLCollectionOf<HTMLElement>
  );
  tempCategories.forEach(tempCategory => {
    tempCategory.style.flexDirection = "row";
  });
  (document.getElementsByClassName("blocklyToolboxContents")[0] as HTMLElement).style.alignItems = "start";
  tempCategories = Array.from(
    document.getElementsByClassName('blocklyToolboxCategory') as HTMLCollectionOf<HTMLElement>
  );
  tempCategories.forEach(tempCategory => {
    tempCategory.style.width = "100%";
  });
  tempCategories = Array.from(
    document.getElementsByClassName('categoryBubble') as HTMLCollectionOf<HTMLElement>
  );
  tempCategories.forEach(tempCategory => {
    tempCategory.style.margin = "0";
  });
  tempCategories = Array.from(
    document.getElementsByClassName('blocklyTreeLabel ') as HTMLCollectionOf<HTMLElement>
  );
  tempCategories.forEach(tempCategory => {
    tempCategory.style.margin = "0";
  });
  µcB_workspaceOnResize();
  µcB.setParamsBlockly();
  µcB.workspaceLoadBlocks("mainWorkspace_blocks");
  (µcB.workspace as Blockly.WorkspaceSvg).scrollCenter();
  µcB.pluginsSetupWorkspace();
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
  µcB.workspaceSaveBlocks("mainWorkspace_blocks");
  µcB.workspaceSetupPlugins(true);
};
