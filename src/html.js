/**
 * @eldrex/cairnjs - Tagged Template Literal HTML Engine
 * Zero-dependency, fine-grained reactive HTML parser.
 * Allows developers and designers to write standard HTML template literals with direct signal bindings.
 *
 * @example
 * const count = state(0);
 * const view = html`
 *   <div class="card">
 *     <h2>Count: ${count}</h2>
 *     <button onclick=${() => count.value++}>Increment</button>
 *   </div>
 * `;
 */

import { effect } from './state.js';
import { h, sanitize, raw } from './dom.js';

let _placeholderId = 0;

/**
 * Parses a tagged template literal into a reactive DOM tree, creates an <html> element, or creates sanitized HTML from string.
 *
 * @param {TemplateStringsArray|object|string} strings 
 * @param {...any} values 
 * @returns {HTMLElement|DocumentFragment|string}
 */
export function html(strings, ...values) {
    if (typeof strings === 'string') {
        const options = (typeof values[0] === 'object' && values[0] !== null) ? values[0] : {};
        const sanitized = sanitize(strings, options);
        return raw(sanitized);
    }
    if (!strings || !Array.isArray(strings) || !strings.raw) {
        return h('html', strings, ...values);
    }

    if (typeof document === 'undefined') {
        // SSR / Node Fallback: Render static HTML string
        return strings.reduce((acc, str, i) => {
            const val = values[i - 1];
            let rendered = '';
            if (val !== undefined && val !== null) {
                if (typeof val === 'function') {
                    try { rendered = String(val()); } catch (e) { rendered = ''; }
                } else if (val._isCairnState) {
                    rendered = String(val.value);
                } else {
                    rendered = String(val);
                }
            }
            return acc + rendered + str;
        });
    }

    const placeholderMap = new Map();
    let rawHtml = '';

    for (let i = 0; i < strings.length; i++) {
        rawHtml += strings[i];
        if (i < values.length) {
            const val = values[i];
            const token = `__cairn_ph_${++_placeholderId}__`;
            placeholderMap.set(token, val);
            rawHtml += token;
        }
    }

    const template = document.createElement('template');
    template.innerHTML = rawHtml.trim();
    const fragment = template.content.cloneNode(true);

    // Process nodes recursively to bind dynamic values and signals
    const walker = document.createTreeWalker(fragment, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    const nodesToProcess = [];

    while (walker.nextNode()) {
        nodesToProcess.push(walker.currentNode);
    }

    nodesToProcess.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node, placeholderMap);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            processElementAttributes(node, placeholderMap);
        }
    });

    if (fragment.childNodes.length === 1) {
        return fragment.childNodes[0];
    }
    return fragment;
}

function processTextNode(textNode, placeholderMap) {
    const text = textNode.nodeValue;
    if (!text) return;

    placeholderMap.forEach((val, token) => {
        if (!text.includes(token)) return;

        const parent = textNode.parentNode;
        if (!parent) return;

        if (text.trim() === token) {
            // Whole text node is the placeholder
            bindDynamicContent(textNode, val);
        } else {
            // Placeholder embedded within static text
            const parts = text.split(token);
            const frag = document.createDocumentFragment();
            parts.forEach((part, idx) => {
                if (part) frag.appendChild(document.createTextNode(part));
                if (idx < parts.length - 1) {
                    const dynamicMarker = document.createTextNode('');
                    frag.appendChild(dynamicMarker);
                    bindDynamicContent(dynamicMarker, val);
                }
            });
            parent.replaceChild(frag, textNode);
        }
    });
}

function bindDynamicContent(targetNode, val) {
    const parent = targetNode.parentNode;
    if (!parent) return;

    if (typeof val === 'function' || (val && val._isCairnState)) {
        const getVal = val._isCairnState ? () => val.value : val;
        let activeNodes = [targetNode];

        effect(() => {
            const result = getVal();
            const newFrag = document.createDocumentFragment();

            if (result instanceof Node) {
                newFrag.appendChild(result);
            } else if (Array.isArray(result)) {
                result.forEach(item => {
                    if (item instanceof Node) newFrag.appendChild(item);
                    else newFrag.appendChild(document.createTextNode(String(item ?? '')));
                });
            } else {
                newFrag.appendChild(document.createTextNode(String(result ?? '')));
            }

            const firstActive = activeNodes[0];
            if (firstActive && firstActive.parentNode) {
                const newNodesArray = Array.from(newFrag.childNodes);
                firstActive.parentNode.insertBefore(newFrag, firstActive);
                activeNodes.forEach(n => {
                    if (n.parentNode) n.parentNode.removeChild(n);
                });
                activeNodes = newNodesArray.length > 0 ? newNodesArray : [document.createTextNode('')];
                if (newNodesArray.length === 0 && firstActive.parentNode) {
                    firstActive.parentNode.insertBefore(activeNodes[0], null);
                }
            }
        });
    } else if (val instanceof Node) {
        parent.replaceChild(val, targetNode);
    } else if (Array.isArray(val)) {
        const frag = document.createDocumentFragment();
        val.forEach(item => {
            if (item instanceof Node) frag.appendChild(item);
            else frag.appendChild(document.createTextNode(String(item ?? '')));
        });
        parent.replaceChild(frag, targetNode);
    } else {
        targetNode.nodeValue = String(val ?? '');
    }
}

