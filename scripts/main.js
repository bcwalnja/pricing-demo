// bootstrap FIRST (must exist before other files load)
window.APP = window.APP || {
  state: {},
  config: {},
  modules: {}
}


// ---- controller ----
APP.update = function () {
  const pricing = this.modules.pricing.calc(this.state)
  const svgData = this.modules.svg.compute(this.state)

  this.modules.pricing.render(pricing)
  this.modules.svg.render(svgData, this.state)
  this.modules.ui.render(this.state)
}


// ---- init ----
window.addEventListener('DOMContentLoaded', () => {
  APP.state = {
    cost: document.getElementById('coil-cost').value / 100,
    price: document.getElementById('coil-price').value / 100,
    markup: document.getElementById('markup').value,
    markupEnabled: document.getElementById('markup-enabled').checked,

    tMove: document.getElementById('special-trim-length').value / 1000,
    inchesStretchout: Math.round(
      document.getElementById('stretchout').value * 20 / 1000
    )
  }

  APP.update()
})
