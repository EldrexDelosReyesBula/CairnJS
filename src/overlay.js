/**
 * @eldrex/cairn - Overlay & Accessibility Focus Management
 * Focus trapping, click-outside detection, escape-key overlay stack, and anchored floating positioning.
 */

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Creates an accessible focus trap within a container element.
 * Traps Tab and Shift+Tab key navigation and restores focus on release.
 *
 * @param {HTMLElement} container DOM element to trap focus within
 * @param {object} [options]
 * @param {boolean} [options.autoFocus=true] Focus first element on activation
 * @param {boolean} [options.restoreFocus=true] Return focus to previous element on deactivation
 * @returns {object} { activate, deactivate }
 */
export function createFocusTrap(container, options = {}) {
    const { autoFocus = true, restoreFocus = true } = options;
    let previouslyFocused = null;
    let active = false;

    function getFocusableElements() {
        if (!container || !container.querySelectorAll) return [];
        return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
            el => !el.hasAttribute('disabled') && el.offsetParent !== null
        );
    }

    function handleKeyDown(e) {
        if (!active || e.key !== 'Tab') return;
        const focusables = getFocusableElements();
        if (focusables.length === 0) {
            e.preventDefault();
            return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first || !container.contains(document.activeElement)) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last || !container.contains(document.activeElement)) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    function activate() {
        if (typeof document === 'undefined') return;
        active = true;
        previouslyFocused = document.activeElement;

        const focusables = getFocusableElements();
        if (autoFocus && focusables.length > 0) {
            setTimeout(() => {
                if (active && focusables[0]) focusables[0].focus();
            }, 10);
        }

        document.addEventListener('keydown', handleKeyDown);
    }

    function deactivate() {
        if (!active || typeof document === 'undefined') return;
        active = false;
        document.removeEventListener('keydown', handleKeyDown);

        if (restoreFocus && previouslyFocused && typeof previouslyFocused.focus === 'function') {
            previouslyFocused.focus();
        }
    }

    return {
        activate,
        deactivate,
        getFocusableElements
    };
}

/**
 * Invokes a callback when a pointer or click occurs outside the specified element(s).
 *
 * @param {HTMLElement|Array<HTMLElement>} target Target element or array of elements
 * @param {Function} callback Handler to invoke on outside click
 * @returns {Function} Cleanup function
 */
export function useClickOutside(target, callback) {
    if (typeof document === 'undefined') return () => {};

    const listener = (event) => {
        const targets = Array.isArray(target) ? target : [target];
        const clickedInside = targets.some(t => t && (t === event.target || (t.contains && t.contains(event.target))));
        if (!clickedInside) {
            callback(event);
        }
    };

    document.addEventListener('pointerdown', listener, true);
    return () => {
        document.removeEventListener('pointerdown', listener, true);
    };
}

/**
 * Invokes a callback when the Escape key is pressed.
 *
 * @param {Function} callback Handler callback
 * @returns {Function} Cleanup function
 */
export function useEscapeKey(callback) {
    if (typeof document === 'undefined') return () => {};

    const listener = (event) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
            callback(event);
        }
    };

    document.addEventListener('keydown', listener);
    return () => {
        document.removeEventListener('keydown', listener);
    };
}

/**
 * Overlay Stack for managing top-most overlay layers and escape dismissal order.
 */
class OverlayStackManager {
    constructor() {
        this.stack = [];
        this._initEscapeListener();
    }

    _initEscapeListener() {
        if (typeof document === 'undefined') return;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.stack.length > 0) {
                const top = this.stack[this.stack.length - 1];
                if (top && typeof top.onDismiss === 'function') {
                    top.onDismiss();
                }
            }
        });
    }

    push(id, onDismiss) {
        this.stack.push({ id, onDismiss });
    }

    pop(id) {
        this.stack = this.stack.filter(item => item.id !== id);
    }

    isTop(id) {
        if (this.stack.length === 0) return false;
        return this.stack[this.stack.length - 1].id === id;
    }
}

export const overlayStack = new OverlayStackManager();

/**
 * Anchored floating positioning helper for Popovers, Dropdowns, and Tooltips.
 * Calculates top and left coordinates relative to viewport.
 *
 * @param {HTMLElement} triggerEl Reference anchor element
 * @param {HTMLElement} floatingEl Floating content element
 * @param {object} [options]
 * @param {'top'|'bottom'|'left'|'right'|'bottom-start'|'bottom-end'|'top-start'|'top-end'} [options.placement='bottom-start']
 * @param {number} [options.offset=8] Pixel offset gap
 */
