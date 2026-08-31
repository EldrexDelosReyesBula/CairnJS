/**
 * @eldrex/cairnjs/framework-bridges - Universal Framework Integration Adapters
 * Converts Cairn components seamlessly into React, Vue, Angular, Svelte, or Web Component definitions.
 */

import { mount } from './mount.js';

/**
 * React Hook: Mounts a Cairn component factory into a React ref container.
 * @param {Function} factory Factory function returning a Cairn component or DOM element
 * @param {Array} deps Dependency array for re-mounting when props change
 * @returns {object} React ref object { current: HTMLElement }
 */
export function useCairn(factory, deps = []) {
    const containerRef = { current: null };

    if (typeof window !== 'undefined' && window.React && typeof window.React.useEffect === 'function') {
        window.React.useEffect(() => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                const node = typeof factory === 'function' ? factory() : factory;
                const unmount = mount(containerRef.current, node);
                return unmount;
            }
        }, deps);
    }

    return containerRef;
}

/**
 * Converts a Cairn component into a React component function.
 * @param {Function|HTMLElement} CairnComponent Cairn component factory or element
 * @returns {Function} React component function
 */
export function cairnToReact(CairnComponent) {
    return function ReactCairnWrapper(props = {}) {
        const mountRef = (element) => {
            if (element) {
                element.innerHTML = '';
                const node = typeof CairnComponent === 'function' ? CairnComponent(props) : CairnComponent;
                mount(element, node);
            }
        };

        return {
            $$typeof: Symbol.for('react.element'),
            type: 'div',
            key: null,
            ref: mountRef,
            props: { style: { display: 'contents' } }
        };
    };
}

/**
 * Converts a Cairn component into a Vue component object.
 * @param {Function|HTMLElement} CairnComponent Cairn component factory or element
 * @returns {object} Vue component object configuration
 */
export function cairnToVue(CairnComponent) {
    return {
        name: 'VueCairnWrapper',
        props: {
            props: { type: Object, default: () => ({}) }
        },
        mounted() {
            this._renderCairn();
        },
        watch: {
            props: {
                deep: true,
                handler() {
                    this._renderCairn();
                }
            }
        },
        methods: {
            _renderCairn() {
                if (this._unmount) this._unmount();
                this.$el.innerHTML = '';
                const node = typeof CairnComponent === 'function' ? CairnComponent(this.props || {}) : CairnComponent;
                this._unmount = mount(this.$el, node);
            }
        },
        beforeUnmount() {
            if (this._unmount) this._unmount();
        },
        render() {
            return {
                tag: 'div',
                data: { style: { display: 'contents' } },
                children: []
            };
        }
    };
}

/**
 * Converts a Cairn component into a standard native Web Component (Custom Element).
 * Supports Shadow DOM, reactive prop updates, property reflection, and custom events.
 *
 * @param {Function|HTMLElement} CairnComponent Cairn component factory
 * @param {Array<string>|object} [options] List of observed attributes or options object
 * @param {Array<string>} [options.observedAttributes] Attributes to watch for reactive updates
 * @param {boolean|string} [options.shadow] Enable Shadow DOM ('open', 'closed', or true)
 * @param {string} [options.styles] Inline CSS styles for Shadow DOM root
 * @returns {typeof HTMLElement} Custom Element Class
 */
