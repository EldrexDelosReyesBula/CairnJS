/**
 * @eldrex/cairn - Component Factory Engine
 * Advanced component declaration utility supporting function setup and object configs.
 */

import { state } from './state.js';

/**
 * Creates a component factory function.
 * Supports both function setup: `component((props) => ...)`
 * and object config: `component({ props, emits, slots, setup })`
 * 
 * @param {Function|object} config Component render function or declaration object
 * @returns {Function} Component factory accepting props
 */
export function component(config) {
    if (typeof config === 'function') {
        const ComponentFactory = (props = {}) => {
            try {
                const node = config(props);
                if (node) {
                    node._cairnComponent = true;
                }
                return node;
            } catch (err) {
                console.error('[Cairn Component Render Error]:', err);
                throw err;
            }
        };
        ComponentFactory._isCairnComponent = true;
        return ComponentFactory;
    }

    if (typeof config === 'object' && config !== null) {
        const { props: declaredProps = {}, setup, studio } = config;

        const ComponentFactory = (passedProps = {}, ...children) => {
            const propsObj = {};

            // Normalize passed props vs declared props
            Object.entries(declaredProps).forEach(([pKey, pDef]) => {
                const rawVal = passedProps[pKey] !== undefined ? passedProps[pKey] : pDef.default;
                propsObj[pKey] = state(rawVal);
            });

            // Extra props
            Object.entries(passedProps).forEach(([pKey, pVal]) => {
                if (!propsObj[pKey]) {
                    propsObj[pKey] = state(pVal);
                }
            });

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

            if (typeof setup === 'function') {
                const res = setup({ ...propsObj, emit, slots });
                const node = res.el || res;
                if (node) node._cairnComponent = true;
                return node;
            }
        };

        ComponentFactory._isCairnComponent = true;
        ComponentFactory._studioConfig = studio;
        return ComponentFactory;
    }

    throw new TypeError('[Cairn Component Error]: Invalid component configuration.');
}

export default component;
