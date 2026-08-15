/**
 * @eldrex/cairn - DOM Builder Engine
 * Declarative, reactive HTML element builders with zero dependencies, automatic accessibility, and helpful error warnings.
 */

import { effect, state } from './state.js';
import { warnInvalidCss, logDomUpdate } from './debug.js';
import { middlewareEngine } from './extensibility.js';
import { resolveAdapters } from './adapters/index.js';
import { applyAnimateProp, gesture } from './animation.js';

// Global document reference safety check (SSR/Node friendly)
const getDoc = () => {
    if (typeof document !== 'undefined') return document;
    return null;
};

/**
 * Creates a DOM node for a given tag, applying properties, attributes, event listeners, and children.
 * Integrates reactive auto-updating for function values and state primitives.
 * 
 * @param {string} tag HTML tag name
 * @param {...any} args Props object, children nodes, strings, functions, or state signals
 * @returns {HTMLElement} Native HTML Element
 */
export function h(tag, ...args) {
    const doc = getDoc();
    const mockAttrs = {};
    const mockChildren = [];
    const mockStyle = {};
    const el = doc ? doc.createElement(tag) : {
        tagName: tag.toUpperCase(),
        attributes: mockAttrs,
        style: mockStyle,
        childNodes: mockChildren,
        className: '',
        setAttribute(k, v) { mockAttrs[k] = String(v); if (k === 'class' || k === 'className') this.className = String(v); },
        getAttribute(k) { return mockAttrs[k] || (k === 'class' ? this.className : null); },
        hasAttribute(k) { return Boolean(mockAttrs[k]); },
        addEventListener() {},
        appendChild(child) { mockChildren.push(child); }
    };

    let props = {};
    const children = [];

    // Parse flexible arguments
    args.forEach((arg) => {
        if (arg === null || arg === undefined) return;

        if (Array.isArray(arg)) {
            arg.forEach((child) => children.push(child));
        } else if (
            typeof arg === 'object' &&
            !arg._isCairnState &&
            !(typeof Element !== 'undefined' && arg instanceof Element) &&
            !(arg.nodeType)
        ) {
            Object.assign(props, arg);
        } else {
            children.push(arg);
        }
    });

    // Run middleware beforeCreate interceptor & adapter style resolvers
    props = middlewareEngine.beforeCreate(tag, props);
    props = resolveAdapters(props);

    // Automatic ARIA & Accessibility Defaults
    if (tag === 'button' && el.setAttribute) {
        if (!props.role && !el.hasAttribute('role')) el.setAttribute('role', 'button');
        if (props.tabIndex === undefined && !el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        
        // Keyboard Enter / Space trigger execution
        if (el.addEventListener) {
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (props.onclick) props.onclick(e);
                }
            });
        }
    }

    if (tag === 'input' && el.setAttribute) {
        if (props.placeholder && !props['aria-label'] && !el.hasAttribute('aria-label')) {
            el.setAttribute('aria-label', props.placeholder);
        }
        if (props.type === 'email' && !props.autocomplete) {
            el.setAttribute('autocomplete', 'email');
        }
    }

    // Apply props & event listeners
    Object.entries(props).forEach(([key, val]) => {
        if (key.startsWith('on') && typeof val === 'function') {
            const eventName = key.slice(2).toLowerCase();
            if (el.addEventListener) {
                el.addEventListener(eventName, val);
            }
        } else if (key === 'style') {
            if (typeof val === 'function') {
                effect(() => {
                    const startTime = typeof performance !== 'undefined' ? performance.now() : 0;
                    const computedObj = val();
                    if (el.style && typeof computedObj === 'object' && computedObj !== null) {
                        Object.entries(computedObj).forEach(([sKey, sVal]) => {
                            let resolved = sVal;
                            if (typeof sVal === 'function') resolved = sVal();
                            else if (sVal && sVal._isCairnState) resolved = sVal.value;
                            el.style[sKey] = resolved;
                        });
                    }
                    if (startTime) logDomUpdate(tag, performance.now() - startTime);
                });
            } else if (typeof val === 'object' && val !== null) {
                Object.entries(val).forEach(([sKey, sVal]) => {
                    if (typeof sVal === 'function') {
                        effect(() => {
                            const computedVal = sVal();
                            if (el.style) el.style[sKey] = computedVal;
                        });
                    } else if (sVal && sVal._isCairnState) {
                        effect(() => {
                            if (el.style) el.style[sKey] = sVal.value;
                        });
                    } else if (el.style) {
                        el.style[sKey] = sVal;
                    }
                });
            }
        } else if (key === 'className' || key === 'class') {
            if (typeof val === 'function') {
                effect(() => {
                    if (el.className !== undefined) el.className = val();
                });
            } else if (val && val._isCairnState) {
                effect(() => {
                    if (el.className !== undefined) el.className = val.value;
                });
            } else if (el.className !== undefined) {
                el.className = val;
            }
        } else if (key === 'animate') {
            applyAnimateProp(el, val, props.duration, props.delay, props.easing);
        } else if (key === 'gestures' && typeof val === 'object') {
            gesture(el, val);
        } else if (typeof val === 'function') {
            effect(() => {
                const computedVal = val();
                if (el.setAttribute) el.setAttribute(key, computedVal);
            });
        } else if (val && val._isCairnState) {
            effect(() => {
                if (el.setAttribute) el.setAttribute(key, val.value);
            });
        } else if (el.setAttribute) {
            el.setAttribute(key, val);
        }
    });

    // Modern micro-interaction styling defaults for button elements
    if (tag === 'button' && el.style) {
        if (!props.style || !props.style.transform) {
            el.style.transition = 'transform 0.15s cubic-bezier(0.2, 0, 0, 1), opacity 0.15s ease';
            el.style.cursor = 'pointer';
        }
    }

    // Append Children
    const appendChildNode = (childNode) => {
        if (childNode === null || childNode === undefined) return;
        if (Array.isArray(childNode)) {
            childNode.forEach(appendChildNode);
            return;
        }

        if (typeof childNode === 'function') {
            if (doc) {
                const anchor = doc.createTextNode('');
                if (el.appendChild) el.appendChild(anchor);

                let currentNodes = [];

                effect(() => {
                    const startTime = typeof performance !== 'undefined' ? performance.now() : 0;
                    const res = childNode();
                    
                    // Remove old dynamic nodes
                    currentNodes.forEach(n => {
                        if (n && n.parentNode) n.parentNode.removeChild(n);
                    });
                    currentNodes = [];

                    if (res === null || res === undefined) return;

                    if (Array.isArray(res)) {
                        res.forEach(item => {
                            let nodeToInsert = item;
                            if (typeof item === 'string' || typeof item === 'number') {
                                nodeToInsert = doc.createTextNode(String(item));
                            }
                            if (nodeToInsert && anchor.parentNode) {
                                anchor.parentNode.insertBefore(nodeToInsert, anchor);
                                currentNodes.push(nodeToInsert);
                            }
                        });
                    } else if (res instanceof (typeof Element !== 'undefined' ? Element : Object) || res.nodeType) {
                        if (anchor.parentNode) {
                            anchor.parentNode.insertBefore(res, anchor);
                            currentNodes.push(res);
                        }
                    } else {
                        const txt = doc.createTextNode(String(res));
                        if (anchor.parentNode) {
                            anchor.parentNode.insertBefore(txt, anchor);
                            currentNodes.push(txt);
                        }
                    }
                    if (startTime) logDomUpdate(tag, performance.now() - startTime);
                });
            }
        } else if (childNode && childNode._isCairnState) {
            if (doc) {
                const textNode = doc.createTextNode('');
                effect(() => {
                    textNode.textContent = String(childNode.value);
                });
                if (el.appendChild) el.appendChild(textNode);
            }
        } else if (typeof childNode === 'string' || typeof childNode === 'number') {
            if (doc) {
                if (el.appendChild) el.appendChild(doc.createTextNode(String(childNode)));
            }
        } else if (childNode instanceof (typeof Element !== 'undefined' ? Element : Object) || childNode.nodeType) {
            if (el.appendChild) el.appendChild(childNode);
        }
    };

    children.forEach(appendChildNode);

    return el;
}

