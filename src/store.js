/**
 * @eldrex/cairnjs - Global Reactive Store
 * Pinia-style createStore() with reactive state, computed getters, and actions.
 * Zero dependencies — built entirely on Cairn's fine-grained reactivity primitives.
 */

import { state, computed, effect } from './state.js';

const _storeRegistry = new Map();

/**
 * Creates a named global reactive store.
 *
 * @param {string} name Unique store identifier
 * @param {object} config { state, getters, actions }
 * @returns {object} Reactive store instance
 *
 * @example
 * const auth = createStore('auth', {
 *   state: { user: null, token: null },
 *   getters: { isLoggedIn: (s) => !!s.user },
 *   actions: {
 *     login(user) { this.user = user; }
 *   }
 * });
 * auth.login({ name: 'Eldrex' });
 * console.log(auth.isLoggedIn); // true
 */
export function createStore(name, config = {}) {
    if (_storeRegistry.has(name)) {
        return _storeRegistry.get(name);
    }

    const { state: initialState = {}, getters = {}, actions = {} } = config;

    // Create reactive signals for each state key
    const signals = {};
    Object.entries(initialState).forEach(([key, val]) => {
        signals[key] = state(val);
    });

    // Build proxy that forwards .key to signal.value
    const storeProxy = new Proxy({}, {
        get(_, prop) {
            // Actions
            if (actions[prop]) {
                return (...args) => actions[prop].apply(storeProxy, args);
            }
            // Getters (computed)
            if (getters[prop]) {
                return getters[prop](storeProxy);
            }
            // State signals
            if (signals[prop]) {
                return signals[prop].value;
            }
            // Meta
            if (prop === '$signals') return signals;
            if (prop === '$name') return name;
            if (prop === '$subscribe') {
                return (key, fn) => {
                    if (signals[key]) return signals[key].subscribe(fn);
                };
            }
            if (prop === '$reset') {
                return () => {
                    Object.entries(initialState).forEach(([key, val]) => {
                        if (signals[key]) signals[key].value = val;
                    });
                };
            }
            if (prop === '$patch') {
                return (updates = {}) => {
                    Object.entries(updates).forEach(([key, val]) => {
                        if (signals[key]) signals[key].value = val;
                    });
                };
            }
            return undefined;
        },
        set(_, prop, val) {
            if (signals[prop]) {
                signals[prop].value = val;
                return true;
            }
            // Allow setting new reactive keys dynamically
            signals[prop] = state(val);
            return true;
        }
    });

    _storeRegistry.set(name, storeProxy);
    return storeProxy;
}

/**
 * Retrieves a previously registered store by name.
 * @param {string} name Store name
 * @returns {object} Store instance
 */
export function useStore(name) {
    if (!_storeRegistry.has(name)) {
        console.warn(`[Cairn Store Warning]: Store "${name}" has not been created yet with createStore("${name}", ...). Auto-initializing fallback store.`);
        return createStore(name, { state: {}, actions: {}, getters: {} });
    }
    return _storeRegistry.get(name);
}

/**
 * Lists all registered store names.
 * @returns {string[]}
 */
export function listStores() {
    return Array.from(_storeRegistry.keys());
}

export default { createStore, useStore, listStores };
