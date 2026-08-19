/**
 * @eldrex/cairn - Utility Toolbox
 * Color, clipboard, localStorage (reactive), fullscreen, IntersectionObserver,
 * resize observer, debounce, throttle, and miscellaneous browser utilities.
 */

import { state } from './state.js';

// ─── Color Utilities ──────────────────────────────────────────────────────────

function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const full = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean;
    const num = parseInt(full, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex({ r, g, b }) {
    return '#' + [r, g, b].map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
}

function clamp(n, min = 0, max = 255) { return Math.max(min, Math.min(max, n)); }

export const color = {
    /**
     * Convert hex to { r, g, b } object.
     */
    hexToRgb,

    /**
     * Convert { r, g, b } to hex string.
     */
    rgbToHex,

    /**
     * Darken a hex color by a percentage (0-1).
     */
    darken(hex, amount = 0.1) {
        const { r, g, b } = hexToRgb(hex);
        const factor = 1 - amount;
        return rgbToHex({ r: clamp(r * factor), g: clamp(g * factor), b: clamp(b * factor) });
    },

    /**
     * Lighten a hex color by a percentage (0-1).
     */
    lighten(hex, amount = 0.1) {
        const { r, g, b } = hexToRgb(hex);
        return rgbToHex({
            r: clamp(r + (255 - r) * amount),
            g: clamp(g + (255 - g) * amount),
            b: clamp(b + (255 - b) * amount)
        });
    },

    /**
     * Mix two hex colors by a ratio (0 = first, 1 = second).
     */
    mix(hex1, hex2, ratio = 0.5) {
        const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
        return rgbToHex({
            r: clamp(c1.r + (c2.r - c1.r) * ratio),
            g: clamp(c1.g + (c2.g - c1.g) * ratio),
            b: clamp(c1.b + (c2.b - c1.b) * ratio)
        });
    },

    /**
     * Convert hex to rgba() CSS string.
     */
    rgba(hex, alpha = 1) {
        const { r, g, b } = hexToRgb(hex);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    },

    /**
     * Returns a CSS linear-gradient string.
     */
    gradient(direction, ...stops) {
        return `linear-gradient(${direction}, ${stops.join(', ')})`;
    }
};

// ─── Clipboard ────────────────────────────────────────────────────────────────

export const clipboard = {
    /**
     * Copies text to clipboard. Returns a Promise.
     * @param {string} text
     */
    async copy(text) {
        if (typeof navigator === 'undefined') return false;
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch {
            // Fallback for older browsers
            const el = document.createElement('textarea');
            el.value = text;
            el.style.position = 'fixed';
            el.style.opacity = '0';
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            return true;
        }
    },

    /**
     * Reads text from clipboard. Returns a Promise<string>.
     */
    async read() {
        if (typeof navigator === 'undefined') return '';
        try {
            return await navigator.clipboard.readText();
        } catch {
            return '';
        }
    }
};

// ─── Reactive localStorage ────────────────────────────────────────────────────

export const storage = {
    /**
     * Gets a value from localStorage, parsed as JSON.
     * @param {string} key
     * @param {*} defaultValue
     */
    get(key, defaultValue = null) {
        if (typeof localStorage === 'undefined') return defaultValue;
        try {
            const raw = localStorage.getItem(key);
            return raw !== null ? JSON.parse(raw) : defaultValue;
        } catch { return defaultValue; }
    },

    /**
     * Sets a value in localStorage (serialized as JSON).
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        if (typeof localStorage === 'undefined') return;
        try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    },

    /**
     * Removes a key from localStorage.
     */
    remove(key) {
        if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
    },

    /**
     * Creates a reactive state signal backed by localStorage.
     * Persists writes to localStorage automatically.
     *
     * @param {string} key localStorage key
     * @param {*} defaultValue
     * @returns {object} Reactive state signal
     *
     * @example
     * const theme = storage.reactive('theme', 'dark');
     * theme.value = 'light'; // persists to localStorage
     */
    reactive(key, defaultValue = null) {
        const initial = storage.get(key, defaultValue);
        const signal = state(initial);

        const originalSet = Object.getOwnPropertyDescriptor(signal, 'value')?.set;

        const proxy = new Proxy(signal, {
            get(target, prop) {
                return Reflect.get(target, prop);
            },
            set(target, prop, val) {
                if (prop === 'value') {
                    storage.set(key, val);
                }
                return Reflect.set(target, prop, val);
            }
        });

        return proxy;
    }
};

// ─── Fullscreen ───────────────────────────────────────────────────────────────

export const fullscreen = {
    /**
     * Enters fullscreen mode for a given element.
     * @param {HTMLElement} el Defaults to document.documentElement
     */
    enter(el) {
        const target = el || (typeof document !== 'undefined' ? document.documentElement : null);
        if (!target) return;
        if (target.requestFullscreen) target.requestFullscreen();
        else if (target.webkitRequestFullscreen) target.webkitRequestFullscreen();
    },

    /**
     * Exits fullscreen mode.
     */
    exit() {
        if (typeof document === 'undefined') return;
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    },

    /**
     * Toggles fullscreen mode for a given element.
     */
    toggle(el) {
        if (typeof document === 'undefined') return;
        if (document.fullscreenElement) this.exit();
        else this.enter(el);
    },

    /**
     * Reactive signal that tracks whether the page is in fullscreen mode.
     * @returns {object} Reactive boolean signal
     */
    isFullscreen() {
        const sig = state(typeof document !== 'undefined' ? !!document.fullscreenElement : false);
        if (typeof document !== 'undefined') {
            document.addEventListener('fullscreenchange', () => {
                sig.value = !!document.fullscreenElement;
            });
        }
        return sig;
    }
};

// ─── Intersection Observer ────────────────────────────────────────────────────

/**
 * Creates a reactive boolean signal that becomes true when the element
 * enters the viewport (IntersectionObserver).
 *
 * @param {HTMLElement} el Target element
 * @param {object} opts IntersectionObserver options { threshold, rootMargin }
 * @returns {object} Reactive boolean signal
 *
 * @example
 * const isVisible = onVisible(myDiv);
 * effect(() => {
 *   if (isVisible.value) myDiv.classList.add('animate-in');
 * });
 */
export function onVisible(el, opts = {}) {
    const isVisible = state(false);
    if (!el || typeof IntersectionObserver === 'undefined') return isVisible;

    const observer = new IntersectionObserver(([entry]) => {
        isVisible.value = entry.isIntersecting;
        if (entry.isIntersecting && opts.once) observer.disconnect();
    }, { threshold: opts.threshold || 0.1, rootMargin: opts.rootMargin || '0px' });

    observer.observe(el);
    return isVisible;
}

// ─── Resize Observer ──────────────────────────────────────────────────────────

/**
 * Creates a reactive { width, height } signal that updates whenever the element resizes.
 *
 * @param {HTMLElement} el Target element
 * @returns {object} Reactive signal with { width, height } shape (use .value.width)
 *
 * @example
 * const size = useResize(myDiv);
 * effect(() => console.log(size.value.width, size.value.height));
 */
export function useResize(el) {
    const dimensions = state({ width: el ? el.offsetWidth : 0, height: el ? el.offsetHeight : 0 });
    if (!el || typeof ResizeObserver === 'undefined') return dimensions;

    const observer = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        dimensions.value = { width: Math.round(width), height: Math.round(height) };
    });
    observer.observe(el);
    return dimensions;
}

