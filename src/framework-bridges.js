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

export default {
    useCairn,
    cairnToReact,
    cairnToVue,
    cairnToAngular,
    cairnToSvelte,
    cairnToCustomElement,
    defineCustomElement
};
