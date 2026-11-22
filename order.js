/* Padre Coffee Roasters - cart and checkout demonstration.
   Cart data is stored in this browser with localStorage. This is not a live payment system. */
const CART_KEY = 'pcrCart';
const PROMO_KEY = 'pcrPromo';
let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
let promoApplied = localStorage.getItem(PROMO_KEY) === 'PADRE10';
let tipPercent = 0;

const peso = amount => `₱${Number(amount).toFixed(2)}`;
const saveCart = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const subtotal = () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const discount = () => promoApplied ? subtotal() * 0.10 : 0;
const tipAmount = () => Math.max(0, (subtotal() - discount()) * tipPercent / 100);
const total = () => Math.max(0, subtotal() - discount()) + tipAmount();

function renderCart() {
    const list = document.getElementById('cart-items');
    const empty = document.getElementById('empty-cart');
    const hasItems = cart.length > 0;
    list.innerHTML = '';
    empty.hidden = hasItems;
    list.hidden = !hasItems;
    document.getElementById('checkout-button').disabled = !hasItems;

    cart.forEach((item, index) => {
        const article = document.createElement('article');
        article.className = 'cart-item-card';
        const image = document.createElement('img');
        image.src = item.image || './assets/iconography/logo.png';
        image.alt = item.name;
        image.onerror = () => { image.src = './assets/iconography/logo.png'; };
        const details = document.createElement('div');
        details.className = 'cart-item-details';
        const title = document.createElement('h3'); title.textContent = item.name;
        const customization = document.createElement('p'); customization.className = 'cart-customization'; customization.textContent = item.customization || 'Standard selection';
        const unit = document.createElement('p'); unit.className = 'cart-unit-price'; unit.textContent = `${peso(item.price)} each`;
        details.append(title, customization, unit);
        const controls = document.createElement('div'); controls.className = 'cart-item-controls';
        const quantity = document.createElement('div'); quantity.className = 'quantity-control';
        const minus = document.createElement('button'); minus.type = 'button'; minus.textContent = '−'; minus.setAttribute('aria-label', `Decrease ${item.name} quantity`);
        const count = document.createElement('span'); count.textContent = item.quantity;
        const plus = document.createElement('button'); plus.type = 'button'; plus.textContent = '+'; plus.setAttribute('aria-label', `Increase ${item.name} quantity`);
        minus.addEventListener('click', () => changeQuantity(index, -1));
        plus.addEventListener('click', () => changeQuantity(index, 1));
        quantity.append(minus, count, plus);
        const linePrice = document.createElement('strong'); linePrice.className = 'cart-line-price'; linePrice.textContent = peso(item.price * item.quantity);
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove-item'; remove.textContent = 'Remove'; remove.addEventListener('click', () => { cart.splice(index, 1); saveCart(); renderAll(); });
        controls.append(quantity, linePrice, remove);
        article.append(image, details, controls); list.append(article);
    });
    document.getElementById('subtotal').textContent = peso(subtotal());
    document.getElementById('discount').textContent = `−${peso(discount())}`;
    document.getElementById('cart-total').textContent = peso(subtotal() - discount());
    document.getElementById('promo-message').textContent = promoApplied ? 'PADRE10 applied: 10% discount added.' : 'Use PADRE10 for a sample 10% discount.';
    document.getElementById('promo-message').classList.toggle('success-message', promoApplied);
}

function changeQuantity(index, amount) {
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart(); renderAll();
}

function renderCheckoutSummary() {
    const items = document.getElementById('checkout-items');
    items.innerHTML = '';
    cart.forEach(item => {
        const row = document.createElement('div'); row.className = 'checkout-item-row';
        const name = document.createElement('span'); name.textContent = `${item.quantity} × ${item.name}`;
        const price = document.createElement('strong'); price.textContent = peso(item.price * item.quantity);
        row.append(name, price); items.append(row);
    });
    document.getElementById('checkout-subtotal').textContent = peso(subtotal());
    document.getElementById('checkout-discount').textContent = `−${peso(discount())}`;
    document.getElementById('checkout-tip').textContent = peso(tipAmount());
    document.getElementById('checkout-total').textContent = peso(total());
}

function renderAll() { renderCart(); renderCheckoutSummary(); }

document.getElementById('apply-promo').addEventListener('click', () => {
    const code = document.getElementById('promo-code').value.trim().toUpperCase();
    const message = document.getElementById('promo-message');
    if (code === 'PADRE10') { promoApplied = true; localStorage.setItem(PROMO_KEY, code); }
    else { promoApplied = false; localStorage.removeItem(PROMO_KEY); }
    message.textContent = promoApplied ? 'PADRE10 applied: 10% discount added.' : 'That code is not valid. Try PADRE10.';
    message.classList.toggle('success-message', promoApplied);
    renderAll();
});

