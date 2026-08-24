/**
 * @eldrex/cairnjs - Component Factory Engine
 * Advanced component declaration utility supporting function setup, full lifecycle,
 * state/computed/methods declaration, compound component attachments, and HOCs.
 */

import { state as createState, computed as createComputed } from './state.js';
import { onMount as addOnMount, onUnmount as addOnUnmount, onUpdate as addOnUpdate } from './lifecycle.js';

/**
 * Creates a component factory function.
 * Supports:
 * - Function setup: `component((props) => ...)`
 * - Full object config: `component({ name, props, state, computed, methods, lifecycle, render, setup })`
 * 
 * @param {Function|object} config Component render function or declaration object
 * @returns {Function} Component factory accepting props
 */
export function component(config) {
    if (typeof config === 'function') {
        const ComponentFactory = (props = {}, ...children) => {
            try {
                const node = config(props, ...children);
                if (node && typeof node === 'object') {
                    node._cairnComponent = true;
                }
                return node;
            } catch (err) {
                console.error('[Cairn Component Render Error]:', err);
                throw err;
            }
        };
        ComponentFactory._isCairnComponent = true;
        ComponentFactory.attach = (subComponents) => {
            Object.assign(ComponentFactory, subComponents);
            return ComponentFactory;
        };
        return ComponentFactory;
    }

    if (typeof config === 'object' && config !== null) {
        const {
            name = 'AnonymousComponent',
            props: declaredProps = {},
            state: declaredState = {},
            computed: declaredComputed = {},
            methods: declaredMethods = {},
            lifecycle = {},
            render,
            setup,
            studio
        } = config;

        const ComponentFactory = (passedProps = {}, ...children) => {
            const propsObj = {};

            // Normalize passed props vs declared props
            if (Array.isArray(declaredProps)) {
                declaredProps.forEach(pKey => {
                    propsObj[pKey] = passedProps[pKey];
                });
            } else {
                Object.entries(declaredProps).forEach(([pKey, pDef]) => {
                    const rawVal = passedProps[pKey] !== undefined
                        ? passedProps[pKey]
                        : (pDef && typeof pDef === 'object' && pDef.default !== undefined ? pDef.default : undefined);
                    propsObj[pKey] = rawVal;
                });
            }

            // Include any additional passed props
            Object.entries(passedProps).forEach(([pKey, pVal]) => {
                if (propsObj[pKey] === undefined) {
                    propsObj[pKey] = pVal;
                }
            });

            // Initialize component local reactive state
            const localState = {};
            if (typeof declaredState === 'function') {
                Object.assign(localState, declaredState(propsObj));
            } else if (typeof declaredState === 'object' && declaredState !== null) {
                Object.entries(declaredState).forEach(([sKey, sVal]) => {
                    localState[sKey] = sVal;
                });
            }
            const reactiveState = createState(localState);

            // Initialize computed properties
            const computedObj = {};
            Object.entries(declaredComputed).forEach(([cKey, cFn]) => {
                if (typeof cFn === 'function') {
                    computedObj[cKey] = createComputed(() => cFn(reactiveState, propsObj, computedObj)).value;
                }
            });

            // Create context for methods
            const ctx = {
                props: propsObj,
                state: reactiveState,
                computed: computedObj,
                methods: {}
            };

            Object.entries(declaredMethods).forEach(([mKey, mFn]) => {
                if (typeof mFn === 'function') {
                    ctx.methods[mKey] = (...args) => mFn.apply(ctx, args);
                }
            });

            // Handle legacy setup if provided
            if (typeof setup === 'function') {
                const emits = {};
                const emit = (eventName, data) => {
                    const handlerKey = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
                    if (typeof passedProps[handlerKey] === 'function') {
                        passedProps[handlerKey](data);
                    }
                };

                const slots = {
                    default: () => children
                };
                if (passedProps.slots) {
                    Object.assign(slots, passedProps.slots);
                }

                const res = setup({ ...propsObj, emit, slots, state: reactiveState, computed: computedObj, methods: ctx.methods });
                const node = res && res.el ? res.el : res;
                if (node && typeof node === 'object') node._cairnComponent = true;
                return node;
            }

            // Execute component render
            if (typeof render === 'function') {
                try {
                    const renderedNode = render.call(ctx, {
                        props: propsObj,
                        state: reactiveState,
                        computed: computedObj,
                        methods: ctx.methods,
                        children
                    });

                    // Wire lifecycle hooks if present
                    if (renderedNode && typeof renderedNode === 'object') {
                        renderedNode._cairnComponent = true;
                        if (typeof lifecycle.onMount === 'function') {
                            addOnMount(renderedNode, () => lifecycle.onMount.call(ctx));
                        }
                        if (typeof lifecycle.onUpdate === 'function') {
                            addOnUpdate(renderedNode, (prev) => lifecycle.onUpdate.call(ctx, prev));
                        }
                        if (typeof lifecycle.onUnmount === 'function') {
                            addOnUnmount(renderedNode, () => lifecycle.onUnmount.call(ctx));
                        }
                    }

                    return renderedNode;
                } catch (err) {
                    if (typeof lifecycle.onError === 'function') {
                        return lifecycle.onError.call(ctx, err);
                    }
                    throw err;
                }
            }

            throw new Error(`[Cairn Component]: Component '${name}' must define a render or setup method.`);
        };

        ComponentFactory._isCairnComponent = true;
        ComponentFactory._componentName = name;
        ComponentFactory._studioConfig = studio;
        ComponentFactory.attach = (subComponents) => {
            Object.assign(ComponentFactory, subComponents);
            return ComponentFactory;
        };

        return ComponentFactory;
    }

    throw new TypeError('[Cairn Component Error]: Invalid component configuration.');
}

/**
 * Higher-Order Component: withAuth
 * Conditionally renders component based on auth state or redirects/shows fallback.
 */
export function withAuth(ComponentToWrap, options = {}) {
    const { fallback = null, isAuth = () => true } = typeof options === 'function' ? { isAuth: options } : options;

    return component((props = {}, ...children) => {
        const authorized = typeof isAuth === 'function' ? isAuth(props) : Boolean(isAuth);
        if (!authorized) {
            return typeof fallback === 'function' ? fallback(props) : fallback;
        }
        return ComponentToWrap(props, ...children);
    });
}

/**
 * Higher-Order Component: withLoading
 * Displays loading spinner or fallback when props.loading or condition is true.
 */
export function withLoading(ComponentToWrap, fallbackView = null) {
    return component((props = {}, ...children) => {
        if (props.loading) {
            if (typeof fallbackView === 'function') return fallbackView(props);
            if (fallbackView) return fallbackView;
            if (typeof document !== 'undefined') {
                const spinner = document.createElement('div');
                spinner.className = 'cairn-spinner';
                spinner.style.cssText = 'display: inline-block; width: 20px; height: 20px; border: 2px solid rgba(0,0,0,0.1); border-top-color: #6366f1; border-radius: 50%; animation: cairn-spin 0.8s linear infinite;';
                return spinner;
            }
        }
        return ComponentToWrap(props, ...children);
    });
}

export default component;