// ─── Debounce / Throttle ─────────────────────────────────────────────────────

/**
 * Returns a debounced version of the function.
 * @param {Function} fn
 * @param {number} delay ms
 */
export function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

/**
 * Returns a throttled version of the function.
 * @param {Function} fn
 * @param {number} limit ms
 */
export function throttle(fn, limit = 100) {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall >= limit) {
            lastCall = now;
            fn(...args);
        }
    };
}

// ─── UUID Generator ───────────────────────────────────────────────────────────

/**
 * Generates a UUID v4 string.
 */
export function uuid() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

// ─── Sleep ────────────────────────────────────────────────────────────────────

/**
 * Returns a promise that resolves after `ms` milliseconds.
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Reactive copy-to-clipboard hook with auto-resetting copied status.
 */
export function useClipboard(options = {}) {
    const { timeout = 2000 } = options;
    const copied = state(false);
    const error = state(null);
    let timer = null;

    const copy = async (textVal) => {
        if (timer) clearTimeout(timer);
        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(String(textVal));
            }
            copied.value = true;
            error.value = null;
            timer = setTimeout(() => {
                copied.value = false;
            }, timeout);
            return true;
        } catch (err) {
            copied.value = false;
            error.value = err;
            return false;
        }
    };

    return { copy, copied, error };
}

