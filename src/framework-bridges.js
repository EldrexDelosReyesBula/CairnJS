/**
 * @eldrex/cairn/framework-bridges - Universal Framework Integration Adapters
 * Converts Cairn components seamlessly into React, Vue, Angular, or Svelte component definitions.
 */

import { mount } from './mount.js';

/**
 * Converts a Cairn component into a React component function.
 * @param {Function|HTMLElement} CairnComponent Cairn component factory or element
 * @returns {Function} React component function
 */
export function cairnToReact(CairnComponent) {
    return function ReactCairnWrapper(props) {
        const containerRef = { current: null };

        const mountRef = (element) => {
            if (element) {
                containerRef.current = element;
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
            const node = typeof CairnComponent === 'function' ? CairnComponent(this.props || {}) : CairnComponent;
            this._unmount = mount(this.$el, node);
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
    cairnToReact,
    cairnToVue,
    cairnToAngular,
    cairnToSvelte
};
