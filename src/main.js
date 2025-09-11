/* Created by Alexander Pen
this is the main file that the code runs from */
import * as THREE from 'https://unpkg.com/three@0.168.0/build/three.module.js'; // Importing the Three.js library
import { setupScene } from './setup.js'; // Importing all js files for better organization
import { mouseSetup } from './mouseControls.js';
import { worldSetup, addLight, addSkillWalls, removeAllWalls } from './worldSetup.js';
import { Target, EasyStaticTarget, EasyDynamicTarget, 
        MediumStaticTarget, MediumDynamicTarget, 
        HardStaticTarget, HardDynamicTarget, scenarioTarget } from './target.js';
import { menu } from './menu.js';
import { settings } from './settings.js';
import { addScenarioWalls, camIntersection, removeAllBoxes } from "./scenarioSetup.js";

const { scene, camera, renderer } = setupScene(); // setup scene, camera, renderer
const controls = mouseSetup(camera, document.body); // setup 3D mouse controls
const clock = new THREE.Clock(); // clock to track time between frames
const raycaster = new THREE.Raycaster(); // for detecting if we hit a target
const mouse = new THREE.Vector2(0, 0); // mouse at center of screen for raycaster

// game variables
let targets = [];
const maxTargets = 5;
let lastSpawn = 0;
const targetSpawnTime = 0.1; // seconds between spawn

// counters for stats
let hitCounter = 0;
let shotCounter = 0;
let roundStartTime = 0;
const roundDuration = 30; 

// Movement variables
const camSpeed = 10;
const keysPressed = {}; 

// game state
let gameRunning = false;
let gameMode;
let targetType = EasyStaticTarget; // default target type
let modeWalls = [];

let scenarioCounter = 0; // for scenario testing

menu(scene, controls, clock, (isGameRunning, mode, walls, targetClass, time) => {
  gameRunning = isGameRunning;
  gameMode = mode;
  targetType = targetClass;
  roundStartTime = time;
  modeWalls = walls
}); // pass controls to menu for locking/unlocking, and a callback to update gameRunning. And also type of mode

settings();

// setup
worldSetup(scene);
addLight(scene);
keyControls();
animate();

window.addEventListener('resize', adjustCamera); // adjust camera and renderer on window resize
document.addEventListener('mousedown', hitsTarget); // on click check if we hit a target

