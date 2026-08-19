/**
 * @eldrex/cairn/framework-bridges - Universal Framework Integration Adapters
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
 * @param {Function|HTMLElement} CairnComponent Cairn component factory
 * @param {Array<string>} observedAttributes List of attribute names to observe
 * @returns {typeof HTMLElement} Custom Element Class
 */
export function cairnToCustomElement(CairnComponent, observedAttributes = []) {
    if (typeof HTMLElement === 'undefined') {
        return class MockCustomElement {};
    }

    return class CairnCustomElement extends HTMLElement {
        static get observedAttributes() {
            return observedAttributes;
        }

        connectedCallback() {
            this._renderComponent();
        }

        disconnectedCallback() {
            if (this._unmount) this._unmount();
        }

        attributeChangedCallback(name, oldVal, newVal) {
            if (this._unmount && oldVal !== newVal) {
                this._renderComponent();
            }
        }

        getProps() {
            const props = {};
            if (this.attributes) {
                for (let i = 0; i < this.attributes.length; i++) {
                    const attr = this.attributes[i];
                    props[attr.name] = attr.value;
                }
            }
            return props;
        }

        _renderComponent() {
            if (this._unmount) this._unmount();
            this.innerHTML = '';
            const node = typeof CairnComponent === 'function' ? CairnComponent(this.getProps()) : CairnComponent;
            this._unmount = mount(this, node);
        }
    };
}

/**
 * Registers a Cairn component as a standard Web Component (Custom Element).
 * @param {string} tagName Custom element tag name (e.g. 'cairn-counter')
 * @param {Function|HTMLElement} CairnComponent Cairn component factory
 * @param {Array<string>} observedAttributes List of attribute names to watch
 */
export function defineCustomElement(tagName, CairnComponent, observedAttributes = []) {
    if (typeof customElements !== 'undefined' && !customElements.get(tagName)) {
        customElements.define(tagName, cairnToCustomElement(CairnComponent, observedAttributes));
    }
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
