/**
 * @eldrex/cairnjs - Error Boundary & Global Error Handling
 * Catches render errors in component subtrees, provides global crash handlers, and wraps safe components.
 */

import { state } from './state.js';

let globalErrorHandlers = {
    onError: (err, context) => console.error('[Cairn Error]:', err, context),
    onComponentError: null,
    onRecover: null
};

/**
 * Configure global error handling and recovery strategies.
 * @param {object} handlers
 */
export function error(handlers = {}) {
    Object.assign(globalErrorHandlers, handlers);
    return globalErrorHandlers;
}

/**
 * Wraps a component factory in a safe boundary with fallback UI and retry support.
 * 
 * @param {Function} ComponentFn Base component factory
 * @param {object} options Options { fallback, retry, log }
 * @returns {Function} Safe wrapped component
 */
export function safe(ComponentFn, options = {}) {
    const {
        fallback = (err) => {
            if (typeof document !== 'undefined') {
                const el = document.createElement('div');
                el.className = 'cairn-safe-fallback';
                el.textContent = `Something went wrong: ${err.message || 'Unknown error'}`;
                el.style.cssText = 'padding: 12px 16px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; color: #ef4444; font-family: sans-serif; font-size: 14px;';
                return el;
            }
            return null;
        },
        retry = true,
        log = true
    } = options;

    return (props = {}, ...children) => {
        let attempts = 0;
        const renderAttempt = () => {
            try {
                return ComponentFn(props, ...children);
            } catch (err) {
                if (log) {
                    console.error('[Cairn SafeComponent Error]:', err);
                }
                if (typeof globalErrorHandlers.onError === 'function') {
                    try {
                        globalErrorHandlers.onError(err, { component: ComponentFn.name || 'AnonymousComponent', props });
                    } catch (_) {}
                }
                if (typeof globalErrorHandlers.onComponentError === 'function') {
                    const degraded = globalErrorHandlers.onComponentError(err, ComponentFn);
                    if (degraded) return degraded;
                }
                if (typeof fallback === 'function') {
                    return fallback(err, {
                        retry: () => {
                            attempts++;
                            if (typeof globalErrorHandlers.onRecover === 'function') {
                                globalErrorHandlers.onRecover(ComponentFn);
                            }
                            return renderAttempt();
                        }
                    });
                }
                return fallback;
            }
        };

        return renderAttempt();
    };
}

/**
 * Wraps a component factory in an error boundary.
 * If the render function throws, shows the fallback UI.
 *
 * @param {object} config Error boundary configuration
 * @param {Function} config.children Component factory function to execute
 * @param {Function|HTMLElement} config.fallback Fallback UI or factory receiving the error
 * @param {Function} config.onError Optional callback invoked with the caught error
 * @returns {HTMLElement} The rendered child or fallback
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
        if (typeof globalErrorHandlers.onError === 'function') {
            try { globalErrorHandlers.onError(err, { component: 'errorBoundary' }); } catch (_) {}
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
            if (typeof document !== 'undefined') {
                node = document.createElement('div');
                node.textContent = `Component Error: ${err.message}`;
                node.style.cssText = 'color: #ef4444; padding: 1rem; background: rgba(239,68,68,0.1); border-radius: 6px; font-family: monospace; border: 1px solid rgba(239,68,68,0.3);';
            }
        }
    }

    return node;
}

export default { error, safe, errorBoundary };
