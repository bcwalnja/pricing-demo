// bootstrap FIRST (must exist before other files load)
window.APP = window.APP || {
    state: {},
    config: {},
    modules: {}
}


// ---- controller ----
APP.update = function (source) {
    APP.syncState(source);
    const svgData = this.modules.svg.compute(this.state)
    this.modules.ui.updateSvg(svgData)
    this.modules.ui.render(this.state)
}

APP.syncState = function (source) {
    APP.state ??= {};
    const els = APP.modules.ui.els;
    const cost = els.coilCostSlider.value / 100
    const price = els.coilPriceSlider.value / 100
    const markup = Number(els.markupSlider.value)
    const enabled = els.markupEnabled.checked

    if (enabled) {
        if (source === 'cost' || source === 'markup') {
            APP.state.cost = cost
            APP.state.markup = markup
            APP.state.markupEnabled = true

            APP.state.price = APP.state.cost * (1 + APP.state.markup / 100)
        } else {
            APP.state.price = price
            APP.state.markup = markup
            APP.state.markupEnabled = true

            APP.state.cost = APP.state.price / (1 + APP.state.markup / 100)
        }
    } else {
        APP.state.cost = cost
        APP.state.price = price
        APP.state.markup = markup
        APP.state.markupEnabled = false
    }

    // keep sliders in sync with computed values
    APP.state.tMove = els.lengthSlider.value / 1000
    APP.state.inchesStretchout = Math.round(els.stretchoutSlider.value * 20 / 1000)
}

// ---- init ----
window.addEventListener('DOMContentLoaded', () => {
    APP.modules.ui.init();
    APP.update()
})
