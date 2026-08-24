/**
 * @eldrex/cairnjs - Lifecycle Hooks
 * onMount, onUnmount, onUpdate — component lifecycle hooks that fire
 * when DOM elements are inserted, removed, or reactively updated.
 */

// Active lifecycle context stack (set by component)
const _mountQueue = [];
const _unmountQueue = [];
const _updateQueue = [];

let _currentMountCallbacks = null;
let _currentUnmountCallbacks = null;
let _currentUpdateCallbacks = null;

/**
 * Registers a callback to run after the component's DOM element is mounted.
 * If the callback returns a function, it is automatically registered as a cleanup (onUnmount) handler.
 * Must be called during component setup (synchronous).
 *
 * @param {Function} fn Callback function — receives the mounted DOM element, can optionally return a cleanup function
 *
 * @example
 * const Card = component(() => {
 *   onMount((el) => {
 *     console.log('Mounted:', el);
 *     const timer = setInterval(tick, 1000);
 *     return () => clearInterval(timer); // Automatic cleanup on unmount!
 *   });
 *   return div({ class: 'card' }, 'Hello');
 * });
 */
export function onMount(fn) {
    if (_currentMountCallbacks) {
        _currentMountCallbacks.push(fn);
    } else {
        // Defer: attach on next RAF if called outside component scope
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(() => {
                const cleanup = fn(document.body);
                if (typeof cleanup === 'function' && _currentUnmountCallbacks) {
                    _currentUnmountCallbacks.push(cleanup);
                }
            });
        }
    }
}

/**
 * Registers a callback to run when the component is removed from the DOM.
 * Useful for cleanup (timers, subscriptions, event listeners).
 *
 * @param {Function} fn Cleanup callback
 *
 * @example
 * onUnmount(() => {
 *   clearInterval(timerId);
 * });
 */
export function onUnmount(fn) {
    if (_currentUnmountCallbacks) {
        _currentUnmountCallbacks.push(fn);
    }
}

/**
 * Registers a callback to run each time the component's reactive state updates.
 *
 * @param {Function} fn Update callback — receives { prev, next } values
 */
export function onUpdate(fn) {
    if (_currentUpdateCallbacks) {
        _currentUpdateCallbacks.push(fn);
    }
}

/**
 * Internal: attaches lifecycle hooks to a DOM element using MutationObserver.
 * Called by the mount() function after inserting a component node.
 *
 * @param {HTMLElement} el DOM element
 * @param {object} hooks { mount, unmount, update }
 */
export function attachLifecycle(el, hooks = {}) {
    if (!el || typeof el !== 'object') return;

    const { mount: mountFns = [], unmount: unmountFns = [], update: updateFns = [] } = hooks;

    // Fire mount callbacks and capture returned cleanups
    if (mountFns.length) {
        if (typeof requestAnimationFrame !== 'undefined') {
            requestAnimationFrame(() => mountFns.forEach(fn => {
                try {
                    const cleanup = fn(el);
                    if (typeof cleanup === 'function') {
                        unmountFns.push(cleanup);
                    }
                } catch (e) {
                    console.error('[Cairn Lifecycle onMount Error]:', e);
                }
            }));
        } else {
            // Fallback for non-browser / immediate environments
            mountFns.forEach(fn => {
                try {
                    const cleanup = fn(el);
                    if (typeof cleanup === 'function') {
                        unmountFns.push(cleanup);
                    }
                } catch (e) {}
            });
        }
    }

    // Observe removal using MutationObserver
    if (unmountFns.length && typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const removed of mutation.removedNodes) {
                    if (removed === el || (removed.contains && removed.contains(el))) {
                        unmountFns.forEach(fn => {
                            try { fn(el); } catch (e) { console.error('[Cairn Lifecycle onUnmount Error]:', e); }
                        });
                        observer.disconnect();
                        return;
                    }
                }
            }
        });

        const parent = el.parentNode || (typeof document !== 'undefined' ? document.body : null);
        if (parent) {
            observer.observe(parent, { childList: true, subtree: true });
        }
    }

    // Update callbacks — stored on element for external invocation
    if (updateFns.length) {
        el._cairnUpdateHooks = updateFns;
    }
}

/**
 * Runs a component setup function with lifecycle context active,
 * returns the DOM node and captured lifecycle callbacks.
 *
 * @param {Function} setupFn Component setup function
 * @returns {{ node: HTMLElement, lifecycles: object }}
 */
export function withLifecycle(setupFn) {
    const mountCallbacks = [];
    const unmountCallbacks = [];
    const updateCallbacks = [];

    const prev = {
        mount: _currentMountCallbacks,
        unmount: _currentUnmountCallbacks,
        update: _currentUpdateCallbacks
    };

    _currentMountCallbacks = mountCallbacks;
    _currentUnmountCallbacks = unmountCallbacks;
    _currentUpdateCallbacks = updateCallbacks;

    let node;
    try {
        node = setupFn();
    } finally {
        _currentMountCallbacks = prev.mount;
        _currentUnmountCallbacks = prev.unmount;
        _currentUpdateCallbacks = prev.update;
    }

    if (node) {
        attachLifecycle(node, {
            mount: mountCallbacks,
            unmount: unmountCallbacks,
            update: updateCallbacks
        });
    }

    return node;
}

export default { onMount, onUnmount, onUpdate, withLifecycle, attachLifecycle };
