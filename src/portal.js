/**
 * @eldrex/cairn - DOM Portal
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
        if (typeof document === 'undefined') return null;
        if (typeof target === 'string') return document.querySelector(target);
        if (target.nodeType) return target;
        return null;
    };

    const targetEl = getTarget();
    const insertedNodes = [];

    if (!targetEl) {
        console.warn('[Cairn Portal]: Target element not found:', target);
        return { destroy: () => {} };
    }

    const flatChildren = children.flat(Infinity);

    flatChildren.forEach(child => {
        if (!child) return;
        if (child.nodeType) {
            targetEl.appendChild(child);
            insertedNodes.push(child);
        } else if (typeof child === 'string' || typeof child === 'number') {
            const textNode = document.createTextNode(String(child));
            targetEl.appendChild(textNode);
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
                }
            });
            insertedNodes.length = 0;
        }
    };
}

export default portal;
