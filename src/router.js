/**
 * @eldrex/cairn - Built-in Router
 * Zero-dependency, lightweight client-side router for Cairn applications.
 */

import { state } from './state.js';

export const currentPath = state(typeof window !== 'undefined' ? window.location.pathname : '/');

/**
 * Declares routes and returns router controller.
 * 
 * @param {object} routes Object mapping path patterns to components/render functions
 * @returns {object} Router controller with .go(path) and .resolve()
 */
export function router(routes = {}) {
    const handleRoute = () => {
        if (typeof window !== 'undefined') {
            currentPath.value = window.location.pathname;
        }
    };

    if (typeof window !== 'undefined') {
        window.removeEventListener('popstate', handleRoute);
        window.addEventListener('popstate', handleRoute);
    }

    const routerInstance = {
        currentPath,
        go(path) {
            if (typeof window !== 'undefined' && window.history) {
                window.history.pushState({}, '', path);
                currentPath.value = path;
            }
        },
        resolve() {
            const path = currentPath.value;
            if (routes[path]) {
                return typeof routes[path] === 'function' ? routes[path]() : routes[path];
            }
            
            // Check wildcards
            if (routes['*']) {
                return typeof routes['*'] === 'function' ? routes['*']() : routes['*'];
            }
            return null;
        }
    };

    return routerInstance;
}

export default router;
