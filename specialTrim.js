const specialTrimSlider = document.getElementById('special-trim-length');
const specialTrimLengthDisplay = document.getElementById('special-trim-length-display');

function updateSpecialTrimLength() {
    const specialTrimLength = specialTrimSlider.value * 20.5 / 1000;

    let feet = Math.floor(specialTrimLength);
    let inches = Math.round((specialTrimLength - feet) * 12);

    if (inches === 12) {
        feet += 1;
        inches = 0;
    }

    specialTrimLengthDisplay.textContent = `${feet}' ${inches}"`;
}

specialTrimSlider.oninput = updateSpecialTrimLength;
updateSpecialTrimLength();