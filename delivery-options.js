const deliveryOptions = document.querySelectorAll('.delivery-option-btn');

deliveryOptions.forEach(link => {
    link.addEventListener('click', () => {
        deliveryOptions.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});