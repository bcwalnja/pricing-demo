function syncStateFromInputs(source) {
    const state = APP.state

    const cost = els.costSlider.value / 100
    const price = els.priceSlider.value / 100
    const markup = Number(els.markupSlider.value)
    const enabled = els.markupToggle.checked

    if (enabled) {
        if (source === 'cost' || source === 'markup') {
            state.cost = cost
            state.markup = markup
            state.markupEnabled = true

            state.price = state.cost * (1 + state.markup / 100)
        } else {
            state.price = price
            state.markup = markup
            state.markupEnabled = true

            state.cost = state.price / (1 + state.markup / 100)
        }
    } else {
        state.cost = cost
        state.price = price
        state.markup = markup
        state.markupEnabled = false
    }

    // keep sliders in sync with computed values
    els.costSlider.value = Math.round(state.cost * 100)
    els.priceSlider.value = Math.round(state.price * 100)
    APP.state.tMove = els.lengthSlider.value / 1000
    APP.state.inchesStretchout = Math.round(els.stretchSlider.value * 20 / 1000)
}
