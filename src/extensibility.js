/**
 * @eldrex/cairnjs - Extensibility & Middleware Architecture
 * Plugin System, Middleware Engine, Hook Lifecycles, Deep Configuration, and Engine Overrides.
 */

class ComponentRegistry {
    constructor() {
        this._components = new Map();
    }

    register(nameOrObj, componentFn, metadata = {}) {
        if (typeof nameOrObj === 'object' && nameOrObj !== null) {
            Object.entries(nameOrObj).forEach(([name, fn]) => {
                this.register(name, fn);
            });
            return;
        }

        if (typeof nameOrObj === 'string' && componentFn) {
            this._components.set(nameOrObj, {
                name: nameOrObj,
                fn: componentFn,
                metadata: {
                    description: metadata.description || '',
                    props: metadata.props || {},
                    events: metadata.events || [],
                    examples: metadata.examples || [],
                    ai: metadata.ai || {},
                    accessibility: metadata.accessibility || {}
                }
            });
        }
    }

    get(name) {
        const entry = this._components.get(name);
        return entry ? entry : null;
    }

    list() {
        const result = {};
        for (const [name, entry] of this._components.entries()) {
            result[name] = entry;
        }
        return result;
    }
}

class UtilsRegistry {
    constructor() {
        this._utils = new Map();
    }

    register(name, fn) {
        if (typeof name === 'string' && typeof fn === 'function') {
            this._utils.set(name, fn);
            this[name] = fn;
        }
    }

    get(name) {
        return this._utils.get(name);
    }
}

class AnimationRegistry {
    constructor() {
        this._animations = new Map();
    }

    register(name, animationDef) {
        if (typeof name === 'string' && animationDef) {
            this._animations.set(name, animationDef);
            this[name] = animationDef;
        }
    }

    get(name) {
        return this._animations.get(name);
    }
}

class HookBus {
    constructor() {
        this._mountHooks = [];
        this._unmountHooks = [];
        this._updateHooks = [];
    }

    mount(fn) {
        if (typeof fn === 'function') this._mountHooks.push(fn);
    }

    unmount(fn) {
        if (typeof fn === 'function') this._unmountHooks.push(fn);
    }

    update(fn) {
        if (typeof fn === 'function') this._updateHooks.push(fn);
    }

    triggerMount(el, component) {
        this._mountHooks.forEach((fn) => {
            try {
                fn(el, component);
            } catch (err) {
                console.error('[Cairn Hook Error (mount)]:', err);
            }
        });
    }

    triggerUnmount(el, component) {
        this._unmountHooks.forEach((fn) => {
            try {
                fn(el, component);
            } catch (err) {
                console.error('[Cairn Hook Error (unmount)]:', err);
            }
        });
    }

    triggerUpdate(el, component) {
        this._updateHooks.forEach((fn) => {
            try {
                fn(el, component);
            } catch (err) {
                console.error('[Cairn Hook Error (update)]:', err);
            }
        });
    }
}

class MiddlewareEngine {
    constructor() {
        this._middlewares = [];
    }

    add(middleware) {
        if (typeof middleware === 'object' && middleware !== null) {
            this._middlewares.push(middleware);
        }
    }

    beforeCreate(element, props) {
        let currentProps = { ...props };
        for (const mw of this._middlewares) {
            if (typeof mw.beforeCreate === 'function') {
                const res = mw.beforeCreate(element, currentProps);
                if (res && typeof res === 'object') {
                    currentProps = res;
                }
            }
        }
        return currentProps;
    }

    beforeMount(el, target) {
        let currentEl = el;
        for (const mw of this._middlewares) {
            if (typeof mw.beforeMount === 'function') {
                const res = mw.beforeMount(currentEl, target);
                if (res) currentEl = res;
            }
        }
        return currentEl;
    }

    afterStateChange(key, oldValue, newValue) {
        for (const mw of this._middlewares) {
            if (typeof mw.afterStateChange === 'function') {
                try {
                    mw.afterStateChange(key, oldValue, newValue);
                } catch (err) {
                    console.error('[Cairn Middleware Error (afterStateChange)]:', err);
                }
            }
        }
    }

    beforeStyleUpdate(el, newStyles) {
        let currentStyles = { ...newStyles };
        for (const mw of this._middlewares) {
            if (typeof mw.beforeStyleUpdate === 'function') {
                const res = mw.beforeStyleUpdate(el, currentStyles);
                if (res && typeof res === 'object') {
                    currentStyles = res;
                }
            }
        }
        return currentStyles;
    }
}

export const componentsRegistry = new ComponentRegistry();
export const utilsRegistry = new UtilsRegistry();
export const animationRegistry = new AnimationRegistry();
export const hooksBus = new HookBus();
export const middlewareEngine = new MiddlewareEngine();

let globalConfig = {
    rendering: { mode: 'auto', batchUpdates: true, asyncRendering: false, priority: 'auto' },
    state: { mode: 'reactive', deepTracking: true, batchUpdates: true, equalityCheck: 'deep' },
    styling: { engine: 'dom', priority: 'inline', vendorPrefixes: true, minify: false },
    components: { lazyLoading: true, memoization: true, autoCleanup: true, devTools: true },
    events: { delegation: true, passive: true, capture: false, preventDefault: false },
    performance: { fps: 60, budget: 16, memory: 100, optimization: 'auto' }
};

/**
 * Configure global Cairn engine options.
 * @param {object} options Deep configuration options
 * @returns {object} Active global configuration
 */
export function config(options = {}) {
    if (typeof options === 'object' && options !== null) {
        Object.entries(options).forEach(([category, settings]) => {
            if (globalConfig[category] && typeof settings === 'object') {
                Object.assign(globalConfig[category], settings);
            } else {
                globalConfig[category] = settings;
            }
        });
    }
    return globalConfig;
}

/**
 * Engine Replacement Hooks: Allows replacing internal state, renderer, style engine, or component engine.
 */
export const engineOverrides = {
    stateEngine: null,
    rendererEngine: null,
    styleEngine: null,
    componentEngine: null
};

export function use(pluginFn) {
    if (typeof pluginFn !== 'function') {
        throw new TypeError('[Cairn Plugin Error]: Plugin must be a function.');
    }

    const cairnContext = {
        components: componentsRegistry,
        utils: utilsRegistry,
        animations: animationRegistry,
        hooks: hooksBus,
        middleware: middlewareEngine,
        config,
        register: (name, componentFn, metadata) => componentsRegistry.register(name, componentFn, metadata),
        button: (content, props) => import('./dom.js').then(m => m.button(content, props))
    };

    pluginFn(cairnContext);
}

export function registerComponent(nameOrObj, componentFn, metadata) {
    componentsRegistry.register(nameOrObj, componentFn, metadata);
}
