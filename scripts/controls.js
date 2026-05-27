// cache DOM once
const els = {
    costSlider: document.getElementById('coil-cost'),
    costDisplay: document.getElementById('coil-cost-display'),

    priceSlider: document.getElementById('coil-price'),
    priceDisplay: document.getElementById('coil-price-display'),

    markupSlider: document.getElementById('markup'),
    markupDisplay: document.getElementById('markup-display'),

    markupToggle: document.getElementById('markup-enabled')
}


// shared formatter (kept global intentionally)
window.formatCurrency = function (v) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(v)
}


// ---- internal sync helpers ----

function syncStateFromInputs(source) {
    const s = APP.state

    const cost = els.costSlider.value / 100
    const price = els.priceSlider.value / 100
    const markup = Number(els.markupSlider.value)
    const enabled = els.markupToggle.checked

    if (enabled) {
        if (source === 'cost' || source === 'markup') {
            s.cost = cost
            s.markup = markup
            s.markupEnabled = true

            s.price = s.cost * (1 + s.markup / 100)
        } else {
            s.price = price
            s.markup = markup
            s.markupEnabled = true

            s.cost = s.price / (1 + s.markup / 100)
        }
    } else {
        s.cost = cost
        s.price = price
        s.markup = markup
        s.markupEnabled = false
    }

    // keep sliders in sync with computed values
    els.costSlider.value = Math.round(s.cost * 100)
    els.priceSlider.value = Math.round(s.price * 100)
    APP.state.tMove = els.lengthSlider.value / 1000
    APP.state.inchesStretchout = Math.round(els.stretchSlider.value * 20 / 1000)
}


function render() {
    const s = APP.state

    els.costDisplay.textContent = formatCurrency(s.cost)
    els.priceDisplay.textContent = formatCurrency(s.price)
    els.markupDisplay.textContent = `${s.markup}%`

    els.markupSlider.disabled = !s.markupEnabled
    
    els.lengthSlider = document.getElementById('special-trim-length')
    els.stretchSlider = document.getElementById('stretchout')
}


// ---- event handlers ----

function onInput(source) {
    syncStateFromInputs(source)
    render()
    APP.update()
}


// ---- listeners ----

els.costSlider.addEventListener('input', () => onInput('cost'))
els.priceSlider.addEventListener('input', () => onInput('price'))
els.markupSlider.addEventListener('input', () => onInput('markup'))
els.markupToggle.addEventListener('change', () => onInput('markup'))
els.lengthSlider.addEventListener('input', () => onInput('trim'))
els.stretchSlider.addEventListener('input', () => onInput('trim'))

// ---- initial render ----

window.addEventListener('DOMContentLoaded', () => {
  onInput('init')
})
