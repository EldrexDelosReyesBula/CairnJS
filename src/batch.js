/**
 * @eldrex/cairn - Batched Updates
 * Collects multiple reactive state writes and flushes them in a single
 * synchronous pass, preventing intermediate re-renders.
 */

let _isBatching = false;
const _pendingEffects = new Set();

/**
 * Batches multiple reactive state mutations, flushing all queued
 * effects in a single pass after the callback completes.
 *
 * Without batch(), each `.value =` write triggers a separate update cycle.
 * With batch(), all writes flush together — one render pass, zero intermediate states.
 *
 * @param {Function} fn Synchronous function containing state mutations
 *
 * @example
 * batch(() => {
 *   user.name.value = 'Eldrex';
 *   user.role.value = 'admin';
 *   user.active.value = true;
 * });
 * // Components update exactly once, not three times.
 */
export function batch(fn) {
    if (_isBatching) {
        // Already inside a batch — just run
        fn();
        return;
    }

    _isBatching = true;
    try {
        fn();
    } finally {
        _isBatching = false;
        // Flush all queued effects
        const toFlush = Array.from(_pendingEffects);
        _pendingEffects.clear();
        toFlush.forEach(effect => {
            try { effect(); } catch (e) { console.error('[Cairn Batch Flush Error]:', e); }
        });
    }
}

/**
 * Internal: called by state signals to queue an effect for batch flushing.
 * @param {Function} effectFn
 */
export function _queueEffect(effectFn) {
    if (_isBatching) {
        _pendingEffects.add(effectFn);
        return true; // Signal is being batched
    }
    return false; // Run immediately
}

/**
 * Returns whether a batch is currently active.
 * @returns {boolean}
 */
export function isBatching() {
    return _isBatching;
}

export default { batch, isBatching };
