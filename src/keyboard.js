/**
 * @eldrex/cairn - Keyboard Shortcut Manager
 * Global, composable keyboard shortcut registry with modifier key support.
 */

const _shortcuts = new Map();
let _isListening = false;

function parseKey(combo) {
    const parts = combo.toLowerCase().split('+').map(p => p.trim());
    return {
        ctrl: parts.includes('ctrl') || parts.includes('control'),
        alt: parts.includes('alt'),
        shift: parts.includes('shift'),
        meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('command'),
        key: parts.find(p => !['ctrl','control','alt','shift','meta','cmd','command'].includes(p)) || ''
    };
}

function keysMatch(parsed, event) {
    return (
        parsed.ctrl === event.ctrlKey &&
        parsed.alt === event.altKey &&
        parsed.shift === event.shiftKey &&
        parsed.meta === event.metaKey &&
        parsed.key === event.key.toLowerCase()
    );
}

function ensureListening() {
    if (_isListening || typeof window === 'undefined') return;
    _isListening = true;
    window.addEventListener('keydown', (e) => {
        _shortcuts.forEach(({ parsed, handler, opts }) => {
            if (keysMatch(parsed, e)) {
                if (opts.preventDefault !== false) e.preventDefault();
                if (opts.stopPropagation) e.stopPropagation();
                try { handler(e); } catch (err) { console.error('[Cairn Keyboard] Shortcut handler error:', err); }
            }
        });
    });
}

export const keyboard = {
    /**
     * Registers a global keyboard shortcut.
     *
     * @param {string} combo Key combo string. e.g. 'ctrl+k', 'shift+enter', 'meta+s'
     * @param {Function} handler Callback receiving the KeyboardEvent
     * @param {object} opts { preventDefault, stopPropagation, description }
     * @returns {Function} Unregister function
     *
     * @example
     * keyboard.on('ctrl+k', () => searchModal.value = true);
     * keyboard.on('escape', () => closeModal());
     * keyboard.on('ctrl+shift+d', () => debug.toggle(), { description: 'Toggle debug mode' });
     */
    on(combo, handler, opts = {}) {
        ensureListening();
        const id = Symbol(combo);
        const parsed = parseKey(combo);
        _shortcuts.set(id, { combo, parsed, handler, opts });
        return () => _shortcuts.delete(id);
    },

    /**
     * Removes all shortcuts matching a combo string.
     * @param {string} combo Key combo string
     */
    off(combo) {
        const parsed = parseKey(combo);
        for (const [id, entry] of _shortcuts) {
            if (entry.combo === combo.toLowerCase()) {
                _shortcuts.delete(id);
            }
        }
    },

    /**
     * Removes all registered shortcuts.
     */
    clear() {
        _shortcuts.clear();
    },

    /**
     * Returns all currently registered shortcuts.
     * @returns {Array} Array of { combo, description } entries
     */
    list() {
        return Array.from(_shortcuts.values()).map(({ combo, opts }) => ({
            combo,
            description: opts.description || ''
        }));
    }
};

export default keyboard;
