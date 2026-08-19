/**
 * @eldrex/cairn - Suspense / Async Boundary
 * Shows a loading fallback while async child resources are resolving.
 * Works natively with Cairn's resource() async signal primitive.
 */

import { state, effect } from './state.js';

/**
 * Renders children once all tracked resource signals finish loading,
 * showing a loading fallback in the meantime.
 *
 * @param {object} config Suspense configuration
 * @param {Function} config.children Render function returning node(s)
 * @param {Function|HTMLElement} config.loading Loading fallback UI or render function
 * @param {Function|HTMLElement} config.error Error fallback UI or render function receiving error
 * @param {Array} [config.resources] Optional array of resource signals to track
 * @returns {HTMLElement} Suspense container
 *
 * @example
 * const users = resource(() => fetch('/api/users').then(r => r.json()));
 *
 * suspense({
 *   resources: [users],
 *   loading: () => Spinner(),
 *   error: (err) => div('Failed to load: ' + err.message),
 *   children: () => UserList({ data: users.data.value })
 * });
 */
export function suspense(config = {}) {
    const { children, loading, error, resources = [] } = config;

    if (typeof document === 'undefined') {
        const output = typeof children === 'function' ? children() : children;
        return output || { tagName: 'DIV', nodeType: 1, childNodes: [], setAttribute() {}, appendChild() {} };
    }

    const container = document.createElement('div');
    container.setAttribute('data-cairn-suspense', '');

    const renderLoading = () => {
        if (typeof loading === 'function') return loading();
        if (loading && loading.nodeType) return loading;
        // Default spinner
        const def = document.createElement('div');
        def.textContent = 'Loading...';
        def.style.cssText = 'color: #94a3b8; padding: 1rem; text-align: center; font-family: sans-serif;';
        return def;
    };

    const renderError = (err) => {
        if (typeof error === 'function') return error(err);
        if (error && error.nodeType) return error;
        const def = document.createElement('div');
        def.textContent = `Error: ${err ? err.message || String(err) : 'Unknown error'}`;
        def.style.cssText = 'color: #ef4444; padding: 1rem; font-family: monospace;';
        return def;
    };

    const setContent = (node) => {
        while (container.firstChild) container.removeChild(container.firstChild);
        if (node) container.appendChild(node);
    };

    // Initial loading state
    setContent(renderLoading());

    if (resources.length === 0) {
        // No tracked resources — render children immediately after microtask
        Promise.resolve().then(() => {
            try {
                if (typeof children === 'function') {
                    setContent(children());
                }
            } catch (e) {
                setContent(renderError(e));
            }
        });
        return container;
    }

    // Track all resource loading states
    effect(() => {
        const isLoading = resources.some(r => r && r.loading && r.loading.value === true);
        const firstError = resources.find(r => r && r.error && r.error.value !== null);

        if (firstError && firstError.error.value) {
            setContent(renderError(firstError.error.value));
        } else if (isLoading) {
            setContent(renderLoading());
        } else {
            try {
                if (typeof children === 'function') {
                    setContent(children());
                }
            } catch (e) {
                setContent(renderError(e));
            }
        }
    });

    return container;
}

export default suspense;
