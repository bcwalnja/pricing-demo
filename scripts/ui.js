APP.modules.ui = (function () {

  const els = {
    lengthDisplay: document.getElementById('special-trim-length-display'),
    stretchDisplay: document.getElementById('special-trim-stretchout-display')
  }

  const CFG = {
    maxLengthFeet: 20.5
  }


  function formatLength(feetFloat) {
    let feet = Math.floor(feetFloat)
    let inches = Math.round((feetFloat - feet) * 12)

    if (inches === 12) {
      feet++
      inches = 0
    }

    return `${feet}' ${inches}"`
  }


  function render(state) {
    // length
    const lengthFeet = state.tMove * CFG.maxLengthFeet
    els.lengthDisplay.textContent = formatLength(lengthFeet)

    // stretch
    els.stretchDisplay.textContent = `${state.inchesStretchout}"`
  }


  return {
    render
  }

})()