/**
 * Viewport Intersection Observer hook with reactive inView signal.
 */
export function useInView(target, options = {}) {
    const inView = state(false);
    const entry = state(null);

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([firstEntry]) => {
            inView.value = firstEntry.isIntersecting;
            entry.value = firstEntry;
            if (firstEntry.isIntersecting && options.once) {
                observer.disconnect();
            }
        }, options);

        if (target) {
            const el = typeof target === 'function' ? target() : (target.current || target);
            if (el && el.nodeType) observer.observe(el);
        }
    }

    return { inView, entry };
}

/**
 * Reactive media query matching hook.
 * @param {string} query CSS media query string (e.g. '(max-width: 768px)')
 * @returns {object} Reactive boolean signal
 */
export function useMediaQuery(query) {
    const matches = state(typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(query).matches : false);

    if (typeof window !== 'undefined' && window.matchMedia) {
        const mql = window.matchMedia(query);
        const handler = (e) => { matches.value = e.matches; };
        if (mql.addEventListener) {
            mql.addEventListener('change', handler);
        } else if (mql.addListener) {
            mql.addListener(handler);
        }
    }

    return matches;
}

/**
 * Keyboard shortcut listener for key combinations (e.g. 'ctrl+k', 'alt+s', 'escape').
 * @param {string|string[]} combo Key combination string or array of strings
 * @param {(e: KeyboardEvent) => void} callback Triggered when combo matches
 * @param {object} options { target = window, preventDefault = true }
 * @returns {() => void} Unsubscribe cleanup function
 */
export function useHotkeys(combo, callback, options = {}) {
    const { target = (typeof window !== 'undefined' ? window : null), preventDefault = true } = options;
    if (!target) return () => {};

    const combos = (Array.isArray(combo) ? combo : [combo]).map(c => c.toLowerCase().split('+').map(k => k.trim()));

    const handler = (e) => {
        const key = e.key ? e.key.toLowerCase() : '';
        const ctrl = e.ctrlKey || e.metaKey;
        const alt = e.altKey;
        const shift = e.shiftKey;

        for (const keys of combos) {
            const hasCtrl = keys.includes('ctrl') || keys.includes('meta') || keys.includes('cmd');
            const hasAlt = keys.includes('alt');
            const hasShift = keys.includes('shift');
            const targetKey = keys.find(k => !['ctrl', 'meta', 'cmd', 'alt', 'shift'].includes(k));

            const ctrlMatch = hasCtrl ? ctrl : !ctrl;
            const altMatch = hasAlt ? alt : !alt;
            const shiftMatch = hasShift ? shift : !shift;
            const keyMatch = !targetKey || key === targetKey;

            if (ctrlMatch && altMatch && shiftMatch && keyMatch) {
                if (preventDefault) e.preventDefault();
                callback(e);
                break;
            }
        }
    };

    target.addEventListener('keydown', handler);
    return () => target.removeEventListener('keydown', handler);
}

export const utils = {
    color,
    clipboard,
    useClipboard,
    storage,
    fullscreen,
    onVisible,
    useInView,
    useMediaQuery,
    useHotkeys,
    useResize,
    debounce,
    throttle,
    uuid,
    sleep,
    hexToRgb,
    rgbToHex
};

export default utils;
