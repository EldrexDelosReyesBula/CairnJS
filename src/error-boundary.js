/**
 * @eldrex/cairn - Error Boundary
 * Catches render errors in component subtrees and renders a fallback UI.
 * Equivalent to React's ErrorBoundary / getDerivedStateFromError.
 */

import { state } from './state.js';

/**
 * Wraps a component factory in an error boundary.
 * If the render function throws, shows the fallback UI.
 *
 * @param {object} config Error boundary configuration
 * @param {Function} config.children Component factory function to execute
 * @param {Function|HTMLElement} config.fallback Fallback UI or factory receiving the error
 * @param {Function} config.onError Optional callback invoked with the caught error
 * @returns {HTMLElement} The rendered child or fallback
 *
 * @example
 * errorBoundary({
 *   children: () => BrokenComponent(),
 *   fallback: (err) => div('Something went wrong: ' + err.message),
 *   onError: (err) => console.error('Boundary caught:', err)
 * });
 */
export function errorBoundary(config = {}) {
    const {
        children,
        fallback,
        onError
    } = config;

    const hasError = state(false);
    const caughtError = state(null);

    if (typeof children !== 'function') {
        console.warn('[Cairn ErrorBoundary]: `children` must be a render function.');
        return null;
    }

    let node;
    try {
        node = children();
    } catch (err) {
        hasError.value = true;
        caughtError.value = err;

        if (typeof onError === 'function') {
            try { onError(err); } catch (_) {}
        }

        if (typeof fallback === 'function') {
            try {
                node = fallback(err);
            } catch (fallbackErr) {
                console.error('[Cairn ErrorBoundary]: Fallback itself threw:', fallbackErr);
                if (typeof document !== 'undefined') {
                    node = document.createElement('div');
                    node.textContent = `[Cairn Error]: ${err.message}`;
                    node.style.cssText = 'color: #ef4444; padding: 1rem; background: rgba(239,68,68,0.1); border-radius: 6px; font-family: monospace;';
                }
            }
        } else if (fallback && fallback.nodeType) {
            node = fallback;
        } else {
            // Default error UI
            if (typeof document !== 'undefined') {
                node = document.createElement('div');
                node.textContent = `Component Error: ${err.message}`;
                node.style.cssText = 'color: #ef4444; padding: 1rem; background: rgba(239,68,68,0.1); border-radius: 6px; font-family: monospace; border: 1px solid rgba(239,68,68,0.3);';
            }
        }
    }

    return node;
}

export default errorBoundary;
