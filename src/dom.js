/**
 * @eldrex/cairn - DOM Builder Engine
 * Declarative, reactive HTML element builders with zero dependencies, automatic accessibility, and helpful error warnings.
 */

import { effect, state, computed } from './state.js';
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
        nodeType: 1,
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
                    } else if (el.style && typeof computedObj === 'string') {
                        el.style.cssText = computedObj;
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
            } else if (typeof val === 'string' && el.style) {
                el.style.cssText = val;
            }
        } else if (key === 'className' || key === 'class') {
            const formatClass = (c) => {
                if (!c) return '';
                if (Array.isArray(c)) return c.filter(Boolean).join(' ');
                if (typeof c === 'object') return Object.entries(c).filter(([, v]) => Boolean(v)).map(([k]) => k).join(' ');
                return String(c);
            };

            if (typeof val === 'function') {
                effect(() => {
                    const formatted = formatClass(val());
                    if (el.className !== undefined) el.className = formatted;
                    if (el.setAttribute) el.setAttribute('class', formatted);
                });
            } else if (val && val._isCairnState) {
                effect(() => {
                    const formatted = formatClass(val.value);
                    if (el.className !== undefined) el.className = formatted;
                    if (el.setAttribute) el.setAttribute('class', formatted);
                });
            } else if (el.className !== undefined) {
                const formatted = formatClass(val);
                el.className = formatted;
                if (el.setAttribute) el.setAttribute('class', formatted);
            }
        } else if (key === 'animate') {
            applyAnimateProp(el, val, props.duration, props.delay, props.easing);
        } else if (key === 'gestures' && typeof val === 'object') {
            gesture(el, val);
        } else if (key === 'value' || key === 'checked' || key === 'disabled' || key === 'selected' || key === 'readOnly') {
            if (typeof val === 'function') {
                effect(() => {
                    const computedVal = val();
                    if (key in el) el[key] = computedVal;
                    if (el.setAttribute) el.setAttribute(key, computedVal);
                });
            } else if (val && val._isCairnState) {
                effect(() => {
                    if (key in el) el[key] = val.value;
                    if (el.setAttribute) el.setAttribute(key, val.value);
                });
            } else {
                if (key in el) el[key] = val;
                if (el.setAttribute) el.setAttribute(key, val);
            }
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
            } else {
                if (el.appendChild) el.appendChild(String(childNode));
            }
        } else if (childNode instanceof (typeof Element !== 'undefined' ? Element : Object) || childNode?.nodeType) {
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
export const button = (...args) => h('button', ...args);
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
 * Built-in validation rule helpers for declarative form validation schemas.
 */
export const validators = {
    required: (msg = 'This field is required') => (val) => {
        if (val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0)) {
            return msg;
        }
        return null;
    },
    email: (msg = 'Please enter a valid email address') => (val) => {
        if (!val) return null;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(String(val)) ? null : msg;
    },
    minLength: (min, msg) => (val) => {
        if (!val) return null;
        const err = msg || `Must be at least ${min} characters`;
        return String(val).length >= min ? null : err;
    },
    maxLength: (max, msg) => (val) => {
        if (!val) return null;
        const err = msg || `Must be at most ${max} characters`;
        return String(val).length <= max ? null : err;
    },
    pattern: (regex, msg = 'Invalid format') => (val) => {
        if (!val) return null;
        return regex.test(String(val)) ? null : msg;
    },
    matches: (fieldKey, msg = 'Fields do not match') => (val, values) => {
        return values && values[fieldKey] === val ? null : msg;
    },
    custom: (fn) => fn
};

/**
 * Auto-generating form helper that handles state, inputs, schema validation, and submission.
 * @param {object} config Form configuration { fields, schema, onSubmit, submit }
 * @returns {HTMLElement} Form DOM Element augmented with form controller signals
 */
