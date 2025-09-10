/* Created by Alexander Pen
this is the file for the functionality of the menu */
import { EasyDynamicTarget, EasyStaticTarget, HardDynamicTarget, HardStaticTarget, MediumDynamicTarget, MediumStaticTarget, scenarioTarget } from "./target";
import { worldSetup, addLight, addSkillWalls, removeAllWalls } from './worldSetup.js';
import { addScenarioWalls } from "./scenarioSetup.js";

// Setup menu interactions
export function menu(scene, controls, clock, gameRunning) {
    document.getElementById("libraryBtn").addEventListener("click", () => { // open library
        document.getElementById("menu").style.display = "none";
        document.getElementById("library").style.display = "flex";
    });

    document.getElementById("closeLibraryBtn").addEventListener("click", () => { // close library
        document.getElementById("menu").style.display = "flex";
        document.getElementById("library").style.display = "none";
    });


    document.getElementById("staticEasy").addEventListener("click", () => { // start static easy game
        document.getElementById("library").style.display = "none";
        document.getElementById("crosshair").style.display = "block";
        document.getElementById("game-canvas").style.display = "block";

        if (gameRunning) {
            let walls = addSkillWalls(scene);
            gameRunning("skill", "staticEasy", walls, EasyStaticTarget, clock.getElapsedTime());
        }

        controls.lock();
    });

    document.getElementById("dynamicEasy").addEventListener("click", () => { // start dynamic easy game
        document.getElementById("library").style.display = "none";
        document.getElementById("crosshair").style.display = "block";
        document.getElementById("game-canvas").style.display = "block";
        if (gameRunning) {
            let walls = addSkillWalls(scene);
            gameRunning("skill", "dynamicEasy", walls, EasyDynamicTarget, clock.getElapsedTime());
        }
        controls.lock();
    });

    document.getElementById("staticMedium").addEventListener("click", () => { // start static medium game
        document.getElementById("library").style.display = "none";
        document.getElementById("crosshair").style.display = "block";
        document.getElementById("game-canvas").style.display = "block";
        if (gameRunning) {
            let walls = addSkillWalls(scene);
            gameRunning("skill", "staticMedium", walls, MediumStaticTarget, clock.getElapsedTime());
        }
        controls.lock();
    });

    document.getElementById("dynamicMedium").addEventListener("click", () => { // start dynamic medium game
        document.getElementById("library").style.display = "none";
        document.getElementById("crosshair").style.display = "block";
        document.getElementById("game-canvas").style.display = "block";
        if (gameRunning) {
            let walls = addSkillWalls(scene);
            gameRunning("skill", "dynamicMedium", walls, MediumDynamicTarget, clock.getElapsedTime());
        }
        controls.lock();
    });

    document.getElementById("staticHard").addEventListener("click", () => { // start static hard game
        document.getElementById("library").style.display = "none";
        document.getElementById("crosshair").style.display = "block";
        document.getElementById("game-canvas").style.display = "block";
        if (gameRunning) {
            let walls = addSkillWalls(scene);
            gameRunning("skill", "staticHard", walls, HardStaticTarget, clock.getElapsedTime());
        }
        controls.lock();
    });

    document.getElementById("dynamicHard").addEventListener("click", () => { // start dynamic hard game
        document.getElementById("library").style.display = "none";
        document.getElementById("crosshair").style.display = "block";
        document.getElementById("game-canvas").style.display = "block";
        if (gameRunning) {
            let walls = addSkillWalls(scene);
            gameRunning("skill", "dynamicHard", walls, HardDynamicTarget, clock.getElapsedTime());
        }
        controls.lock();
    });

    document.getElementById("closeScoreBtn").addEventListener("click", () => { // close score screen
        document.getElementById("score").style.display = "none";
        document.getElementById("menu").style.display = "flex";
    });

    document.getElementById("settingsBtn").addEventListener("click", () => { // open settings
        document.getElementById("menu").style.display = "none";
        document.getElementById("settings").style.display = "flex";
    });

    document.getElementById("closeSettingsBtn").addEventListener("click", () => { // close settings
        document.getElementById("menu").style.display = "flex";
        document.getElementById("settings").style.display = "none";
    });


    // start scenario mode
    document.getElementById("roomClearingBtn").addEventListener("click", () => { 
        document.getElementById("library").style.display = "none";
        document.getElementById("crosshair").style.display = "block";
        document.getElementById("game-canvas").style.display = "block";

        let walls = addScenarioWalls(scene);
        if (gameRunning) {
            gameRunning("scenario", "roomClearing", walls, scenarioTarget, clock.getElapsedTime());
        }
        controls.lock();

    });


    // relock the player if they click escape and then click back on the screen
    document.getElementById('game-canvas').addEventListener('click', () => { 
        if (!controls.isLocked) {
            controls.lock();
        }
    });
}