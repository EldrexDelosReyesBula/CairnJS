/**
 * @eldrex/cairn - Mount System
 * Framework-agnostic mounting and lifecycle management.
 */

import { middlewareEngine, hooksBus } from './extensibility.js';

/**
 * Resolves a target node from a CSS selector, HTMLElement, SVGElement, or Framework Ref object.
 * @param {string|HTMLElement|SVGElement|object} target 
 * @returns {HTMLElement|null} Resolved DOM element
 */
function resolveTarget(target) {
    if (typeof target === 'string') {
        if (typeof document !== 'undefined') {
            try {
                const el = document.querySelector(target);
                if (el) return el;
            } catch (e) {
                // Invalid selector syntax, try direct ID lookup
            }
            const cleanId = target.startsWith('#') ? target.slice(1) : target;
            return document.getElementById(cleanId);
        }
        return null;
    }
    if (target && typeof target === 'object') {
        if (target.current && target.current.nodeType) return target.current; // React Ref
        if (target.value && target.value.nodeType) return target.value;       // Vue Ref
        if (target.nodeType) return target;                                  // Direct DOM Element
    }
    return null;
}

/**
 * Mounts a Cairn component or DOM element into any target DOM node.
 * Works seamlessly with React, Vue, Svelte, or Vanilla JS.
 * 
 * @param {string|HTMLElement|object} target Target DOM container or selector
 * @param {HTMLElement|Function} component Element or component function to mount
 * @returns {Function} Unmount function
 */
export function mount(target, component) {
    const container = resolveTarget(target);

    if (!container) {
        console.warn('[Cairn Mount Warning]: Mount target could not be resolved:', target);
        return () => {};
    }

    let node = component;
    if (typeof component === 'function') {
        node = component();
    }

    if (!node) {
        console.warn('[Cairn Mount Warning]: Component produced null or invalid DOM node.');
        return () => {};
    }

    // Run middleware beforeMount interceptor & hook bus
    node = middlewareEngine.beforeMount(node, container);

    // Append element to container
    if (container.appendChild && node) {
        container.appendChild(node);
    }

    hooksBus.triggerMount(node, component);

    // Return unmount / cleanup handler
    return function unmount() {
        if (node && node.parentNode) {
            node.parentNode.removeChild(node);
        }
        hooksBus.triggerUnmount(node, component);
    };
}

