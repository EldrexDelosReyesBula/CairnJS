/**
 * @eldrex/cairnjs - DOM Portal
 * Renders Cairn component trees into any arbitrary DOM target,
 * outside the current component's DOM hierarchy.
 * Equivalent to React.createPortal().
 */

/**
 * Renders one or more Cairn nodes into a target DOM element
 * outside the current component tree.
 *
 * @param {HTMLElement|string} target DOM element or CSS selector string
 * @param {...HTMLElement} children Cairn nodes to portal into target
 * @returns {object} Portal instance with .destroy() to remove all portaled nodes
 *
 * @example
 * // Render a modal into document.body regardless of where component lives
 * const modalPortal = portal('#modals', ModalComponent());
 *
 * // Cleanup
 * modalPortal.destroy();
 */
export function portal(target, ...children) {
    const getTarget = () => {
        if (!target) return null;
        if (target.nodeType || (target && typeof target.appendChild === 'function')) return target;
        if (typeof target === 'string' && typeof document !== 'undefined') return document.querySelector(target);
        return null;
    };

    const targetEl = getTarget();
    const insertedNodes = [];

    if (!targetEl) {
        console.warn('[Cairn Portal]: Target element not found:', target);
        return { destroy: () => {}, nodes: [] };
    }

    const flatChildren = children.flat(Infinity);

    flatChildren.forEach(child => {
        if (!child) return;
        if (child.nodeType || typeof child === 'object') {
            if (targetEl.appendChild) targetEl.appendChild(child);
            insertedNodes.push(child);
        } else if (typeof child === 'string' || typeof child === 'number') {
            const textNode = typeof document !== 'undefined' ? document.createTextNode(String(child)) : String(child);
            if (targetEl.appendChild) targetEl.appendChild(textNode);
            insertedNodes.push(textNode);
        }
    });

    return {
        nodes: insertedNodes,
        target: targetEl,
        destroy() {
            insertedNodes.forEach(node => {
                if (node && node.parentNode) {
                    node.parentNode.removeChild(node);
                } else if (targetEl && targetEl.childNodes && Array.isArray(targetEl.childNodes)) {
                    const idx = targetEl.childNodes.indexOf(node);
                    if (idx !== -1) targetEl.childNodes.splice(idx, 1);
                }
            });
            insertedNodes.length = 0;
        }
    };
}

export default portal;
