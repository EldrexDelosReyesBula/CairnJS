/**
 * @eldrex/cairn - Virtual DOM Reconciler / Key-Based Diffing
 * Efficient, keyed list reconciliation that surgically patches the DOM
 * instead of destroying and recreating entire node trees.
 * Dramatically improves performance for large reactive lists.
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
 * @param {Function} getKey (item) => string|number unique key extractor
 *
 * @example
 * const items = state([{ id: 1, name: 'A' }, { id: 2, name: 'B' }]);
 * const container = div();
 * let prevItems = [];
 *
 * effect(() => {
 *   const newItems = items.value;
 *   reconcile(container, prevItems, newItems, (item) => div(item.name), (item) => item.id);
 *   prevItems = [...newItems];
 * });
 */
export function reconcile(parent, oldItems, newItems, renderItem, getKey = (item) => item.id ?? item) {
    if (!parent) return;

    const oldKeyMap = new Map();
    oldItems.forEach((item, i) => {
        const key = getKey(item);
        oldKeyMap.set(key, { item, index: i, node: parent.children[i] });
    });

    const newKeyMap = new Map();
    newItems.forEach((item, i) => {
        newKeyMap.set(getKey(item), item);
    });

    // Remove nodes no longer in new list
    oldItems.forEach((item) => {
        const key = getKey(item);
        if (!newKeyMap.has(key)) {
            const entry = oldKeyMap.get(key);
            if (entry && entry.node && entry.node.parentNode === parent) {
                parent.removeChild(entry.node);
            }
        }
    });

    // Insert / reorder nodes for new items
    newItems.forEach((item, newIdx) => {
        const key = getKey(item);
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
 * Creates a managed reactive list that auto-reconciles on signal change.
 *
 * @param {HTMLElement} parent Container element
 * @param {object} listSignal Cairn state signal (array)
 * @param {Function} renderItem (item, index) => HTMLElement
 * @param {Function} getKey Key extractor function
 * @returns {Function} Unsubscribe function
 *
 * @example
 * const todos = state([{ id: 1, text: 'Buy milk' }]);
 * const list = div();
 *
 * const stop = createList(list, todos, (todo) => li(todo.text), (t) => t.id);
 */
export function createList(parent, listSignal, renderItem, getKey = item => item.id ?? item) {
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
                if (el.style[sk] !== sv) el.style[sk] = sv;
            });
        } else if (key === 'className' || key === 'class') {
            if (el.className !== newVal) el.className = newVal;
        } else {
            el.setAttribute(key, String(newVal));
        }
    });
}

export const reconciler = { reconcile, createList, patchProps };
export default reconciler;
