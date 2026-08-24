/**
 * @eldrex/cairnjs - Batched Updates & Microtask Auto-Batching
 * Collects multiple reactive state writes and flushes them in a single
 * pass, preventing intermediate re-renders.
 */

let _isBatching = false;
let _autoBatching = false;
let _microtaskQueued = false;
const _pendingEffects = new Set();

/**
 * Batches multiple reactive state mutations, flushing all queued
 * effects in a single pass after the callback completes.
 *
 * @param {Function} fn Function containing state mutations
 */
export function batch(fn) {
    if (typeof fn !== 'function') return;

    if (_isBatching) {
        fn();
        return;
    }

    _isBatching = true;
    try {
        fn();
    } finally {
        _isBatching = false;
        flushBatch();
    }
}

/**
 * Flush all currently pending batched effects.
 */
export function flushBatch() {
    const toFlush = Array.from(_pendingEffects);
    _pendingEffects.clear();
    toFlush.forEach(effect => {
        try {
            effect();
        } catch (e) {
            console.error('[Cairn Batch Flush Error]:', e);
        }
    });
}

/**
 * Enable or disable automatic microtask batching across state writes.
 * @param {boolean} enable
 */
export function setAutoBatch(enable = true) {
    _autoBatching = enable;
}

/**
 * Internal: called by state signals to queue an effect for batch flushing.
 * @param {Function} effectFn
 */
export function _queueEffect(effectFn) {
    if (_isBatching) {
        _pendingEffects.add(effectFn);
        return true;
    }

    if (_autoBatching) {
        _pendingEffects.add(effectFn);
        if (!_microtaskQueued) {
            _microtaskQueued = true;
            const schedule = typeof queueMicrotask === 'function'
                ? queueMicrotask
                : (cb) => Promise.resolve().then(cb);
            
            schedule(() => {
                _microtaskQueued = false;
                flushBatch();
            });
        }
        return true;
    }

    return false;
}

/**
 * Returns whether a batch is currently active.
 * @returns {boolean}
 */
export function isBatching() {
    return _isBatching;
}

export default { batch, flushBatch, setAutoBatch, isBatching, _queueEffect };
