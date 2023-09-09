/**
 * @packageDocumentation General script file for index
 * Author scanet\@libreducc (Sébastien Canet)
 */

/**
 * @license
 * Copyright 2023 ASTUCE (Sébastien Canet microcompany)
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import * as Blockly from 'blockly';
import 'blockly/blocks';
import { javascriptGenerator } from 'blockly/javascript';
import { workspaceSaveBlocks, workspaceLoadBlocks } from './serialization';
import { initLanguage } from './language';
import { ToolboxConfiguration } from './toolbox';

import './css/index.css';
import './css/µcBlockly.css';

// Set up UI elements
const div_workspace_content_area: HTMLElement = document.getElementById('div_workspace_content_area')!;
const div_workspace_content_blockly: HTMLElement = document.getElementById('div_workspace_content_blockly')!;
const div_code_generated: HTMLElement = document.getElementById('div_code_generated')!;

/**
 * Create an empty application.
 */
/* The above code is defining an interface called `BlocklyApplicationType` in TypeScript. This
interface has the following properties: */
export interface BlocklyApplicationType {
  workspace?: Blockly.Workspace;
  toolbox?: ToolboxConfiguration;
  LANGUAGE_NAME: Record<string, string>;
  LANGUAGE_RTL: string[];
}
/* The above code is defining a constant variable named `µcB` which is of type
`BlocklyApplicationType`. It exports this variable for use in other modules. The
`BlocklyApplicationType` is an interface or type that is not shown in the code snippet. The
`LANGUAGE_NAME` property is an empty object, and the `LANGUAGE_RTL` property is an empty array. */
export const µcB: BlocklyApplicationType = {
  LANGUAGE_NAME: {},
  LANGUAGE_RTL: []
};

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
µcB.LANGUAGE_NAME = {
  'ar': 'العربية',
  'en': 'English',
  'es': 'Español',
  'fr': 'Français'
};

/**
 * List of RTL languages.
 */
µcB.LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];

/**
 * The function `genWorkspace` creates a Blockly workspace with specified options and injects it into a
 * specified HTML element.
 * @param isRtl - The `isRtl` parameter is a boolean value that determines whether the
 * workspace should be displayed in right-to-left (RTL) mode. If `isRtl` is `true`, the workspace will
 * be displayed in RTL mode, otherwise it will be displayed in left-to-right (LTR) mode
 */
export const genWorkspace = (isRtl: boolean): void => {
  µcB.workspace = div_workspace_content_blockly && Blockly.inject(div_workspace_content_blockly, {
    grid:
    {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true
    },
    rtl: isRtl,
    scrollbars: true,
    toolbox: µcB.toolbox!,
    zoom:
    {
      controls: true,
      wheel: true,
      startScale: 1.0,
      maxScale: 6,
      minScale: 0.1,
      scaleSpeed: 1.2,
      pinch: true
    },
    trashcan: true,
  });
}

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
  div_workspace_content_blockly.style.width = div_workspace_content_area.offsetWidth + 'px';
  div_workspace_content_blockly.style.height = div_workspace_content_area.offsetHeight + 'px';
  div_workspace_content_blockly.style.left = x + 'px';
  div_workspace_content_blockly.style.top = y + 'px';
  if (µcB.workspace && µcB.workspace instanceof Blockly.WorkspaceSvg) {
    Blockly.svgResize(µcB.workspace);
  }
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
const µcB_workspaceManageResize = (mouseDown: Event, sizeProp: string, posProp: string): void => {
  const recall: HTMLElement = mouseDown.target as HTMLElement;
  const prev = recall?.previousElementSibling as (HTMLInputElement | null);
  const next = recall?.nextElementSibling as (HTMLInputElement | null);
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
  }

  /**
   * The function `onMouseUp` sets the cursor style and removes event listeners when the mouse button
   * is released.
   */
  const onMouseUp = (): void => {
    const html = document.querySelector('html') as HTMLElement;
    html.style.cursor = 'default';
    if (String(posProp) === 'pageX') {
      recall.style.cursor = 'ew-resize';
    } else {
      recall.style.cursor = 'ns-resize';
    }
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("mouseup", onMouseUp);
}

/**
 * The function `addFlexResizerEvents` adds event listeners to the body of the document to handle mouse
 * events on flex resizer elements and resize the Blockly workspace accordingly.
 * @param workspace - The `workspace` parameter is of type `Blockly.WorkspaceSvg`. It represents the
 * Blockly workspace on which the resizer events will be added.
 * @returns Nothing is being returned. The function has a return type of `void`, which means it does
 * not return any value.
 */