export function updateFloatingPosition(triggerEl, floatingEl, options = {}) {
    if (!triggerEl || !floatingEl || typeof window === 'undefined') return;

    const { placement = 'bottom-start', offset = 8 } = options;
    const triggerRect = triggerEl.getBoundingClientRect();
    const floatingRect = floatingEl.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (placement) {
        case 'top':
            top = triggerRect.top - floatingRect.height - offset;
            left = triggerRect.left + (triggerRect.width - floatingRect.width) / 2;
            break;
        case 'top-start':
            top = triggerRect.top - floatingRect.height - offset;
            left = triggerRect.left;
            break;
        case 'top-end':
            top = triggerRect.top - floatingRect.height - offset;
            left = triggerRect.right - floatingRect.width;
            break;
        case 'bottom':
            top = triggerRect.bottom + offset;
            left = triggerRect.left + (triggerRect.width - floatingRect.width) / 2;
            break;
        case 'bottom-end':
            top = triggerRect.bottom + offset;
            left = triggerRect.right - floatingRect.width;
            break;
        case 'left':
            top = triggerRect.top + (triggerRect.height - floatingRect.height) / 2;
            left = triggerRect.left - floatingRect.width - offset;
            break;
        case 'right':
            top = triggerRect.top + (triggerRect.height - floatingRect.height) / 2;
            left = triggerRect.right + offset;
            break;
        case 'bottom-start':
        default:
            top = triggerRect.bottom + offset;
            left = triggerRect.left;
            break;
    }

    // Viewport bounding clamp
    const maxLeft = window.innerWidth - floatingRect.width - 8;
    const maxTop = window.innerHeight - floatingRect.height - 8;
    left = Math.max(8, Math.min(left, maxLeft));
    top = Math.max(8, Math.min(top, maxTop));

    floatingEl.style.position = 'fixed';
    floatingEl.style.top = `${top}px`;
    floatingEl.style.left = `${left}px`;
}

/**
 * Runtime Accessibility (a11y) Auditor
 * Scans a DOM node tree for common WCAG / ARIA violations.
 *
 * @param {HTMLElement} [rootNode] Element to scan (defaults to document.body)
 * @returns {object} { valid, errors, warnings, passes }
 */
export function a11yAudit(rootNode) {
    const root = rootNode || (typeof document !== 'undefined' ? document.body : null);
    const errors = [];
    const warnings = [];
    let passes = 0;

    if (!root || !root.querySelectorAll) {
        return { valid: true, errors: [], warnings: [], passes: 0 };
    }

    // 1. Buttons must have accessible name
    const buttons = root.querySelectorAll('button, [role="button"]');
    buttons.forEach((btn, i) => {
        const textContent = (btn.textContent || '').trim();
        const ariaLabel = btn.getAttribute('aria-label');
        const ariaLabelledby = btn.getAttribute('aria-labelledby');
        if (!textContent && !ariaLabel && !ariaLabelledby) {
            errors.push(`Button #${i + 1} (${btn.tagName.toLowerCase()}) is missing an accessible text name or aria-label.`);
        } else {
            passes++;
        }
    });

    // 2. Images must have alt attribute
    const images = root.querySelectorAll('img');
    images.forEach((img, i) => {
        if (!img.hasAttribute('alt')) {
            errors.push(`Image #${i + 1} (src: "${img.getAttribute('src') || ''}") is missing an 'alt' attribute.`);
        } else {
            passes++;
        }
    });

    // 3. Form inputs must have accessible labels
    const inputs = root.querySelectorAll('input:not([type="hidden"]), textarea, select');
    inputs.forEach((inp, i) => {
        const id = inp.getAttribute('id');
        const ariaLabel = inp.getAttribute('aria-label');
        const ariaLabelledby = inp.getAttribute('aria-labelledby');
        const hasAssociatedLabel = id && root.querySelector(`label[for="${id}"]`);
        const isWrappedInLabel = inp.closest('label');

        if (!ariaLabel && !ariaLabelledby && !hasAssociatedLabel && !isWrappedInLabel) {
            warnings.push(`Form control #${i + 1} (${inp.tagName.toLowerCase()}${inp.type ? `[type="${inp.type}"]` : ''}) has no associated <label> or aria-label.`);
        } else {
            passes++;
        }
    });

    // 4. Dialogs must have aria-modal and accessible title
    const dialogs = root.querySelectorAll('[role="dialog"]');
    dialogs.forEach((dlg, i) => {
        if (!dlg.hasAttribute('aria-modal')) {
            warnings.push(`Dialog #${i + 1} is missing 'aria-modal="true"'.`);
        }
        if (!dlg.getAttribute('aria-labelledby') && !dlg.getAttribute('aria-label')) {
            warnings.push(`Dialog #${i + 1} is missing an 'aria-labelledby' or 'aria-label' attribute.`);
        } else {
            passes++;
        }
    });

    return {
        valid: errors.length === 0,
        errors,
        warnings,
        passes
    };
}

export const a11y = {
    audit: a11yAudit
};

export default {
    createFocusTrap,
    useClickOutside,
    useEscapeKey,
    overlayStack,
    updateFloatingPosition,
    a11yAudit,
    a11y
};
