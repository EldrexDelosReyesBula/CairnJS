/**
 * @eldrex/cairn - Developer Experience & Debugging System
 * Auto-logging, state mutation tracking, DOM timing, and helpful CSS warnings.
 */

export let isDebugEnabled = false;

/**
 * Enables or disables developer debug mode.
 * @param {boolean} enabled 
 */
export function debug(enabled = true) {
    isDebugEnabled = !!enabled;
    if (typeof console !== 'undefined') {
        console.log(`[Cairn Debug Mode]: ${isDebugEnabled ? 'ENABLED 🟢' : 'DISABLED 🔴'}`);
    }
}

export function logStateChange(name, oldVal, newVal, source = 'mutation') {
    if (isDebugEnabled && typeof console !== 'undefined') {
        console.log(
            `%c[State] ${name || 'Signal'}: ${JSON.stringify(oldVal)} → ${JSON.stringify(newVal)} (triggered by: ${source})`,
            'color: #3b82f6; font-weight: bold;'
        );
    }
}

export function logDomUpdate(target, duration = 0.3) {
    if (isDebugEnabled && typeof console !== 'undefined') {
        console.log(`%c[DOM] Updated ${target} in ${duration.toFixed(2)}ms`, 'color: #10b981;');
    }
}

export function warnInvalidCss(prop) {
    if ((isDebugEnabled || typeof process !== 'undefined') && typeof console !== 'undefined') {
        console.warn(`[Cairn Warning]: "${prop}" is not a recognized CSS property.`);
    }
}
