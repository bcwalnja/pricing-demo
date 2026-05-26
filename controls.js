const costSlider = document.getElementById('coil-cost');
const costDisplay = document.getElementById('coil-cost-display');

const priceSlider = document.getElementById('coil-price');
const priceDisplay = document.getElementById('coil-price-display');

const markupSlider = document.getElementById('markup');
const markupDisplay = document.getElementById('markup-display');
const markupToggle = document.getElementById('markup-enabled');

let cost = 0;
let price = 0;
let markup = 0;

function formatCurrency(v) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(v);
}

function recalc(source) {

    // read
    cost = costSlider.value / 100;
    price = priceSlider.value / 100;
    markup = markupSlider.value;

    // compute
    if (markupToggle.checked) {
        if (source === 'cost' || source === 'markup') {
            price = cost * (1 + markup / 100);
            priceSlider.value = Math.round(price * 100);
        } else {
            cost = price / (1 + markup / 100);
            costSlider.value = Math.round(cost * 100);
        }
    }

    // render
    costDisplay.textContent = formatCurrency(cost);
    priceDisplay.textContent = formatCurrency(price);
    markupDisplay.textContent = `${markup}%`;

    markupSlider.disabled = !markupToggle.checked;
}

// listeners
costSlider.addEventListener('input', () => recalc('cost'));
priceSlider.addEventListener('input', () => recalc('price'));
markupSlider.addEventListener('input', () => recalc('markup'));
markupToggle.addEventListener('change', () => recalc('markup'));

// init
recalc('cost');