/* Created by Alexander Pen
this is the file that instantiates the mouse controls so the player can look around */

import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'; // Import PointerLockControls

export function mouseSetup(camera, gameCanvas) { // PointerLock Controls (for mouse look)
  if (!camera || !gameCanvas) {
    throw new Error("mouseSetup requires a valid camera and DOM element"); // if not there
  }

  const pointerControls = new PointerLockControls(camera, gameCanvas); // create pointer lock controls 
  // - it requires a camera and the DOM element to capture mouse events from

  return pointerControls; // return the controls so they can be used elsewhere
}