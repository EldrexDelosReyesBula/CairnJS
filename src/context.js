/**
 * @eldrex/cairnjs - Reactive Context / Dependency Injection
 * React Context-style provide/inject with scoped subtree providers for sharing values across component trees.
 * Zero external dependencies.
 */

import { state } from './state.js';
import { div } from './dom.js';

const _contextMap = new Map();
let _contextIdCounter = 0;

/**
 * Creates a named context with an optional default value and helper methods.
 *
 * @param {string|*} name Unique context identifier (or defaultValue if omitted)
 * @param {*} [defaultValue=null] Default value if no provider found
 * @returns {object} Context object with .name, .defaultValue, .Provider, .use(), .provide()
 *
 * @example
 * const ThemeContext = createContext('theme', 'dark');
 * ThemeContext.provide('light');
 * const theme = ThemeContext.use();
 */
export function createContext(name, defaultValue = null) {
    let ctxName = name;
    let defVal = defaultValue;

    if (typeof name !== 'string') {
        defVal = name;
        ctxName = `cairn_ctx_${++_contextIdCounter}`;
    }

    const context = {
        name: ctxName,
        defaultValue: defVal,
        _isCairnContext: true,

        /**
         * Shorthand to retrieve the reactive context value.
         * @returns {object} State signal
         */
        use() {
            return useContext(context);
        },

        /**
         * Shorthand to provide a value globally or for the current branch.
         * @param {*} value
         */
        provide(value) {
            provideContext(context, value);
            return context;
        },

        /**
         * Creates a scoped DOM provider subtree that overrides this context value for its child elements.
         * @param {*} value Value or signal to provide
         * @param {...*} children Child elements
         * @returns {HTMLElement} Scoped container element
         */
        Provider(value, ...children) {
            const previous = _contextMap.get(context.name);
            provideContext(context, value);
            const container = div({ class: `cairn-provider-${context.name}`, 'data-cairn-context': context.name }, ...children);
            if (previous !== undefined) {
                _contextMap.set(context.name, previous);
            }
            return container;
        }
    };

    return context;
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
 * Checks if a context is currently provided in the active map.
 * @param {object} context Context object
 * @returns {boolean} True if context is active
 */
export function hasContext(context) {
    return !!(context && context._isCairnContext && _contextMap.has(context.name));
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

/**
 * Resets all active context providers (useful for test isolation and page resets).
 */
export function resetContexts() {
    _contextMap.clear();
}

export default { createContext, provideContext, useContext, hasContext, removeContext, resetContexts };