function animate() { 
  requestAnimationFrame(animate);

  if (gameRunning === "skill") {
    const delta = clock.getDelta();

    spawnTarget(targetType); // Test to spawn target every frame
    moveTargets(delta); // move targets every frame
    renderer.render(scene, camera); // render scene

    if (clock.getElapsedTime() - roundStartTime > roundDuration) { // end game after roundDuration seconds
      gameRunning = false;
      // load score screen
      document.getElementById("crosshair").style.display = "none";
      document.getElementById("score").style.display = "flex";
      document.getElementById("game-canvas").style.display = "none";

      // change stats
      if (shotCounter === 0) {
        document.getElementById("totalShotsFired").innerText = shotCounter;
        shotCounter = 1; // avoid div by 0
      } else {
        document.getElementById("totalShotsFired").innerText = shotCounter;
      }
      document.getElementById("overallAccuracy").innerText = ((hitCounter / shotCounter) * 100).toFixed(2) + "%"; // format to 2 decimal places
      document.getElementById("totalTargetsHit").innerText = hitCounter;
      document.getElementById("totalTimePlayed").innerText = roundDuration + " seconds";
      controls.unlock(); // unlock mouse


      // reset counters
      hitCounter = 0;
      shotCounter = 0;
      roundStartTime = 0;
      // removal of stuff in scene
      removeAllTargets();
      removeAllWalls(scene, modeWalls);
      modeWalls = [];
    }

  } else if (gameRunning === "scenario") {
    if (scenarioCounter === 0) { // spawn scenario targets on the first frame then no others
      
      // room 1
      spawnScenarioTarget(new THREE.Vector3(0, 5, -40));
      spawnScenarioTarget(new THREE.Vector3(10, 8, -40));
      spawnScenarioTarget(new THREE.Vector3(-10, 8, -40));
      spawnScenarioTarget(new THREE.Vector3(10, 2, -40));
      spawnScenarioTarget(new THREE.Vector3(-10, 2, -40));
      // room 2
      spawnScenarioTarget(new THREE.Vector3(30, 1, -29));
      spawnScenarioTarget(new THREE.Vector3(30, 1, -11));
      spawnScenarioTarget(new THREE.Vector3(30, 1, -20));
      spawnScenarioTarget(new THREE.Vector3(35, 5, -29));
      spawnScenarioTarget(new THREE.Vector3(35, 5, -11));
      spawnScenarioTarget(new THREE.Vector3(35, 5, -20));
      spawnScenarioTarget(new THREE.Vector3(40, 8, -29));
      spawnScenarioTarget(new THREE.Vector3(40, 8, -11));
      spawnScenarioTarget(new THREE.Vector3(40, 8, -20));

      // room 3
      spawnScenarioTarget(new THREE.Vector3(56, 5, 18));
      spawnScenarioTarget(new THREE.Vector3(74, 5, 18));
      spawnScenarioTarget(new THREE.Vector3(65, 5, 18));
      spawnScenarioTarget(new THREE.Vector3(65, 9, 18));
      spawnScenarioTarget(new THREE.Vector3(65, 1, 18));
      spawnScenarioTarget(new THREE.Vector3(56, 5, -58));
      spawnScenarioTarget(new THREE.Vector3(74, 5, -58));
      spawnScenarioTarget(new THREE.Vector3(65, 5, -58));
      spawnScenarioTarget(new THREE.Vector3(65, 9, -58));
      spawnScenarioTarget(new THREE.Vector3(65, 1, -58));

      // room 4
      spawnScenarioTarget(new THREE.Vector3(80, 2, -58));
      spawnScenarioTarget(new THREE.Vector3(85, 5, -58));
      spawnScenarioTarget(new THREE.Vector3(90, 7, -56));
      spawnScenarioTarget(new THREE.Vector3(95, 4, -54));
      spawnScenarioTarget(new THREE.Vector3(100, 2, -52));
      spawnScenarioTarget(new THREE.Vector3(103, 4, -50));
      spawnScenarioTarget(new THREE.Vector3(106, 7, -47));
      spawnScenarioTarget(new THREE.Vector3(108, 4, -43));
      spawnScenarioTarget(new THREE.Vector3(110, 2, -40));
      spawnScenarioTarget(new THREE.Vector3(110, 4, -36));
      spawnScenarioTarget(new THREE.Vector3(110, 7, -32));
      spawnScenarioTarget(new THREE.Vector3(110, 4, -28));
      spawnScenarioTarget(new THREE.Vector3(110, 2, -24));
      spawnScenarioTarget(new THREE.Vector3(110, 4, -20));
      spawnScenarioTarget(new THREE.Vector3(110, 7, -16));
      spawnScenarioTarget(new THREE.Vector3(110, 4, -12));
      spawnScenarioTarget(new THREE.Vector3(110, 2, -8));
      spawnScenarioTarget(new THREE.Vector3(110, 4, -4));
      spawnScenarioTarget(new THREE.Vector3(110, 7, 0));
      spawnScenarioTarget(new THREE.Vector3(110, 4, 4));
      spawnScenarioTarget(new THREE.Vector3(110, 2, 8));
      spawnScenarioTarget(new THREE.Vector3(108, 4, 11));
      spawnScenarioTarget(new THREE.Vector3(106, 7, 14));
      spawnScenarioTarget(new THREE.Vector3(103, 4, 17));
      spawnScenarioTarget(new THREE.Vector3(95, 2, 19));
      spawnScenarioTarget(new THREE.Vector3(90, 4, 19));
      spawnScenarioTarget(new THREE.Vector3(85, 7, 19));
      spawnScenarioTarget(new THREE.Vector3(80, 4, 19));

    }
    scenarioCounter++;
    const delta = clock.getDelta();

    renderer.render(scene, camera); // render scene
    moveCam(delta); // move player

    if (targets.length === 0) { // if all targets are gone
      gameRunning = false;
      let completionTime = clock.getElapsedTime() - roundStartTime; // find time spent
      // load score
      document.getElementById("crosshair").style.display = "none";
      document.getElementById("score").style.display = "flex";
      document.getElementById("game-canvas").style.display = "none";

      // change stats
      if (shotCounter === 0) {
        document.getElementById("totalShotsFired").innerText = shotCounter;
        shotCounter = 1; // avoid div by 0
      } else {
        document.getElementById("totalShotsFired").innerText = shotCounter;
      }
      document.getElementById("overallAccuracy").innerText = ((hitCounter / shotCounter) * 100).toFixed(2) + "%"; // format to 2 decimal places
      document.getElementById("totalTargetsHit").innerText = hitCounter;
      document.getElementById("totalTimePlayed").innerText = completionTime.toFixed(2) + " seconds";
      controls.unlock(); // unlock mouse

      // reset counters
      hitCounter = 0;
      shotCounter = 0;
      roundStartTime = 0;

      // removal of stuff in scene
      removeAllWalls(scene, modeWalls);
      removeAllBoxes(scene);

      camera.position.set(0,4,0);
      console.log(camera.position);

      modeWalls = [];
    }
  }
}

