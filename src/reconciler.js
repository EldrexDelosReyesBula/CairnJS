/**
 * @eldrex/cairnjs - Virtual DOM Reconciler & Key-Based List Engine
 * Efficient, keyed list reconciliation that surgically patches the DOM
 * instead of destroying and recreating entire node trees.
 * Preserves input focus, scroll positions, and CSS transitions during array mutations.
 */

import { effect } from './state.js';

/**
 * Reconciles a DOM parent's children against a new list of virtual nodes.
 * Uses key-based diffing to reorder, add, and remove nodes surgically.
 *
 * @param {HTMLElement} parent Parent DOM container
 * @param {Array} oldItems Previous item array (with keys)
 * @param {Array} newItems New item array (with keys)
 * @param {Function} renderItem (item, index) => HTMLElement
 * @param {Function} getKey (item, index) => string|number unique key extractor
 */
export function reconcile(parent, oldItems, newItems, renderItem, getKey = (item, i) => item?.id ?? item?.key ?? i) {
    if (!parent) return;

    const oldKeyMap = new Map();
    oldItems.forEach((item, i) => {
        const key = getKey(item, i);
        oldKeyMap.set(key, { item, index: i, node: parent.children[i] });
    });

    const newKeyMap = new Map();
    newItems.forEach((item, i) => {
        newKeyMap.set(getKey(item, i), item);
    });

    // Remove nodes no longer in new list
    oldItems.forEach((item, i) => {
        const key = getKey(item, i);
        if (!newKeyMap.has(key)) {
            const entry = oldKeyMap.get(key);
            if (entry && entry.node && entry.node.parentNode === parent) {
                parent.removeChild(entry.node);
            }
        }
    });

    // Insert / reorder nodes for new items
    newItems.forEach((item, newIdx) => {
        const key = getKey(item, newIdx);
        const existing = oldKeyMap.get(key);

        if (!existing) {
            // New item — create and insert
            let newNode;
            try { newNode = renderItem(item, newIdx); } catch (e) {
                console.error('[Cairn Reconciler] renderItem error:', e);
                return;
            }
            if (!newNode) return;

            const refNode = parent.children[newIdx] || null;
            parent.insertBefore(newNode, refNode);
        } else {
            // Existing item — ensure position is correct
            const currentNode = existing.node;
            if (!currentNode) return;

            const nodeAtPos = parent.children[newIdx];
            if (nodeAtPos !== currentNode) {
                parent.insertBefore(currentNode, nodeAtPos || null);
            }
        }
    });
}

/**
 * Creates a reactive keyed list descriptor for declarative template rendering.
 *
 * @example
 * // Usage in Cairn DOM builders:
 * ul(
 *   each(todos, (todo) => todo.id, (todo) => li(todo.title))
 * )
 *
 * @param {Array|object|Function} listSource Cairn state signal, array, or getter function
 * @param {Function} [keyOrRender] Key selector function or render function if 2 arguments passed
 * @param {Function} [maybeRender] Render function (item, index) => HTMLElement
 * @returns {object} Cairn Each Descriptor
 */
export function each(listSource, keyOrRender, maybeRender) {
    let getKey;
    let renderItem;

    if (typeof maybeRender === 'function') {
        getKey = typeof keyOrRender === 'function' ? keyOrRender : (item, i) => item?.id ?? item?.key ?? i;
        renderItem = maybeRender;
    } else if (typeof keyOrRender === 'function') {
        getKey = (item, i) => item?.id ?? item?.key ?? i;
        renderItem = keyOrRender;
    } else {
        getKey = (item, i) => item?.id ?? item?.key ?? i;
        renderItem = (item) => item;
    }

    return {
        _isCairnEach: true,
        listSource,
        getKey,
        renderItem
    };
}

/**
 * Declarative component wrapper for keyed list iteration.
 *
 * @example
 * For({
 *   each: todosSignal,
 *   key: (todo) => todo.id,
 *   children: (todo, index) => li(todo.text)
 * })
 *
 * @param {object} props
 * @param {Array|object|Function} props.each Source array or signal
 * @param {Function} [props.key] Key extraction function
 * @param {Function} props.children Render function
 * @returns {object} Cairn Each Descriptor
 */
export function For(props = {}) {
    const listSource = props.each || props.items || [];
    const getKey = props.key || ((item, i) => item?.id ?? item?.key ?? i);
    const renderItem = props.children || props.render || ((item) => item);
    return each(listSource, getKey, renderItem);
}

/**
 * Creates a managed reactive list that auto-reconciles on signal change.
 *
 * @param {HTMLElement} parent Container element
 * @param {object} listSignal Cairn state signal (array)
 * @param {Function} renderItem (item, index) => HTMLElement
 * @param {Function} getKey Key extractor function
 * @returns {Function} Unsubscribe function
 */
export function createList(parent, listSignal, renderItem, getKey = (item, i) => item?.id ?? item?.key ?? i) {
    let prevItems = [];

    return effect(() => {
        const newItems = Array.isArray(listSignal.value) ? listSignal.value : [];
        reconcile(parent, prevItems, newItems, renderItem, getKey);
        prevItems = [...newItems];
    });
}

/**
 * Patches a single DOM node's attributes based on a diff of old/new props.
 * Only modifies attributes that actually changed.
 *
 * @param {HTMLElement} el Target element
 * @param {object} oldProps Previous props
 * @param {object} newProps New props
 */
export function patchProps(el, oldProps = {}, newProps = {}) {
    if (!el || !el.setAttribute) return;

    const allKeys = new Set([...Object.keys(oldProps), ...Object.keys(newProps)]);
    allKeys.forEach(key => {
        if (key.startsWith('on')) return; // Skip event listeners (not patchable easily)

        const oldVal = oldProps[key];
        const newVal = newProps[key];

        if (oldVal === newVal) return;

        if (newVal === undefined || newVal === null) {
            el.removeAttribute(key);
        } else if (key === 'style' && typeof newVal === 'object') {
            Object.entries(newVal).forEach(([sk, sv]) => {
                if (el.style && el.style[sk] !== sv) el.style[sk] = sv;
            });
        } else if (key === 'className' || key === 'class') {
            if (el.className !== newVal) el.className = newVal;
        } else {
            el.setAttribute(key, String(newVal));
        }
    });
}

export const reconciler = { reconcile, each, For, createList, patchProps };
export default reconciler;

