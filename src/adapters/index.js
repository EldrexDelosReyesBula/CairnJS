/**
 * @eldrex/cairn/adapters - Extensible Multi-Styling Adapters Architecture
 * Supports Tailwind CSS, CSS Modules, Styled Components, Emotion, UnoCSS, Bootstrap,
 * Motion, Design Tokens, and custom 3rd-party adapters.
 */

import { tailwind } from './tailwind.js';
import { cssModules } from './css-modules.js';
import { styled } from './styled.js';
import { unocss } from './unocss.js';
import { bootstrap } from './bootstrap.js';
import { motion } from './motion.js';
import { tokens } from './tokens.js';

class AdapterRegistry {
    constructor() {
        this._adapters = new Map();
        // Register built-in adapters by default
        this.register(tokens);
        this.register(tailwind);
        this.register(cssModules);
        this.register(styled);
        this.register(unocss);
        this.register(bootstrap);
        this.register(motion);
    }

    /**
     * Registers a styling or behavioral adapter.
     * @param {string|object} nameOrAdapter Adapter object or name string
     * @param {Function} [transformFn] Transform function if name was passed
     */
    register(nameOrAdapter, transformFn) {
        if (typeof nameOrAdapter === 'object' && nameOrAdapter !== null) {
            const name = nameOrAdapter.name || `adapter-${Math.random().toString(36).slice(2)}`;
            const transform = typeof nameOrAdapter.transform === 'function' ? nameOrAdapter.transform : (typeof nameOrAdapter === 'function' ? nameOrAdapter : (p) => p);
            this._adapters.set(name, { name, transform, enabled: true });
            return;
        }

        if (typeof nameOrAdapter === 'string' && typeof transformFn === 'function') {
            this._adapters.set(nameOrAdapter, { name: nameOrAdapter, transform: transformFn, enabled: true });
        }
    }

    /**
     * Factory function allowing 3rd-party developers to author custom adapters.
     * @param {string} name Unique adapter identifier
     * @param {Function} transformFn (props, tag) => modifiedProps
     * @returns {object} Adapter object
     *
     * @example
     * const bulmaAdapter = createAdapter('bulma', (props) => {
     *   if (props.bulma) {
     *     props.class = `${props.class || ''} is-${props.bulma}`;
     *     delete props.bulma;
     *   }
     *   return props;
     * });
     * registerAdapter(bulmaAdapter);
     */
    create(name, transformFn) {
        if (typeof transformFn !== 'function') {
            throw new TypeError(`[Cairn Adapter Error]: createAdapter transformFn must be a function.`);
        }
        return {
            name: name || `custom-adapter-${Date.now()}`,
            transform: transformFn,
            enabled: true
        };
    }

    get(name) {
        return this._adapters.get(name) || null;
    }

    remove(name) {
        return this._adapters.delete(name);
    }

    list() {
        const result = {};
        for (const [k, v] of this._adapters.entries()) {
            result[k] = { name: v.name, enabled: v.enabled };
        }
        return result;
    }

    /**
     * Resolves all registered adapters sequentially on the element props.
     * @param {object} props Incoming component properties
     * @param {string} tag HTML tag name
     * @returns {object} Transformed properties
     */
    resolve(props = {}, tag = 'div') {
        let currentProps = { ...props };
        for (const adapter of this._adapters.values()) {
            if (adapter.enabled && typeof adapter.transform === 'function') {
                try {
                    const res = adapter.transform(currentProps, tag);
                    if (res && typeof res === 'object') {
                        currentProps = res;
                    }
                } catch (err) {
                    console.error(`[Cairn Adapter Error (${adapter.name})]:`, err);
                }
            }
        }
        return currentProps;
    }
}

export const adapterRegistry = new AdapterRegistry();

export const registerAdapter = (name, fn) => adapterRegistry.register(name, fn);
export const createAdapter = (name, fn) => adapterRegistry.create(name, fn);
export const useAdapter = (adapter) => adapterRegistry.register(adapter);
export const listAdapters = () => adapterRegistry.list();
export const getAdapter = (name) => adapterRegistry.get(name);
export const removeAdapter = (name) => adapterRegistry.remove(name);

/**
 * Universal adapter resolver used by Cairn DOM engine.
 */
export function resolveAdapters(props = {}, tag = 'div') {
    return adapterRegistry.resolve(props, tag);
}

export {
    tailwind,
    cssModules,
    styled,
    unocss,
    bootstrap,
    motion,
    tokens
};

export const adapters = {
    registry: adapterRegistry,
    register: registerAdapter,
    create: createAdapter,
    use: useAdapter,
    list: listAdapters,
    get: getAdapter,
    remove: removeAdapter,
    resolve: resolveAdapters,
    // Built-in adapters
    tailwind,
    cssModules,
    styled,
    unocss,
    bootstrap,
    motion,
    tokens
};

export default adapters;
