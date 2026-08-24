/**
 * @eldrex/cairnjs - Server-Side Rendering (SSR)
 * renderToString() serializes Cairn component trees to HTML for Node.js, Deno, and Bun.
 * hydrate() attaches event listeners to server-rendered HTML in browser environments.
 */

const VOID_TAGS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

const BOOLEAN_ATTRS = new Set([
    'allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked',
    'controls', 'default', 'defer', 'disabled', 'formnovalidate',
    'hidden', 'ismap', 'itemscope', 'loop', 'multiple', 'muted',
    'nomodule', 'novalidate', 'open', 'playsinline', 'readonly',
    'required', 'reversed', 'selected'
]);

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;');
}

function resolveClassValue(c) {
    if (!c) return '';
    if (typeof c === 'string' || typeof c === 'number') return String(c);
    if (c && c._isCairnState) return resolveClassValue(c.value);
    if (typeof c === 'function') return resolveClassValue(c());
    if (Array.isArray(c)) {
        return c.map(resolveClassValue).filter(Boolean).join(' ');
    }
    if (typeof c === 'object') {
        return Object.entries(c)
            .filter(([, v]) => {
                let resolved = v;
                if (typeof v === 'function') resolved = v();
                else if (v && v._isCairnState) resolved = v.value;
                return Boolean(resolved);
            })
            .map(([k]) => k)
            .join(' ');
    }
    return '';
}

function resolveStyleValue(styleObj) {
    if (!styleObj) return '';
    if (typeof styleObj === 'string') return styleObj;
    if (styleObj && styleObj._isCairnState) return resolveStyleValue(styleObj.value);
    if (typeof styleObj === 'function') return resolveStyleValue(styleObj());
    if (typeof styleObj === 'object') {
        return Object.entries(styleObj)
            .map(([k, v]) => {
                let resolved = v;
                if (typeof v === 'function') resolved = v();
                else if (v && v._isCairnState) resolved = v.value;
                if (resolved === undefined || resolved === null || resolved === '') return null;
                const kebab = k.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `${kebab}: ${resolved}`;
            })
            .filter(Boolean)
            .join('; ');
    }
    return '';
}

function serializeAttributes(attrsObj) {
    if (!attrsObj || typeof attrsObj !== 'object') return '';
    let str = '';
    const entries = attrsObj.entries ? Array.from(attrsObj.entries()) : Object.entries(attrsObj);

    for (let [k, v] of entries) {
        if (k.startsWith('on') || k === 'animate' || k === 'gestures' || k === 'duration' || k === 'delay' || k === 'easing') {
            continue;
        }

        if (k === 'className' || k === 'class') {
            const classStr = resolveClassValue(v);
            if (classStr) str += ` class="${escapeAttr(classStr)}"`;
            continue;
        }

        if (k === 'style') {
            const styleStr = resolveStyleValue(v);
            if (styleStr) str += ` style="${escapeAttr(styleStr)}"`;
            continue;
        }

        let resolvedVal = v;
        if (typeof v === 'function') resolvedVal = v();
        else if (v && v._isCairnState) resolvedVal = v.value;

        const lowerKey = k.toLowerCase();
        if (BOOLEAN_ATTRS.has(lowerKey)) {
            if (Boolean(resolvedVal)) str += ` ${lowerKey}`;
        } else if (resolvedVal !== null && resolvedVal !== undefined && resolvedVal !== false) {
            str += ` ${k}="${escapeAttr(String(resolvedVal))}"`;
        }
    }

    return str;
}

/**
 * Recursively serializes a Cairn DOM node, component tree, or descriptor to an HTML string.
 * Designed for Node.js, Deno, and Bun environments without requiring a DOM polyfill.
 *
 * @param {HTMLElement|object|Function|string|number} node Cairn DOM node, component, or descriptor
 * @returns {string} Serialized HTML string
 *
 * @example
 * // Node.js SSR
 * import { div, h1, each, state } from '@eldrex/cairnjs';
 * import { renderToString } from '@eldrex/cairnjs/ssr';
 *
 * const todos = state([{ id: 1, text: 'Hello' }]);
 * const html = renderToString(div({ class: 'app' }, h1('Todo List'), each(todos, (t) => t.text)));
 */
export function renderToString(node) {
    if (node === null || node === undefined || node === false) return '';

    // Array of nodes
    if (Array.isArray(node)) {
        return node.map(renderToString).join('');
    }

    // Cairn Signal / State primitive
    if (node && node._isCairnState) {
        return renderToString(node.value);
    }

    // Function getter or factory
    if (typeof node === 'function') {
        return renderToString(node());
    }

    // Cairn Keyed List (each / For descriptor)
    if (node && node._isCairnEach) {
        let rawList = node.listSource;
        if (typeof rawList === 'function') rawList = rawList();
        else if (rawList && rawList._isCairnState) rawList = rawList.value;

        if (!Array.isArray(rawList)) return '';
        return rawList.map((item, i) => renderToString(node.renderItem(item, i))).join('');
    }

    // Native DOM Element with outerHTML
    if (typeof node.outerHTML === 'string') {
        return node.outerHTML;
    }

    // DOM Text node
    if (node.nodeType === 3) {
        return escapeHtml(node.textContent || '');
    }

    // Document fragment
    if (node.nodeType === 11) {
        return Array.from(node.childNodes || []).map(renderToString).join('');
    }

    // Cairn Virtual / Mock Node (from h() in Node.js)
    if (node._isCairnVNode || typeof node.tagName === 'string') {
        const tag = (node.tagName || 'div').toLowerCase();
        const attrsObj = { ...(node.attributes || node._attrs || {}) };
        if (node.className && !attrsObj.class && !attrsObj.className) {
            attrsObj.class = node.className;
        }
        if (node.style && typeof node.style === 'object' && Object.keys(node.style).length > 0 && !attrsObj.style) {
            attrsObj.style = node.style;
        }

        const attrs = serializeAttributes(attrsObj);
        const children = (node.childNodes || node._children || []).map(renderToString).join('');

        if (VOID_TAGS.has(tag)) {
            return `<${tag}${attrs}>`;
        }

        return `<${tag}${attrs}>${children}</${tag}>`;
    }

    // String / Number primitive
    if (typeof node === 'string' || typeof node === 'number') {
        return escapeHtml(String(node));
    }

    return '';
}

/**
 * Hydrates a server-rendered HTML container by mounting a Cairn component
 * on top of existing markup.
 *
 * @param {HTMLElement|string} container DOM element or CSS selector
 * @param {Function} componentFn Component factory returning a DOM node
 * @param {object} [props] Props to pass to the component
 */
export function hydrate(container, componentFn, props = {}) {
    if (typeof document === 'undefined') {
        console.warn('[Cairn SSR]: hydrate() must be called in a browser environment.');
        return;
    }

    const targetEl = typeof container === 'string'
        ? document.querySelector(container)
        : container;

    if (!targetEl) {
        console.warn('[Cairn SSR]: hydrate() target not found:', container);
        return;
    }

    targetEl.setAttribute('data-cairn-hydrating', '');

    try {
        const node = typeof componentFn === 'function' ? componentFn(props) : componentFn;

        if (node && node.nodeType) {
            targetEl.innerHTML = '';
            targetEl.appendChild(node);
        }
    } catch (e) {
        console.error('[Cairn SSR] hydrate() error:', e);
    }

    targetEl.removeAttribute('data-cairn-hydrating');
}

export const ssr = { renderToString, hydrate };
export default ssr;

