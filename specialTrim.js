const slider = document.getElementById('special-trim-length');
const display = document.getElementById('special-trim-length-display');
const topTrim = document.getElementById('top-trim');
const bottomTrim = document.getElementById('bottom');
const CFG = {
    sliderMax: 1000,

    // transform limits
    minScale: 1,
    maxScale: 0.1,
    maxOffsetX: 1.4,
    maxOffsetY: 2,

    // geometry
    w: 14,
    h: 20,
    hemW: 2,
    hemH: 4,

    // length display
    maxLengthFeet: 20.5
};

// linear interpolate
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// build profile path
function buildProfile(x0, y0) {
    return [
        `M${x0 + CFG.w} ${y0}`,
        `L${x0 + CFG.w} ${y0 + CFG.h}`,
        `L${x0} ${y0 + CFG.h}`,
        `L${x0} ${y0 + CFG.h / 2}`,
        `L${x0 + CFG.hemW} ${y0 + CFG.h / 2}`,
        `L${x0 + CFG.hemW} ${y0 + CFG.h / 2 + CFG.hemH}`
    ].join(' ');
}

// update transform
function updateTransform(t) {
    const scale = lerp(CFG.minScale, CFG.maxScale, t);
    const tx = lerp(0, CFG.maxOffsetX, t);
    const ty = lerp(0, CFG.maxOffsetY, t);

    // ✅ IMPORTANT: translate AFTER scale so movement isn't exaggerated
    topTrim.setAttribute(
        'transform',
        `translate(${tx}, ${ty}) scale(${scale})`
    );
}

// update length display
function updateLengthDisplay(t) {
    const length = t * CFG.maxLengthFeet;

    let feet = Math.floor(length);
    let inches = Math.round((length - feet) * 12);

    if (inches === 12) {
        feet++;
        inches = 0;
    }

    display.textContent = `${feet}' ${inches}"`;
}

// master update
function update() {
    const t = slider.value / CFG.sliderMax;

    updateTransform(t);
    updateLengthDisplay(t);
    drawConnectors(t);
}

function getPoints(x0, y0) {
  return [
    [x0 + CFG.w, y0],
    [x0 + CFG.w, y0 + CFG.h],
    [x0, y0 + CFG.h],
    [x0, y0 + CFG.h / 2],
    [x0 + CFG.hemW, y0 + CFG.h / 2],
    [x0 + CFG.hemW, y0 + CFG.h / 2 + CFG.hemH]
  ];
}

function drawConnectors(t) {
    const svg = topTrim.parentNode;

    // remove old
    document.querySelectorAll('.connector').forEach(e => e.remove());

    const b = getPoints(14, 20);
    const scale = lerp(CFG.minScale, CFG.maxScale, t);

    const tx = lerp(0, CFG.maxOffsetX, t);
    const ty = lerp(0, CFG.maxOffsetY, t);

    const topPts = b.map(([x, y]) => [
        x * scale + tx,
        y * scale + ty
    ]);

    for (let i = 0; i < b.length; i++) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

        line.setAttribute("x1", b[i][0]);
        line.setAttribute("y1", b[i][1]);
        line.setAttribute("x2", topPts[i][0]);
        line.setAttribute("y2", topPts[i][1]);

        line.setAttribute("stroke", "white");
        line.setAttribute("stroke-width", "1");
        line.setAttribute("class", "connector");

        svg.appendChild(line);
    }
}

// set fixed paths (NO offset baked in anymore)
bottomTrim.setAttribute('d', buildProfile(14, 20));
topTrim.setAttribute('d', buildProfile(14, 20));

// events
slider.oninput = update;

// initial render
update();