const deliveryOptions = document.querySelectorAll('.delivery-option-btn');

deliveryOptions.forEach(link => {
    link.addEventListener('click', () => {
        deliveryOptions.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

const paymentOptions = document.querySelectorAll('.payment-option-btn');

paymentOptions.forEach(link => {
    link.addEventListener('click', () => {
        paymentOptions.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

const tipOptions = document.querySelectorAll('.tip-option-btn');

tipOptions.forEach(link => {
    link.addEventListener('click', () => {
        tipOptions.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});