// Tag-specific builder functions
export const div = (...args) => h('div', ...args);
export const span = (...args) => h('span', ...args);
export const p = (...args) => h('p', ...args);
export const h1 = (...args) => h('h1', ...args);
export const h2 = (...args) => h('h2', ...args);
export const h3 = (...args) => h('h3', ...args);
export const h4 = (...args) => h('h4', ...args);
export const h5 = (...args) => h('h5', ...args);
export const h6 = (...args) => h('h6', ...args);
export const button = (content, props = {}) => {
    if (typeof content === 'number') {
        console.warn(`[Cairn Warning]: Button content should be a string or function. Got number (${content}).`);
    }
    return h('button', props, content);
};
export const input = (props = {}) => h('input', props);
export const img = (src, props = {}) => h('img', { src, ...props });
export const a = (...args) => {
    if (typeof args[0] === 'string' && (args[0].startsWith('http') || args[0].startsWith('/') || args[0].startsWith('#'))) {
        const href = args[0];
        const rest = args.slice(1);
        return h('a', { href }, ...rest);
    }
    return h('a', ...args);
};
export const section = (...args) => h('section', ...args);
export const article = (...args) => h('article', ...args);
export const nav = (...args) => h('nav', ...args);
export const footer = (...args) => h('footer', ...args);
export const header = (...args) => h('header', ...args);
export const main = (...args) => h('main', ...args);
export const aside = (...args) => h('aside', ...args);
export const pre = (...args) => h('pre', ...args);
export const code = (...args) => h('code', ...args);
export const hr = (...args) => h('hr', ...args);
export const br = (...args) => h('br', ...args);
export const strong = (...args) => h('strong', ...args);
export const em = (...args) => h('em', ...args);
export const label = (...args) => h('label', ...args);

