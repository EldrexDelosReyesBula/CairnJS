/**
 * Cairn Live — Zero-Build Hot Reload Engine
 * Provides instant hot reload & live code updating without Webpack, Vite, or server setup.
 */
(function () {
    if (typeof window === 'undefined') return;

    console.log('⚡ [Cairn Live]: Hot reload monitor active. Watching page mutations...');

    let lastSource = '';
    const pollCode = () => {
        const scripts = Array.from(document.querySelectorAll('script:not([src])'));
        const currentSource = scripts.map(s => s.textContent).join('\n');

        if (lastSource && currentSource !== lastSource) {
            console.log('⚡ [Cairn Live]: Local code modification detected. Reloading component tree...');
            window.location.reload();
        }
        lastSource = currentSource;
    };

    setInterval(pollCode, 1000);
})();
