// module registration
APP.modules.pricing = {

  calc(state) {
    const hems = 1
    const bends = 2
    const stretch = state.inchesStretchout
    const lfPrice = state.price

    const hemCost = hems * lfPrice
    const bendCost = bends * lfPrice
    const stretchCost = stretch * lfPrice

    return {
      hem: hemCost,
      bend: bendCost,
      stretch: stretchCost,
      total: hemCost + bendCost + stretchCost
    }
  },


  render(result) {
    document.getElementById('st-hem-price-display').textContent = formatCurrency(result.hem)
    document.getElementById('st-bend-price-display').textContent = formatCurrency(result.bend)
    document.getElementById('st-stretchout-price-display').textContent = formatCurrency(result.stretch)
    document.getElementById('st-total-price-display').textContent = formatCurrency(result.total)
  }

}
