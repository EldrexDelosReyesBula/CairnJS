/**
 * @eldrex/cairnjs - Built-in Single Page App (SPA) Router
 * Zero-dependency, lightweight client-side router with dynamic route parameters (:id),
 * query string parsing, declarative Link component, and hash/history mode support.
 */

import { state } from './state.js';
import { a } from './dom.js';

export const currentPath = state(typeof window !== 'undefined' ? (window.location.pathname || '/') : '/');
export const currentQuery = state({});
export const currentParams = state({});

/**
 * Parses a query string (?a=1&b=2) into a key-value object.
 */
function parseQueryString(searchStr = '') {
    const clean = searchStr.startsWith('?') ? searchStr.slice(1) : searchStr;
    if (!clean) return {};
    const query = {};
    clean.split('&').forEach(part => {
        if (!part) return;
        const [k, v] = part.split('=');
        query[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
    return query;
}

/**
 * Matches a route pattern (e.g. '/users/:id') against a target path.
 * Returns { match: true, params } or { match: false }.
 */
function matchRoute(pattern, path) {
    if (pattern === path) return { match: true, params: {} };
    if (pattern === '*') return { match: true, params: { wildcard: path } };

    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) return { match: false };

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
        const pSeg = patternParts[i];
        const seg = pathParts[i];
        if (pSeg.startsWith(':')) {
            const paramName = pSeg.slice(1);
            params[paramName] = seg;
        } else if (pSeg !== seg) {
            return { match: false };
        }
    }

    return { match: true, params };
}

/**
 * Declares routes and returns a router controller.
 * 
 * @param {object} routes Object mapping path patterns (e.g. '/', '/users/:id', '*') to components or render functions
 * @param {object} [options={}] Router options { mode: 'history'|'hash' }
 * @returns {object} Router controller
 *
 * @example
 * const appRouter = router({
 *   '/': () => HomePage(),
 *   '/users/:id': ({ params, query }) => UserProfile({ userId: params.id }),
 *   '*': () => NotFoundPage()
 * });
 */
export function router(routes = {}, options = {}) {
    const { mode = 'history' } = options;

    const getRawPath = () => {
        if (typeof window === 'undefined') return '/';
        if (mode === 'hash') {
            const hash = window.location.hash.slice(1) || '/';
            return hash.split('?')[0] || '/';
        }
        return window.location.pathname || '/';
    };

    const getRawSearch = () => {
        if (typeof window === 'undefined') return '';
        if (mode === 'hash') {
            const hash = window.location.hash.slice(1) || '';
            const qIdx = hash.indexOf('?');
            return qIdx !== -1 ? hash.slice(qIdx) : '';
        }
        return window.location.search || '';
    };

    const syncRouteState = () => {
        const p = getRawPath();
        const q = parseQueryString(getRawSearch());
        currentPath.value = p;
        currentQuery.value = q;
    };

    if (typeof window !== 'undefined') {
        const eventName = mode === 'hash' ? 'hashchange' : 'popstate';
        window.removeEventListener(eventName, syncRouteState);
        window.addEventListener(eventName, syncRouteState);
        syncRouteState();
    }

    const routerInstance = {
        currentPath,
        currentQuery,
        currentParams,
        mode,

        /**
         * Navigates programmatically to a new path.
         * @param {string} path Target URL / path
         */
        go(path) {
            if (typeof window !== 'undefined') {
                if (mode === 'hash') {
                    window.location.hash = path.startsWith('#') ? path : `#${path}`;
                } else if (window.history) {
                    window.history.pushState({}, '', path);
                    syncRouteState();
                }
            } else {
                currentPath.value = path.split('?')[0];
                currentQuery.value = parseQueryString(path.split('?')[1] || '');
            }
        },

        /**
         * Resolves the active component based on current URL path.
         * @returns {HTMLElement|*} Rendered route output
         */
        resolve() {
            const path = currentPath.value;
            const query = currentQuery.value;

            for (const [pattern, handler] of Object.entries(routes)) {
                if (pattern === '*') continue;
                const { match, params } = matchRoute(pattern, path);
                if (match) {
                    currentParams.value = params;
                    return typeof handler === 'function' ? handler({ params, query, path }) : handler;
                }
            }

            // Fallback to wildcard route
            if (routes['*']) {
                const handler = routes['*'];
                currentParams.value = { wildcard: path };
                return typeof handler === 'function' ? handler({ params: { wildcard: path }, query, path }) : handler;
            }

            return null;
        },

        /**
         * Declarative SPA Link component that intercepts clicks for smooth client-side routing.
         */
        Link(props = {}, ...children) {
            const href = typeof props === 'string' ? props : (props.href || '/');
            const otherProps = typeof props === 'object' ? { ...props } : {};
            delete otherProps.href;

            return a({
                href: mode === 'hash' ? `#${href}` : href,
                onclick: (e) => {
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                    e.preventDefault();
                    routerInstance.go(href);
                },
                ...otherProps
            }, ...children);
        }
    };

    return routerInstance;
}

export const Link = (props, ...children) => {
    const r = router();
    return r.Link(props, ...children);
};

export default router;
