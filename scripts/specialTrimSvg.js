APP.modules.svg = (function () {

    // ---- config (SVG-specific only) ----
    const CFG = {
        sliderMax: 1000,

        // transform
        minScale: 1,
        maxScale: 0.1,
        maxOffsetX: 1.4,
        maxOffsetY: 2,

        // geometry
        w: 12,
        h: 20,
        hemW: -2,
        hemH: 4
    }


    // ---- DOM ----
    const topTrim = document.getElementById('top-trim')
    const bottomTrim = document.getElementById('bottom')
    const stretchSlider = document.getElementById('stretchout')
    const lengthSlider = document.getElementById('special-trim-length')


    // ---- math utils ----
    function lerp(a, b, t) {
        return a + (b - a) * t
    }

    function dist(a, b) {
        return Math.hypot(b[0] - a[0], b[1] - a[1])
    }

    function lerpPt(a, b, t) {
        return [
            a[0] + (b[0] - a[0]) * t,
            a[1] + (b[1] - a[1]) * t
        ]
    }

    function pathFromPoints(pts) {
        return pts.map((p, i) =>
            (i === 0 ? 'M' : 'L') + p[0] + ' ' + p[1]
        ).join(' ')
    }


    // ---- geometry ----
    function getPoints(x0, y0) {
        return [
            [x0 + CFG.w, y0],
            [x0 + CFG.w, y0 + CFG.h],
            [x0, y0 + CFG.h],
            [x0, y0 + CFG.h / 2],
            [x0 + CFG.hemW, y0 + CFG.h / 2],
            [x0 + CFG.hemW, y0 + CFG.h / 2 + CFG.hemH]
        ]
    }

    function buildTrimWithStretch(x0, y0, t) {
        const pts = getPoints(x0, y0)

        let total = 0
        for (let i = 0; i < pts.length - 1; i++) {
            total += dist(pts[i], pts[i + 1])
        }

        let remaining = total * (1 - t)
        let newPts = []
        let i = 0

        while (i < pts.length - 1) {
            const d = dist(pts[i], pts[i + 1])

            if (remaining > d) {
                remaining -= d
                i++
            } else {
                const u = d === 0 ? 0 : remaining / d
                newPts.push(lerpPt(pts[i], pts[i + 1], u))
                break
            }
        }

        for (; i + 1 < pts.length; i++) {
            newPts.push(pts[i + 1])
        }

        return newPts
    }


    // ---- compute ----
    function compute(state) {
        const tStretch = state.inchesStretchout / 20 // normalize

        return {
            pts: buildTrimWithStretch(14, 20, tStretch),
            tMove: state.tMove
        }
    }


    // ---- render helpers ----
    function getTransform(t) {
        return {
            scale: lerp(CFG.minScale, CFG.maxScale, t),
            tx: lerp(0, CFG.maxOffsetX, t),
            ty: lerp(0, CFG.maxOffsetY, t)
        }
    }

    function updateTransform(t) {
        const { scale, tx, ty } = getTransform(t)

        topTrim.setAttribute(
            'transform',
            `translate(${tx}, ${ty}) scale(${scale})`
        )
    }

    function applyPaths(pts) {
        const d = pathFromPoints(pts)
        bottomTrim.setAttribute('d', d)
        topTrim.setAttribute('d', d)
    }

    function drawConnectors(tMove, pts) {
        document.querySelectorAll('.connector').forEach(e => e.remove())

        const { scale, tx, ty } = getTransform(tMove)
        const svg = topTrim.parentNode

        for (let i = 0; i < pts.length; i++) {
            const [x1, y1] = pts[i]
            const x2 = x1 * scale + tx
            const y2 = y1 * scale + ty

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line")

            line.setAttribute("x1", x1)
            line.setAttribute("y1", y1)
            line.setAttribute("x2", x2)
            line.setAttribute("y2", y2)
            line.setAttribute("stroke", "white")
            line.setAttribute("class", "connector")

            svg.appendChild(line)
        }
    }


    // ---- render ----
    function render(data, state) {
        applyPaths(data.pts)
        updateTransform(data.tMove)
        drawConnectors(data.tMove, data.pts)
    }


    return {
        compute,
        render
    }

})()
