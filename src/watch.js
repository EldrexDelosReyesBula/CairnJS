/**
 * @eldrex/cairnjs - Explicit Watcher
 * Vue-style watch() for explicitly observing state signal changes
 * with old/new value access, immediate execution, and deep comparison.
 */

import { effect } from './state.js';

/**
 * Watches a reactive state signal or computed and fires a callback
 * whenever its value changes, with access to both old and new values.
 *
 * @param {object|Function|Array} source Signal, computed, getter function, or array of signals
 * @param {Function} handler Callback receiving (newValue, oldValue)
 * @param {object} options { immediate: boolean, deep: boolean }
 * @returns {Function} Unwatch / stop function
 *
 * @example
 * const count = state(0);
 *
 * const stop = watch(count, (newVal, oldVal) => {
 *   console.log(`count changed from ${oldVal} to ${newVal}`);
 * }, { immediate: true });
 *
 * count.value = 5; // fires handler
 * stop(); // removes watcher
 */
export function watch(source, handler, options = {}) {
    const { immediate = false, deep = false } = options;

    let oldValue;
    let initialized = false;

    const getValue = () => {
        if (Array.isArray(source)) {
            return source.map(s => {
                if (s && s._isCairnState) return s.value;
                if (typeof s === 'function') return s();
                return s;
            });
        }
        if (source && source._isCairnState) return source.value;
        if (typeof source === 'function') return source();
        return source;
    };

    const deepEqual = (a, b) => {
        if (a === b) return true;
        if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return false;
        const keysA = Object.keys(a);
        const keysB = Object.keys(b);
        if (keysA.length !== keysB.length) return false;
        return keysA.every(k => deepEqual(a[k], b[k]));
    };

    const stop = effect(() => {
        const newValue = getValue();

        if (!initialized) {
            oldValue = deep && typeof newValue === 'object' ? JSON.parse(JSON.stringify(newValue || {})) : newValue;
            initialized = true;
            if (immediate) {
                try {
                    handler(newValue, undefined);
                } catch (e) {
                    console.error('[Cairn Watch Handler Error]:', e);
                }
            }
            return;
        }

        const changed = deep ? !deepEqual(newValue, oldValue) : newValue !== oldValue;

        if (changed) {
            const prevValue = oldValue;
            oldValue = deep && typeof newValue === 'object' ? JSON.parse(JSON.stringify(newValue || {})) : newValue;
            try {
                handler(newValue, prevValue);
            } catch (e) {
                console.error('[Cairn Watch Handler Error]:', e);
            }
        }
    });

    return stop;
}

/**
 * Watches multiple signals simultaneously and fires the handler when any of them change.
 *
 * @param {Array} sources Array of signals or getter functions
 * @param {Function} handler Callback receiving ([newValues], [oldValues])
 * @param {object} options { immediate }
 * @returns {Function} Unwatch function
 *
 * @example
 * watchEffect([firstName, lastName], ([fn, ln]) => {
 *   console.log('Name changed:', fn, ln);
 * });
 */
export function watchEffect(sources, handler, options = {}) {
    return watch(sources, handler, options);
}

export default { watch, watchEffect };
