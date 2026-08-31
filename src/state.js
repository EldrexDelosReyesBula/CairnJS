/**
 * @eldrex/cairnjs - Reactive Engine
 * Lightweight, fine-grained state, computed, effect, collection, resource, and memory primitives.
 */

import { logStateChange } from './debug.js';
import { middlewareEngine } from './extensibility.js';
import { _queueEffect } from './batch.js';

let activeEffect = null;
const effectStack = [];
let _activePropertyTrack = null;

// Memory Configuration & Object Pools
const memoryConfig = {
    autoDispose: true,
    weakRefs: typeof WeakRef !== 'undefined',
    pooling: true,
    gcHints: true,
    maxMemory: 100 // MB
};

const _stateRegistry = new Set();
const _objectPool = new Map();

/**
 * Configure memory management for CairnJS.
 * @param {object} options
 * @returns {object} Current memory configuration and metrics
 */
export function memory(options = {}) {
    Object.assign(memoryConfig, options);
    return {
        ...memoryConfig,
        activeStates: _stateRegistry.size,
        poolSize: _objectPool.size,
        getMemoryUsage() {
            if (typeof performance !== 'undefined' && performance.memory) {
                return {
                    usedJSHeapSizeMB: (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(2),
                    totalJSHeapSizeMB: (performance.memory.totalJSHeapSize / (1024 * 1024)).toFixed(2)
                };
            }
            return { usedJSHeapSizeMB: 'N/A', totalJSHeapSizeMB: 'N/A' };
        }
    };
}

/**
 * Creates a fine-grained reactive state primitive.
 * Supports primitive values as well as proxy-wrapped objects for surgical per-property reactivity.
 * 
 * @param {*} initialValue Initial value of the state or getter function
 * @returns {object} Reactive state instance with history & fine-grained reactivity
 */
export function state(initialValue) {
    if (typeof initialValue === 'function') {
        return computed(initialValue);
    }

    let _val = initialValue;
    let _queuedNext = undefined;
    let _hasQueuedNext = false;
    const history = [];
    const subscribers = new Set();
    const propSubscribers = new Map();

    const notify = (property = null) => {
        const toNotify = new Set(subscribers);

        if (property && propSubscribers.has(property)) {
            const pSubs = propSubscribers.get(property);
            pSubs.forEach(sub => {
                if (sub._isDisposed) pSubs.delete(sub);
                else toNotify.add(sub);
            });
        }

        toNotify.forEach((sub) => {
            if (sub._isDisposed) {
                subscribers.delete(sub);
                return;
            }
            if (_queueEffect(sub)) return;
            try {
                sub(_val);
            } catch (err) {
                console.error('[Cairn Reactivity Error]:', err);
            }
        });
    };

    const recordHistory = (oldVal) => {
        if (history.length > 50) history.shift();
        history.push(JSON.parse(JSON.stringify(oldVal !== undefined ? oldVal : null)));
    };

    // Proxy wrapper for granular object property reactivity
    const createObjectProxy = (obj) => {
        return new Proxy(obj, {
            get(target, prop, receiver) {
                if (prop === '_isCairnState') return true;
                if (prop === 'value') {
                    if (activeEffect) {
                        subscribers.add(activeEffect);
                    }
                    return proxyInstance || (proxyInstance = createObjectProxy(target));
                }
                if (prop === 'peek') return () => target;
                if (prop === 'subscribe') return (fn, specificProp = null) => stateSignal.subscribe(fn, specificProp);
                if (prop === 'next') return (val) => stateSignal.next(val);
                if (prop === 'commit') return () => stateSignal.commit();
                if (prop === 'rollback') return () => stateSignal.rollback();
                if (prop === 'snapshot') return () => stateSignal.snapshot();
                if (prop === 'restore') return (snap) => stateSignal.restore(snap);

                if (activeEffect) {
                    if (!propSubscribers.has(prop)) {
                        propSubscribers.set(prop, new Set());
                    }
                    propSubscribers.get(prop).add(activeEffect);
                }

                const res = Reflect.get(target, prop, receiver);
                if (typeof res === 'object' && res !== null && !res._isCairnState) {
                    return createObjectProxy(res);
                }
                return res;
            },
            set(target, prop, newVal, receiver) {
                if (prop === 'value' && typeof newVal === 'object' && newVal !== null) {
                    recordHistory(_val);
                    Object.keys(target).forEach(k => delete target[k]);
                    Object.assign(target, newVal);
                    logStateChange('signal.value', _val, newVal);
                    middlewareEngine.afterStateChange('state.value', _val, newVal);
                    notify();
                    return true;
                }
                const oldVal = target[prop];
                if (Object.is(oldVal, newVal)) return true;
                recordHistory(_val);
                const res = Reflect.set(target, prop, newVal, receiver);
                logStateChange(`signal.${String(prop)}`, oldVal, newVal);
                middlewareEngine.afterStateChange(`state.${String(prop)}`, oldVal, newVal);
                notify(prop);
                return res;
            }
        });
    };

    let proxyInstance = null;
    const isObjectTarget = _val !== null && typeof _val === 'object' && !Array.isArray(_val) && !_val._isCairnState;

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
            recordHistory(oldVal);
            _val = newValue;
            logStateChange('signal', oldVal, newValue);
            middlewareEngine.afterStateChange('state', oldVal, newValue);
            notify();
        },
        peek() {
            return _val;
        },
        subscribe(fn, propName = null) {
            if (propName) {
                if (!propSubscribers.has(propName)) {
                    propSubscribers.set(propName, new Set());
                }
                propSubscribers.get(propName).add(fn);
                return () => propSubscribers.get(propName).delete(fn);
            }
            subscribers.add(fn);
            return () => subscribers.delete(fn);
        },
        // State predictability & time-travel
        next(value) {
            _queuedNext = value;
            _hasQueuedNext = true;
            return this;
        },
        commit() {
            if (_hasQueuedNext) {
                this.value = _queuedNext;
                _queuedNext = undefined;
                _hasQueuedNext = false;
            }
            return this;
        },
        rollback() {
            if (history.length > 0) {
                const prev = history.pop();
                if (typeof _val === 'object' && _val !== null && typeof prev === 'object' && prev !== null) {
                    Object.keys(_val).forEach(k => delete _val[k]);
                    Object.assign(_val, prev);
                } else {
                    _val = prev;
                }
                notify();
            }
            return this;
        },
        snapshot() {
            return JSON.parse(JSON.stringify(_val));
        },
        restore(snapshotData) {
            recordHistory(_val);
            const parsed = JSON.parse(JSON.stringify(snapshotData));
            if (typeof _val === 'object' && _val !== null && typeof parsed === 'object' && parsed !== null) {
                Object.keys(_val).forEach(k => delete _val[k]);
                Object.assign(_val, parsed);
            } else {
                _val = parsed;
            }
            notify();
            return this;
        },
        toString() {
            return String(this.value);
        },
        valueOf() {
            return this.value;
        }
    };

    if (isObjectTarget) {
        proxyInstance = createObjectProxy(_val);
        _stateRegistry.add(proxyInstance);
        return proxyInstance;
    }

    _stateRegistry.add(stateSignal);
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
 * Supports auto-cleanup if the effect function returns a cleanup callback.
 * 
 * @param {Function} fn Function containing state accesses. May return a cleanup callback.
 * @returns {Function} Unsubscribe / stop effect function
 */
export function effect(fn) {
    let cleanupFn = null;
    let isStopped = false;

    let recursionDepth = 0;
    const MAX_EFFECT_RECURSION = 100;

    const runEffect = () => {
        if (isStopped || runEffect._isDisposed) return;
        if (recursionDepth >= MAX_EFFECT_RECURSION) {
            console.warn('[Cairn Reactivity Warning]: Maximum effect recursion depth exceeded. Breaking cyclic dependency.');
            return;
        }

        recursionDepth++;
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
            recursionDepth--;
        }
    };

    runEffect._isDisposed = false;
    runEffect();

    const dispose = () => {
        isStopped = true;
        runEffect._isDisposed = true;
        if (typeof cleanupFn === 'function') {
            try {
                cleanupFn();
            } catch (err) {
                console.error('[Cairn Effect Cleanup Error]:', err);
            }
            cleanupFn = null;
        }
    };

    return dispose;
}

/**
 * Checks if a given object is a Cairn reactive state or signal.
 * @param {*} val
 * @returns {boolean}
 */
export function isState(val) {
    return Boolean(val && (val._isCairnState || (typeof val === 'object' && 'value' in val && typeof val.subscribe === 'function')));
}