// Smart Array Rendering helper for ul and ol
export const ul = (items, renderItem) => {
    if (items && (items._isCairnState || Array.isArray(items))) {
        const renderFn = typeof renderItem === 'function' ? renderItem : (item) => li(typeof item === 'object' && item.text ? item.text : String(item));
        return h('ul', () => {
            const list = items._isCairnState ? items.value : items;
            return (list || []).map((item, idx) => renderFn(item, idx));
        });
    }
    return h('ul', items, renderItem);
};

export const ol = (items, renderItem) => {
    if (items && (items._isCairnState || Array.isArray(items))) {
        const renderFn = typeof renderItem === 'function' ? renderItem : (item) => li(typeof item === 'object' && item.text ? item.text : String(item));
        return h('ol', () => {
            const list = items._isCairnState ? items.value : items;
            return (list || []).map((item, idx) => renderFn(item, idx));
        });
    }
    return h('ol', items, renderItem);
};

export const li = (...args) => h('li', ...args);
export const form = (...args) => h('form', ...args);

/**
 * Auto-generating form helper that handles state, inputs, validation, and submission.
 * @param {object} config Form configuration { fields, submit }
 * @returns {HTMLElement} Form DOM Element
 */
export const createForm = (config = {}) => {
    const { fields = {}, submit = () => {} } = config;
    const fieldStates = {};
    const fieldElements = [];

    Object.entries(fields).forEach(([fName, fDef]) => {
        const fieldSignal = state(fDef.default || '');
        fieldStates[fName] = fieldSignal;

        const inputEl = input({
            type: fDef.type || 'text',
            value: fieldSignal,
            placeholder: fDef.label || fName,
            required: fDef.required,
            oninput: (e) => fieldSignal.value = e.target.value
        });

        fieldElements.push(div({ style: { marginBottom: '0.75rem' } }, inputEl));
    });

    fieldElements.push(button('Submit', { type: 'submit' }));

    return form({
        onsubmit: (e) => {
            e.preventDefault();
            const values = {};
            Object.entries(fieldStates).forEach(([k, s]) => values[k] = s.value);
            submit(values);
        }
    }, ...fieldElements);
};

export const textarea = (...args) => h('textarea', ...args);
export const select = (...args) => h('select', ...args);
export const option = (...args) => h('option', ...args);

export const text = (val) => {
    const doc = getDoc();
    if (!doc) return String(val);
    if (typeof val === 'function') {
        const textNode = doc.createTextNode('');
        effect(() => {
            textNode.textContent = String(val());
        });
        return textNode;
    }
    if (val && val._isCairnState) {
        const textNode = doc.createTextNode('');
        effect(() => {
            textNode.textContent = String(val.value);
        });
        return textNode;
    }
    return doc.createTextNode(String(val));
};

/**
 * Escape Hatch 1: Parse raw HTML string into native DOM elements.
 * @param {string} htmlString Raw HTML markup
 * @returns {HTMLElement|DocumentFragment} Native DOM node or Fragment
 */
export function raw(htmlString) {
    const doc = getDoc();
    if (!doc) {
        return h('div', { innerHTML: htmlString });
    }
    const template = doc.createElement('template');
    template.innerHTML = String(htmlString).trim();
    if (template.content.childNodes.length === 1) {
        return template.content.firstChild;
    }
    return template.content;
}

/**
 * Escape Hatch 2: Instantiate any standard HTML element or custom Web Component.
 * @param {string} tag Standard tag or custom-element name
 * @param {...any} args Props or children
 * @returns {HTMLElement} Element node
 */
export function element(tag, ...args) {
    return h(tag, ...args);
}

/**
 * Escape Hatch 3: Direct Canvas factory with 2D / WebGL context methods.
 * @param {object} props Canvas attributes & properties { width, height }
 * @returns {HTMLCanvasElement} Native Canvas element
 */
export function canvas(props = {}) {
    const { width = 300, height = 150, ...rest } = props;
    return h('canvas', { width, height, ...rest });
}

