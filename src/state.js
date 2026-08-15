/**
 * @eldrex/cairn - Reactive Engine
 * Lightweight, fine-grained state, computed, effect, collection, and resource primitives.
 */

import { logStateChange } from './debug.js';
import { middlewareEngine } from './extensibility.js';

let activeEffect = null;
const effectStack = [];

/**
 * Creates a reactive state primitive.
 * @param {*} initialValue Initial value of the state or getter function
 * @returns Object with `.value` getter/setter, `.peek()`, and `.subscribe()`
 */
export function state(initialValue) {
    if (typeof initialValue === 'function') {
        return computed(initialValue);
    }
    let _val = initialValue;
    const subscribers = new Set();

    const stateSignal = {
        _isCairnState: true,
        get value() {
            if (activeEffect) {
                subscribers.add(activeEffect);
            }
            return _val;
        },
        set value(newValue) {
            if (Object.is(_val, newValue)) return;
            const oldVal = _val;
            _val = newValue;
            logStateChange('signal', oldVal, newValue);
            middlewareEngine.afterStateChange('state', oldVal, newValue);

            const toNotify = Array.from(subscribers);
            toNotify.forEach((sub) => {
                try {
                    sub(_val);
                } catch (err) {
                    console.error('[Cairn Reactivity Error]:', err);
                }
            });
        },
        peek() {
            return _val;
        },
        subscribe(fn) {
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        },
        toString() {
            return String(this.value);
        },
        valueOf() {
            return this.value;
        }
    };

    return stateSignal;
}

/**
 * Creates a reactive collection proxy for arrays or objects with granular mutation tracking.
 * @param {Array|Object} initialData 
 * @returns {Proxy} Reactive collection proxy
 */
export function collection(initialData = []) {
    const rawSignal = state(initialData);

    const makeReactiveProxy = (target) => {
        if (!target || typeof target !== 'object') return target;

        return new Proxy(target, {
            get(obj, prop, receiver) {
                if (prop === '_isCairnCollection') return true;
                if (prop === 'rawSignal') return rawSignal;
                if (prop === 'value') return rawSignal.value;

                if (prop === 'remove' && typeof obj.filter === 'function') {
                    return (item) => {
                        const updated = obj.filter(i => i !== item);
                        obj.length = 0;
                        updated.forEach(i => obj.push(i));
                        rawSignal.value = obj;
                    };
                }

                const val = Reflect.get(obj, prop, receiver);
                if (typeof val === 'function') {
                    return function (...args) {
                        const res = Array.prototype[prop].apply(obj, args);
                        rawSignal.value = Array.isArray(obj) ? [...obj] : { ...obj };
                        return res;
                    };
                }
                if (typeof val === 'object' && val !== null) {
                    return makeReactiveProxy(val);
                }
                return val;
            },
            set(obj, prop, val, receiver) {
                const res = Reflect.set(obj, prop, val, receiver);
                rawSignal.value = Array.isArray(obj) ? [...obj] : { ...obj };
                return res;
            }
        });
    };

    return makeReactiveProxy(initialData);
}

/**
 * Creates an async resource signal for API calls and async data loading.
 * Includes auto-polling, caching, and manual refetch capabilities.
 * 
 * @param {Function} fetcher Async fetch function
 * @returns {object} Resource object { data, value, loading, error, refetch, refresh, poll, cache }
 */
export function resource(fetcher) {
    const data = state(null);
    const loading = state(true);
    const error = state(null);

    let lastFetchTime = 0;
    let cacheTTL = 0;
    let pollIntervalId = null;

    const refetch = async () => {
        const now = Date.now();
        if (cacheTTL > 0 && data.value !== null && (now - lastFetchTime) < cacheTTL) {
            loading.value = false;
            return;
        }

        loading.value = true;
        error.value = null;
        try {
            const result = await fetcher();
            data.value = result;
            lastFetchTime = Date.now();
        } catch (err) {
            error.value = err;
        } finally {
            loading.value = false;
        }
    };

    refetch();

    const resourceObj = {
        data,
        get value() { return data.value; },
        loading,
        error,
        refetch,
        refresh: refetch,
        poll(intervalMs = 5000) {
            if (pollIntervalId) clearInterval(pollIntervalId);
            if (typeof setInterval !== 'undefined') {
                pollIntervalId = setInterval(refetch, intervalMs);
            }
            return () => {
                if (pollIntervalId) clearInterval(pollIntervalId);
            };
        },
        cache(options = {}) {
            if (options.ttl) {
                cacheTTL = options.ttl * 1000;
            }
            return resourceObj;
        }
    };

    return resourceObj;
}

/**
 * Creates a derived reactive computed property.
 * @param {Function} getter Computation function
 * @returns Computed state signal with `.value` getter
 */
export function computed(getter) {
    let _cachedValue;
    let _isDirty = true;
    const subscribers = new Set();

    const notifySubscribers = () => {
        const toNotify = Array.from(subscribers);
        toNotify.forEach((sub) => {
            try {
                sub(_cachedValue);
            } catch (err) {
                console.error('[Cairn Computed Error]:', err);
            }
        });
    };

    const reevaluate = () => {
        if (!_isDirty) {
            _isDirty = true;
            notifySubscribers();
        }
    };

    const computedSignal = {
        _isCairnState: true,
        _isCairnComputed: true,
        get value() {
            if (_isDirty) {
                effectStack.push(reevaluate);
                activeEffect = reevaluate;
                try {
                    _cachedValue = getter();
                } finally {
                    effectStack.pop();
                    activeEffect = effectStack[effectStack.length - 1] || null;
                }
                _isDirty = false;
            }
            if (activeEffect) {
                subscribers.add(activeEffect);
            }
            return _cachedValue;
        },
        peek() {
            return _cachedValue;
        },
        subscribe(fn) {
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        },
        toString() {
            return String(this.value);
        },
        valueOf() {
            return this.value;
        }
    };

    return computedSignal;
}

/**
 * Runs a side-effect function that automatically re-executes whenever dependent states change.
 * @param {Function} fn Function containing state accesses. May return a cleanup callback.
 * @returns {Function} Unsubscribe / stop effect function
 */
export function effect(fn) {
    let cleanupFn = null;
    let isStopped = false;

    const runEffect = () => {
        if (isStopped) return;

        if (typeof cleanupFn === 'function') {
            try {
                cleanupFn();
            } catch (err) {
                console.error('[Cairn Effect Cleanup Error]:', err);
            }
            cleanupFn = null;
        }

        effectStack.push(runEffect);
        activeEffect = runEffect;
        try {
            cleanupFn = fn();
        } catch (err) {
            console.error('[Cairn Effect Execution Error]:', err);
        } finally {
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1] || null;
        }
    };

    runEffect();

    return () => {
        isStopped = true;
        if (typeof cleanupFn === 'function') {
            try {
                cleanupFn();
            } catch (err) {
                console.error('[Cairn Effect Cleanup Error]:', err);
            }
        }
    };
}