document.getElementById('checkout-button').addEventListener('click', () => {
    if (!cart.length) return;
    document.getElementById('cart-view').hidden = true;
    document.getElementById('checkout-view').hidden = false;
    updateStep(2); renderCheckoutSummary(); window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.getElementById('back-to-cart').addEventListener('click', () => {
    document.getElementById('checkout-view').hidden = true;
    document.getElementById('cart-view').hidden = false;
    updateStep(1); window.scrollTo({ top: 0, behavior: 'smooth' });
});

function updateFulfillment() {
    const selected = document.querySelector('input[name="fulfillment"]:checked').value;
    const pickup = document.getElementById('pickup-fields');
    const delivery = document.getElementById('delivery-fields');
    pickup.hidden = selected !== 'Pickup'; delivery.hidden = selected !== 'Delivery';
    document.getElementById('pickup-location').required = selected === 'Pickup';
    document.getElementById('delivery-address').required = selected === 'Delivery';
    document.getElementById('ready-status-label').textContent = selected === 'Pickup' ? 'Ready for Pickup' : 'Out for Delivery';
}
document.querySelectorAll('input[name="fulfillment"]').forEach(input => input.addEventListener('change', updateFulfillment));

document.querySelectorAll('.tip-button').forEach(button => button.addEventListener('click', () => {
    tipPercent = Number(button.dataset.tip); document.getElementById('custom-tip').value = '';
    document.querySelectorAll('.tip-button').forEach(item => item.classList.toggle('selected', item === button));
    renderCheckoutSummary();
}));
document.getElementById('custom-tip').addEventListener('input', event => {
    const value = Number(event.target.value);
    if (event.target.value === '') tipPercent = 0;
    else tipPercent = Math.min(100, Math.max(0, value));
    document.querySelectorAll('.tip-button').forEach(button => button.classList.remove('selected'));
    renderCheckoutSummary();
});

document.getElementById('checkout-form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = document.getElementById('checkout-error');
    if (!cart.length) { error.textContent = 'Your cart is empty. Add an item before placing an order.'; return; }
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const reference = `PCR-${Date.now().toString().slice(-6)}`;
    const fulfillment = data.get('fulfillment');
    const destination = fulfillment === 'Pickup' ? data.get('pickupLocation') : data.get('deliveryAddress');
    const details = document.getElementById('confirmation-details');
    details.innerHTML = '';
    const rows = [
        ['Customer', data.get('customerName')], ['Order type', fulfillment],
        [fulfillment === 'Pickup' ? 'Pickup branch' : 'Delivery address', destination],
        ['Payment preference', data.get('payment')], ['Estimated total', peso(total())]
    ];
    rows.forEach(([label, value]) => {
        const row = document.createElement('div'); row.className = 'confirmation-detail-row';
        const left = document.createElement('span'); left.textContent = label;
        const right = document.createElement('strong'); right.textContent = value;
        row.append(left, right); details.append(row);
    });
    document.getElementById('order-reference').textContent = reference;
    document.getElementById('checkout-view').hidden = true;
    document.getElementById('confirmation-view').hidden = false;
    updateStep(3); window.scrollTo({ top: 0, behavior: 'smooth' });
    // The submitted cart is cleared only after the demo confirmation is shown.
    localStorage.removeItem(CART_KEY); localStorage.removeItem(PROMO_KEY);
});

function updateStep(active) {
    document.querySelectorAll('[data-step-indicator]').forEach(step => {
        const number = Number(step.dataset.stepIndicator);
        step.classList.toggle('active', number === active);
        step.classList.toggle('completed', number < active);
    });
}

document.getElementById('new-order-button').addEventListener('click', () => {
    cart = []; promoApplied = false; tipPercent = 0; saveCart();
    document.getElementById('confirmation-view').hidden = true;
    document.getElementById('cart-view').hidden = false;
    document.getElementById('promo-code').value = '';
    document.getElementById('checkout-form').reset();
    document.getElementById('checkout-error').textContent = '';
    document.querySelectorAll('.tip-button').forEach(button => button.classList.toggle('selected', button.dataset.tip === '0'));
    updateFulfillment(); updateStep(1); renderAll(); window.scrollTo({ top: 0, behavior: 'smooth' });
});

updateFulfillment(); renderAll();