export function cairnToCustomElement(CairnComponent, options = {}) {
    const config = Array.isArray(options)
        ? { observedAttributes: options, shadow: false }
        : { observedAttributes: [], shadow: false, styles: '', ...options };

    const observedAttrs = config.observedAttributes || [];
    const shadowMode = config.shadow === true ? 'open' : (typeof config.shadow === 'string' ? config.shadow : false);

    if (typeof HTMLElement === 'undefined') {
        return class MockCustomElement {
            static get observedAttributes() {
                return observedAttrs;
            }
        };
    }

    return class CairnCustomElement extends HTMLElement {
        static get observedAttributes() {
            return observedAttrs;
        }

        constructor() {
            super();
            this._unmount = null;
            this._props = {};

            if (shadowMode) {
                this.attachShadow({ mode: shadowMode });
            }

            // Define property getters/setters for observed attributes
            observedAttrs.forEach(attrName => {
                const camelName = attrName.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
                if (!(camelName in this)) {
                    Object.defineProperty(this, camelName, {
                        get: () => this.getProps()[camelName],
                        set: (val) => {
                            if (typeof val === 'object') {
                                this.setAttribute(attrName, JSON.stringify(val));
                            } else if (typeof val === 'boolean') {
                                if (val) this.setAttribute(attrName, '');
                                else this.removeAttribute(attrName);
                            } else {
                                this.setAttribute(attrName, String(val));
                            }
                        }
                    });
                }
            });
        }

        connectedCallback() {
            this._renderComponent();
        }

        disconnectedCallback() {
            if (this._unmount) {
                this._unmount();
                this._unmount = null;
            }
        }

        attributeChangedCallback(name, oldVal, newVal) {
            if (oldVal !== newVal) {
                this._renderComponent();
            }
        }

        emit(eventName, detail = {}, options = {}) {
            const event = new CustomEvent(eventName, {
                bubbles: true,
                composed: true,
                detail,
                ...options
            });
            this.dispatchEvent(event);
            return event;
        }

        getProps() {
            const props = { ...this._props };
            if (this.attributes) {
                for (let i = 0; i < this.attributes.length; i++) {
                    const attr = this.attributes[i];
                    const camelName = attr.name.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
                    let val = attr.value;
                    if (val === '' && this.hasAttribute(attr.name)) {
                        val = true;
                    } else if (val === 'true') val = true;
                    else if (val === 'false') val = false;
                    else if (!isNaN(Number(val)) && val.trim() !== '') val = Number(val);
                    else if ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']'))) {
                        try { val = JSON.parse(val); } catch {}
                    }
                    props[camelName] = val;
                    props[attr.name] = val;
                }
            }
            props.$emit = (eventName, detail, opts) => this.emit(eventName, detail, opts);
            props.$host = this;
            return props;
        }

        _renderComponent() {
            if (this._unmount) {
                this._unmount();
                this._unmount = null;
            }

            const targetRoot = this.shadowRoot || this;
            targetRoot.innerHTML = '';

            if (this.shadowRoot && config.styles) {
                const styleEl = document.createElement('style');
                styleEl.textContent = config.styles;
                targetRoot.appendChild(styleEl);
            }

            const props = this.getProps();
            const node = typeof CairnComponent === 'function' ? CairnComponent(props) : CairnComponent;
            if (node) {
                this._unmount = mount(targetRoot, node);
            }
        }
    };
}

/**
 * Registers a Cairn component as a standard Web Component (Custom Element).
 *
 * @param {string} tagName Custom element tag name (must contain a hyphen, e.g. 'cairn-card')
 * @param {Function|HTMLElement} CairnComponent Cairn component factory
 * @param {Array<string>|object} [options] List of observed attributes or options object
 * @returns {typeof HTMLElement} Registered custom element constructor
 */
export function defineCustomElement(tagName, CairnComponent, options = {}) {
    if (typeof customElements !== 'undefined') {
        const existing = customElements.get(tagName);
        if (existing) return existing;
        const CustomEl = cairnToCustomElement(CairnComponent, options);
        customElements.define(tagName, CustomEl);
        return CustomEl;
    }
    return cairnToCustomElement(CairnComponent, options);
}

/**
 * Converts a Cairn component into an Angular Directive wrapper.
 * @param {Function|HTMLElement} CairnComponent Cairn component factory or element
 * @returns {Function} Angular Directive factory
 */