const addFlexResizerEvents = (workspace: Blockly.WorkspaceSvg): void => {
  document.body.addEventListener("mousedown", function (mouseDown: Event) {
    const html = document.querySelector('html') as HTMLElement;
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
      mouseTarget.style.cursor = 'col-resize';
      html.style.cursor = 'col-resize'; // avoid cursor's flickering
      µcB_workspaceManageResize(mouseDown, "offsetWidth", "pageX");
    } else if (resizeVertical) {
      mouseTarget.style.cursor = 'row-resize';
      html.style.cursor = 'row-resize'; // avoid cursor's flickering
      µcB_workspaceManageResize(mouseDown, "offsetHeight", "pageY");
    }
    Blockly.svgResize(workspace);
  });
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
    workspaceSaveBlocks(workspace);
  });

  // Whenever the workspace changes meaningfully, run the code again.
  workspace.addChangeListener((e: Blockly.Events.Abstract): void => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING || workspace.isDragging()) {
      return;
    }
    if (div_code_generated) div_code_generated.textContent = javascriptGenerator.workspaceToCode(workspace);
  });
}

/**
 * The function adds or replaces a parameter and its value in a given URL.
 * @param url - The `url` parameter is a string representing the URL to which the parameter
 * needs to be added or replaced.
 * @param param - The `param` parameter is a string that represents the name of the query
 * parameter that you want to add or replace in the URL.
 * @param value - The `value` parameter is a string representing the value that you want to
 * add or replace for the specified parameter in the URL.
 * @returns The function `addReplaceParamToUrl` returns a modified version of the input `url` string
 * with the specified `param` and `value` added or replaced.
 */
export const addReplaceParamToUrl = (url: string, param: string, value: string): string => {
  const re = new RegExp("([?&])" + param + "=.*?(&|$)", "i");
  const separator = url.indexOf('?') !== -1 ? "&" : "?";
  if (re.exec(url)) {
    return url.replace(re, '$1' + param + "=" + value + '$2');
  } else {
    return url + separator + param + "=" + value;
  }
};

/**
 * The `DomIsLoaded` function waits for the DOM to be ready and then executes a callback function.
 * @param callback - The parameter "callback" is a callback function that will be executed when the DOM
 * is ready.
 */
const DomIsLoaded = (callback: () => void): void => {
  if (document.readyState !== 'loading') {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}
// The `DomIsLoaded` function prepares everything needed by structure of DOM.
DomIsLoaded((): void => {
  initLanguage(µcB);
  // Define resizable flex views: workspace, code, console.
  window.addEventListener('resize', µcB_workspaceOnResize, false);
  µcB_workspaceOnResize();
  addFlexResizerEvents(µcB.workspace as Blockly.WorkspaceSvg);
  // Initialize plugin.




  // Intial load of workspace with previous state
  workspaceLoadBlocks(µcB.workspace as Blockly.WorkspaceSvg);

  // Add different listeners related to Blockly workspace
  workspaceListeners(µcB.workspace as Blockly.WorkspaceSvg);
});

/* The `window.onload` event is triggered when the entire page has finished loading, including all
resources such as images and scripts. */
window.onload = (): void => {
  div_code_generated.textContent = javascriptGenerator.workspaceToCode(µcB.workspace);
  let tempComponent: HTMLElement = document.getElementById("flex_container_up") as HTMLElement;
  if (window.sessionStorage.getItem('flex_container_up')) tempComponent.style.flex = window.sessionStorage.getItem('flex_container_up')!;
  tempComponent = document.getElementById("flex_container_up_left")!;
  if (window.sessionStorage.getItem('flex_container_up_left')) tempComponent.style.flex = window.sessionStorage.getItem('flex_container_up_left')!;
  tempComponent = document.getElementById("flex_container_up_right")!;
  if (window.sessionStorage.getItem('flex_container_up_right')) tempComponent.style.flexGrow = window.sessionStorage.getItem('flex_container_up_right')!;
  tempComponent = document.getElementById("flex_container_bottom")!;
  if (window.sessionStorage.getItem('flex_container_bottom')) tempComponent.style.flexGrow = window.sessionStorage.getItem('flex_container_bottom')!;
  µcB_workspaceOnResize();
};

/* The above code is a TypeScript code snippet that sets the `onbeforeunload` event handler for the
window object. This event is triggered when the user is about to leave the current page, and save windows position in UI. */
window.onbeforeunload = function () {
  window.sessionStorage?.setItem('flex_container_up', document.getElementById("flex_container_up")!.style.flex);
  window.sessionStorage?.setItem('flex_container_up_left', document.getElementById(`flex_container_up_left`)!.style.flex);
  window.sessionStorage?.setItem('flex_container_up_right', document.getElementById(`flex_container_up_right`)!.style.flexGrow);
  window.sessionStorage?.setItem('flex_container_bottom', document.getElementById(`flex_container_bottom`)!.style.flexGrow);
}