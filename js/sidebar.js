const navContainers = document.querySelectorAll('.sidebar-nav-container');
const navLinks = document.querySelectorAll('.sidebar-nav');

navContainers.forEach(container => {
    container.addEventListener('click', e => {
        const link = container.querySelector('.sidebar-nav');

        navLinks.forEach(l => l.classList.remove('active'));
        navContainers.forEach(c => c.classList.remove('active'));

        link.classList.add('active');
        container.classList.add('active');

        if (e.target !== link) link.click();
    });
});