const DANGEROUS_ATTRS = new Set(['href', 'src', 'action', 'formaction', 'data', 'xlink:href']);

function sanitizeAttributeValue(attrName, val) {
    if (!val || typeof val !== 'string') return val;
    if (DANGEROUS_ATTRS.has(attrName.toLowerCase())) {
        const clean = val.trim().toLowerCase().replace(/[\x00-\x20]/g, '');
        if (clean.startsWith('javascript:') || clean.startsWith('vbscript:') || clean.startsWith('data:text/html')) {
            console.warn(`[Cairn Security Warning]: Blocked potentially unsafe URL execution in attribute "${attrName}": ${val}`);
            return 'about:blank#blocked';
        }
    }
    return val;
}

function processElementAttributes(element, placeholderMap) {
    const attributes = Array.from(element.attributes);

    attributes.forEach(attr => {
        const attrName = attr.name;
        const attrVal = attr.value;

        placeholderMap.forEach((val, token) => {
            if (attrName.includes(token.toLowerCase())) {
                return;
            }

            if (attrVal.includes(token)) {
                // 1. Two-Way Model / Bind Directive (:bind=${signal} or bind=${signal})
                if (attrName === ':bind' || attrName === 'bind' || attrName === 'model' || attrName === ':model') {
                    element.removeAttribute(attrName);
                    if (val && (val._isCairnState || typeof val.subscribe === 'function')) {
                        effect(() => {
                            if (element.type === 'checkbox') {
                                element.checked = Boolean(val.value);
                            } else {
                                element.value = val.value ?? '';
                            }
                        });
                        const eventName = (element.type === 'checkbox' || element.tagName === 'SELECT') ? 'change' : 'input';
                        element.addEventListener(eventName, (e) => {
                            if (element.type === 'checkbox') {
                                val.value = e.target.checked;
                            } else if (element.type === 'number') {
                                val.value = Number(e.target.value);
                            } else {
                                val.value = e.target.value;
                            }
                        });
                    }
                    return;
                }

                // 2. Event listener bindings (@click, onclick, @submit, etc.)
                if (attrName.startsWith('on') || attrName.startsWith('@')) {
                    const eventName = attrName.replace(/^@|^on/, '').toLowerCase();
                    element.removeAttribute(attrName);
                    if (typeof val === 'function') {
                        element.addEventListener(eventName, val);
                    }
                    return;
                }

                // 3. Dynamic Style Object / Reactive Style
                if (attrName === ':style' || (attrName === 'style' && typeof val === 'object' && val !== null)) {
                    if (attrName === ':style') element.removeAttribute(attrName);
                    if (val && val._isCairnState) {
                        effect(() => {
                            const styleObj = val.value || {};
                            Object.assign(element.style, styleObj);
                        });
                    } else if (typeof val === 'object' && val !== null) {
                        Object.assign(element.style, val);
                    }
                    return;
                }

                // 4. Reactive attribute binding
                if (typeof val === 'function' || (val && val._isCairnState)) {
                    const getVal = val._isCairnState ? () => val.value : val;
                    effect(() => {
                        const computedVal = getVal();
                        if (computedVal === false || computedVal === null || computedVal === undefined) {
                            element.removeAttribute(attrName);
                        } else if (computedVal === true) {
                            element.setAttribute(attrName, '');
                        } else if (attrName === 'value' && ('value' in element)) {
                            element.value = computedVal;
                        } else {
                            const safeVal = sanitizeAttributeValue(attrName, String(computedVal));
                            element.setAttribute(attrName, safeVal);
                        }
                    });
                } else if (typeof val === 'boolean') {
                    if (val) element.setAttribute(attrName, '');
                    else element.removeAttribute(attrName);
                } else {
                    const safeVal = sanitizeAttributeValue(attrName, attrVal.replace(token, String(val ?? '')));
                    element.setAttribute(attrName, safeVal);
                }
            }
        });
    });
}

export default html;
