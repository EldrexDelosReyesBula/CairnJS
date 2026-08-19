/**
 * @eldrex/cairn - Server-Side Rendering (SSR)
 * renderToString() serializes Cairn component trees to HTML for Node.js.
 * hydrate() attaches event listeners to server-rendered HTML.
 */

/**
 * Recursively serializes a Cairn DOM node (or plain HTMLElement) to an HTML string.
 * Designed for Node.js environments using Cairn's h() / component() output.
 *
 * @param {HTMLElement|object} node Cairn DOM node or virtual element
 * @returns {string} HTML string
 *
 * @example
 * // Node.js SSR
 * import { h, div, p } from '@eldrex/cairn';
 * import { renderToString } from '@eldrex/cairn/ssr';
 *
 * const html = renderToString(div({ class: 'hero' }, p('Hello SSR!')));
 * // '<div class="hero"><p>Hello SSR!</p></div>'
 */
export function renderToString(node) {
    if (!node) return '';

    // Native DOM Element (browser environment with JSDOM or similar)
    if (typeof node.outerHTML === 'string') {
        return node.outerHTML;
    }

    // Text node
    if (node.nodeType === 3) {
        return escapeHtml(node.textContent || '');
    }

    // Document fragment
    if (node.nodeType === 11) {
        return Array.from(node.childNodes || []).map(renderToString).join('');
    }

    // Virtual node (Cairn's SSR-safe object format)
    if (node._isCairnVNode || typeof node.tagName === 'string') {
        const tag = (node.tagName || 'div').toLowerCase();
        const attrsObj = { ...(node.attributes || node._attrs || {}) };
        if (node.className && !attrsObj.class && !attrsObj.className) {
            attrsObj.class = node.className;
        }
        const attrs = serializeAttributes(attrsObj);
        const children = serializeChildren(node.childNodes || node._children || []);

        if (VOID_TAGS.has(tag)) {
            return `<${tag}${attrs}>`;
        }

        return `<${tag}${attrs}>${children}</${tag}>`;
    }

    // String / number fallback
    if (typeof node === 'string' || typeof node === 'number') {
        return escapeHtml(String(node));
    }

    return '';
}

const VOID_TAGS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
]);

function serializeAttributes(attrs) {
    if (!attrs || typeof attrs !== 'object') return '';
    let str = '';
    const iterate = attrs.entries ? attrs.entries() : Object.entries(attrs);
    for (const [k, v] of iterate) {
        if (k.startsWith('on') || k === 'style' && typeof v === 'function') continue;
        if (typeof v === 'boolean') {
            if (v) str += ` ${k}`;
        } else if (typeof v === 'object' && v !== null && k === 'style') {
            const styleStr = Object.entries(v).map(([sk, sv]) => {
                const kebab = sk.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
                return `${kebab}: ${sv}`;
            }).join('; ');
            str += ` style="${escapeAttr(styleStr)}"`;
        } else if (v !== null && v !== undefined) {
            str += ` ${k}="${escapeAttr(String(v))}"`;
        }
    }
    return str;
}

function serializeChildren(children) {
    if (!children) return '';
    const arr = Array.isArray(children) ? children : Array.from(children);
    return arr.map(renderToString).join('');
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
}

/**
 * Hydrates a server-rendered HTML container by mounting a Cairn component
 * on top of existing markup. Attaches event listeners without re-rendering.
 *
 * In the current implementation, this performs a replace-hydration:
 * runs the component and replaces the container's children.
 * Full diffing hydration can be layered on top with the reconciler.
 *
 * @param {HTMLElement|string} container DOM element or CSS selector
 * @param {Function} componentFn Component factory returning a DOM node
 * @param {object} [props] Props to pass to the component
 *
 * @example
 * // Client-side hydration
 * hydrate('#app', MyApp, { initialData: window.__SSR_DATA__ });
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

    // Preserve existing HTML for SEO/no-flash
    targetEl.setAttribute('data-cairn-hydrating', '');

    try {
        const node = typeof componentFn === 'function' ? componentFn(props) : componentFn;

        if (node && node.nodeType) {
            // Replace with live Cairn-managed node
            targetEl.innerHTML = '';
            targetEl.appendChild(node);
        }
    } catch (e) {
        console.error('[Cairn SSR] hydrate() error:', e);
    }

    targetEl.removeAttribute('data-cairn-hydrating');
}

export default { renderToString, hydrate };