function keyControls() { // setup key controls - for movement 
  document.addEventListener('keydown', e => { //
    const key = e.key.toLowerCase();
    keysPressed[key] = true;
  });

  document.addEventListener('keyup', e => {
    keysPressed[e.key.toLowerCase()] = false;
  });
}

function moveCam(delta) {  // Move camera based on keys pressed 
  if (!controls.isLocked) return;
     // Delta is the time between frames

  if (keysPressed['w']) {
    controls.moveForward(camSpeed * delta);
    if (camIntersection(camera.position)) controls.moveForward(-camSpeed * delta); // move back if intersecting
  }
  if (keysPressed['s']) {
    controls.moveForward(-camSpeed * delta);
    if (camIntersection(camera.position)) controls.moveForward(camSpeed * delta); // move back if intersecting
  }
  if (keysPressed['a']) {
    controls.moveRight(-camSpeed * delta);
    if (camIntersection(camera.position)) controls.moveRight(camSpeed * delta); // move back if intersecting
  }
  if (keysPressed['d']) {
    controls.moveRight(camSpeed * delta);
    if (camIntersection(camera.position)) controls.moveRight(-camSpeed * delta); // move back if intersecting
  }
}

function adjustCamera() { // Adjust camera and renderer on window resize
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


function spawnTarget(targetType) { // spawn a target of type targetType if less than maxTargets in scene
  const now = clock.getElapsedTime();

  if ((now - lastSpawn) > targetSpawnTime && targets.length < maxTargets) { // spawn a target every targetSpawnTime seconds
    const t = new targetType(); // create a target of type targetType
    t.addToScene(scene); // add target to scene
    targets.push(t); // add target to array
    lastSpawn = now; // update last spawn time
  }
}

function moveTargets(delta) { // move all targets in array
  for (let t of targets) {
    t.moveTarget(delta);
  }
}

function removeTarget(Mesh) { // remove target from scene and array
  let found = null;
  for (let i = 0; i < targets.length; i++) {
    if (targets[i].mesh === Mesh) { //search for specific target with this mesh
      found = targets[i];
      break;
    }
  }
  if (found) { // if found remove it
    found.removeFromScene(scene);
    const targetIndex = targets.indexOf(found);
    targets.splice(targetIndex, 1); // remove from array
    console.log("Target removed");
  } else {
    console.log("tried to remove target not found");
  }
}

function hitsTarget(){ // check if crosshair is aiming at a target
  if (!gameRunning) return;

  shotCounter++;

  raycaster.setFromCamera(mouse, camera);

  const hits = raycaster.intersectObjects(scene.children);

  for (let i = 0; i < hits.length; i++) { // only remove first target hit so no double hits
    const obj = hits[i].object;

    if (obj.geometry.type === "SphereGeometry"){ //
      console.log("Crosshair is aiming at a target");
      removeTarget(obj);
      hitCounter++;
      break;
    }
  }
}

function removeAllTargets() { // remove all targets from scene and array
  for (let t of targets) {
    t.removeFromScene(scene);
  }
  targets = [];
}

function spawnScenarioTarget(position) { // spawn a scenario target at a specific position
  const t = new scenarioTarget(position);
  targets.push(t);
  t.addToScene(scene);
}