export function cairnToAngular(CairnComponent) {
    return function AngularCairnDirective(elementRef) {
        this.ngOnInit = function () {
            if (elementRef && elementRef.nativeElement) {
                const node = typeof CairnComponent === 'function' ? CairnComponent({}) : CairnComponent;
                this._unmount = mount(elementRef.nativeElement, node);
            }
        };
        this.ngOnDestroy = function () {
            if (this._unmount) this._unmount();
        };
    };
}

/**
 * Converts a Cairn component into a Svelte action handler.
 * @param {Function|HTMLElement} CairnComponent Cairn component factory or element
 * @returns {Function} Svelte action function (node, parameters) => { update, destroy }
 */
export function cairnToSvelte(CairnComponent) {
    return function svelteCairnAction(node, props = {}) {
        let unmountFn = mount(node, typeof CairnComponent === 'function' ? CairnComponent(props) : CairnComponent);

        return {
            update(newProps) {
                if (unmountFn) unmountFn();
                node.innerHTML = '';
                unmountFn = mount(node, typeof CairnComponent === 'function' ? CairnComponent(newProps) : CairnComponent);
            },
            destroy() {
                if (unmountFn) unmountFn();
            }
        };
    };
}

// Backend Bridge Adapters

/**
 * REST API Client Bridge
 */
export const rest = {
    /**
     * Fetch JSON helper
     */
    fetch(url, options = {}) {
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        return globalThis.fetch(url, { ...options, headers }).then(res => {
            if (!res.ok) throw new Error(`[Cairn REST Bridge] HTTP ${res.status}: ${res.statusText}`);
            return res.json();
        });
    },
    get(url, options = {}) {
        return this.fetch(url, { method: 'GET', ...options });
    },
    post(url, data, options = {}) {
        return this.fetch(url, { method: 'POST', body: JSON.stringify(data), ...options });
    },
    put(url, data, options = {}) {
        return this.fetch(url, { method: 'PUT', body: JSON.stringify(data), ...options });
    },
    delete(url, options = {}) {
        return this.fetch(url, { method: 'DELETE', ...options });
    },
    sync(targetState, url, options = {}) {
        return this.get(url, options).then(data => {
            if (targetState && 'value' in targetState) {
                targetState.value = data;
            }
            return data;
        });
    }
};

/**
 * GraphQL API Client Bridge
 */
export const graphql = {
    query(queryStr, variables = {}, endpoint = '/graphql') {
        return globalThis.fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: queryStr, variables })
        }).then(res => res.json()).then(result => {
            if (result.errors && result.errors.length) {
                throw new Error(`[Cairn GraphQL Bridge] ${result.errors[0].message}`);
            }
            return result.data;
        });
    },
    mutation(mutationStr, variables = {}, endpoint = '/graphql') {
        return this.query(mutationStr, variables, endpoint);
    },
    subscription(subscriptionStr, onData, endpoint = 'wss://localhost/graphql') {
        if (typeof WebSocket === 'undefined') return null;
        const ws = new WebSocket(endpoint, 'graphql-ws');
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (typeof onData === 'function') onData(data);
            } catch (_) {}
        };
        return ws;
    }
};

/**
 * WebSocket Real-Time Client Bridge
 */
export const websocket = {
    connect(url, protocols) {
        if (typeof WebSocket === 'undefined') {
            return {
                send: () => {},
                close: () => {},
                onmessage: null,
                onerror: null,
                onclose: null
            };
        }
        return new WebSocket(url, protocols);
    },
    onMessage(ws, handler) {
        if (!ws) return;
        ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data);
                handler(data, e);
            } catch (_) {
                handler(e.data, e);
            }
        };
    },
    send(ws, data) {
        if (!ws || ws.readyState !== 1) return false;
        const payload = typeof data === 'object' ? JSON.stringify(data) : String(data);
        ws.send(payload);
        return true;
    }
};

/**
 * Server-Sent Events (SSE) Bridge
 */
