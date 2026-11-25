document.addEventListener('error', (e) => {
    const img = e.target;
    if (img.tagName === 'IMG' && !img.dataset.fallback) {
        img.dataset.fallback = 'true';
        img.src = './assets/placeholders/inf.png';
        // note to self: the line above is supposed to be relative to the page files, not the js itself
        // cuz it runs on the page
    }
}, true);
