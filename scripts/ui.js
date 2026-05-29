APP.modules.ui = (function () {

    const els = {
        // coil controls
        coilCostSlider: document.getElementById('coil-cost'),
        coilCostDisplay: document.getElementById('coil-cost-display'),
        coilPriceSlider: document.getElementById('coil-price'),
        coilPriceDisplay: document.getElementById('coil-price-display'),
        markupSlider: document.getElementById('markup'),
        markupDisplay: document.getElementById('markup-display'),
        markupEnabled: document.getElementById('markup-enabled'),

        // special trim controls
        stretchoutSlider: document.getElementById('stretchout'),
        stretchoutDisplay: document.getElementById('special-trim-stretchout-display'),
        lengthSlider: document.getElementById('special-trim-length'),
        lengthDisplay: document.getElementById('special-trim-length-display'),

        // special trim SVG
        topPath: document.getElementById('top-trim'),
        bottomPath: document.getElementById('bottom'),

        // special trim price displays
        hemPriceDisplay: document.getElementById('st-hem-price-display'),
        bendPriceDisplay: document.getElementById('st-bend-price-display'),
        stretchoutPriceDisplay: document.getElementById('st-stretchout-price-display'),
        totalPriceDisplay: document.getElementById('st-total-price-display'),
    }

    function render(state) {
        // special trim
        els.lengthDisplay.textContent = formatLengthFtIn(state.tMove * state.maxLengthFeet)
        els.stretchoutDisplay.textContent = `${state.inchesStretchout}"`

        // special trim pricing
        els.hemPriceDisplay.textContent = APP.modules.calc.formatCurrency(state.hem)
        els.bendPriceDisplay.textContent = APP.modules.calc.formatCurrency(state.bend)
        els.stretchoutPriceDisplay.textContent = APP.modules.calc.formatCurrency(state.stretch)
        els.totalPriceDisplay.textContent = APP.modules.calc.formatCurrency(state.total)

        // coil cost, markup, and price
        els.coilCostDisplay.textContent = APP.modules.calc.formatCurrency(state.cost)
        els.coilPriceDisplay.textContent = APP.modules.calc.formatCurrency(state.price)
        els.markupDisplay.textContent = `${state.markup}%`
        els.markupSlider.disabled = !state.markupEnabled

        els.coilCostSlider.value = Math.round(state.cost * 100)
        els.coilPriceSlider.value = Math.round(state.price * 100)
    }

    function updateSvg({ path, transform, points }) {
        els.bottomPath.setAttribute('d', path)

        const { scale, x, y } = transform;
        els.topPath.setAttribute('d', path)
        els.topPath.setAttribute('transform', `translate(${x}, ${y}) scale(${scale})`)

        // clear and redraw connectors
        document.querySelectorAll('.connector').forEach(el => el.remove())

        for (const [px, py] of points) {
            const line = document.createElementNS("http://www.w3.org/2000/svg", "line")

            line.setAttribute("x1", px)
            line.setAttribute("y1", py)
            line.setAttribute("x2", px * scale + x)
            line.setAttribute("y2", py * scale + y)
            line.setAttribute("stroke", "white")
            line.setAttribute("class", "connector")

            this.uiElements.topPath.parentNode.appendChild(line)
        }
    }

    function init() {
        els.coilCostSlider.addEventListener('input', () => APP.update('cost'))
        els.coilPriceSlider.addEventListener('input', () => APP.update('price'))
        els.markupSlider.addEventListener('input', () => APP.update('markup'))
        els.markupEnabled.addEventListener('change', () => APP.update('markup'))
        els.lengthSlider.addEventListener('input', () => APP.update('trim'))
        els.stretchoutSlider.addEventListener('input', () => APP.update('trim'))
    }

    return {
        els,
        render,
        updateSvg,
        init
    }

})()