export const sse = {
    connect(url, options = {}) {
        if (typeof EventSource === 'undefined') {
            return {
                addEventListener: () => {},
                close: () => {}
            };
        }
        return new EventSource(url, options);
    },
    onEvent(source, eventName, handler) {
        if (!source) return;
        source.addEventListener(eventName, (e) => {
            try {
                const data = JSON.parse(e.data);
                handler(data, e);
            } catch (_) {
                handler(e.data, e);
            }
        });
    }
};

/**
 * Universal Environment Bridge
 * Automatically detects whether running inside React, Vue, Svelte, Angular, or Vanilla DOM.
 */
export const universal = {
    detect() {
        const isClient = typeof window !== 'undefined';
        return {
            react: isClient && !!(window.React || window.__REACT_DEVTOOLS_GLOBAL_HOOK__),
            vue: isClient && !!(window.Vue || window.__VUE__),
            svelte: isClient && !!window.__svelte,
            angular: isClient && !!(window.ng || window.getAllAngularRootElements),
            vanilla: true
        };
    },
    mount(target, componentFactory, props = {}) {
        if (!target) return null;
        const el = typeof target === 'string' && typeof document !== 'undefined' ? document.querySelector(target) : target;
        if (!el) return null;
        el.innerHTML = '';
        const node = typeof componentFactory === 'function' ? componentFactory(props) : componentFactory;
        return mount(el, node);
    }
};

/**
 * Unified Bridge Namespace
 */
const createBridgeFn = (fn, targetObj) => {
    const wrapped = (options = {}) => fn(options);
    return Object.assign(wrapped, targetObj);
};

export const bridge = {
    react: createBridgeFn((options = {}) => ({
        toReact: cairnToReact,
        useCairn,
        features: { stateSync: true, events: true, styling: true, ...(options.features || {}) },
        usage: options.usage || 'cairnToReact(CairnComponent)'
    }), { toReact: cairnToReact, useCairn }),
    vue: createBridgeFn((options = {}) => ({
        toVue: cairnToVue,
        features: { stateSync: true, events: true, styling: true, ...(options.features || {}) },
        usage: options.usage || 'cairnToVue(CairnComponent)'
    }), { toVue: cairnToVue }),
    svelte: createBridgeFn((options = {}) => ({
        toSvelte: cairnToSvelte,
        features: { stateSync: true, events: true, styling: true, ...(options.features || {}) },
        usage: options.usage || 'cairnToSvelte(CairnComponent)'
    }), { toSvelte: cairnToSvelte }),
    angular: createBridgeFn((options = {}) => ({
        toAngular: cairnToAngular,
        features: { stateSync: true, events: true, styling: true, ...(options.features || {}) },
        usage: options.usage || 'cairnToAngular(CairnComponent)'
    }), { toAngular: cairnToAngular }),
    rest: createBridgeFn((options = {}) => ({
        ...rest,
        features: { autoSync: true, optimistic: true, ...(options.features || {}) }
    }), rest),
    graphql: createBridgeFn((options = {}) => ({
        ...graphql,
        features: { query: true, mutation: true, subscription: true, ...(options.features || {}) }
    }), graphql),
    websocket: createBridgeFn((options = {}) => ({
        ...websocket,
        features: { autoReconnect: true, ...(options.features || {}) }
    }), websocket),
    sse: createBridgeFn((options = {}) => ({
        ...sse,
        features: { autoReconnect: true, ...(options.features || {}) }
    }), sse),
    universal: createBridgeFn((options = {}) => ({
        ...universal,
        autoDetect: universal.detect(),
        ...(options || {})
    }), universal),
    toReact: cairnToReact,
    toVue: cairnToVue,
    toSvelte: cairnToSvelte,
    toAngular: cairnToAngular,
    toCustomElement: cairnToCustomElement,
    defineCustomElement,
    useCairn
};

export default {
    useCairn,
    cairnToReact,
    cairnToVue,
    cairnToAngular,
    cairnToSvelte,
    cairnToCustomElement,
    defineCustomElement,
    rest,
    graphql,
    websocket,
    sse,
    universal,
    bridge
};