export const createForm = (config = {}) => {
    const { fields = {}, schema = {}, onSubmit = config.submit || (() => {}) } = config;
    const values = {};
    const errors = state({});
    const touched = state({});
    const isSubmitting = state(false);
    const isValid = computed(() => Object.keys(errors.value).length === 0);

    const validateField = (fName, fVal, allVals) => {
        const rules = schema[fName] || (fields[fName] && fields[fName].rules) || [];
        for (const rule of rules) {
            const err = rule(fVal, allVals);
            if (err) return err;
        }
        if (fields[fName] && fields[fName].required && (fVal === '' || fVal === undefined || fVal === null)) {
            return 'This field is required';
        }
        return null;
    };

    const validateAll = () => {
        const currentVals = {};
        Object.entries(values).forEach(([k, sig]) => { currentVals[k] = sig.value; });
        const newErrors = {};
        Object.keys({ ...fields, ...schema }).forEach((fName) => {
            const err = validateField(fName, currentVals[fName], currentVals);
            if (err) newErrors[fName] = err;
        });
        errors.value = newErrors;
        return Object.keys(newErrors).length === 0;
    };

    const fieldElements = [];

    Object.entries(fields).forEach(([fName, fDef]) => {
        const fieldSignal = state(fDef.default !== undefined ? fDef.default : '');
        values[fName] = fieldSignal;

        const inputEl = input({
            id: `field-${fName}`,
            type: fDef.type || 'text',
            value: fieldSignal,
            placeholder: fDef.label || fName,
            required: fDef.required,
            'aria-invalid': () => (errors.value[fName] ? 'true' : undefined),
            oninput: (e) => {
                fieldSignal.value = e.target.value;
                touched.value = { ...touched.value, [fName]: true };
                validateAll();
            },
            onblur: () => {
                touched.value = { ...touched.value, [fName]: true };
                validateAll();
            }
        });

        const errorMsgEl = p(() => errors.value[fName] || '', {
            style: () => ({ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: errors.value[fName] ? 'block' : 'none' })
        });

        fieldElements.push(div({ style: { marginBottom: '0.75rem' } }, inputEl, errorMsgEl));
    });

    fieldElements.push(button('Submit', {
        type: 'submit',
        disabled: () => isSubmitting.value
    }));

    const formEl = form({
        onsubmit: async (e) => {
            e.preventDefault();
            const valid = validateAll();
            if (!valid) return;

            const currentVals = {};
            Object.entries(values).forEach(([k, sig]) => { currentVals[k] = sig.value; });

            isSubmitting.value = true;
            try {
                await onSubmit(currentVals);
            } finally {
                isSubmitting.value = false;
            }
        }
    }, ...fieldElements);

    return Object.assign(formEl, {
        values,
        errors,
        touched,
        isValid,
        isSubmitting,
        validate: validateAll,
        reset: () => {
            Object.entries(fields).forEach(([k, def]) => {
                if (values[k]) values[k].value = def.default !== undefined ? def.default : '';
            });
            errors.value = {};
            touched.value = {};
        }
    });
};

/**
 * Dynamic repeatable form field array manager.
 * @param {Array<object>} initialItems Initial list of item objects
 * @returns {object} { fields, append, prepend, remove, move, clear, count }
 */
export const useFieldArray = (initialItems = []) => {
    let idCounter = 0;
    const wrapItem = (item) => ({
        ...item,
        _id: (item && item._id) || `fa-${Date.now()}-${++idCounter}`
    });

    const fields = state(initialItems.map(wrapItem));

    const append = (item) => {
        fields.value = [...fields.value, wrapItem(item)];
    };

    const prepend = (item) => {
        fields.value = [wrapItem(item), ...fields.value];
    };

    const remove = (index) => {
        fields.value = fields.value.filter((_, i) => i !== index);
    };

    const move = (fromIndex, toIndex) => {
        const arr = [...fields.value];
        const [moved] = arr.splice(fromIndex, 1);
        arr.splice(toIndex, 0, moved);
        fields.value = arr;
    };

    const clear = () => {
        fields.value = [];
    };

    const count = computed(() => fields.value.length);

    return {
        fields,
        append,
        prepend,
        remove,
        move,
        clear,
        count
    };
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

