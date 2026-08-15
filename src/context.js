/**
 * @eldrex/cairn - Reactive Context / Dependency Injection
 * React Context-style provide/inject for sharing values across the component tree
 * without prop drilling. Zero dependencies.
 */

import { state } from './state.js';

const _contextMap = new Map();

/**
 * Creates a named context with an optional default value.
 *
 * @param {string} name Unique context identifier
 * @param {*} defaultValue Default value if no provider found
 * @returns {object} Context object { name, defaultValue }
 *
 * @example
 * const ThemeContext = createContext('theme', { color: 'dark' });
 * provideContext(ThemeContext, { color: 'light' });
 * const theme = useContext(ThemeContext);
 */
export function createContext(name, defaultValue = null) {
    return { name, defaultValue, _isCairnContext: true };
}

/**
 * Provides a reactive value for a context, making it available to all
 * descendant components that call useContext() with the same context.
 *
 * @param {object} context Context object created by createContext()
 * @param {*} value Value (or reactive signal) to provide
 */
export function provideContext(context, value) {
    if (!context || !context._isCairnContext) {
        console.warn('[Cairn Context]: provideContext() requires a valid context created by createContext().');
        return;
    }

    const signal = (value && value._isCairnState) ? value : state(value);
    _contextMap.set(context.name, signal);
}

/**
 * Retrieves the nearest provided context value as a reactive signal.
 * Falls back to a signal wrapping the context's defaultValue.
 *
 * @param {object} context Context object
 * @returns {object} Reactive state signal
 */
export function useContext(context) {
    if (!context || !context._isCairnContext) {
        console.warn('[Cairn Context]: useContext() requires a valid context created by createContext().');
        return state(null);
    }

    if (_contextMap.has(context.name)) {
        return _contextMap.get(context.name);
    }

    // No provider found — return default value wrapped in a signal
    return state(context.defaultValue);
}

/**
 * Removes a provided context (useful for cleanup in unmounted trees).
 * @param {object} context Context object
 */
export function removeContext(context) {
    if (context && context._isCairnContext) {
        _contextMap.delete(context.name);
    }
}

export default { createContext, provideContext, useContext, removeContext };
