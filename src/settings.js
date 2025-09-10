/* Created by Alexander Pen
this is the settings file handles all the functionality for the settings */
export function settings() {
    const colorPicker = document.getElementById('crosshairColourInput'); // gets the colour wheel input 
    const sizePicker = document.getElementById('crosshairSizeInput');// gets the size input 
    const crosshair = document.getElementById('crosshair');// gets the crosshair the player uses 
    const crosshairPreview = document.getElementById('crosshairPreview');// gets the preview the player sees

    colorPicker.addEventListener('input', (e) => { // if the colour is changed it is  displayed to the preview
        if (crosshairPreview) {
            crosshairPreview.style.color = e.target.value;
        }
    });

    sizePicker.addEventListener('input', (e) => { // if the size is changed it is  displayed to the preview
        const size = e.target.value + 'px';
        if (crosshairPreview) {
            crosshairPreview.style.fontSize = size;
        }
    });

    document.getElementById("defaultPreset").addEventListener("click", () => { // changes the preview preset to a +
        if (crosshairPreview) {
            crosshairPreview.textContent = '+';
        }
    });

    document.getElementById("dotPreset").addEventListener("click", () => { // changes the preview preset to a •
        if (crosshairPreview) {
            crosshairPreview.textContent = '•';
        }
    });

    document.getElementById("saveCrosshairBtn").addEventListener("click", () => { // saves the preview settings to the actual crosshair if the save button is clicked
        crosshair.style.color = colorPicker.value;
        crosshair.style.fontSize = sizePicker.value + 'px';
        if (crosshairPreview) {
            crosshair.textContent = crosshairPreview.textContent;
        }
    });
}