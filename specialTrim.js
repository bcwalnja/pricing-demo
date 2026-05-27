const slider = document.getElementById('special-trim-length');
const display = document.getElementById('special-trim-length-display');
const topTrim = document.getElementById('top-trim');
const bottomTrim = document.getElementById('bottom');
const stretchSlider = document.getElementById('stretchout');

let stretchInches = stretchSlider.value * 20 / 1000;
let tStretch = stretchInches / 20;
const stretchDisplay = document.getElementById('special-trim-stretchout-display');

const CFG = {
    sliderMax: 1000,

    // transform limits
    minScale: 1,
    maxScale: 0.1,
    maxOffsetX: 1.4,
    maxOffsetY: 2,

    // geometry
    w: 12,
    h: 20,
    hemW: -2,
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

function pathFromPoints(pts) {
  return pts.map((p, i) =>
    (i === 0 ? 'M' : 'L') + p[0] + ' ' + p[1]
  ).join(' ');
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
  const tMove = slider.value / CFG.sliderMax;
  const tStretch = (stretchSlider.value * 20 / 1000) / 20;

  const pts = buildTrimWithStretch(14, 20, tStretch);

  bottomTrim.setAttribute('d', pathFromPoints(pts));
  topTrim.setAttribute('d', pathFromPoints(pts));

  updateTransform(tMove);
  drawConnectors(tMove, pts);
  updateStretchout();
  updateLengthDisplay(tMove);
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

function dist(a, b) {
    return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

function lerpPt(a, b, t) {
    return [
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t
    ];
}

function buildTrimWithStretch(x0, y0, t) {
  const pts = getPoints(x0, y0);

  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    total += dist(pts[i], pts[i+1]);
  }

  let remaining = total * (1 - t);

  let newPts = [];
  let i = 0;

  while (i < pts.length - 1) {
    const d = dist(pts[i], pts[i+1]);

    if (remaining > d) {
      remaining -= d;
      i++;
    } else {
      const u = remaining / d;
      newPts.push(lerpPt(pts[i], pts[i+1], u));
      break;
    }
  }

  for (; i + 1 < pts.length; i++) {
    newPts.push(pts[i+1]);
  }

  return newPts;
}

function drawConnectors(tMove, pts) {
  document.querySelectorAll('.connector').forEach(e => e.remove());

  const scale = lerp(CFG.minScale, CFG.maxScale, tMove);
  const tx = lerp(0, CFG.maxOffsetX, tMove);
  const ty = lerp(0, CFG.maxOffsetY, tMove);

  const svg = topTrim.parentNode;

  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const x2 = x1 * scale + tx;
    const y2 = y1 * scale + ty;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "white");
    line.setAttribute("class", "connector");

    svg.appendChild(line);
  }
}

function updateStretchout() {
    const inchesTotal = Math.round(stretchSlider.value * 20 / 1000, 0);
    stretchDisplay.textContent = `${inchesTotal}"`;
}

// set fixed paths (NO offset baked in anymore)
bottomTrim.setAttribute('d', buildTrimWithStretch(14, 20, tStretch));
topTrim.setAttribute('d', buildTrimWithStretch(14, 20, tStretch));

// events
slider.oninput = update;
stretchSlider.oninput = update;

// initial render
update();