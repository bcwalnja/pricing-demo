APP.modules.svg = (function () {

    // configuration
    const CONFIG = {
        sliderMax: 1000,

        scale: { from: 1, to: 0.1 },
        offset: { x: 1.4, y: 2 },

        trim: {
            width: 12,
            height: 20,
            hemWidth: -2,
            hemHeight: 4
        }
    }

    // basic math
    const interpolate = (a, b, t) => a + (b - a) * t

    const distance = ([x1, y1], [x2, y2]) =>
        Math.hypot(x2 - x1, y2 - y1)

    const interpolatePoint = ([x1, y1], [x2, y2], t) => ([
        x1 + (x2 - x1) * t,
        y1 + (y2 - y1) * t
    ])

    const updatePaths = points =>
        points.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ')

    // shape construction
    function createTrimShape(originX, originY) {
        const { width, height, hemWidth, hemHeight } = CONFIG.trim

        return [
            [originX + width, originY],
            [originX + width, originY + height],
            [originX, originY + height],
            [originX, originY + height / 2],
            [originX + hemWidth, originY + height / 2],
            [originX + hemWidth, originY + height / 2 + hemHeight]
        ]
    }

    function cutShapeByRatio(points, ratio) {
        let totalLength = 0

        for (let i = 0; i < points.length - 1; i++) {
            totalLength += distance(points[i], points[i + 1])
        }

        let remaining = totalLength * (1 - ratio)
        const result = []
        let i = 0

        while (i < points.length - 1) {
            const segmentLength = distance(points[i], points[i + 1])

            if (remaining > segmentLength) {
                remaining -= segmentLength
                i++
                continue
            }

            const t = segmentLength === 0 ? 0 : remaining / segmentLength
            result.push(interpolatePoint(points[i], points[i + 1], t))
            break
        }

        for (; i + 1 < points.length; i++) {
            result.push(points[i + 1])
        }

        return result
    }

    // transforms
    function calculateTransform(progress) {
        return {
            scale: interpolate(CONFIG.scale.from, CONFIG.scale.to, progress),
            x: interpolate(0, CONFIG.offset.x, progress),
            y: interpolate(0, CONFIG.offset.y, progress)
        }
    }

    // public api
    function compute(state) {
        const stretchRatio = state.inchesStretchout / 20;
        const points = cutShapeByRatio(createTrimShape(14, 20), stretchRatio);
        const transform = calculateTransform(state.tMove);
        return { path, transform, points }

    }

    return {
        compute
    }

})()